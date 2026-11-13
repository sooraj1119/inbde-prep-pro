import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const QUESTIONS_DIR = path.join(ROOT, "public", "questions");

const SECTIONS = [
  { id: "anatomical-sciences", name: "Anatomic Sciences", count: 1000 },
  { id: "biochemistry-physiology", name: "Biochemistry & Physiology", count: 500 },
  { id: "microbiology-immunology", name: "Microbiology & Pathology", count: 500 },
  { id: "general-pathology", name: "General Pathology", count: 1000 },
  { id: "oral-pathology-medicine", name: "Oral Pathology & Medicine", count: 1500 },
  { id: "pharmacology-anesthesia", name: "Pharmacology & Pain Control", count: 2000 },
  { id: "operative-materials", name: "Operative Dentistry & Dental Materials", count: 1500 },
  { id: "periodontics", name: "Periodontics", count: 500 },
  { id: "endodontics", name: "Endodontics", count: 500 },
  { id: "prosthodontics-implants", name: "Prosthodontics & Implantology", count: 1500 },
  { id: "oral-surgery-emergencies", name: "Oral Surgery & Emergencies", count: 1000 },
  { id: "orthodontics-pedodontics", name: "Orthodontics & Pediatric Dentistry", count: 1000 },
  { id: "oral-radiology", name: "Oral & Maxillofacial Radiology", count: 500 },
  { id: "patient-management-ethics", name: "Patient Management, Public Health & Ethics", count: 1000 },
];

const PROHIBITED_OPTIONS = [
  "all of the above",
  "none of the above",
  "all of the above are correct",
  "none of the above are correct",
  "both a and b",
  "both b and c",
  "both a and c",
  "both a and d",
  "both b and d",
  "both c and d",
  "neither a nor b",
  "neither b nor c"
];

const FOREIGN_TERMS_REGEX = /\b(NDEB|AFK|ACJ|OSCE\b|CDA\b|Canadian Dental|Health Canada|Royal College of Dentists|RCDC|CEOD|provincial dental)\b/i;
const FDI_TOOTH_REGEX = /#([1-4][1-8]|[5-8][1-5])\b/g;

const letterByIndex = ["A", "B", "C", "D"];
const indexByLetter = { A: 0, B: 1, C: 2, D: 3 };
function auditQuestionStrict(q, subjectId, index, seenStems, seenIds) {
  const flags = [];

  // Check 1: ID uniqueness and format
  if (!q.id || typeof q.id !== "string") {
    flags.push({ rule: "ID_FORMAT", detail: "Question missing valid ID string" });
  } else if (seenIds.has(q.id)) {
    flags.push({ rule: "ID_DUPLICATE", detail: `Duplicate ID encountered: ${q.id}` });
  } else {
    seenIds.add(q.id);
  }

  // Check 2: Exactly 4 options
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    flags.push({ rule: "OPTION_COUNT", detail: `Expected exactly 4 options, found ${Array.isArray(q.options) ? q.options.length : 0}` });
  } else {
    // Check 3: No prohibited options
    for (let oIdx = 0; oIdx < 4; oIdx++) {
      const optText = (q.options[oIdx] || "").trim().toLowerCase();
      if (PROHIBITED_OPTIONS.includes(optText)) {
        flags.push({ rule: "PROHIBITED_OPTION", detail: `Option ${letterByIndex[oIdx]} uses prohibited phrasing: "${q.options[oIdx]}"` });
      }
    }

    // Check 4: Option distinctness
    const lowerTrimmed = q.options.map(o => (o || "").trim().toLowerCase());
    if (new Set(lowerTrimmed).size !== 4) {
      flags.push({ rule: "DUPLICATE_OPTION", detail: "Question contains duplicate or identical options" });
    }
  }

  // Check 5: Correct answer index range
  if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3) {
    flags.push({ rule: "CORRECT_ANSWER_RANGE", detail: `correctAnswer must be integer 0..3, found: ${q.correctAnswer}` });
  }

  // Check 6: Substantive clinical stem
  const stem = (q.question || "").trim();
  if (stem.length < 25) {
    flags.push({ rule: "SHORT_STEM", detail: `Stem length (${stem.length} chars) is below INBDE threshold of 25` });
  }

  // Check 7: Deduplication of stem
  const normStem = stem.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (normStem.length >= 30) {
    if (seenStems.has(normStem)) {
      flags.push({ rule: "DUPLICATE_STEM", detail: `Identical clinical stem found in question ${seenStems.get(normStem)}` });
    } else {
      seenStems.set(normStem, q.id);
    }
  }

  // Check 8: Capitalization of negative qualifiers
  const negMatch = stem.match(/\b(which of the following is (?:not|the least)|all of the following are .* except)\b/i);
  if (negMatch && /\b(?:not|except|least)\b/.test(negMatch[0])) {
    flags.push({ rule: "UNCAPITALIZED_NEGATIVE", detail: `Negative modifier should be uppercase: "${negMatch[0]}"` });
  }

  // Check 9: Substantive clinical explanation
  const exp = (q.explanation || "").trim();
  if (exp.length < 30) {
    flags.push({ rule: "SHORT_EXPLANATION", detail: `Explanation length (${exp.length} chars) is below INBDE threshold of 30` });
  }

  // Combine full text for regulatory and terminology scans
  const allText = `${stem} ${(q.options || []).join(" ")} ${exp}`;

  // Check 10: Non-US / Foreign Remnants
  const foreignMatch = allText.match(FOREIGN_TERMS_REGEX);
  if (foreignMatch) {
    flags.push({ rule: "NON_US_REGULATORY", detail: `Found non-US dental reference: "${foreignMatch[0]}"` });
  }

  // Check 11: FDI Tooth Numbering
  const fdiMatches = allText.match(FDI_TOOTH_REGEX);
  if (fdiMatches) {
    // Filter to exclude valid US Universal permanent numbers (#1 to #32)
    const trueFDI = fdiMatches.filter(m => {
      const num = parseInt(m.replace("#", ""), 10);
      return num > 32;
    });
    if (trueFDI.length > 0) {
      flags.push({ rule: "FDI_TOOTH_NOTATION", detail: `Found FDI 2-digit tooth numbering: ${trueFDI.join(", ")}` });
    }
  }

  // Check 12: 2021 AHA Prophylaxis Guideline Compliance
  if (/infective endocarditis|antibiotic prophylaxis/i.test(allText)) {
    const chosenOpt = q.options && q.options[q.correctAnswer] ? q.options[q.correctAnswer].toLowerCase() : "";
    if (chosenOpt.includes("clindamycin")) {
      flags.push({ rule: "AHA_2021_VIOLATION", detail: "Clindamycin designated as correct prophylaxis answer (violates 2021 AHA guideline)" });
    }
  }

  // Check 13: Waterline Standard Compliance (EPA/CDC <= 500 CFU/mL)
  if (/200\s*cfu\/ml/i.test(allText) && !/500\s*cfu\/ml/i.test(allText)) {
    flags.push({ rule: "WATERLINE_CFU_STANDARD", detail: "Waterline standard mentions obsolete 200 CFU/mL without CDC/EPA 500 CFU/mL standard" });
  }

  // Check 14: Answer Concordance (Strict)
  // Check for explicit "Option A/B/C/D is correct" or "The correct answer is Option A/B/C/D"
  const optLetterMatch = exp.match(/\b(?:the\s+correct\s+answer\s+is\s+option\s+([A-D])\b|option\s+([A-D])\s+is\s+the\s+correct\s+answer\b)/i);
  if (optLetterMatch) {
    const statedLetter = (optLetterMatch[1] || optLetterMatch[2]).toUpperCase();
    const statedIndex = indexByLetter[statedLetter];
    if (statedIndex !== undefined && statedIndex !== q.correctAnswer) {
      flags.push({
        rule: "ANSWER_CONCORDANCE_LETTER",
        detail: `Explanation explicitly states Option ${statedLetter} is correct, but correctAnswer index is ${q.correctAnswer} (${letterByIndex[q.correctAnswer]})`
      });
    }
  }

  return {
    passed: flags.length === 0,
    flags
  };
}
async function runStrictVerification() {
  console.log("=".repeat(80));
  console.log("   STRICT JCNDE INBDE MODEL VERIFICATION & QUALITY AUDIT ENGINE        ");
  console.log("=".repeat(80));

  const globalStems = new Map();
  const globalIds = new Set();

  let totalCount = 0;
  let passCount = 0;
  let flagCount = 0;

  const sectionSummaries = [];
  const flaggedIssues = [];
  const allMasterQuestions = [];

  for (const sec of SECTIONS) {
    const filePath = path.join(QUESTIONS_DIR, `${sec.id}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`Missing file: ${filePath}`);
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const questions = JSON.parse(raw);

    let secPass = 0;
    let secFlag = 0;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      totalCount++;

      const res = auditQuestionStrict(q, sec.id, i, globalStems, globalIds);

      q.inbdeVerified = true;
      q.inbdeStrictPass = res.passed;
      q.inbdeAudit = {
        status: res.passed ? "PASS" : "FLAGGED",
        verifiedAt: new Date().toISOString(),
        strictModelVersion: "JCNDE_INBDE_STRICT_V2",
        flags: res.flags
      };

      if (res.passed) {
        passCount++;
        secPass++;
      } else {
        flagCount++;
        secFlag++;
        flaggedIssues.push({
          section: sec.id,
          index: i,
          id: q.id,
          stem: (q.question || "").slice(0, 100),
          correctAnswer: q.correctAnswer,
          options: q.options,
          explanation: (q.explanation || "").slice(0, 200),
          flags: res.flags
        });
      }

      allMasterQuestions.push(q);
    }

    // Write updated subject file
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), "utf8");

    sectionSummaries.push({
      section: sec.name,
      total: questions.length,
      pass: secPass,
      flagged: secFlag,
      passRate: ((secPass / questions.length) * 100).toFixed(2) + "%"
    });
  }

  // Update src/lib/questions.json
  const masterPath = path.join(ROOT, "src", "lib", "questions.json");
  fs.writeFileSync(masterPath, JSON.stringify(allMasterQuestions, null, 2), "utf8");
  console.log(`\nUpdated master bundle at src/lib/questions.json (${allMasterQuestions.length} questions)`);

  // Save flagged issues report
  const reportPath = path.join(ROOT, "scripts", "inbde-flagged-issues.json");
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalQuestions: totalCount,
    passedQuestions: passCount,
    flaggedQuestions: flagCount,
    overallPassRate: ((passCount / totalCount) * 100).toFixed(2) + "%",
    sectionSummaries,
    flaggedIssues
  }, null, 2), "utf8");

  console.log("\n" + "=".repeat(80));
  console.log("                  STRICT VERIFICATION SUMMARY                          ");
  console.log("=".repeat(80));
  console.table(sectionSummaries);

  console.log(`\nTotal Questions Inspected:     ${totalCount.toLocaleString()}`);
  console.log(`Strict INBDE Pass Count:       ${passCount.toLocaleString()} (${((passCount / totalCount) * 100).toFixed(2)}%)`);
  console.log(`Flagged Issues for Later:      ${flagCount.toLocaleString()}`);

  if (flagCount === 0) {
    console.log("\n>>> ZERO ISSUES FLAGGED: 100% OF 14,000 QUESTIONS STRICTLY COMPLIANT WITH INBDE STANDARDS! <<<");
  } else {
    console.log(`\n>>> ${flagCount} QUESTIONS FLAGGED FOR REVIEW. See scripts/inbde-flagged-issues.json <<<`);
  }
}

runStrictVerification().catch(err => {
  console.error("Verification engine failed:", err);
  process.exit(1);
});
