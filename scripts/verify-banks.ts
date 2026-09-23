import { OPAM_TOTAL, forcedItems, selfItems, situationItems } from "../client/src/data/opamBank";
import { CSSS_SECTION_COUNTS, CSSS_TOTAL, csssBank } from "../client/src/data/csssBank";

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
  console.log(`PASS ${message}`);
};

assert(selfItems.length === 72, `OPAM self-description bank has ${selfItems.length} items`);
assert(forcedItems.length === 24, `OPAM forced-choice bank has ${forcedItems.length} items`);
assert(situationItems.length === 24, `OPAM situation bank has ${situationItems.length} items`);
assert(OPAM_TOTAL === 120, `OPAM total is ${OPAM_TOTAL}`);
assert(CSSS_TOTAL === 70, `CSSS total is ${CSSS_TOTAL}`);
assert(CSSS_SECTION_COUNTS.memory === 14, `CSSS memory section has ${CSSS_SECTION_COUNTS.memory} items`);
assert(CSSS_SECTION_COUNTS.spatial === 14, `CSSS spatial section has ${CSSS_SECTION_COUNTS.spatial} items`);
assert(CSSS_SECTION_COUNTS.pattern === 14, `CSSS pattern section has ${CSSS_SECTION_COUNTS.pattern} items`);
assert(CSSS_SECTION_COUNTS.language === 14, `CSSS language section has ${CSSS_SECTION_COUNTS.language} items`);
assert(CSSS_SECTION_COUNTS.audio === 14, `CSSS audio section has ${CSSS_SECTION_COUNTS.audio} items`);
assert(csssBank.every((item) => item.options.length === 4), "CSSS every item has four response options");
