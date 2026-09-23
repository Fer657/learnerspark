# Learners Park

Learners Park is an independent, mobile-first practice platform for Indian defence aspirants preparing for SSB Stage 1. The current build is **Phase 2**: the home narrative plus functional, no-login CSSS and OPAM practice engines backed by complete original content banks.

## Phase 2 included

- Editorial home page with the Learners Park brand system, Stage 1 explainer, 15 OLQ grouping, differentiators, testimonials, trust notice, and official links.
- CSSS practice engine at `/csss`: 70 original items across five sections split 15/15/15/15/10, with hard per-question timers, no back navigation, section pauses, local response timing, spoken number-string prompts for audio practice, and benchmarked results.
- OPAM practice engine at `/opam`: 120 original items across 60 self-description statements, 35 forced-choice pairs, and 25 situation reactions, with a 15-second soft timer, no back navigation, local response latency, shuffled situation option order, and mentor-style debrief output.
- Placeholder routes for `/tests`, `/briefs`, and `/guides` that are intentionally labeled as Phase 2/3 rather than dead links.
- SEO metadata, responsive mobile layouts, PWA manifest, robots file, and reduced-motion support.

The banks use original practice content. They are not official question banks or official psychometric instruments and must not be presented as such. The repository includes `scripts/verify-banks.ts`, which checks counts, unique IDs and prompts, answer indexes, forced-pair tags, shuffled situation keys, and known typo regressions.

## Content format for the next phases

Keep question banks as TypeScript data modules or JSON files with one object per item. A written-test item should follow this shape:

```ts
{
  id: "nda-maths-001",
  exam: "NDA",
  section: "Mathematics",
  difficulty: "Standard",
  prompt: "Original question text here",
  options: ["A", "B", "C", "D"],
  answer: 1,
  explanation: "Plain-language reasoning, not just the option letter.",
  marks: 2,
  negativeMarks: 0.66
}
```

A brief should follow this shape:

```ts
{
  id: "brief-2026-09-23-01",
  date: "2026-09-23",
  category: "Defence Deals",
  title: "Original headline",
  summary: "80–150 word original summary.",
  ssbAngle: "How this could enter a GD, lecturette, or interview.",
  sources: [{ label: "Official source", href: "https://example.com" }]
}
```

An OPAM item should retain the item type, trait mapping, reverse-pair key where applicable, and scenario options. Do not mix personal response data into the content files. Response latency belongs on-device unless the learner explicitly opts in to saving a history.

## Local development

```bash
pnpm install
pnpm dev
```

Validate before handoff:

```bash
pnpm check
pnpm build
```

## Deploying to Vercel or Netlify

Use the project root as the repository root. Build with `pnpm build`. The static frontend is emitted under `dist/public`; the scaffold's start script can serve it with the generated Node wrapper. For a static-only host, configure the publish directory as `dist/public` and add a history-fallback rewrite from `/*` to `/index.html` so `/opam` and `/csss` continue to work on refresh.

The project is already configured for a Vite build. Do not expose response data through a public API in the static build. If accounts, database-backed result history, or scheduled daily briefs are added later, upgrade the scaffold to the full-stack WebDev template before adding secrets.

## Pointing `learnerspark.online`

1. Create the production deployment in Vercel or Netlify and copy the host's DNS targets.
2. At the domain registrar, add the host-provided apex and `www` records. Prefer the host's recommended ALIAS/ANAME for the apex; use a CNAME for `www` where supported.
3. Set `www.learnerspark.online` to redirect to the chosen canonical host.
4. Wait for DNS propagation, then enable the host-managed TLS certificate.
5. Verify `/`, `/opam`, and `/csss` directly and confirm that refreshes preserve client-side routing.

## Trust and compliance

Learners Park is independent and must not claim affiliation with the Indian Armed Forces, DIPR, or any Selection Board. Simulations are based on publicly known patterns and are for self-assessment only; they do not predict official results. Official information belongs at `joinindianarmy.nic.in`, `careerairforce.nic.in`, and `joinindiannavy.gov.in`.
