import fs from "fs";
import { spawn } from "child_process";

const questions = JSON.parse(fs.readFileSync("src/lib/questions.json", "utf8"));

// Pick 5 representative questions from 5 distinct core sections
const testIndices = [
  { sec: "anatomical-sciences", idx: 0 },
  { sec: "pharmacology-anesthesia", idx: 3000 },
  { sec: "oral-pathology-medicine", idx: 5000 },
  { sec: "operative-materials", idx: 7000 },
  { sec: "patient-management-ethics", idx: 13000 }
];

const batch = testIndices.map(t => {
  const q = questions[t.idx];
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

const prompt = `You are an expert JCNDE INBDE Dental Board Auditor and clinical dentist.
Evaluate each of the following ${batch.length} multiple-choice questions for clinical correctness under strict INBDE guidelines.
For each question:
1. Determine the single best answer under American dental standards (ADA, CDC, AHA 2021, Malamed, Neville).
2. Check if the designatedAnswer matches the clinically correct answer.
3. Verify strict INBDE format (single best answer, plausible distractors, no "all/none of the above", US Universal tooth numbering #1-32/A-T).

Questions to audit:
${JSON.stringify(batch, null, 2)}

Output ONLY a JSON array with no markdown formatting or commentary:
[
  {
    "id": "question-id",
    "clinicalVerdict": "PASS" or "FLAG",
    "reasonedBestOption": "A" or "B" or "C" or "D",
    "agreesWithDesignated": true or false,
    "inbdeFormatCompliant": true or false,
    "clinicalRationale": "2-3 sentences of clear clinical reasoning"
  }
]`;

console.log("Launching Reasoning Model (gemini-3.8-flash-high)...");

const agyProcess = spawn("C:\\Users\\sooraj\\.gemini\\bin\\agy.exe", [
  "-p", prompt,
  "--model", "gemini-3.8-flash-high"
], {
  windowsHide: true
});

let stdout = "";
let stderr = "";

agyProcess.stdout.on("data", (chunk) => {
  stdout += chunk.toString();
});

agyProcess.stderr.on("data", (chunk) => {
  stderr += chunk.toString();
});

agyProcess.on("close", (code) => {
  console.log(`Reasoning model process exited with code ${code}`);
  if (stderr.trim()) console.error("STDERR:", stderr);

  // Extract JSON from output
  const jsonMatch = stdout.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    try {
      const results = JSON.parse(jsonMatch[0]);
      console.log("Successfully parsed reasoning model audit results:");
      console.log(JSON.stringify(results, null, 2));

      fs.writeFileSync("scripts/reasoning-model-sample-results.json", JSON.stringify(results, null, 2), "utf8");
    } catch (e) {
      console.error("JSON parse error:", e.message);
      console.log("Raw output:", stdout);
    }
  } else {
    console.log("No JSON array found in output. Raw output:\n", stdout);
  }
});
