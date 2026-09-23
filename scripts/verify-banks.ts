import { OPAM_COUNTS, OPAM_TOTAL, forcedItems, opamBank, selfItems, situationItems } from "../client/src/data/opamBank";
import { CSSS_SECTION_COUNTS, CSSS_TOTAL, csssBank } from "../client/src/data/csssBank";

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
  console.log(`PASS ${message}`);
};
const unique = (values: string[]) => new Set(values).size === values.length;

assert(OPAM_COUNTS.self === 60, `OPAM self-description bank has ${OPAM_COUNTS.self} items`);
assert(OPAM_COUNTS.forced === 35, `OPAM forced-choice bank has ${OPAM_COUNTS.forced} items`);
assert(OPAM_COUNTS.situation === 25, `OPAM situation bank has ${OPAM_COUNTS.situation} items`);
assert(OPAM_TOTAL === 120 && opamBank.length === 120, `OPAM total is ${OPAM_TOTAL}`);
assert(unique(opamBank.map((item) => item.id)), "OPAM ids are unique");
assert(unique(selfItems.map((item) => item.text)), "OPAM self statements are unique");
assert(unique(situationItems.map((item) => item.text)), "OPAM situation prompts are unique");
assert(situationItems.every((item) => item.options.length === 4 && item.best >= 0 && item.best < 4), "OPAM situations have four options and valid best indexes");
assert(new Set(situationItems.map((item) => item.best)).size > 1, "OPAM responsible options are shuffled");
assert(forcedItems.every((item) => item.left !== item.right && item.leftOlq !== item.rightOlq), "OPAM forced pairs are distinct and cross-tagged");
assert(CSSS_TOTAL === 70 && csssBank.length === 70, `CSSS total is ${CSSS_TOTAL}`);
assert(CSSS_SECTION_COUNTS.memory === 15 && CSSS_SECTION_COUNTS.spatial === 15 && CSSS_SECTION_COUNTS.pattern === 15 && CSSS_SECTION_COUNTS.language === 15 && CSSS_SECTION_COUNTS.audio === 10, "CSSS section split is 15/15/15/15/10");
assert(unique(csssBank.map((item) => item.id)), "CSSS ids are unique");
assert(unique(csssBank.map((item) => item.prompt)), "CSSS prompts are unique");
assert(csssBank.every((item) => item.options.length === 4 && item.answer >= 0 && item.answer < 4 && item.explanation.length > 10), "CSSS items have four options, valid answers, and explanations");
assert(!csssBank.some((item) => item.prompt.includes("CTO[A]")), "CSSS coding typo is removed");
console.log("PASS content audit complete");
