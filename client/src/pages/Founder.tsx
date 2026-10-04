import { ArrowUpRight, BookOpen, BriefcaseBusiness, CheckCircle2, Mail, MessageCircle, MapPin, Phone, ShieldCheck, Star, Target } from "lucide-react";
import { Link } from "wouter";
import { GhostButton, PageShell, PrimaryButton, SectionEyebrow, SiteFooter, SiteHeader } from "../components/SiteChrome";

const whatsappUrl = "https://wa.me/919009829888";
const emailUrl = "mailto:amansaroj2304@gmail.com";
const phoneUrl = "tel:+919009829888";
const sourceUrl = "https://learnerspark.online/?i=1";

const milestones = [
  { year: "2016", title: "NDA recommendation", body: "Recommended for NDA, marking the beginning of a defence and leadership journey." },
  { year: "2017", title: "Defence examination sweep", body: "Cleared Airforce X & Y, Navy AA & SSR, and Indian Coast Guard examinations." },
  { year: "2018—2020", title: "Officer-level success", body: "Cleared CDSE and AFCAT while building a broad understanding of officer-entry preparation." },
  { year: "Professional", title: "DRDO scientist", body: "Served at the Defence Research and Development Organisation, gaining technical and national-security perspective." },
  { year: "Present", title: "Education entrepreneur", body: "Founded Learner’s Park and mentors defence aspirants through focused, practical preparation." },
];

const qualifications = ["M.Sc", "B.Sc", "B.Ed", "NDA recommended", "CDSE cleared", "AFCAT cleared"];

export default function Founder() {
  return <PageShell><SiteHeader /><main className="founder-page">
    <section className="founder-hero"><div className="container founder-hero-grid"><div><SectionEyebrow>FOUNDER · MENTOR · EDUCATOR</SectionEyebrow><h1>Aman Saroj <em>Gopal</em></h1><p className="founder-lede">Shaping futures through excellence in defence education — combining military discipline, scientific thinking, and a practical mentor’s voice.</p><div className="founder-actions"><PrimaryButton href={whatsappUrl}>Chat on WhatsApp</PrimaryButton><GhostButton href={emailUrl}>Send an email</GhostButton></div><p className="founder-source">Founder of Learner’s Park · Ex-DRDO · Gwalior / Pan-India</p></div><aside className="founder-identity"><div className="founder-avatar">ASG</div><p className="founder-identity-label">THE PERSON BEHIND THE PLATFORM</p><strong>A disciplined approach to the work before the hall.</strong><span>Defence preparation · mentorship · education</span></aside></div></section>

    <section className="founder-about"><div className="container founder-about-grid"><div><SectionEyebrow>ABOUT THE FOUNDER</SectionEyebrow><h2>The architect of a calmer, more honest preparation room.</h2></div><div className="founder-copy"><p>Aman Saroj Gopal brings together an academic foundation in science and education with first-hand experience of defence examinations and national research.</p><p>His work is built around helping aspirants understand the task, practise deliberately, and develop the behaviours that matter — without false promises or borrowed confidence.</p><div className="qualification-list">{qualifications.map((item) => <span key={item}><CheckCircle2 size={14} />{item}</span>)}</div></div></div></section>

    <section className="founder-journey"><div className="container"><div className="founder-section-heading"><div><SectionEyebrow dark>THE JOURNEY</SectionEyebrow><h2>Service, learning, then shared opportunity.</h2></div><p>A timeline adapted from the founder profile provided on Learner’s Park’s official website.</p></div><div className="founder-timeline">{milestones.map((item) => <article className="founder-milestone" key={item.year}><span>{item.year}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div></div></section>

    <section className="founder-platforms"><div className="container"><SectionEyebrow>PLATFORMS & INITIATIVES</SectionEyebrow><div className="platform-grid"><article><BriefcaseBusiness size={22} /><span>FLAGSHIP VENTURE</span><h3>Learner’s Park</h3><p>A comprehensive defence-examination preparation platform designed to make quality practice more accessible.</p></article><article><Target size={22} /><span>EXPERT FACULTY</span><h3>Sabre Officers Defence Academy</h3><p>Contributing defence-preparation expertise and mentorship to future officers.</p></article><article><BookOpen size={22} /><span>STRATEGIC PARTNER</span><h3>Abhilasha Classes</h3><p>Supporting quality defence preparation in Gwalior and beyond.</p></article></div></div></section>

    <section className="founder-contact"><div className="container founder-contact-grid"><div><SectionEyebrow>GET IN TOUCH</SectionEyebrow><h2>Ready to shape your future?</h2><p>For mentorship, defence-preparation guidance, or collaboration, contact Aman Saroj Gopal directly.</p><div className="contact-actions"><PrimaryButton href={whatsappUrl}><MessageCircle size={16} /> WhatsApp</PrimaryButton><GhostButton href={emailUrl}><Mail size={16} /> Email</GhostButton></div></div><div className="contact-card"><div><Phone size={17} /><span>Call directly</span><a href={phoneUrl}>+91 90098 29888</a></div><div><Mail size={17} /><span>Email address</span><a href={emailUrl}>amansaroj2304@gmail.com</a></div><div><MapPin size={17} /><span>Location</span><strong>India · Gwalior / Pan-India</strong></div><div className="contact-note"><ShieldCheck size={15} />Use the official source for the latest contact details.</div></div></div></section>

    <section className="founder-source-note"><div className="container"><Star size={15} /><p>Founder information and contact details are adapted from the provided Learner’s Park profile.</p><a href={sourceUrl} target="_blank" rel="noreferrer">View source profile <ArrowUpRight size={14} /></a></div></section>
  </main><SiteFooter /></PageShell>;
}
