import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const ARTIFACT_DIR = "C:\\Users\\sooraj\\.gemini\\antigravity\\brain\\59559eb0-10b7-4e60-a34a-e6f96f996bf1";
const DOWNLOADS_DIR = path.join(ROOT, "public", "downloads");

const questionsPath = path.join(ROOT, "src", "lib", "questions.json");
const questions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
console.log(`Loaded ${questions.length} questions.`);

// 1. Save JSON to public/downloads
const jsonPublicPath = path.join(DOWNLOADS_DIR, "inbde-14000-questions.json");
fs.copyFileSync(questionsPath, jsonPublicPath);
console.log(`Saved JSON to ${jsonPublicPath}`);

// 2. Generate CSV
function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

const letterByIndex = ["A", "B", "C", "D"];
const csvHeader = [
  "ID",
  "Topic",
  "Question",
  "Option A",
  "Option B",
  "Option C",
  "Option D",
  "Correct Answer Letter",
  "Correct Answer Text",
  "Explanation",
  "INBDE Verified"
].join(",") + "\n";

const csvRows = questions.map(q => {
  const optA = q.options && q.options[0] ? q.options[0] : "";
  const optB = q.options && q.options[1] ? q.options[1] : "";
  const optC = q.options && q.options[2] ? q.options[2] : "";
  const optD = q.options && q.options[3] ? q.options[3] : "";
  const correctLetter = letterByIndex[q.correctAnswer] || "";
  const correctText = q.options && q.options[q.correctAnswer] ? q.options[q.correctAnswer] : "";
  const verified = q.inbdeVerified ? "TRUE" : "FALSE";

  return [
    escapeCsv(q.id),
    escapeCsv(q.topicId),
    escapeCsv(q.question),
    escapeCsv(optA),
    escapeCsv(optB),
    escapeCsv(optC),
    escapeCsv(optD),
    escapeCsv(correctLetter),
    escapeCsv(correctText),
    escapeCsv(q.explanation),
    escapeCsv(verified)
  ].join(",");
});

const csvPublicPath = path.join(DOWNLOADS_DIR, "inbde-14000-questions.csv");
fs.writeFileSync(csvPublicPath, csvHeader + csvRows.join("\n"), "utf8");
console.log(`Saved CSV to ${csvPublicPath}`);

// 3. Copy to Artifact Directory for direct UI download
const jsonArtifactPath = path.join(ARTIFACT_DIR, "inbde-14000-questions.json");
const csvArtifactPath = path.join(ARTIFACT_DIR, "inbde-14000-questions.csv");

fs.copyFileSync(jsonPublicPath, jsonArtifactPath);
fs.copyFileSync(csvPublicPath, csvArtifactPath);
console.log(`Copied to Artifacts directory:`);
console.log(` - ${jsonArtifactPath}`);
console.log(` - ${csvArtifactPath}`);
