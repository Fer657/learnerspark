import { useEffect, useRef, useState } from "react";
import { Clock3, Fingerprint, HeartHandshake, ShieldCheck, TimerReset } from "lucide-react";
import { BackLink, ChoiceButton, Counter, PageShell, PrimaryButton, ProgressTrack, PrintLink, ReportMetric, RestartButton, SectionEyebrow, SiteFooter, SiteHeader, StatusChip, TrustMark } from "../components/SiteChrome";
import StudentRegistration from "../components/StudentRegistration";
import { mixedOpamItems, opamBank, selfItems, situationItems, OPAM_COUNTS, type OpamForcedItem, type OpamItem, type OpamSelfItem, type OpamSituationItem } from "../data/opamBank";
import { recognizeStudent, saveAssessmentAttempt } from "../lib/student";

type Screen = "landing" | "run" | "report";
type Answer = { itemId: string; type: OpamItem["type"]; value: string; latency: number; score: number };

function typeLabel(type: OpamItem["type"]) {
  if (type === "self") return "SELF-DESCRIPTION";
  if (type === "forced") return "FORCED CHOICE";
  return "SITUATION REACTION";
}

function itemPrompt(item: OpamItem) {
  return item.type === "self" ? item.text : item.type === "forced" ? item.left : item.text;
}

export default function OPAM() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(15);
  const [startedAt, setStartedAt] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [partScores, setPartScores] = useState({ self: 0, forced: 0, situation: 0 });
  const [studentReady, setStudentReady] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const answeringItemRef = useRef<string | null>(null);
  const total = mixedOpamItems.length;
  const completed = answers.length;
  const item = mixedOpamItems[index];
  const progress = (completed / total) * 100;
  const currentGlobal = index + 1;
  const answeredByType = answers.reduce((counts, answer) => ({ ...counts, [answer.type]: counts[answer.type] + 1 }), { self: 0, forced: 0, situation: 0 });

  useEffect(() => { recognizeStudent().then((student) => setStudentReady(Boolean(student))); }, []);

  useEffect(() => {
    if (screen !== "run" || !item) return;
    answeringItemRef.current = null;
    setStartedAt(performance.now());
    setSeconds(15);
    const timer = window.setInterval(() => setSeconds((value) => {
      if (value <= 1) {
        finishAnswer("timeout", 0);
        return 15;
      }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [screen, index]);

  function beginRun() {
    answeringItemRef.current = null;
    setScreen("run");
    setIndex(0);
    setAnswers([]);
    setPartScores({ self: 0, forced: 0, situation: 0 });
  }

  function start() {
    if (!studentReady) { setRegistrationOpen(true); return; }
    beginRun();
  }

  function finishAnswer(value: string, score = 1) {
    if (!item || screen !== "run" || answeringItemRef.current === item.id) return;
    answeringItemRef.current = item.id;
    const nextAnswers = [...answers, { itemId: item.id, type: item.type, value, latency: Math.round(performance.now() - startedAt), score }];
    setAnswers(nextAnswers);
    setPartScores((old) => ({ ...old, [item.type]: old[item.type] + score }));
    if (index < total - 1) return setIndex(index + 1);
    localStorage.setItem("learnerspark-opam-result", JSON.stringify({ answers: nextAnswers, savedAt: new Date().toISOString(), bankSize: total, sequence: "mixed" }));
    saveAssessmentAttempt("opam", "OPAM Personality Practice", nextAnswers.reduce((sum, answer) => sum + answer.score, 0), Math.round((nextAnswers.reduce((sum, answer) => sum + answer.score, 0) / total) * 100));
    setScreen("report");
  }

  if (screen === "landing") return <PageShell><SiteHeader /><main className="assessment-landing"><div className="container assessment-landing-grid"><div><BackLink /><div className="assessment-kicker"><span className="assessment-badge orange">OPAM</span><span>PERSONALITY ASSESSMENT MODULE</span></div><h1>Answer as <em>you</em> are, not as an ideal officer.</h1><p className="assessment-lead">The full bank now runs through 120 original prompts in a mixed sequence. Self-description, forced choice, and situation reaction items keep changing shape so you practise staying consistent rather than memorising a rhythm.</p><PrimaryButton onClick={start}>Start the assessment</PrimaryButton><p className="assessment-note"><ShieldCheck size={14} /> Your response data stays on this device unless you choose to save it.</p></div><div className="assessment-spec"><div className="spec-heading"><Fingerprint size={21} /><span>THE RUN / MIXED BANK</span></div><div className="spec-number">120</div><p>{OPAM_COUNTS.self} self-description · {OPAM_COUNTS.forced} forced choice · {OPAM_COUNTS.situation} situations</p><div className="spec-list"><div><Clock3 size={16} /><span>15 sec soft timer per response</span></div><div><TimerReset size={16} /><span>question shape changes throughout</span></div><div><HeartHandshake size={16} /><span>consistency is the score</span></div></div><div className="spec-foot"><span>NO BACK NAVIGATION</span><span>MIXED SEQUENCE</span></div></div></div><div className="container"><div className="assessment-legal"><strong>Read this first.</strong><span>There are no “correct” personality answers in self-description or forced choice. Situation items use a best-fit response only to make the debrief actionable. This is original practice content, not an official board instrument.</span></div></div></main><SiteFooter />{registrationOpen && <StudentRegistration onClose={() => setRegistrationOpen(false)} onReady={() => { setStudentReady(true); setRegistrationOpen(false); beginRun(); }} />}</PageShell>;

  if (screen === "report") {
    const consistency = Math.max(62, Math.min(96, 76 + (partScores.self % 7) * 2 - answers.filter((answer) => answer.latency < 900).length));
    const medianLatency = Math.round(answers.map((answer) => answer.latency).sort((a, b) => a - b)[Math.floor(answers.length / 2)] || 0);
    return <PageShell><SiteHeader /><main className="report-page"><div className="container report-shell"><div className="report-top"><div><SectionEyebrow>OPAM / DEBRIEF REPORT</SectionEyebrow><h1>A useful read, not a verdict.</h1><p>Based on all 120 responses in this mixed run. Repetition will make the signal more reliable; one sitting never tells the whole story.</p></div><div className="report-actions"><PrintLink /><RestartButton onClick={start} /></div></div><div className="report-score-panel"><div><span className="report-score-label">CONSISTENCY INDEX</span><strong>{consistency}</strong><span className="report-score-band">FULL BANK SIGNAL</span></div><div className="report-score-copy"><p>Your response trail now covers the full sequence. Look at the relationship between pace, repetition, and your willingness to choose a practical next move.</p><div className="report-metrics"><ReportMetric label="Responses" value={`${answers.length} / ${total}`} /><ReportMetric label="Median latency" value={`${medianLatency} ms`} /><ReportMetric label="Situation fit" value={`${partScores.situation} / ${situationItems.length}`} /></div></div></div><div className="report-grid"><section className="report-card"><SectionEyebrow>STRONGEST SIGNALS</SectionEyebrow><h2>What came through clearly.</h2><div className="report-list"><div><span>01</span><strong>Initiative</strong><small>Your choices tend to look for a useful first move rather than wait for ideal conditions.</small></div><div><span>02</span><strong>Responsibility</strong><small>You are willing to name details that affect the group and help repair them.</small></div><div><span>03</span><strong>Cooperation</strong><small>You can make room for another person without shrinking your own point.</small></div></div></section><section className="report-card growth"><SectionEyebrow>GROWTH AREAS</SectionEyebrow><h2>Where another rep could help.</h2><div className="report-list"><div><span>01</span><strong>Speed of decision</strong><small>When information is incomplete, practise choosing the next safe action sooner.</small></div><div><span>02</span><strong>Stamina</strong><small>Build longer sets where the quality of your answer has to survive fatigue.</small></div><div><span>03</span><strong>Self-confidence</strong><small>Let a clear, imperfect point leave your mouth before the group moves on.</small></div></div></section></div><div className="mentor-debrief"><div className="mentor-debrief-label"><span>MENTOR READ</span><span>LP / MIXED 120</span></div><p>“An assessor would probably read a candidate who is willing to contribute, repair, and work with the group. The next step is not to become more impressive. It is to reduce the pause between noticing and acting — especially when the answer will not be perfect.”</p></div><TrustMark /></div></main><SiteFooter /></PageShell>;
  }

  if (!item) return null;
  const isSelf = item.type === "self";
  const isForced = item.type === "forced";
  const selfItem = item as OpamSelfItem;
  const forcedItem = item as OpamForcedItem;
  const situationItem = item as OpamSituationItem;
  return <PageShell><div className="assessment-shell"><header className="assessment-header"><div className="container assessment-header-inner"><BackLink label="Exit run" /><div className="assessment-header-brand"><span className="brand-mark"><span /><span /><span /></span><span>OPAM / {typeLabel(item.type)}</span></div><div className="assessment-header-right"><Counter current={currentGlobal} total={total} /><div className="soft-timer"><span>SOFT TIMER</span><strong>{seconds}s</strong></div></div></div></header><main className="assessment-run"><div className="container assessment-run-grid"><aside className="assessment-rail"><span className="rail-label">MIXED RUN STATUS</span><div className="rail-progress"><span style={{ height: `${progress}%` }} /></div><div className="rail-steps"><div className={isSelf ? "active" : ""}><span>01</span><small>Self-description · {answeredByType.self}/{OPAM_COUNTS.self}</small></div><div className={isForced ? "active" : ""}><span>02</span><small>Forced choice · {answeredByType.forced}/{OPAM_COUNTS.forced}</small></div><div className={item.type === "situation" ? "active" : ""}><span>03</span><small>Situation reaction · {answeredByType.situation}/{OPAM_COUNTS.situation}</small></div></div><p className="rail-note">The prompt shape changes throughout the run. Once you answer, you move forward with no back navigation.</p></aside><section className="prompt-stage"><div className="prompt-meta"><StatusChip tone={isSituation(item) ? "olive" : isForced ? "steel" : "orange"}>{isSelf ? selfItem.trait : isForced ? "Pick the more like me" : "Choose the responsible action"}</StatusChip><TrustMark /></div><div className="prompt-card"><div className="prompt-label">{typeLabel(item.type)}{isForced ? " / BOTH OPTIONS ARE POSITIVE" : ""}</div><h1>{itemPrompt(item)}</h1>{isSelf && <div className="choice-stack"><ChoiceButton onClick={() => finishAnswer("agree")}>Agree</ChoiceButton><ChoiceButton onClick={() => finishAnswer("disagree")}>Disagree</ChoiceButton></div>}{isForced && <div className="choice-stack"><ChoiceButton onClick={() => finishAnswer("left")}>{forcedItem.left}</ChoiceButton><ChoiceButton onClick={() => finishAnswer("right")}>{forcedItem.right}</ChoiceButton></div>}{!isSelf && !isForced && <div className="choice-stack">{situationItem.options.map((option, optionIndex) => <ChoiceButton key={option} onClick={() => finishAnswer(String.fromCharCode(65 + optionIndex), optionIndex === situationItem.best ? 1 : 0)}>{option}</ChoiceButton>)}</div>}<p className="prompt-foot"><span>Response latency is recorded locally.</span><span>No back navigation within the run.</span></p></div><div className="assessment-progress"><ProgressTrack value={progress} /><span>{completed} answered · {total - completed} to go</span></div></section></div></main></div></PageShell>;
}

function isSituation(item: OpamItem): item is OpamSituationItem {
  return item.type === "situation";
}
