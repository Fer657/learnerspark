import { ArrowRight, Brain, Check, Gauge, Grid3X3, LockKeyhole, MessageCircle, Radar, ScanLine, ShieldCheck, Target, UserRound } from "lucide-react";
import { Link } from "wouter";
import { GhostButton, PrimaryButton, SectionEyebrow, SectionHeading, SiteFooter, SiteHeader, StatusChip, TestimonialCard, TrustMark } from "../components/SiteChrome";

const olqGroups = [
  { name: "Planning & organising", code: "F1", items: ["Effective intelligence", "Reasoning ability", "Organising ability", "Power of expression"] },
  { name: "Social adjustment", code: "F2", items: ["Social adaptability", "Cooperation", "Sense of responsibility"] },
  { name: "Social effectiveness", code: "F3", items: ["Initiative", "Self-confidence", "Speed of decision", "Ability to influence the group"] },
  { name: "Dynamic", code: "F4", items: ["Determination", "Liveliness", "Courage", "Stamina"] },
];

const differentiators = [
  { icon: Radar, number: "01", title: "Pattern fidelity", body: "Timed, single-direction drills that respect the shape of the task — not a gamified approximation." },
  { icon: Target, number: "02", title: "Honest scoring", body: "No green ticks for the sake of it. You get a useful signal, even when the signal says keep working." },
  { icon: MessageCircle, number: "03", title: "Mentor-grade debriefs", body: "Plain language on what an assessor could notice, plus the next repetition worth making." },
  { icon: LockKeyhole, number: "04", title: "Free core content", body: "The practice that helps you start is not hidden behind a payment wall or a fake urgency bar." },
];

const testimonials = [
  { initials: "AS", quote: "The first mock that made me slow down and read my own patterns instead of hunting for a score.", name: "Aarav S.", detail: "NDA aspirant · Pune" },
  { initials: "MK", quote: "The tone is different. It feels like someone is giving you a debrief, not trying to sell you a dream.", name: "Mehak K.", detail: "CDS aspirant · Chandigarh" },
  { initials: "RN", quote: "I used the 10-second memory drill between classes. Small reps, but I knew exactly what I was training.", name: "Ritvik N.", detail: "AFCAT aspirant · Kochi" },
];

export default function Home() {
  return <div className="min-h-screen bg-sand text-ink"><SiteHeader /><main>
    <section className="hero-section">
      <div className="hero-overlay" />
      <div className="container hero-inner">
        <div className="hero-copy"><SectionEyebrow dark>SSB STAGE 1 · FIELD PREP / 01</SectionEyebrow><h1>Crack SSB Stage 1 — <em>before</em> you enter the hall.</h1><p className="hero-subhead">Train for the shape of the test, not a fantasy of yourself. Timed CSSS drills, honest OPAM signals, and a calmer way to build readiness.</p><div className="hero-actions"><PrimaryButton href="/csss">Take CSSS practice</PrimaryButton><GhostButton href="/opam">Take OPAM assessment</GhostButton></div><p className="hero-fineprint"><ShieldCheck size={14} /> No prediction. No borrowed confidence. Just reps you can trust.</p></div>
        <div className="hero-instrument"><div className="instrument-top"><span>LP / READOUT</span><span>LIVE DEMO</span></div><div className="instrument-circle"><div className="instrument-crosshair" /><div className="instrument-sweep" /><span className="instrument-center">01</span></div><div className="instrument-readout"><div><span>Signal</span><strong>READY</strong></div><div><span>Response window</span><strong>10—22 SEC</strong></div></div><div className="instrument-footer"><span>CSSS / OPAM</span><span>ONE ACCOUNT</span></div></div>
      </div>
      <div className="hero-bottom-strip"><div className="container hero-strip-inner"><span>TRAIN THE SIGNAL</span><span className="strip-separator">/</span><span>KEEP THE STORY HONEST</span><span className="strip-separator">/</span><span>SHOW UP BETTER</span></div></div>
    </section>

    <section className="intro-section"><div className="container intro-grid"><div><SectionEyebrow>WHY STAGE 1 FEELS DIFFERENT</SectionEyebrow><h2>It is not a knowledge test wearing an army uniform.</h2></div><div><p className="intro-lead">The screening gate is fast, compressed, and deliberately unfamiliar. Your first job is not to “look like an officer.” It is to notice how you think when the clock is running.</p><p className="intro-body">Learners Park turns that first encounter into small, repeatable sessions. You will see where attention slips, where consistency breaks, and where the next useful rep is hiding.</p></div></div></section>

    <section className="stage-section"><div className="container"><SectionHeading kicker="01 / THE NEW STAGE 1" title="Three layers. One honest first impression." body="A plain-English read on the parts candidates tend to overcomplicate." /><div className="stage-cards"><article className="stage-card stage-card-dark"><div className="stage-card-number">01</div><ScanLine size={24} /><h3>Screening tests</h3><p>Think of the first day as a filter for attention, speed, and group presence — not a final verdict on your potential.</p><span className="stage-card-note">The gate, not the whole story.</span></article><article className="stage-card"><div className="stage-card-number">02</div><Brain size={24} /><h3>CSSS cognitive battery</h3><p>Short tasks test working memory, spatial judgement, patterns, language, and sometimes the quality of your listening.</p><span className="stage-card-note">Accuracy under pressure.</span></article><article className="stage-card stage-card-orange"><div className="stage-card-number">03</div><UserRound size={24} /><h3>OPAM personality module</h3><p>A run of statements and situations. There is no perfect answer — there is only the consistency of your real one.</p><span className="stage-card-note">Answer as you are.</span></article></div></div></section>

    <section className="olq-section"><div className="container"><div className="olq-header"><div><SectionEyebrow>02 / THE FRAMEWORK</SectionEyebrow><h2>15 OLQs, read as behaviours.</h2></div><p>Officer Like Qualities are not a personality type to perform. They are a useful vocabulary for spotting what you already do — and what deserves practice.</p></div><div className="olq-grid">{olqGroups.map((group) => <article className="olq-card" key={group.name}><div className="olq-card-top"><span>{group.code}</span><span>04 / 15</span></div><h3>{group.name}</h3><ul>{group.items.map((item) => <li key={item}><Check size={13} />{item}</li>)}</ul></article>)}</div></div></section>

    <section className="why-section"><div className="container"><div className="why-header"><SectionHeading dark kicker="03 / THE DIFFERENCE" title="Built to make the next attempt smarter." body="No noise, no borrowed confidence — just a sharper read on the work." /><div className="why-aside"><span className="why-aside-number">4</span><span>ways to keep your prep honest</span></div></div><div className="differentiator-grid">{differentiators.map(({ icon: Icon, number, title, body }) => <article className="differentiator" key={number}><div className="differentiator-top"><span className="differentiator-number">{number}</span><Icon size={20} /></div><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>

    <section className="launch-section"><div className="container launch-grid"><div><SectionEyebrow>04 / START WITH A SIGNAL</SectionEyebrow><h2>Twenty minutes of honest work beats another hour of anxious scrolling.</h2><p>Pick the door that feels slightly uncomfortable. That is usually the useful one.</p></div><div className="launch-cards"><Link href="/csss" className="launch-card"><span className="launch-icon"><Grid3X3 size={20} /></span><span><strong>CSSS cognitive practice</strong><small>5 sections · hard timers · no back navigation</small></span><ArrowRight size={18} /></Link><Link href="/opam" className="launch-card"><span className="launch-icon orange"><Gauge size={20} /></span><span><strong>OPAM personality assessment</strong><small>3 parts · 15 sec soft timer · debrief report</small></span><ArrowRight size={18} /></Link></div></div></section>

    <section className="testimonial-section"><div className="container"><div className="testimonial-header"><SectionEyebrow>05 / FIELD NOTES</SectionEyebrow><h2>What a calmer prep room sounds like.</h2><StatusChip tone="orange">Sample voices · not endorsements</StatusChip></div><div className="testimonial-grid">{testimonials.map((item) => <TestimonialCard key={item.name}><div className="testimonial-top"><span className="quote-mark">“</span><TrustMark /></div><p>{item.quote}</p><div className="testimonial-person"><span className="avatar">{item.initials}</span><span><strong>{item.name}</strong><small>{item.detail}</small></span></div></TestimonialCard>)}</div></div></section>
  </main><SiteFooter /></div>;
}
