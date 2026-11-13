import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const AGY_EXE = "C:\\Users\\sooraj\\.gemini\\bin\\agy.exe";

const SECTIONS = [
  "anatomical-sciences", "biochemistry-physiology", "microbiology-immunology",
  "general-pathology", "oral-pathology-medicine", "pharmacology-anesthesia",
  "operative-materials", "periodontics", "endodontics", "prosthodontics-implants",
  "oral-surgery-emergencies", "orthodontics-pedodontics", "oral-radiology",
  "patient-management-ethics"
];

const letterByIndex = ["A", "B", "C", "D"];

function runModelBatch(batch) {
  return new Promise((resolve, reject) => {
    const formattedQuestions = batch.map(q => ({
      id: q.id,
      topic: q.topicId,
      question: q.question,
      options: {
        A: q.options[0],
        B: q.options[1],
        C: q.options[2],
        D: q.options[3]
      },
      designatedAnswer: letterByIndex[q.correctAnswer]
    }));

    const prompt = `You are a strict JCNDE INBDE Dental Board Examination Auditor and clinical dental board expert.
Critically evaluate each of the following ${batch.length} multiple-choice questions against strict INBDE guidelines:
1. Identify the single best answer from first principles using standard American dental literature (ADA, CDC, 2021 AHA antibiotic prophylaxis, Malamed, Neville).
2. Check if the designatedAnswer matches the clinically correct answer.
3. Verify strict INBDE compliance (single best answer, plausible distractors, no "all/none of the above", US Universal tooth numbering #1-32 and A-T).

Questions to evaluate:
${JSON.stringify(formattedQuestions, null, 2)}

Return ONLY a strictly valid JSON array (no markdown code blocks, no preamble, no trailing text):
[
  {
    "id": "question-id",
    "clinicalVerdict": "PASS" | "FLAG",
    "reasonedBestOption": "A" | "B" | "C" | "D",
    "agreesWithDesignated": true | false,
    "inbdeFormatCompliant": true | false,
    "clinicalRationale": "2-3 sentences explaining the exact clinical mechanism"
  }
]`;

    const proc = spawn(AGY_EXE, [
      "-p", prompt,
      "--model", "gemini-3.8-flash-high"
    ], {
      windowsHide: true
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", chunk => { stdout += chunk.toString(); });
    proc.stderr.on("data", chunk => { stderr += chunk.toString(); });

    proc.on("close", code => {
      if (code !== 0) {
        return reject(new Error(`Process exited with code ${code}: ${stderr}`));
      }

      const match = stdout.match(/\[[\s\S]*\]/);
      if (!match) {
        return reject(new Error(`Failed to find JSON array in output: ${stdout.slice(0, 300)}`));
      }

      try {
        const parsed = JSON.parse(match[0]);
        resolve(parsed);
      } catch (err) {
        reject(new Error(`JSON parse error: ${err.message}`));
      }
    });

    proc.on("error", err => reject(err));
  });
}

async function runMultiSectionAudit() {
  console.log("=".repeat(80));
  console.log("   INBDE REASONING MODEL (Gemini 3.8 Flash High) CLINICAL AUDITOR      ");
  console.log("=".repeat(80));

  const questionsPath = path.join(ROOT, "src", "lib", "questions.json");
  const allQuestions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
  console.log(`Loaded ${allQuestions.length} total questions.`);

  // Sample 2 representative questions from each of the 14 sections (28 questions total across all disciplines)
  const auditSample = [];
  for (const sec of SECTIONS) {
    const secQuestions = allQuestions.filter(q => q.topicId === sec);
    if (secQuestions.length >= 2) {
      auditSample.push(secQuestions[10]); // Question 11
      auditSample.push(secQuestions[secQuestions.length - 10]); // Near end
    }
  }

  console.log(`Selected ${auditSample.length} stratified questions covering all 14 INBDE disciplines.`);
  
  // Run in 2 batches of 14
  const batch1 = auditSample.slice(0, 14);
  const batch2 = auditSample.slice(14);

  console.log("\nExecuting Batch 1 (14 questions across Basic Sciences & Pathology)...");
  const results1 = await runModelBatch(batch1);
  console.log(`✓ Batch 1 completed (${results1.length} verified)`);

  console.log("\nExecuting Batch 2 (14 questions across Clinical Specialties & Ethics)...");
  const results2 = await runModelBatch(batch2);
  console.log(`✓ Batch 2 completed (${results2.length} verified)`);

  const combinedResults = [...results1, ...results2];

  const passCount = combinedResults.filter(r => r.clinicalVerdict === "PASS" && r.agreesWithDesignated).length;
  const flagCount = combinedResults.length - passCount;

  console.log("\n" + "=".repeat(80));
  console.log("                  REASONING MODEL AUDIT SUMMARY                        ");
  console.log("=".repeat(80));
  console.log(`Total Disciplines Tested:    14 / 14`);
  console.log(`Total Questions Evaluated:   ${combinedResults.length}`);
  console.log(`Reasoning Model PASS:        ${passCount} (${((passCount / combinedResults.length) * 100).toFixed(2)}%)`);
  console.log(`Flagged For Review:          ${flagCount}`);

  console.log("\nDetailed Sample of Reasoning Model Clinical Verdicts:");
  combinedResults.slice(0, 6).forEach(r => {
    console.log(`\n[${r.clinicalVerdict}] ID: ${r.id}`);
    console.log(`Reasoned Best Option: Option ${r.reasonedBestOption} (Agrees: ${r.agreesWithDesignated})`);
    console.log(`INBDE Compliant:      ${r.inbdeFormatCompliant}`);
    console.log(`Clinical Rationale:   ${r.clinicalRationale}`);
  });

  const outPath = path.join(ROOT, "scripts", "reasoning-model-audit-report.json");
  fs.writeFileSync(outPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    model: "gemini-3.8-flash-high",
    totalTested: combinedResults.length,
    passCount,
    flagCount,
    passRate: ((passCount / combinedResults.length) * 100).toFixed(2) + "%",
    results: combinedResults
  }, null, 2), "utf8");

  console.log(`\nFull report saved to: ${outPath}`);
}

runMultiSectionAudit().catch(err => {
  console.error("Reasoning auditor failed:", err);
  process.exit(1);
});
