import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { csssBank, CSSS_SECTION_COUNTS, CSSS_TOTAL } from "../client/src/data/csssBank";
import { OPAM_COUNTS, OPAM_TOTAL } from "../client/src/data/opamBank";

const outputPath = resolve(process.argv[2] ?? "/home/ubuntu/learnerspark-admin-console/data/public_source_snapshot.json");
const snapshot = {
  source: "learnerspark-public-react",
  projectPath: "/home/ubuntu/learnerspark",
  generatedAt: new Date().toISOString(),
  files: ["client/src/data/csssBank.ts", "client/src/data/opamBank.ts"],
  banks: {
    csss: { total: CSSS_TOTAL, sections: CSSS_SECTION_COUNTS, questionIds: csssBank.map((item) => item.id) },
    opam: { total: OPAM_TOTAL, parts: OPAM_COUNTS },
  },
};
writeFileSync(outputPath, JSON.stringify(snapshot, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ outputPath, generatedAt: snapshot.generatedAt, csss: CSSS_TOTAL, opam: OPAM_TOTAL }));
