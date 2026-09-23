# Learners Park Content Audit

## Defects found and corrected

| Area | Defect | Correction |
|---|---|---|
| OPAM counts | The bank did not match the supplied specification: it was presented as 72/24/24, while the brief requires 60/35/25. | Replaced the bank with 60 self-description statements, 35 forced-choice pairs, and 25 situation reactions: 120 total. |
| OPAM freshness | The previous bank generated repeated variants from a small seed list, creating near-duplicates. | Replaced generated variants with individually authored, everyday Indian contexts and unique prompts. |
| OPAM metadata | OLQ tags, keyed direction, pair IDs, social-desirability flags, and situation style metadata were missing. | Added the 15 requested OLQ codes, positive/negative keys, five reverse-pair groups, forced-choice cross-tags, and situation option metadata. |
| OPAM gameability | The responsible situation option was always option A. | Rotated option order per item and recalculated the best index. |
| CSSS counts | The previous bank used 14 items in every section, contrary to the required 15/15/15/15/10 distribution. | Replaced it with 15 memory, 15 spatial, 15 pattern, 15 language, and 10 audio items. |
| CSSS prompt quality | The coding section contained a malformed option (`CTO[A]`) and several items had overly thin stimulus descriptions. | Replaced the malformed option and added explicit subtypes/render hints for memory, spatial, coding, analogy, and TTS items. |
| CSSS audio | Audio items were framed as synthetic tone labels rather than spoken scripts. | Replaced them with ten TTS-ready spoken number-string recall items. |
| Documentation/UI | Landing copy, rail counts, README, and footer still described the old preview release. | Updated all visible counts and release labels to the corrected full-bank build. |

## Validation performed

The strengthened `scripts/verify-banks.ts` checks exact counts, unique IDs, unique prompts, valid answer indexes, four-option structure, forced-pair cross-tags, shuffled situation keys, explanations, and the removed coding typo.

Final checks passed:

```text
OPAM: 60 self + 35 forced + 25 situation = 120
CSSS: 15 memory + 15 spatial + 15 pattern + 15 language + 10 audio = 70
Unique IDs/prompts: PASS
Valid scoring indexes: PASS
Shuffled responsible options: PASS
TypeScript check: PASS
Production build: PASS
Browser smoke test: OPAM landing + first prompt/progression PASS
Browser smoke test: CSSS landing + first prompt/timer/progression PASS
```

The content remains original practice material and is not an official SSB, DIPR, psychometric, or board question bank.
