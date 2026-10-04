// ---------------------------------------------------------------------------
// Student / attempt sync client.
//
// The practice engines (CSSS + OPAM) never *require* this service: results are
// always stored on-device first. When a backend is configured we additionally
// sync the profile and attempts; when it is missing or temporarily unreachable
// the drills keep working locally.
//
// Set VITE_STUDENT_API_URL to the account/attempt service base URL. Leave it
// unset (or set to "off") to run the platform fully on-device with no login.
// ---------------------------------------------------------------------------

const RAW_API_URL = (import.meta.env.VITE_STUDENT_API_URL as string | undefined)?.trim() ?? "";

function normalizeBaseUrl(url: string) {
  const trimmed = url.replace(/\/+$/, "");
  if (!trimmed || trimmed.toLowerCase() === "off" || trimmed.toLowerCase() === "none") return "";
  return trimmed;
}

export const STUDENT_API_URL = normalizeBaseUrl(RAW_API_URL);

/** True when a backend is configured. When false, every caller runs locally. */
export const isAccountServiceEnabled = STUDENT_API_URL.length > 0;

const TOKEN_KEY = "learnerspark-student-token";
const PROFILE_KEY = "learnerspark-student-profile";

export type StudentProfile = {
  student_id: string;
  full_name: string;
  email?: string;
  user_role: string;
  profile_status: string;
  total_tests_attempted: number;
  total_tests_completed: number;
  average_score: number;
};

export function getStudentToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function getCachedStudent() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null") as StudentProfile | null;
  } catch {
    return null;
  }
}
export function cacheStudent(token: string, profile: StudentProfile) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
export function clearStudentSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
}

/**
 * Error carrying the HTTP status so callers can tell an *invalid credential*
 * (401/403 → clear the session) apart from a *transient outage* (5xx / network
 * → keep the session and retry later).
 */
export class StudentApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "StudentApiError";
    this.status = status;
  }
}

async function request(path: string, options: RequestInit = {}) {
  if (!isAccountServiceEnabled) {
    throw new StudentApiError("The account service is not configured on this deployment.", 0);
  }
  const token = getStudentToken();

  let response: Response;
  try {
    response = await fetch(`${STUDENT_API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-Student-Token": token } : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    // Network-level failure — treat as a transient outage, not a bad session.
    throw new StudentApiError("The student service could not be reached.", 0);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new StudentApiError((data as { error?: string }).error || "The student service is unavailable.", response.status);
  }
  return data as Record<string, unknown>;
}

export async function recognizeStudent() {
  if (!isAccountServiceEnabled) return null;
  const token = getStudentToken();
  if (!token) return null;
  try {
    const data = await request("/api/student/me");
    const student = data.student as StudentProfile;
    cacheStudent(token, student);
    return student;
  } catch (error) {
    // Only clear the stored session when the server says the token is invalid.
    if (error instanceof StudentApiError && (error.status === 401 || error.status === 403)) {
      clearStudentSession();
    }
    return null;
  }
}

export async function registerStudent(payload: Record<string, unknown>) {
  const data = await request("/api/student/register", { method: "POST", body: JSON.stringify(payload) });
  cacheStudent(data.student_token as string, data.student as StudentProfile);
  return data.student as StudentProfile;
}

export async function loginStudent(identifier: string, password: string) {
  const data = await request("/api/student/login", { method: "POST", body: JSON.stringify({ identifier, password }) });
  cacheStudent(data.student_token as string, data.student as StudentProfile);
  return data.student as StudentProfile;
}

export async function recognizeStudentByContact(email: string, mobile: string) {
  const data = await request("/api/student/recognize", { method: "POST", body: JSON.stringify({ email, mobile }) });
  cacheStudent(data.student_token as string, data.student as StudentProfile);
  return data.student as StudentProfile;
}

export async function saveAssessmentAttempt(testSlug: string, testName: string, score: number, percentage: number) {
  // Local result is authoritative for the practice engines; sync only if a
  // backend is configured AND the learner has a session.
  if (!isAccountServiceEnabled || !getStudentToken()) return;
  try {
    await request("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ test_slug: testSlug, test_name: testName, score, percentage, status: "completed" }),
    });
  } catch (error) {
    console.warn("Assessment could not be synced; the local result remains available.", error);
  }
}
