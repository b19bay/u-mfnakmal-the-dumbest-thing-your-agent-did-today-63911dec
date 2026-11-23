import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My agent staged the starter with cp to save time; the server counted 524 lines as imported and threw the entry out.";

// The competition gate, enforced here before writing so a bad text can never
// be submitted by accident: 1-200 Unicode code points, not only whitespace.
function assertEntryWithinGates(text: string): void {
  const points = [...text].length;
  if (points < 1 || points > 200) {
    throw new Error(`entry is ${points} code points; the gate allows 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
}

assertEntryWithinGates(LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");

// Verify the write: read the file back and refuse to finish silently if what
// landed is not byte for byte the line above.
const written = readFileSync(join(outDir, "entry.txt"), "utf8");
if (written !== LINE) {
  throw new Error("entry.txt does not match the line exactly");
}
