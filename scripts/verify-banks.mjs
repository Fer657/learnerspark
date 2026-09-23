import fs from "node:fs";

const opam = fs.readFileSync(new URL("../client/src/data/opamBank.ts", import.meta.url), "utf8");
const csss = fs.readFileSync(new URL("../client/src/data/csssBank.ts", import.meta.url), "utf8");
const checks = [
  ["OPAM self items", opam.includes("selfItems"), "typed self-description bank present"],
  ["OPAM forced items", opam.includes("forcedItems"), "typed forced-choice bank present"],
  ["OPAM situation items", opam.includes("situationItems"), "typed situation bank present"],
  ["OPAM total", opam.includes("export const OPAM_TOTAL = opamBank.length"), "runtime total exported"],
  ["CSSS total", csss.includes("export const CSSS_TOTAL = csssBank.length"), "runtime total exported"],
  ["CSSS section counts", csss.includes("CSSS_SECTION_COUNTS"), "per-section counts exported"],
];
for (const [label, ok, detail] of checks) {
  if (!ok) throw new Error(`${label} failed: ${detail}`);
  console.log(`PASS ${label}: ${detail}`);
}
console.log("PASS bank modules are wired for runtime counting");
