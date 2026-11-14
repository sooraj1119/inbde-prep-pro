import fs from "fs";
import { execSync } from "child_process";

const questions = JSON.parse(fs.readFileSync("src/lib/questions.json", "utf8"));
// Sample 5 diverse questions: 1 anatomy, 1 path, 1 pharm, 1 materials, 1 ethics
const sampleIndices = [0, 1500, 3000, 6000, 13000];
const sampleBatch = sampleIndices.map(idx => {
  const q = questions[idx];
  return {
    id: q.id,
    topic: q.topicId,
    question: q.question,
    options: {
      A: q.options[0],
      B: q.options[1],
      C: q.options[2],
      D: q.options[3]
    },
    designatedAnswer: ["A","B","C","D"][q.correctAnswer]
  };
});

const prompt = `You are a strict JCNDE INBDE Dental Board Examination Auditor and clinical dental specialist.
Evaluate the following batch of ${sampleBatch.length} multiple-choice questions according to strict INBDE guidelines (single best answer, plausible distractors, no 'all/none of the above', US tooth numbering, 2021 AHA prophylaxis standards, CDC infection control).

Questions:
${JSON.stringify(sampleBatch, null, 2)}

Return strictly a valid JSON array of objects with no markdown wrapping or preamble:
[
  {
    "id": "question-id",
    "clinicalVerdict": "PASS" | "FLAG",
    "reasonedBestOption": "A" | "B" | "C" | "D",
    "agreesWithDesignated": true | false,
    "inbdeFormatCompliant": true | false,
    "clinicalRationale": "concise 1-2 sentence justification"
  }
]`;

fs.writeFileSync("scripts/temp-batch-prompt.txt", prompt, "utf8");

try {
  // Use agy --settings or standard prompt
  const stdout = execSync(`"C:\\Users\\sooraj\\.gemini\\bin\\agy.exe" -p "${prompt.replace(/"/g, '\\"')}" --model gemini-3.8-flash-high`, {
    encoding: "utf8",
    timeout: 45000
  });
  console.log("Raw Output:\n", stdout);
} catch (e) {
  console.error("Exec error:", e.message);
  if (e.stdout) console.log("stdout:", e.stdout);
}
