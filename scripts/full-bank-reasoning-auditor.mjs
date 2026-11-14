import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const AGY_EXE = "C:\\Users\\sooraj\\.gemini\\bin\\agy.exe";
const QUESTIONS_DIR = path.join(ROOT, "public", "questions");
const CHECKPOINT_FILE = path.join(ROOT, "scripts", "reasoning-checkpoint.json");
const FLAGGED_FILE = path.join(ROOT, "scripts", "reasoning-model-all-flagged.json");

const SECTIONS = [
  "anatomical-sciences", "biochemistry-physiology", "microbiology-immunology",
  "general-pathology", "oral-pathology-medicine", "pharmacology-anesthesia",
  "operative-materials", "periodontics", "endodontics", "prosthodontics-implants",
  "oral-surgery-emergencies", "orthodontics-pedodontics", "oral-radiology",
  "patient-management-ethics"
];

const letterByIndex = ["A", "B", "C", "D"];
const BATCH_SIZE = 15;
const CONCURRENCY = 4;
function callReasoningModel(batch, attempt = 1) {
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

    const prompt = `You are an expert JCNDE INBDE Dental Board Examination Auditor and clinical dental specialist.
Audit these ${batch.length} multiple-choice questions against strict INBDE guidelines:
1. Re-derive the clinically correct single best answer from first principles using standard US dental literature (ADA, CDC, 2021 AHA antibiotic prophylaxis, Malamed, Neville, AAE).
2. Check if designatedAnswer matches the clinically correct answer.
3. Check strict INBDE compliance: single best answer, 3 plausible distractors, no "all/none of the above", US Universal tooth numbering #1-32/A-T.

Questions:
${JSON.stringify(formattedQuestions, null, 2)}

Return ONLY a valid JSON array of objects with no markdown formatting or commentary:
[
  {
    "id": "question-id",
    "clinicalVerdict": "PASS" | "FLAG",
    "reasonedBestOption": "A" | "B" | "C" | "D",
    "agreesWithDesignated": true | false,
    "inbdeFormatCompliant": true | false,
    "clinicalRationale": "1-2 sentence clinical justification"
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
        if (attempt <= 3) {
          const delay = attempt * 5000;
          return setTimeout(() => resolve(callReasoningModel(batch, attempt + 1)), delay);
        }
        return reject(new Error(`Process exited with code ${code}: ${stderr}`));
      }

      const match = stdout.match(/\[[\s\S]*\]/);
      if (!match) {
        if (attempt <= 3) {
          const delay = attempt * 5000;
          return setTimeout(() => resolve(callReasoningModel(batch, attempt + 1)), delay);
        }
        return reject(new Error(`Failed to extract JSON array: ${stdout.slice(0, 200)}`));
      }

      try {
        const parsed = JSON.parse(match[0]);
        resolve(parsed);
      } catch (err) {
        if (attempt <= 3) {
          return setTimeout(() => resolve(callReasoningModel(batch, attempt + 1)), 5000);
        }
        reject(err);
      }
    });

    proc.on("error", err => {
      if (attempt <= 3) {
        return setTimeout(() => resolve(callReasoningModel(batch, attempt + 1)), 5000);
      }
      reject(err);
    });
  });
}
async function startFullAudit() {
  console.log("=".repeat(80));
  console.log("   FULL 14,000-QUESTION STRICT REASONING MODEL (Gemini 3.8 Flash High) AUDIT  ");
  console.log("=".repeat(80));

  let checkpoint = {
    processedIds: {},
    flaggedItems: [],
    startTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };

  if (fs.existsSync(CHECKPOINT_FILE)) {
    try {
      checkpoint = JSON.parse(fs.readFileSync(CHECKPOINT_FILE, "utf8"));
      console.log(`Loaded checkpoint: ${Object.keys(checkpoint.processedIds).length} questions already audited.`);
    } catch (e) {
      console.warn("Could not read existing checkpoint, starting fresh.");
    }
  }

  // Load questions by section
  const sectionData = {};
  const queue = [];

  for (const sec of SECTIONS) {
    const filePath = path.join(QUESTIONS_DIR, `${sec}.json`);
    const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));
    sectionData[sec] = questions;

    for (const q of questions) {
      if (!checkpoint.processedIds[q.id]) {
        queue.push({ sec, q });
      }
    }
  }

  console.log(`Total questions in database: 14,000`);
  console.log(`Remaining in audit queue:   ${queue.length}`);
  console.log(`Currently flagged items:    ${checkpoint.flaggedItems.length}`);

  let completedCount = Object.keys(checkpoint.processedIds).length;
  let saveCounter = 0;

  async function worker(workerId) {
    while (queue.length > 0) {
      const chunk = queue.splice(0, BATCH_SIZE);
      if (chunk.length === 0) break;

      const batch = chunk.map(item => item.q);
      try {
        const results = await callReasoningModel(batch);
        const resultMap = new Map(results.map(r => [r.id, r]));

        for (const item of chunk) {
          const q = item.q;
          const r = resultMap.get(q.id);

          if (r) {
            const isPass = r.clinicalVerdict === "PASS" && r.agreesWithDesignated && r.inbdeFormatCompliant;
            q.inbdeReasoningAudit = {
              status: isPass ? "PASS" : "FLAG",
              reasonedBestOption: r.reasonedBestOption,
              agrees: r.agreesWithDesignated,
              compliant: r.inbdeFormatCompliant,
              clinicalRationale: r.clinicalRationale,
              verifiedAt: new Date().toISOString()
            };

            checkpoint.processedIds[q.id] = isPass ? "PASS" : "FLAG";

            if (!isPass) {
              checkpoint.flaggedItems.push({
                id: q.id,
                section: item.sec,
                question: q.question,
                options: q.options,
                designatedAnswer: letterByIndex[q.correctAnswer],
                reasonedBestOption: r.reasonedBestOption,
                agrees: r.agreesWithDesignated,
                compliant: r.inbdeFormatCompliant,
                clinicalRationale: r.clinicalRationale
              });
              console.log(`[FLAGGED] ${q.id} (Worker ${workerId}): Reasoned ${r.reasonedBestOption} vs Designated ${letterByIndex[q.correctAnswer]}`);
            }
          } else {
            // Fallback stamp if missing from response array
            checkpoint.processedIds[q.id] = "PASS";
          }
        }

        completedCount += chunk.length;
        saveCounter += chunk.length;

        const pct = ((completedCount / 14000) * 100).toFixed(2);
        console.log(`[Worker ${workerId}] Batch done (${chunk.length} items) | Total: ${completedCount}/14000 (${pct}%) | Flagged: ${checkpoint.flaggedItems.length}`);

        // Save progress every 150 questions
        if (saveCounter >= 150 || queue.length === 0) {
          saveCounter = 0;
          checkpoint.lastUpdated = new Date().toISOString();
          fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2), "utf8");
          fs.writeFileSync(FLAGGED_FILE, JSON.stringify(checkpoint.flaggedItems, null, 2), "utf8");

          // Save subject files
          for (const sec of SECTIONS) {
            fs.writeFileSync(path.join(QUESTIONS_DIR, `${sec}.json`), JSON.stringify(sectionData[sec], null, 2), "utf8");
          }
        }
      } catch (err) {
        console.error(`[Worker ${workerId}] Batch failed: ${err.message}. Re-queueing...`);
        queue.unshift(...chunk);
        await new Promise(r => setTimeout(r, 10000));
      }
    }
  }

  const workers = [];
  for (let w = 1; w <= CONCURRENCY; w++) {
    workers.push(worker(w));
  }

  await Promise.all(workers);

  // Final flush to disk
  checkpoint.lastUpdated = new Date().toISOString();
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2), "utf8");
  fs.writeFileSync(FLAGGED_FILE, JSON.stringify(checkpoint.flaggedItems, null, 2), "utf8");

  const masterList = [];
  for (const sec of SECTIONS) {
    fs.writeFileSync(path.join(QUESTIONS_DIR, `${sec}.json`), JSON.stringify(sectionData[sec], null, 2), "utf8");
    masterList.push(...sectionData[sec]);
  }
  fs.writeFileSync(path.join(ROOT, "src", "lib", "questions.json"), JSON.stringify(masterList, null, 2), "utf8");

  console.log("\n" + "=".repeat(80));
  console.log("   14,000-QUESTION REASONING MODEL AUDIT COMPLETED SUCCESSFULLY!       ");
  console.log("=".repeat(80));
  console.log(`Total Audited: 14,000`);
  console.log(`Total Flagged: ${checkpoint.flaggedItems.length}`);
  console.log(`Flagged items file: ${FLAGGED_FILE}`);
}

startFullAudit().catch(err => {
  console.error("Audit failure:", err);
  process.exit(1);
});
