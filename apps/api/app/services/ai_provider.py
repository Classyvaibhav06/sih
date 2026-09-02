"""
AdaptiveX AI — AI Provider Abstraction Layer

Supports:
  - GeminiProvider (Google AI)
  - OpenAIProvider
  - FallbackProvider (deterministic demo mode — no API key required)

Usage:
    provider = get_ai_provider()
    async for chunk in provider.chat(messages, context):
        stream_to_client(chunk)
"""
import json
import random
from abc import ABC, abstractmethod
from typing import AsyncIterator, List, Optional, Dict, Any
from dataclasses import dataclass

from app.core.config import settings


@dataclass
class ChatMessage:
    role: str  # "user" | "assistant" | "system"
    content: str


@dataclass
class AIResponse:
    content: str
    provider: str
    model: str
    is_fallback: bool
    prompt_tokens: Optional[int] = None
    completion_tokens: Optional[int] = None
    latency_ms: Optional[int] = None


class AIProvider(ABC):
    """Abstract base — all providers implement this interface."""

    @abstractmethod
    async def chat(
        self,
        messages: List[ChatMessage],
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1500,
    ) -> AIResponse:
        """Non-streaming chat completion."""
        ...

    @abstractmethod
    async def stream_chat(
        self,
        messages: List[ChatMessage],
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1500,
    ) -> AsyncIterator[str]:
        """Streaming chat completion — yields text chunks."""
        ...

    @abstractmethod
    async def embed(self, text: str) -> List[float]:
        """Generate embedding vector for RAG."""
        ...

    @property
    @abstractmethod
    def provider_name(self) -> str:
        ...

    @property
    @abstractmethod
    def model_name(self) -> str:
        ...


# ─── Gemini Provider ─────────────────────────────────────────────────────

class GeminiProvider(AIProvider):
    """Google Gemini AI provider."""

    def __init__(self):
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self._genai = genai
        self._model = genai.GenerativeModel("gemini-1.5-pro")
        self._flash_model = genai.GenerativeModel("gemini-1.5-flash")
        self._embed_model = "models/text-embedding-004"

    @property
    def provider_name(self) -> str:
        return "gemini"

    @property
    def model_name(self) -> str:
        return "gemini-1.5-pro"

    def _build_messages(self, messages: List[ChatMessage], system_prompt: Optional[str]) -> list:
        history = []
        if system_prompt:
            history.append({"role": "user", "parts": [system_prompt]})
            history.append({"role": "model", "parts": ["Understood. I'll follow these instructions."]})
        for msg in messages[:-1]:
            role = "model" if msg.role == "assistant" else "user"
            history.append({"role": role, "parts": [msg.content]})
        return history

    async def chat(self, messages, system_prompt=None, temperature=0.7, max_tokens=1500) -> AIResponse:
        import time
        start = time.time()
        history = self._build_messages(messages, system_prompt)
        chat = self._model.start_chat(history=history)
        last_msg = messages[-1].content if messages else ""
        response = await chat.send_message_async(
            last_msg,
            generation_config=self._genai.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
            )
        )
        latency = int((time.time() - start) * 1000)
        return AIResponse(
            content=response.text,
            provider="gemini",
            model="gemini-1.5-pro",
            is_fallback=False,
            latency_ms=latency,
        )

    async def stream_chat(self, messages, system_prompt=None, temperature=0.7, max_tokens=1500):
        history = self._build_messages(messages, system_prompt)
        chat = self._flash_model.start_chat(history=history)
        last_msg = messages[-1].content if messages else ""
        response = await chat.send_message_async(
            last_msg,
            generation_config=self._genai.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
            ),
            stream=True,
        )
        async for chunk in response:
            if chunk.text:
                yield chunk.text

    async def embed(self, text: str) -> List[float]:
        result = self._genai.embed_content(
            model=self._embed_model,
            content=text,
            task_type="retrieval_document",
        )
        return result["embedding"]


# ─── OpenAI / TokenRouter Provider ───────────────────────────────────────

class OpenAIProvider(AIProvider):
    """OpenAI & TokenRouter compatible provider."""

    def __init__(self):
        from openai import AsyncOpenAI
        api_key = (
            getattr(settings, "TOKENROUTER_API_KEY", None)
            or getattr(settings, "OPENAI_API_KEY", None)
            or "sk-5lvK2vHFpxB87oYrXGKWznj5hVoiPjaxGwfdaNbFUppNhTWT"
        )
        base_url = (
            getattr(settings, "TOKENROUTER_BASE_URL", None)
            or getattr(settings, "OPENAI_BASE_URL", None)
            or "https://api.tokenrouter.com/v1"
        )
        self._model = (
            getattr(settings, "TOKENROUTER_MODEL", None)
            or getattr(settings, "OPENAI_MODEL", None)
            or "z-ai/glm-5.3-free"
        )
        self._client = AsyncOpenAI(
            api_key=api_key,
            base_url=base_url,
        )

    @property
    def provider_name(self) -> str:
        return "tokenrouter"

    @property
    def model_name(self) -> str:
        return self._model

    def _format(self, messages: List[ChatMessage], system_prompt: Optional[str]) -> list:
        formatted = []
        if system_prompt:
            formatted.append({"role": "system", "content": system_prompt})
        for m in messages:
            formatted.append({"role": m.role, "content": m.content})
        return formatted

    async def chat(self, messages, system_prompt=None, temperature=0.7, max_tokens=1500) -> AIResponse:
        import time
        start = time.time()
        response = await self._client.chat.completions.create(
            model=self._model,
            messages=self._format(messages, system_prompt),
            temperature=temperature,
            max_tokens=max_tokens,
            extra_body={},
        )
        latency = int((time.time() - start) * 1000)
        choice = response.choices[0]
        return AIResponse(
            content=choice.message.content or "",
            provider=self.provider_name,
            model=self._model,
            is_fallback=False,
            prompt_tokens=response.usage.prompt_tokens if response.usage else None,
            completion_tokens=response.usage.completion_tokens if response.usage else None,
            latency_ms=latency,
        )

    async def stream_chat(self, messages, system_prompt=None, temperature=0.7, max_tokens=1500):
        stream = await self._client.chat.completions.create(
            model=self._model,
            messages=self._format(messages, system_prompt),
            temperature=temperature,
            max_tokens=max_tokens,
            stream=True,
            stream_options={"include_usage": True},
            extra_body={},
        )
        async for chunk in stream:
            if chunk.choices:
                delta = chunk.choices[0].delta
                if delta and delta.content:
                    yield delta.content

    async def embed(self, text: str) -> List[float]:
        try:
            response = await self._client.embeddings.create(
                model=getattr(settings, "EMBEDDING_MODEL", "text-embedding-3-small"),
                input=text,
            )
            return response.data[0].embedding
        except Exception:
            import hashlib
            hash_val = int(hashlib.md5(text.encode()).hexdigest(), 16)
            random.seed(hash_val)
            return [random.gauss(0, 1) for _ in range(768)]


# ─── Fallback / Demo Provider ─────────────────────────────────────────────

DEMO_RESPONSES = {
    "explain": [
        """Great question! Let me break this down clearly.

**{topic}** is a fundamental concept in computer science.

Here's how it works step by step:

1. **Core Idea**: Think of it like {analogy}
2. **How it works**: {explanation}
3. **Real-world example**: {example}

> 💡 **Key insight**: Always remember that {insight}

Want me to quiz you on this, or would you like a simpler explanation?""",
    ],
    "quiz": [
        """Here's a question to test your understanding:

**Question**: Which of the following best describes {topic}?

A) Option relating to a common misconception
B) The correct definition in simple terms ✓
C) A partially correct but incomplete answer
D) An unrelated concept

*Think carefully before answering!*

Hint: Focus on the core purpose, not the implementation details.""",
    ],
    "default": [
        """I understand your question about **{topic}**.

Based on your current learning level and what we've covered, here's what I'd like you to consider:

The key concepts here are:
- **Understanding** the core principle
- **Applying** it to examples  
- **Connecting** it to what you already know

Your current mastery in this area is progressing well. Let's focus on strengthening the foundations.

What specific part would you like me to explain further?""",
    ],
}


class FallbackProvider(AIProvider):
    """
    Deterministic demo AI provider.
    Used when no API key is configured.
    Shows 'AI service unavailable — using demo mode' to users.
    """

    @property
    def provider_name(self) -> str:
        return "fallback"

    @property
    def model_name(self) -> str:
        return "demo"

    async def chat(self, messages, system_prompt=None, temperature=0.7, max_tokens=1500) -> AIResponse:
        content = self._generate_demo_response(messages)
        return AIResponse(
            content=content,
            provider="fallback",
            model="demo",
            is_fallback=True,
        )

    async def stream_chat(self, messages, system_prompt=None, temperature=0.7, max_tokens=1500):
        """Simulate streaming by yielding word by word."""
        import asyncio
        content = self._generate_demo_response(messages)
        words = content.split(" ")
        for i, word in enumerate(words):
            yield word + (" " if i < len(words) - 1 else "")
            await asyncio.sleep(0.03)  # Simulate network latency

    async def embed(self, text: str) -> List[float]:
        """Return a mock embedding vector for demo mode."""
        import hashlib
        hash_val = int(hashlib.md5(text.encode()).hexdigest(), 16)
        random.seed(hash_val)
        return [random.gauss(0, 1) for _ in range(768)]

    def _generate_demo_response(self, messages: List[ChatMessage]) -> str:
        last_msg = messages[-1].content.lower() if messages else ""

        if any(kw in last_msg for kw in ["quiz", "test", "question"]):
            template = random.choice(DEMO_RESPONSES["quiz"])
        elif any(kw in last_msg for kw in ["explain", "what is", "how does", "describe"]):
            template = random.choice(DEMO_RESPONSES["explain"])
        else:
            template = random.choice(DEMO_RESPONSES["default"])

        # Extract topic from message
        topic = "this concept"
        for kw in ["recursion", "trees", "arrays", "dbms", "sorting", "graphs", "os"]:
            if kw in last_msg:
                topic = kw.title()
                break

        return template.format(
            topic=topic,
            analogy="a function calling itself to solve smaller problems",
            explanation="the algorithm breaks the problem into identical sub-problems",
            example="calculating factorial(5) = 5 × factorial(4) = 5 × 4 × factorial(3)...",
            insight="there must always be a base case to stop the recursion",
            insight_2="understanding the call stack helps debug infinite recursion",
        )


# ─── Provider Factory ─────────────────────────────────────────────────────

_provider_cache: Optional[AIProvider] = None


def get_ai_provider() -> AIProvider:
    """
    Returns the configured AI provider.
    Falls back to demo mode if no API key is configured.
    """
    global _provider_cache

    if _provider_cache is not None:
        return _provider_cache

    if settings.AI_PROVIDER in ("openai", "tokenrouter") and settings.OPENAI_API_KEY:
        try:
            _provider_cache = OpenAIProvider()
            return _provider_cache
        except Exception:
            pass

    if settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        try:
            _provider_cache = GeminiProvider()
            return _provider_cache
        except Exception:
            pass

    # Fallback to OpenAI/TokenRouter if key is present
    if settings.OPENAI_API_KEY:
        try:
            _provider_cache = OpenAIProvider()
            return _provider_cache
        except Exception:
            pass

    # Demo fallback — always works
    _provider_cache = FallbackProvider()
    return _provider_cache
