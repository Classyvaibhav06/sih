/**
 * AdaptiveX API Client
 * Connects Next.js Frontend to FastAPI Backend with full typed contracts
 * and seamless offline fallback for hackathon demo resilience.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Auth token storage key
const TOKEN_KEY = "adaptivex_token";
const USER_KEY = "adaptivex_user";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "parent" | "admin";
  grade_level?: string;
  school_id?: string;
  xp?: number;
  level?: number;
  streak?: number;
}

export interface StudentDashboardData {
  streak: number;
  xp: number;
  level: number;
  weekly_goal_pct: number;
  weekly_studied_hours: number;
  avg_mastery: number;
  due_revisions: number;
  today_plan: Array<{
    title: string;
    type: string;
    minutes: number;
    mastery: number | null;
  }>;
  mastery_by_subject: Array<{
    subject: string;
    score: number;
  }>;
  weak_concepts: Array<{
    name: string;
    subject: string;
    score: number;
    reason: string;
  }>;
  revision_due: Array<{
    name: string;
    recall: number;
    due_in: string;
  }>;
}

export interface TeacherDashboardData {
  total_students: number;
  active_today: number;
  avg_class_mastery: number;
  at_risk_students_count: number;
  at_risk_students: Array<{
    id: string;
    name: string;
    avatar?: string;
    grade: string;
    risk_factor: string;
    weak_topic: string;
    avg_mastery: number;
  }>;
  topic_difficulties: Array<{
    topic: string;
    subject: string;
    failure_rate: number;
    avg_score: number;
  }>;
  recent_assessments: Array<{
    id: string;
    title: string;
    submissions: number;
    avg_score: number;
    date: string;
  }>;
}

export interface ParentDashboardData {
  student_name: string;
  grade: string;
  weekly_hours: number;
  completion_rate: number;
  overall_mastery: number;
  streak: number;
  strengths: string[];
  focus_areas: string[];
  recent_activities: Array<{
    date: string;
    action: string;
    duration: string;
    score?: string;
  }>;
  recommended_actions: string[];
}

export interface ConceptNode {
  id: string;
  name: string;
  subject: string;
  chapter: string;
  difficulty: number;
  mastery: number;
  prerequisites: string[];
  status: "locked" | "available" | "in_progress" | "mastered";
}

export interface QuizQuestion {
  id: string;
  concept_id: string;
  question_text: string;
  options: string[];
  explanation?: string;
  difficulty: number;
}

// Token Helpers
export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string, user?: UserProfile): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearStoredAuth = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): UserProfile | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// Generic Fetch Wrapper with Bearer Auth & Fallback
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData?: T
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      if (res.status === 401) {
        clearStoredAuth();
      }
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }

    return (await res.json()) as T;
  } catch (err) {
    if (fallbackData !== undefined) {
      console.warn(`[AdaptiveX API] Endpoint ${endpoint} offline, using fallback mock:`, err);
      return fallbackData;
    }
    throw err;
  }
}

// API Methods
export const api = {
  auth: {
    login: async (email: string, password: string): Promise<{ access_token: string; user: UserProfile }> => {
      try {
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const res = await fetch(`${API_BASE_URL}/auth/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        });

        if (res.ok) {
          const data = await res.json();
          const user: UserProfile = {
            id: data.user_id || "demo-user",
            name: data.name || email.split("@")[0],
            email,
            role: data.role || (email.includes("teacher") ? "teacher" : email.includes("parent") ? "parent" : "student"),
            streak: 14,
            xp: 3240,
            level: 12,
          };
          setStoredToken(data.access_token, user);
          return { access_token: data.access_token, user };
        }
      } catch (e) {
        console.warn("[AdaptiveX Auth] Backend offline, issuing demo session:", e);
      }

      // Offline Demo Fallback
      const role: UserProfile["role"] = email.includes("teacher")
        ? "teacher"
        : email.includes("parent")
        ? "parent"
        : "student";

      const demoUser: UserProfile = {
        id: "demo-" + role,
        name: role === "teacher" ? "Priya Sharma (Faculty)" : role === "parent" ? "Rajesh Sharma (Parent)" : "Aarav Sharma",
        email,
        role,
        streak: 14,
        xp: 3240,
        level: 12,
      };

      const demoToken = "demo-jwt-token-" + role;
      setStoredToken(demoToken, demoUser);
      return { access_token: demoToken, user: demoUser };
    },

    register: async (userData: { name: string; email: string; password: string; role: string }) => {
      return request(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
        },
        {
          id: "reg-demo",
          name: userData.name,
          email: userData.email,
          role: userData.role,
        }
      );
    },
  },

  students: {
    getProfile: () =>
      request<UserProfile>(
        "/students/me",
        {},
        {
          id: "demo-aarav",
          name: "Aarav Sharma",
          email: "aarav@demo.adaptivex.ai",
          role: "student",
          grade_level: "Class 11 / CBSE",
          xp: 3240,
          level: 12,
          streak: 14,
        }
      ),

    getDashboard: () =>
      request<StudentDashboardData>(
        "/students/me/dashboard",
        {},
        {
          streak: 14,
          xp: 3240,
          level: 12,
          weekly_goal_pct: 68,
          weekly_studied_hours: 3.4,
          avg_mastery: 69,
          due_revisions: 4,
          today_plan: [
            { title: "Recursion & Trees Practice", type: "practice", minutes: 20, mastery: 43 },
            { title: "Normalization (DBMS) Revision", type: "revision", minutes: 15, mastery: 82 },
            { title: "Computer Networks Diagnostic Quiz", type: "quiz", minutes: 10, mastery: null },
          ],
          mastery_by_subject: [
            { subject: "Data Structures", score: 71 },
            { subject: "DBMS", score: 82 },
            { subject: "Operating Systems", score: 57 },
            { subject: "Computer Networks", score: 64 },
          ],
          weak_concepts: [
            { name: "Binary Search Trees", subject: "DSA", score: 38, reason: "3 failed attempts" },
            { name: "Recursion Stack & Space", subject: "DSA", score: 43, reason: "High response latency" },
            { name: "CPU Scheduling Algorithms", subject: "OS", score: 49, reason: "Repeated misconception" },
          ],
          revision_due: [
            { name: "Binary Search Implementation", recall: 63, due_in: "Today" },
            { name: "Database ACID Properties", recall: 71, due_in: "Today" },
            { name: "OS Deadlock Avoidance (Banker's)", recall: 54, due_in: "Tomorrow" },
          ],
        }
      ),
  },

  curriculum: {
    getKnowledgeGraph: (subjectId: string = "dsa") =>
      request<ConceptNode[]>(
        `/curriculum/graph?subject=${subjectId}`,
        {},
        [
          { id: "c1", name: "Arrays & Pointers", subject: "DSA", chapter: "Foundations", difficulty: 1, mastery: 95, prerequisites: [], status: "mastered" },
          { id: "c2", name: "Linked Lists", subject: "DSA", chapter: "Linear Structures", difficulty: 2, mastery: 88, prerequisites: ["c1"], status: "mastered" },
          { id: "c3", name: "Stacks & Queues", subject: "DSA", chapter: "Linear Structures", difficulty: 2, mastery: 82, prerequisites: ["c2"], status: "mastered" },
          { id: "c4", name: "Recursion & Backtracking", subject: "DSA", chapter: "Algorithms", difficulty: 3, mastery: 43, prerequisites: ["c3"], status: "in_progress" },
          { id: "c5", name: "Binary Search Trees", subject: "DSA", chapter: "Trees & Graphs", difficulty: 3, mastery: 38, prerequisites: ["c4"], status: "in_progress" },
          { id: "c6", name: "Dynamic Programming", subject: "DSA", chapter: "Advanced", difficulty: 4, mastery: 0, prerequisites: ["c4"], status: "locked" },
        ]
      ),
  },

  assessments: {
    submitQuestionAnswer: (questionId: string, selectedOption: number, responseTimeMs: number) =>
      request(
        "/assessments/submit",
        {
          method: "POST",
          body: JSON.stringify({
            question_id: questionId,
            selected_option: selectedOption,
            response_time_ms: responseTimeMs,
          }),
        },
        {
          is_correct: true,
          updated_mastery: 74,
          xp_awarded: 50,
          next_sm2_review_days: 3,
          explanation: "Great job! Your recursion tree analysis was accurate.",
        }
      ),
  },

  teachers: {
    getDashboard: () =>
      request<TeacherDashboardData>(
        "/teachers/dashboard",
        {},
        {
          total_students: 48,
          active_today: 39,
          avg_class_mastery: 72,
          at_risk_students_count: 4,
          at_risk_students: [
            { id: "s1", name: "Rohan Verma", grade: "Class 11-A", risk_factor: "High Latency & Low Recall", weak_topic: "Binary Trees", avg_mastery: 41 },
            { id: "s2", name: "Ananya Deshmukh", grade: "Class 11-A", risk_factor: "Missing Revisions", weak_topic: "Deadlocks (OS)", avg_mastery: 48 },
            { id: "s3", name: "Vikram Singh", grade: "Class 11-B", risk_factor: "3 Consecutive Failed Quizzes", weak_topic: "Recursion", avg_mastery: 36 },
          ],
          topic_difficulties: [
            { topic: "Recursion & Backtracking", subject: "DSA", failure_rate: 42, avg_score: 54 },
            { topic: "Database Normalization (3NF/BCNF)", subject: "DBMS", failure_rate: 35, avg_score: 61 },
            { topic: "Virtual Memory & Paging", subject: "OS", failure_rate: 29, avg_score: 68 },
          ],
          recent_assessments: [
            { id: "a1", title: "DSA Mid-Term Diagnostic", submissions: 44, avg_score: 74, date: "Yesterday" },
            { id: "a2", title: "DBMS Keys & Relational Algebra", submissions: 46, avg_score: 81, date: "3 days ago" },
          ],
        }
      ),
  },

  parents: {
    getDashboard: () =>
      request<ParentDashboardData>(
        "/parents/dashboard",
        {},
        {
          student_name: "Aarav Sharma",
          grade: "Class 11 — Science & CS",
          weekly_hours: 6.8,
          completion_rate: 92,
          overall_mastery: 69,
          streak: 14,
          strengths: ["Database Normalization", "Array Algorithms", "Consistent Daily Routine"],
          focus_areas: ["Binary Search Trees (Needs revision)", "Recursion Call Stack analysis"],
          recent_activities: [
            { date: "Today, 4:15 PM", action: "Completed 15 min Spaced Revision on DBMS", duration: "15m", score: "88%" },
            { date: "Yesterday, 6:00 PM", action: "Interacted with AdaptiveX AI Tutor on Recursion", duration: "24m" },
            { date: "2 days ago", action: "Solved 10 Practice Questions in Data Structures", duration: "20m", score: "70%" },
          ],
          recommended_actions: [
            "Encourage Aarav to spend 15 minutes reviewing Binary Trees flashcards before Friday.",
            "Great progress on streak! Acknowledge his 14-day study consistency.",
          ],
        }
      ),
  },

  ai: {
    streamChat: async (
      message: string,
      context: { topic?: string; mastery?: number; language?: string } = {},
      onChunk: (chunk: string) => void,
      onComplete?: () => void
    ) => {
      try {
        const token = getStoredToken();
        const res = await fetch(`${API_BASE_URL}/ai/tutor/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            message,
            context,
            stream: true,
            language: context.language || "en",
          }),
        });

        if (res.ok && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            onChunk(chunk);
          }
          onComplete?.();
          return;
        }
      } catch (err) {
        console.warn("[AdaptiveX AI] Backend AI streaming unreachable, using client simulation:", err);
      }

      // Simulated streaming fallback
      const simulatedText = `### 💡 AdaptiveX AI Tutor Guidance
      
I noticed you're exploring **${context.topic || "this concept"}** (Current Mastery: **${context.mastery || 65}%**).

Let's break this down using a step-by-step Socratic intuition:

1. **Core Intuition**: Think of how problems divide into smaller self-similar sub-problems with a well-defined base case.
2. **Visual Step**: Each step resolves when the terminating condition returns a value back up the stack.
3. **Check Question**: What happens if the base condition is omitted? (Hint: Stack Overflow!).

Would you like to try a 1-minute guided interactive quiz on this?`;

      let index = 0;
      const interval = setInterval(() => {
        if (index < simulatedText.length) {
          const nextChars = simulatedText.slice(index, index + 6);
          onChunk(nextChars);
          index += 6;
        } else {
          clearInterval(interval);
          onComplete?.();
        }
      }, 25);
    },
  },
};
