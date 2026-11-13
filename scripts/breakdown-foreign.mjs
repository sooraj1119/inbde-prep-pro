import fs from "fs";
import path from "path";

const rootDir = "C:/Users/sooraj/.gemini/antigravity/playground/inbde-prep-pro";
const qDir = path.join(rootDir, "public", "questions");
const manifest = JSON.parse(fs.readFileSync(path.join(qDir, "manifest.json"), "utf8"));

const terms = ["ndeb", "afk", "cdac", "rcdc", "health canada", "cda guideline", "nhs", "canadian dental"];
const counts = {};
for (const t of terms) counts[t] = 0;

for (const entry of manifest) {
  const filePath = path.join(qDir, `${entry.id}.json`);
  const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));

  for (const q of questions) {
    const fullText = (q.question + " " + q.options.join(" ") + " " + (q.explanation || "")).toLowerCase();
    for (const t of terms) {
      if (new RegExp(`\\b${t}\\b`, "i").test(fullText)) {
        counts[t]++;
      }
    }
  }
}

console.log("Matches by term:", counts);
