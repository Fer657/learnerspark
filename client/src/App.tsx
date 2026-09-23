import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import OPAM from "./pages/OPAM";
import CSSS from "./pages/CSSS";
import NotFound from "./pages/NotFound";
import { PageShell, SiteFooter, SiteHeader, SectionEyebrow } from "./components/SiteChrome";

function Upcoming({ title, body }: { title: string; body: string }) {
  return <PageShell><SiteHeader /><main className="upcoming-page"><SectionEyebrow>BUILD QUEUE · PHASE 2</SectionEyebrow><h1>{title}</h1><p>{body}</p><div className="upcoming-card"><span className="phase-pill">Coming next</span><h2>Content is being assembled with the same standard.</h2><p>The next cut will add original question banks, daily briefs, and long-form guides — with no borrowed copy or “guaranteed recommendation” claims.</p></div></main><SiteFooter /></PageShell>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/opam" component={OPAM} /><Route path="/csss" component={CSSS} /><Route path="/tests"><Upcoming title="Written practice, without the guesswork." body="NDA, CDS and AFCAT practice sets are on deck for Phase 2." /></Route><Route path="/briefs"><Upcoming title="Briefs that become speaking points." body="A daily current-affairs room with a clear SSB angle is on deck for Phase 3." /></Route><Route path="/guides"><Upcoming title="Guides for the work between attempts." body="Mentor-voice guides for the new Stage 1, OLQs, PIQ and psychology tests are on deck." /></Route><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
