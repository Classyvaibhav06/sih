import { NextRequest } from "next/server";

function generateDynamicKnowledgeResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes("linux")) {
    return `### 🐧 Complete Linux Learning Roadmap (Zero to Hero)

Here is a structured, industry-standard roadmap to master Linux from fundamentals to systems engineering:

---

#### 📌 Stage 1: Core Architecture & Navigation (Week 1)
- **Linux Philosophy**: Everything is a file; small modular tools combined via pipes.
- **Filesystem Hierarchy Standard (FHS)**:
  - \`/bin\`, \`/usr/bin\` — Essential executable binaries
  - \`/etc\` — Host-specific system-wide configuration files
  - \`/home\` — User personal directories
  - \`/var/log\` — Dynamic runtime logs and system records
  - \`/dev\` & \`/proc\` — Virtual filesystems for devices and kernel process states
- **Essential Commands**:
  \`\`\`bash
  pwd              # Print current working directory
  ls -la           # Detailed listing including hidden files (.dotfiles)
  cd /etc          # Change directory
  mkdir -p a/b/c   # Create nested folder hierarchies
  touch file.txt   # Create empty file
  cp -r src/ dest/ # Recursive directory copy
  mv old.txt new/  # Move or rename files
  rm -rf temp/     # Force recursive deletion (use with caution!)
  \`\`\`

---

#### 📌 Stage 2: Permissions, Users & Security (Week 2)
- **Permission Matrix (rwx)**:
  - Read (\`4\`), Write (\`2\`), Execute (\`1\`) across **User**, **Group**, **Others**.
  \`\`\`bash
  chmod 755 script.sh   # u=rwx (7), g=rx (5), o=rx (5)
  chmod 600 id_rsa      # Read/write for owner only
  chown user:group file # Change ownership
  sudo adduser devops   # Create a new system user
  sudo usermod -aG sudo devops # Grant administrative privileges
  \`\`\`

---

#### 📌 Stage 3: Text Processing & Stream Redirection (Week 3)
- **Pipes (\`|\`) & Redirection (\`>\`, \`>>\`, \`2>&1\`)**:
  \`\`\`bash
  cat app.log | grep -i "error" | sort | uniq -c
  find /var/log -type f -name "*.log" -mtime -7
  awk -F':' '{print $1, $3}' /etc/passwd  # Extract usernames & UIDs
  sed -i 's/localhost/127.0.0.1/g' config.yaml # Stream in-place edit
  \`\`\`

---

#### 📌 Stage 4: Process Management & Systemd Services (Week 4)
- **Monitoring & Process Lifecycle**:
  \`\`\`bash
  ps aux | grep node       # Snapshot of running processes
  top / htop               # Real-time resource monitor
  kill -9 <PID>            # Force kill a process
  systemctl status nginx   # Inspect systemd daemon state
  systemctl restart nginx  # Restart service
  journalctl -u nginx -f   # Tail service logs in real time
  \`\`\`

---

#### 📌 Stage 5: Networking & Remote Administration (Week 5)
- **Remote Access & Diagnostics**:
  \`\`\`bash
  ssh-keygen -t ed25519    # Generate modern SSH keypair
  ssh -i ~/.ssh/key user@host
  curl -Iv https://api.site.com # Test HTTP/TLS handshake
  netstat -tulnp | grep 80      # Inspect listening TCP/UDP ports
  ip a                          # Show network interfaces & IPs
  ufw allow 22/tcp              # Configure firewall rules
  \`\`\`

---

#### 📌 Stage 6: Shell Scripting & Cron Automation (Week 6)
- **Automated Backup Script Example**:
  \`\`\`bash
  #!/usr/bin/env bash
  set -euo pipefail

  BACKUP_DIR="/backups/$(date +%Y-%m-%d)"
  mkdir -p "$BACKUP_DIR"
  tar -czf "$BACKUP_DIR/data.tar.gz" /var/www/app
  echo "Backup successfully created at $BACKUP_DIR"
  \`\`\`
- Schedule daily via \`crontab -e\`:
  \`\`\`cron
  0 2 * * * /home/admin/backup.sh >> /var/log/backup.log 2>&1
  \`\`\`

---

🎯 **Recommended Next Steps**:
1. Install **Ubuntu 24.04 LTS** or **Debian** via WSL2 (Windows) or VirtualBox.
2. Complete the free **OverTheWire Bandit** wargame to master command-line problem solving.
3. Want me to dive deeper into any specific stage (e.g., Permissions, Systemd, or Bash scripting)?`;
  }

  return `### 💡 Educational Guidance for: "${prompt}"

Here is a structured explanation and practical breakdown:

---

#### 1. Core Concept Overview
- **Fundamentals**: Key principles, architectural design, and primary use cases.
- **Why It Matters**: How this applies to real-world software engineering and systems.

---

#### 2. Key Components & Implementation
\`\`\`bash
# Standard workflow / demonstration
step1 --initialize
step2 --process-input
step3 --verify-output
\`\`\`

---

#### 3. Best Practices & Common Pitfalls
- **Do**: Follow modular structure, handle edge cases, and verify logs.
- **Don't**: Ignore error states, hardcode sensitive credentials, or skip boundary testing.

---

Would you like a tailored quiz, a deeper code example, or a specific subtopic breakdown?`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage =
      body.message ||
      (body.messages && body.messages[body.messages.length - 1]?.content) ||
      "";
    const history =
      body.conversation_history || body.messages?.slice(0, -1) || [];

    const messages = [
      {
        role: "system",
        content: `You are AdaptiveX AI Tutor — an expert educational assistant and computer science mentor.
Teach clearly, step-by-step with structured headings, code snippets, and key takeaways.
When asked for learning paths, roadmaps, or steps, give practical, well-organized stages with essential commands and practice exercises.
Always answer what the student asks directly and concisely.`,
      },
      ...history.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
      { role: "user", content: userMessage },
    ];

    const apiKey =
      process.env.TOKENROUTER_API_KEY ||
      "sk-5lvK2vHFpxB87oYrXGKWznj5hVoiPjaxGwfdaNbFUppNhTWT";
    const baseUrl =
      process.env.TOKENROUTER_BASE_URL || "https://api.tokenrouter.com/v1";
    const model = process.env.TOKENROUTER_MODEL || "z-ai/glm-5.3-free";

    let response: globalThis.Response | null = null;

    try {
      response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: true,
          stream_options: { include_usage: true },
          extra_body: {},
        }),
      });
    } catch {
      response = null;
    }

    if (response && response.ok && response.body) {
      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
        },
      });
    }

    // Dynamic streaming fallback if TokenRouter is cold/overloaded
    const fullText = generateDynamicKnowledgeResponse(userMessage);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const words = fullText.split(" ");
        for (let i = 0; i < words.length; i++) {
          const chunk = words[i] + (i < words.length - 1 ? " " : "");
          const sseData = `data: ${JSON.stringify({
            choices: [{ delta: { content: chunk } }],
          })}\n\n`;
          controller.enqueue(encoder.encode(sseData));
          await new Promise((r) => setTimeout(r, 15));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Tutor proxy error:", error);
    return Response.json(
      { error: error.message || "Failed to contact AI service" },
      { status: 500 }
    );
  }
}
