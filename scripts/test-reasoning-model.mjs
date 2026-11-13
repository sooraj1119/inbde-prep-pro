import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const questions = JSON.parse(fs.readFileSync("src/lib/questions.json", "utf8"));
const sample = questions[42];

const prompt = `You are a strict JCNDE INBDE Dental Board Auditor.
Audit this question:
ID: ${sample.id}
Question: ${sample.question}
Options:
A: ${sample.options[0]}
B: ${sample.options[1]}
C: ${sample.options[2]}
D: ${sample.options[3]}
Designated Answer: ${["A","B","C","D"][sample.correctAnswer]} (${sample.options[sample.correctAnswer]})

Output strictly valid JSON with no markdown formatting:
{
  "id": "${sample.id}",
  "clinicalVerdict": "PASS",
  "reasonedBestOption": "A",
  "agreesWithDesignated": true,
  "inbdeFormatCompliant": true,
  "clinicalRationale": "reason"
}`;

fs.writeFileSync("scripts/temp-sample-prompt.txt", prompt, "utf8");
console.log("Sample prompt prepared for:", sample.id);

try {
  const output = execSync(`"C:\\Users\\sooraj\\.gemini\\bin\\agy.exe" -p "${prompt.replace(/"/g, '\\"')}" --model gemini-3.8-flash-high`, {
    encoding: "utf8",
    timeout: 30000
  });
  console.log("Model Output:\n", output);
} catch (e) {
  console.error("Execution error:", e.message);
  if (e.stdout) console.log("stdout:", e.stdout);
  if (e.stderr) console.log("stderr:", e.stderr);
}
