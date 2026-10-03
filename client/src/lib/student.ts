export const STUDENT_API_URL = "https://5001-i8nby448er6suvm9s2l2n-47263608.sg2.manus.computer";
const TOKEN_KEY = "learnerspark-student-token";
const PROFILE_KEY = "learnerspark-student-profile";

export type StudentProfile = { student_id: string; full_name: string; email?: string; user_role: string; profile_status: string; total_tests_attempted: number; total_tests_completed: number; average_score: number };

export function getStudentToken() { return localStorage.getItem(TOKEN_KEY); }
export function getCachedStudent() { try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null") as StudentProfile | null; } catch { return null; } }
export function cacheStudent(token: string, profile: StudentProfile) { localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }

async function request(path: string, options: RequestInit = {}) {
  const token = getStudentToken();
  const response = await fetch(`${STUDENT_API_URL}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(token ? { "X-Student-Token": token } : {}), ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "The student service is unavailable.");
  return data;
}

export async function recognizeStudent() {
  if (!getStudentToken()) return null;
  try { const data = await request("/api/student/me"); cacheStudent(getStudentToken() as string, data.student); return data.student as StudentProfile; } catch { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(PROFILE_KEY); return null; }
}

export async function registerStudent(payload: Record<string, unknown>) {
  const data = await request("/api/student/register", { method: "POST", body: JSON.stringify(payload) });
  cacheStudent(data.student_token, data.student);
  return data.student as StudentProfile;
}

export async function loginStudent(identifier: string, password: string) {
  const data = await request("/api/student/login", { method: "POST", body: JSON.stringify({ identifier, password }) });
  cacheStudent(data.student_token, data.student);
  return data.student as StudentProfile;
}

export async function recognizeStudentByContact(email: string, mobile: string) {
  const data = await request("/api/student/recognize", { method: "POST", body: JSON.stringify({ email, mobile }) });
  cacheStudent(data.student_token, data.student);
  return data.student as StudentProfile;
}

export async function saveAssessmentAttempt(testSlug: string, testName: string, score: number, percentage: number) {
  if (!getStudentToken()) return;
  try { await request("/api/attempts", { method: "POST", body: JSON.stringify({ test_slug: testSlug, test_name: testName, score, percentage, status: "completed" }) }); } catch (error) { console.warn("Assessment could not be synced; local result remains available.", error); }
}
