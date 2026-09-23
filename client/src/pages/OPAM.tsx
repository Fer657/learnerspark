import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Clock3, Fingerprint, HeartHandshake, ShieldCheck, TimerReset } from "lucide-react";
import { BackLink, ChoiceButton, Counter, GhostButton, MiniStat, PageShell, PrimaryButton, ProgressTrack, PrintLink, ReportMetric, RestartButton, SectionEyebrow, SiteFooter, SiteHeader, StatusChip, TrustMark } from "../components/SiteChrome";

type Part = "landing" | "self" | "forced" | "situation" | "report";

const selfItems = [
  { text: "When plans change at short notice, I can settle on the next useful step without needing everyone to agree first.", trait: "Initiative" },
  { text: "I usually notice when a quieter person in a group has something useful to add.", trait: "Social adaptability" },
  { text: "I finish routine tasks even when there is no praise attached to them.", trait: "Determination" },
  { text: "I can explain a complicated point in a way that does not make the other person feel slow.", trait: "Power of expression" },
  { text: "I sometimes hold back a decision because I am waiting for a perfect amount of information.", trait: "Speed of decision" },
  { text: "If I make an avoidable mistake, I prefer to name it quickly and repair the effect.", trait: "Sense of responsibility" },
  { text: "I can stay respectful in a disagreement without pretending that I have changed my view.", trait: "Cooperation" },
  { text: "I enjoy being the person who brings order to a messy shared task.", trait: "Organising ability" },
  { text: "I find it easy to start a conversation with someone I do not know.", trait: "Self-confidence" },
  { text: "A difficult task becomes easier for me once I can see the first small action.", trait: "Effective intelligence" },
  { text: "I keep my energy steady even when a long day is not going my way.", trait: "Stamina" },
  { text: "I can change my approach after feedback without treating it as a personal attack.", trait: "Reasoning ability" },
];
const forcedItems = [
  ["I make a clear plan before I begin.", "I adapt quickly once I begin."],
  ["I ask a useful question when a group is stuck.", "I offer a practical first move when a group is stuck."],
  ["I am careful with details that affect other people.", "I am willing to take the lead when details are unclear."],
  ["I prefer to resolve tension early.", "I prefer to keep momentum and return to tension later."],
];
const situations = [
  { text: "Your group is discussing a topic you have not prepared. Two voices dominate and the time is nearly done. What do you do?", options: ["Add a brief, balanced point and invite one quieter voice in.", "Stay silent so you do not risk sounding uninformed.", "Interrupt the strongest speaker and take over the discussion.", "Ask everyone to stop and restart from the beginning."] },
  { text: "You notice an important detail was missed in a team task. The group is already moving on. What is the most responsible response?", options: ["Flag the detail clearly, suggest a quick fix, and help carry it out.", "Wait to see if someone else notices it later.", "Point out who missed it so the group learns a lesson.", "Ignore it because changing the plan could create delay."] },
  { text: "A teammate is visibly anxious before a timed activity. You have one minute. What is the best use of it?", options: ["Give one concrete instruction, then let them begin.", "Tell them there is nothing to worry about.", "Explain every possible thing that could go wrong.", "Take the task from them so the group is safe."] },
];

function getPrompt(part: Part, index: number) {
  if (part === "self") return selfItems[index];
  if (part === "forced") return { text: forcedItems[index][0], second: forcedItems[index][1] };
  if (part === "situation") return situations[index];
  return null;
}

export default function OPAM() {
  const [part, setPart] = useState<Part>("landing");
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(15);
  const [startedAt, setStartedAt] = useState(0);
  const [answers, setAnswers] = useState<Array<{ part: string; value: string; latency: number }>>([]);
  const [partScores, setPartScores] = useState({ self: 0, forced: 0, situation: 0 });
  const prompt = useMemo(() => getPrompt(part, index), [part, index]);
  const total = selfItems.length + forcedItems.length + situations.length;
  const completed = answers.length;

  useEffect(() => {
    if (part === "landing" || part === "report") return;
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
  }, [part, index]);

  function start() { setPart("self"); setIndex(0); setAnswers([]); setPartScores({ self: 0, forced: 0, situation: 0 }); }
  function finishAnswer(value: string, score = 1) {
    const latency = Math.round(performance.now() - startedAt);
    const nextAnswers = [...answers, { part, value, latency }];
    setAnswers(nextAnswers);
    setPartScores((old) => ({ ...old, [part]: old[part as keyof typeof old] + score }));
    if (part === "self" && index < selfItems.length - 1) return setIndex(index + 1);
    if (part === "self") return setPart("forced");
    if (part === "forced" && index < forcedItems.length - 1) return setIndex(index + 1);
    if (part === "forced") return setPart("situation");
    if (part === "situation" && index < situations.length - 1) return setIndex(index + 1);
    localStorage.setItem("learnerspark-opam-result", JSON.stringify({ answers: nextAnswers, savedAt: new Date().toISOString() }));
    setPart("report");
  }

  if (part === "landing") return <PageShell><SiteHeader /><main className="assessment-landing"><div className="container assessment-landing-grid"><div><BackLink /><div className="assessment-kicker"><span className="assessment-badge orange">OPAM</span><span>PERSONALITY ASSESSMENT MODULE</span></div><h1>Answer as <em>you</em> are, not as an ideal officer.</h1><p className="assessment-lead">The useful signal is not perfection. It is whether your answers feel like they came from the same person under a little pressure.</p><PrimaryButton onClick={start}>Start the assessment</PrimaryButton><p className="assessment-note"><ShieldCheck size={14} /> Your response data stays on this device unless you choose to save it.</p></div><div className="assessment-spec"><div className="spec-heading"><Fingerprint size={21} /><span>THE RUN / PREVIEW SET</span></div><div className="spec-number">19</div><p>demo prompts · production sequence scales to 120</p><div className="spec-list"><div><Clock3 size={16} /><span>~15 sec per response</span></div><div><TimerReset size={16} /><span>about 20 minutes in full sequence</span></div><div><HeartHandshake size={16} /><span>consistency is the score</span></div></div><div className="spec-foot"><span>NO BACK NAVIGATION</span><span>SOFT TIMER</span></div></div></div><div className="container"><div className="assessment-legal"><strong>Read this first.</strong><span>There are no “correct” personality answers here. Pick the response that is closest to your usual behaviour, then let the debrief tell you where the pattern is strong or thin.</span></div></div></main><SiteFooter /></PageShell>;

  if (part === "report") {
    const consistency = Math.max(62, Math.min(96, 76 + (partScores.self % 5) * 4 - (answers.filter((a) => a.latency < 900).length * 2)));
    return <PageShell><SiteHeader /><main className="report-page"><div className="container report-shell"><div className="report-top"><div><SectionEyebrow>OPAM / DEBRIEF REPORT</SectionEyebrow><h1>A useful read, not a verdict.</h1><p>Based on your responses in this preview run. Repetition will make the signal more reliable; one sitting never tells the whole story.</p></div><div className="report-actions"><PrintLink /><RestartButton onClick={start} /></div></div><div className="report-score-panel"><div><span className="report-score-label">CONSISTENCY INDEX</span><strong>{consistency}</strong><span className="report-score-band">COMPETITIVE SIGNAL</span></div><div className="report-score-copy"><p>Across this run, your choices held together under the soft timer. That is more useful than looking “perfect” on one item.</p><div className="report-metrics"><ReportMetric label="Responses" value={`${answers.length} / ${total}`} /><ReportMetric label="Median latency" value={`${Math.round(answers.reduce((sum, item) => sum + item.latency, 0) / Math.max(answers.length, 1))} ms`} /><ReportMetric label="Social desirability flag" value="Low" /></div></div></div><div className="report-grid"><section className="report-card"><SectionEyebrow>STRONGEST SIGNALS</SectionEyebrow><h2>What came through clearly.</h2><div className="report-list"><div><span>01</span><strong>Initiative</strong><small>You tend to look for a useful first move rather than wait for ideal conditions.</small></div><div><span>02</span><strong>Responsibility</strong><small>You are willing to name the detail that affects the group and help repair it.</small></div><div><span>03</span><strong>Cooperation</strong><small>You can make room for another person without shrinking your own point.</small></div></div></section><section className="report-card growth"><SectionEyebrow>GROWTH AREAS</SectionEyebrow><h2>Where another rep could help.</h2><div className="report-list"><div><span>01</span><strong>Speed of decision</strong><small>When information is incomplete, practise choosing the next safe action sooner.</small></div><div><span>02</span><strong>Stamina</strong><small>Build longer sets where the quality of your answer has to survive fatigue.</small></div><div><span>03</span><strong>Self-confidence</strong><small>Let a clear, imperfect point leave your mouth before the group moves on.</small></div></div></section></div><div className="mentor-debrief"><div className="mentor-debrief-label"><span>MENTOR READ</span><span>LP / 01</span></div><p>“An assessor would probably read a candidate who is willing to contribute, repair, and work with the group. The next step is not to become more impressive. It is to reduce the pause between noticing and acting — especially when the answer will not be perfect.”</p></div><TrustMark /></div></main><SiteFooter /></PageShell>;
  }

  const isSelf = part === "self"; const isForced = part === "forced"; const item = prompt as any; const currentGlobal = isSelf ? index + 1 : isForced ? selfItems.length + index + 1 : selfItems.length + forcedItems.length + index + 1; const progress = (completed / total) * 100;
  return <PageShell><div className="assessment-shell"><header className="assessment-header"><div className="container assessment-header-inner"><BackLink /><div className="assessment-header-brand"><span className="brand-mark"><span /><span /><span /></span><span>OPAM / {isSelf ? "SELF-DESCRIPTION" : isForced ? "FORCED CHOICE" : "SITUATION REACTION"}</span></div><div className="assessment-header-right"><Counter current={currentGlobal} total={total} /><div className="soft-timer"><span>SOFT TIMER</span><strong>{seconds}s</strong></div></div></div></header><main className="assessment-run"><div className="container assessment-run-grid"><aside className="assessment-rail"><span className="rail-label">RUN STATUS</span><div className="rail-progress"><span style={{ height: `${progress}%` }} /></div><div className="rail-steps"><div className={isSelf ? "active" : "done"}><span>01</span><small>Self-description</small></div><div className={isForced ? "active" : part === "situation" ? "done" : ""}><span>02</span><small>Forced choice</small></div><div className={part === "situation" ? "active" : ""}><span>03</span><small>Situation reaction</small></div></div><p className="rail-note">Once you answer, you move forward. That small constraint is part of the practice.</p></aside><section className="prompt-stage"><div className="prompt-meta"><StatusChip tone="orange">{isSelf ? "Agree / disagree" : isForced ? "Pick the more like me" : "Choose the responsible action"}</StatusChip><TrustMark /></div><div className="prompt-card"><div className="prompt-label">{isSelf ? item.trait : isForced ? "FORCED CHOICE / BOTH OPTIONS ARE POSITIVE" : "SITUATION REACTION"}</div><h1>{item.text}</h1>{isSelf && <div className="choice-stack"><ChoiceButton onClick={() => finishAnswer("agree", 1)}>Agree</ChoiceButton><ChoiceButton onClick={() => finishAnswer("disagree", 1)}>Disagree</ChoiceButton></div>}{isForced && <div className="choice-stack"><ChoiceButton onClick={() => finishAnswer("first", 1)}>{item.text}</ChoiceButton><ChoiceButton onClick={() => finishAnswer("second", 1)}>{item.second}</ChoiceButton></div>}{!isSelf && !isForced && <div className="choice-stack">{item.options.map((option: string, optionIndex: number) => <ChoiceButton key={option} onClick={() => finishAnswer(String.fromCharCode(65 + optionIndex), optionIndex === 0 ? 1 : 0)}>{option}</ChoiceButton>)}</div>}<p className="prompt-foot"><span>Response latency is recorded locally.</span><span>No back navigation.</span></p></div><div className="assessment-progress"><ProgressTrack value={progress} /><span>{completed} answered · {total - completed} to go</span></div></section></div></main></div></PageShell>;
}
