import { useState, type FormEvent } from "react";
import { ArrowUpRight, FileDown, ShieldCheck } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

function csvCell(value: unknown) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }
function downloadCsv(name: string, headers: string[], rows: unknown[][]) {
  const csv = [headers, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function date(ms: number | null) { return ms ? new Date(ms).toLocaleString() : "—"; }
function ModuleTitle({ title, body }: { title: string; body: string }) {
  return <div className="admin-module-heading"><span><ShieldCheck size={15} /> OWNER CONSOLE</span><h1>{title}</h1><p>{body}</p></div>;
}

function Dashboard() {
  const q = trpc.admin.dashboard.useQuery();
  if (q.isLoading) return <p>Loading database metrics…</p>;
  if (q.error || !q.data) return <p role="alert">Could not load metrics: {q.error?.message}</p>;
  return <><ModuleTitle title="Overview" body="Live counts from the managed database—not estimated visitors or simulated submissions." />
    <div className="admin-metric-grid">{([
      ["Registered aspirants", q.data.students], ["Completed attempts", q.data.attempts], ["Managed tests", q.data.tests], ["Managed questions", q.data.questions],
    ] as const).map(([label, value]) => <div className="admin-metric" key={label}><small>{label}</small><strong>{value}</strong></div>)}</div>
    <div className="admin-panel"><h2>Recent assessment attempts</h2>{q.data.recent.length ? <ul>{q.data.recent.map((r, i) => <li key={`${r.when}-${i}`}>{date(r.when)} · {r.test.toUpperCase()} · {r.score}%</li>)}</ul> : <p>No scored attempts have been synchronized yet.</p>}</div>
    <div className="admin-panel"><h2>Source of truth</h2><p>Accounts and assessment attempts now persist in this managed database. The public CSSS (70 questions) and OPAM (120 items) content banks remain version-controlled in the website source; the admin question catalogue is separate until an explicit publication workflow is added.</p></div>
  </>;
}
function Students() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const list = trpc.admin.students.useQuery({ search });
  const details = trpc.admin.student.useQuery({ id: selected || 1 }, { enabled: Boolean(selected) });
  const attempts = trpc.admin.attempts.useQuery();
  return <><ModuleTitle title="Defence Aspirants" body="One profile per email and mobile number. Returning students use the same account in CSSS and OPAM." />
    <div className="admin-toolbar"><label>Search students <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name, email, or student ID" /></label>
      <button type="button" onClick={() => downloadCsv("learnerspark-students.csv", ["Student ID", "Name", "Email", "Mobile", "Defence entry", "Status", "Registered"], (list.data || []).map(s => [s.studentCode, s.fullName, s.email, s.mobile, s.defenceEntry, s.status, date(s.createdAt)]))} disabled={!list.data}><FileDown size={15} /> Export listed students</button>
      <button type="button" onClick={() => downloadCsv("learnerspark-assessments.csv", ["Student ID", "Name", "Test", "Score", "Percentage", "Completed"], (attempts.data || []).map(a => [a.studentCode, a.fullName, a.testName, a.score, a.percentage, date(a.createdAt)]))} disabled={!attempts.data}><FileDown size={15} /> Export recent attempts</button></div>
    {list.error && <p role="alert">{list.error.message}</p>}
    <div className="admin-table-wrap"><table><thead><tr><th>Student ID</th><th>Name</th><th>Email</th><th>Entry</th><th>Registered</th><th>Profile</th></tr></thead><tbody>{(list.data || []).map(s => <tr key={s.id}><td>{s.studentCode}</td><td>{s.fullName}</td><td>{s.email}</td><td>{s.defenceEntry}</td><td>{date(s.createdAt)}</td><td><button type="button" onClick={() => setSelected(s.id)}>View details <ArrowUpRight size={13} /></button></td></tr>)}</tbody></table>{!list.isLoading && !list.data?.length && <p className="admin-empty">No profiles match your search.</p>}</div>
    {selected && details.data && <div className="admin-panel admin-detail"><button type="button" className="admin-close" onClick={() => setSelected(null)}>Close ×</button><h2>{details.data.record.fullName} · {details.data.record.studentCode}</h2>
      <div className="admin-detail-grid">{([ ["Email", details.data.record.email], ["Mobile", details.data.record.mobile], ["Education", details.data.record.educationLevel], ["Defence entry", details.data.record.defenceEntry], ["Location", `${details.data.record.city}, ${details.data.record.state}`], ["Previous SSB", details.data.record.previousSsbExperience || "Not supplied"], ["Last login", date(details.data.record.lastLoginAt)] ] as const).map(([key, value]) => <p key={key}><small>{key}</small><strong>{value}</strong></p>)}</div>
      <h3>Assessment history</h3>{details.data.attempts.length ? details.data.attempts.map(a => <p key={a.attemptId}>{date(a.createdAt)} · {a.testName} · {a.score} points ({a.percentage}%)</p>) : <p>No attempts recorded.</p>}
    </div>}
  </>;
}
const emptyTest = { slug: "", title: "", description: "", duration: 600, difficulty: "Mixed", status: "draft" as "draft" | "published" | "archived" };
function Tests() {
  const utils = trpc.useUtils(); const q = trpc.admin.tests.useQuery(); const [form, setForm] = useState({ ...emptyTest }); const [id, setId] = useState<number>(); const [message, setMessage] = useState("");
  const save = trpc.admin.saveTest.useMutation({ onSuccess: () => { setMessage("Test saved."); setForm({ ...emptyTest }); setId(undefined); utils.admin.tests.invalidate(); utils.admin.dashboard.invalidate(); }, onError: e => setMessage(e.message) });
  function submit(e: FormEvent) { e.preventDefault(); setMessage(""); save.mutate({ ...form, id }); }
  return <><ModuleTitle title="Test management" body="Manage the admin catalogue. Changes to the public practice banks require a separate reviewed publication step." />
    <div className="admin-table-wrap"><table><thead><tr><th>Slug</th><th>Title</th><th>Status</th><th>Duration</th><th></th></tr></thead><tbody>{q.data?.map(t => <tr key={t.id}><td>{t.slug}</td><td>{t.title}</td><td>{t.status}</td><td>{t.duration}s</td><td><button type="button" onClick={() => { setId(t.id); setForm({ slug: t.slug, title: t.title, description: t.description, duration: t.duration, difficulty: t.difficulty, status: t.status as typeof emptyTest.status }); }}>Edit</button></td></tr>)}</tbody></table></div>
    <form className="admin-edit-form" onSubmit={submit}><h2>{id ? "Edit test" : "Add test"}</h2><div className="admin-form-grid"><label>Slug<input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></label><label>Title<input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label><label>Duration (seconds)<input type="number" min="0" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} /></label><label>Difficulty<input required value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} /></label><label>Status<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as typeof form.status })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label className="admin-span">Description<textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label></div><button disabled={save.isPending} type="submit">{save.isPending ? "Saving…" : "Save test"}</button>{id && <button type="button" onClick={() => { setId(undefined); setForm({ ...emptyTest }); }}>Cancel editing</button>}{message && <p role="status">{message}</p>}</form>
  </>;
}
const emptyQuestion = { testId: null as number | null, prompt: "", questionType: "multiple-choice", formatLabel: "Standard", options: "[]", correctAnswer: "", explanation: "", category: "Reasoning", difficulty: "Mixed", status: "draft" as "draft" | "published" | "archived" };
function Questions() {
  const utils = trpc.useUtils(); const q = trpc.admin.questions.useQuery({}); const tests = trpc.admin.tests.useQuery(); const [form, setForm] = useState({ ...emptyQuestion }); const [id, setId] = useState<number>(); const [message, setMessage] = useState("");
  const save = trpc.admin.saveQuestion.useMutation({ onSuccess: () => { setMessage("Question saved."); setForm({ ...emptyQuestion }); setId(undefined); utils.admin.questions.invalidate(); utils.admin.dashboard.invalidate(); }, onError: e => setMessage(e.message) });
  function submit(e: FormEvent) { e.preventDefault(); setMessage(""); save.mutate({ ...form, id }); }
  return <><ModuleTitle title="Question bank" body="Owner-only question catalogue. The public CSSS/OPAM banks are versioned separately and are not silently overwritten." />
    <div className="admin-table-wrap"><table><thead><tr><th>ID</th><th>Prompt</th><th>Format</th><th>Category</th><th>Status</th><th></th></tr></thead><tbody>{q.data?.map(item => <tr key={item.id}><td>{item.id}</td><td className="admin-prompt">{item.prompt}</td><td>{item.formatLabel}</td><td>{item.category}</td><td>{item.status}</td><td><button type="button" onClick={() => { setId(item.id); setForm({ testId: item.testId, prompt: item.prompt, questionType: item.questionType, formatLabel: item.formatLabel, options: item.options, correctAnswer: item.correctAnswer, explanation: item.explanation, category: item.category, difficulty: item.difficulty, status: item.status as typeof emptyQuestion.status }); }}>Edit</button></td></tr>)}</tbody></table></div>
    <form className="admin-edit-form" onSubmit={submit}><h2>{id ? "Edit question" : "Add question"}</h2><div className="admin-form-grid"><label>Test<select value={form.testId || ""} onChange={e => setForm({ ...form, testId: e.target.value ? Number(e.target.value) : null })}><option value="">Unassigned</option>{tests.data?.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select></label><label>Format label<input required value={form.formatLabel} onChange={e => setForm({ ...form, formatLabel: e.target.value })} /></label><label>Question type<input required value={form.questionType} onChange={e => setForm({ ...form, questionType: e.target.value })} /></label><label>Category<input required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></label><label>Difficulty<input required value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} /></label><label>Status<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as typeof form.status })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label className="admin-span">Prompt<textarea required value={form.prompt} onChange={e => setForm({ ...form, prompt: e.target.value })} /></label><label className="admin-span">Options (JSON or plain text)<textarea value={form.options} onChange={e => setForm({ ...form, options: e.target.value })} /></label><label>Correct answer<input value={form.correctAnswer} onChange={e => setForm({ ...form, correctAnswer: e.target.value })} /></label><label className="admin-span">Explanation<textarea value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })} /></label></div><button disabled={save.isPending} type="submit">{save.isPending ? "Saving…" : "Save question"}</button>{id && <button type="button" onClick={() => { setId(undefined); setForm({ ...emptyQuestion }); }}>Cancel editing</button>}{message && <p role="status">{message}</p>}</form>
  </>;
}

export default function AdminConsole({ section = "dashboard" }: { section?: "dashboard" | "students" | "tests" | "questions" }) {
  const status = trpc.admin.status.useQuery();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = trpc.admin.login.useMutation({ onSuccess: () => { setPassword(""); status.refetch(); } });
  const logout = trpc.admin.logout.useMutation({ onSuccess: () => window.location.assign("/admin/dashboard") });
  const oauthLogout = trpc.auth.logout.useMutation({ onSuccess: () => window.location.assign("/admin/dashboard") });
  function submitLogin(e: FormEvent) { e.preventDefault(); login.mutate({ username, password }); }
  if (status.isLoading) return <main className="admin-access-gate"><p>Checking administrator access…</p></main>;
  if (status.error) return <main className="admin-access-gate"><h1>Admin Console unavailable</h1><p role="alert">{status.error.message}</p></main>;
  if (!status.data?.isAdmin) return <main className="admin-access-gate"><ShieldCheck size={32} /><h1>Administrator sign-in</h1><p>Use your existing Admin Console credentials. Student credentials do not grant admin access.</p>
    {status.data?.signedIn && <p role="alert">The current account does not have administrator access. Use your admin credentials instead.</p>}
    <form className="admin-login-form" onSubmit={submitLogin}><label>Admin username<input autoComplete="username" required value={username} onChange={e => setUsername(e.target.value)} /></label><label>Password<input autoComplete="current-password" type="password" required value={password} onChange={e => setPassword(e.target.value)} /></label><button disabled={login.isPending} type="submit">{login.isPending ? "Signing in…" : "Sign in to Admin Console"} <ArrowUpRight size={16} /></button>{login.error && <p role="alert">{login.error.message}</p>}</form>
    <button className="admin-oauth-button" type="button" onClick={startLogin}>Alternatively, sign in as site owner</button><a href="/">Back to website</a></main>;
  const signOut = () => status.data.authType === "password" ? logout.mutate() : oauthLogout.mutate();
  return <DashboardLayout allowSessionAuth displayName={status.data.name || "Owner"} onLogout={signOut}><div className="admin-console"><div className="admin-console-top"><span>Learners Park / Admin Console</span><small>Signed in as {status.data.name || "owner"}</small></div>
    {section === "dashboard" ? <Dashboard /> : section === "students" ? <Students /> : section === "tests" ? <Tests /> : <Questions />}
  </div></DashboardLayout>;
}
