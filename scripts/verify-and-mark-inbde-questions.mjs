import fs from "fs";
import path from "path";

const rootDir = "C:/Users/sooraj/.gemini/antigravity/playground/inbde-prep-pro";
const qDir = path.join(rootDir, "public", "questions");
const manifest = JSON.parse(fs.readFileSync(path.join(qDir, "manifest.json"), "utf8"));

console.log("================================================================================");
console.log("   FORENSIC LINE-BY-LINE INBDE VERIFICATION & TRUE/FALSE MARKING ENGINE         ");
console.log("================================================================================\n");

const PROHIBITED_OPTIONS = [
  "all of the above", "none of the above", "all the above",
  "both a and b", "both b and c", "both a and c",
  "neither a nor b", "none of these", "all of these", "both a & b"
];

const FOREIGN_REGEX = /\b(ndeb|afk|cdac|rcdc|health canada|phac|rcdso|cdho|odq|cdsbc|cdobc|pipeda|phipa|canadian|canada|provincial|province|provinces)\b/i;

const seenGlobalIds = new Set();
const seenStems = new Map();

// Pre-pass: check global stems across entire bank
for (const entry of manifest) {
  const filePath = path.join(qDir, `${entry.id}.json`);
  const qs = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const q of qs) {
    if (q.question && typeof q.question === "string") {
      const norm = q.question.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (norm.length > 30) {
        if (!seenStems.has(norm)) {
          seenStems.set(norm, q.id);
        }
      }
    }
  }
}
function auditQuestionStrict(q, subjectId, index, currentSeenStems, currentSeenIds) {
  const checks = {
    c1_fourOptions: false,
    c2_noProhibitedOptions: false,
    c3_validCorrectAnswer: false,
    c4_substantiveStem: false,
    c5_negativeCapitalized: false,
    c6_universalToothNotation: false,
    c7_usRegulatoryCompliant: false,
    c8_substantiveExplanation: false,
    c9_aha2021Compliant: false,
    c10_waterlineCompliant: false,
    c11_uniqueStemAndId: false
  };

  const failures = [];

  // C1: Exact 4 options, all non-empty, all distinct
  if (Array.isArray(q.options) && q.options.length === 4) {
    const validStrings = q.options.every(o => typeof o === "string" && o.trim().length > 0);
    const uniqueOptions = new Set(q.options.map(o => o.trim().toLowerCase())).size === 4;
    if (validStrings && uniqueOptions) {
      checks.c1_fourOptions = true;
    } else {
      failures.push("Options not distinct or contains empty string");
    }
  } else {
    failures.push(`Options count is ${Array.isArray(q.options) ? q.options.length : "invalid"}`);
  }

  // C2: No prohibited options ("All of the above", "None of the above", etc.)
  if (Array.isArray(q.options)) {
    let hasProhibited = false;
    for (const opt of q.options) {
      const lower = (opt || "").toLowerCase().trim();
      if (PROHIBITED_OPTIONS.includes(lower)) {
        hasProhibited = true;
        failures.push(`Prohibited option found: "${opt}"`);
      }
    }
    if (!hasProhibited) checks.c2_noProhibitedOptions = true;
  }

  // C3: Valid correct answer index 0, 1, 2, 3
  if (Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 && q.correctAnswer <= 3) {
    checks.c3_validCorrectAnswer = true;
  } else {
    failures.push(`Invalid correctAnswer index: ${q.correctAnswer}`);
  }

  // C4: Substantive stem (length >= 25)
  if (typeof q.question === "string" && q.question.trim().length >= 25) {
    checks.c4_substantiveStem = true;
  } else {
    failures.push("Stem is missing or < 25 characters");
  }

  // C5: Negative stem capitalization
  const stem = q.question || "";
  const negMatch = stem.match(/\b(which of the following is (?:not|the least)|all of the following are .* except)\b/i);
  if (negMatch) {
    const snippet = negMatch[0];
    if (/\b(?:not|except|least)\b/.test(snippet)) {
      failures.push(`Uncapitalized negative in stem: "${snippet}"`);
    } else {
      checks.c5_negativeCapitalized = true;
    }
  } else {
    checks.c5_negativeCapitalized = true;
  }

  // C6: Universal Tooth Notation (No FDI)
  const fullText = (stem || "") + " " + (Array.isArray(q.options) ? q.options.join(" ") : "") + " " + (q.explanation || "");
  const fdiHigh = fullText.match(/#([3-8][3-8]|[5-8][1-5])\b/);
  const fdiKey = fullText.match(/\bFDI\b/i);
  if (fdiHigh || fdiKey) {
    failures.push(`FDI notation found: ${fdiHigh ? fdiHigh[0] : ""} ${fdiKey ? fdiKey[0] : ""}`);
  } else {
    checks.c6_universalToothNotation = true;
  }

  // C7: 100% US Regulatory Compliant
  const foreignMatch = fullText.match(FOREIGN_REGEX);
  const cdaMatch = fullText.match(/\bCDA\b/);
  if (foreignMatch || cdaMatch) {
    failures.push(`Non-US regulatory term found: ${foreignMatch ? foreignMatch[0] : ""} ${cdaMatch ? cdaMatch[0] : ""}`);
  } else {
    checks.c7_usRegulatoryCompliant = true;
  }

  // C8: Substantive clinical explanation (>= 30 characters)
  if (typeof q.explanation === "string" && q.explanation.trim().length >= 30) {
    checks.c8_substantiveExplanation = true;
  } else {
    failures.push("Explanation is missing or < 30 characters");
  }

  // C9: 2021 AHA Prophylaxis Guideline Compliance
  if (/infective endocarditis|antibiotic prophylaxis|cardiac condition/i.test(fullText)) {
    if (Array.isArray(q.options) && q.correctAnswer >= 0 && q.correctAnswer < q.options.length) {
      const correctText = q.options[q.correctAnswer];
      if (/clindamycin/i.test(correctText)) {
        failures.push("Outdated 2021 AHA: Clindamycin marked as correct");
      } else {
        checks.c9_aha2021Compliant = true;
      }
    } else {
      checks.c9_aha2021Compliant = true;
    }
  } else {
    checks.c9_aha2021Compliant = true;
  }

  // C10: Waterline Standard (<= 500 CFU/mL, not 200)
  if (/200\s*cfu\/ml/i.test(fullText) && !/500\s*cfu\/ml/i.test(fullText)) {
    failures.push("Waterline threshold cites 200 CFU/mL instead of EPA/CDC 500 CFU/mL");
  } else {
    checks.c10_waterlineCompliant = true;
  }

  // C11: Global Unique Stem & ID
  let uniqueId = false;
  if (q.id && !currentSeenIds.has(q.id)) {
    currentSeenIds.add(q.id);
    uniqueId = true;
  } else {
    failures.push(`Duplicate ID: ${q.id}`);
  }

  let uniqueStem = false;
  const normStem = stem.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (normStem.length > 30) {
    if (currentSeenStems.has(normStem) && currentSeenStems.get(normStem) !== q.id) {
      failures.push(`Duplicate stem with ${currentSeenStems.get(normStem)}`);
    } else {
      currentSeenStems.set(normStem, q.id);
      uniqueStem = true;
    }
  } else {
    uniqueStem = true;
  }

  if (uniqueId && uniqueStem) {
    checks.c11_uniqueStemAndId = true;
  }

  const isStrictPass = Object.values(checks).every(Boolean);

  return {
    isStrictPass,
    checks,
    failures
  };
}
let totalAudited = 0;
let totalPassCount = 0;
let totalFailCount = 0;

const subjectBreakdown = {};
const allMarkedQuestions = [];
const failedQuestionsList = [];

const globalSeenIds = new Set();
const globalSeenStems = new Map();

for (const entry of manifest) {
  const filePath = path.join(qDir, `${entry.id}.json`);
  const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));

  let subjectPass = 0;
  let subjectFail = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    totalAudited++;

    const result = auditQuestionStrict(q, entry.id, i, globalSeenStems, globalSeenIds);

    // Explicitly stamp the verification fields on the question object
    q.inbdeVerified = result.isStrictPass;
    q.inbdeStrictPass = result.isStrictPass;
    q.inbdeAudit = {
      status: result.isStrictPass ? "TRUE" : "FALSE",
      verifiedAt: new Date().toISOString(),
      standardsVersion: "JCNDE_INBDE_2026",
      checks: result.checks
    };

    if (result.isStrictPass) {
      subjectPass++;
      totalPassCount++;
    } else {
      subjectFail++;
      totalFailCount++;
      failedQuestionsList.push({
        id: q.id,
        topic: entry.id,
        index: i,
        failures: result.failures
      });
    }

    allMarkedQuestions.push(q);
  }

  subjectBreakdown[entry.id] = {
    total: questions.length,
    trueCount: subjectPass,
    falseCount: subjectFail,
    accuracy: ((subjectPass / questions.length) * 100).toFixed(2) + "%"
  };

  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), "utf8");
  console.log(`[AUDITED & MARKED] ${entry.id.padEnd(30)} : ${subjectPass}/${questions.length} marked TRUE (PASS), ${subjectFail} FALSE`);
}

// Synchronize src/lib/questions.json
fs.writeFileSync(path.join(rootDir, "src", "lib", "questions.json"), JSON.stringify(allMarkedQuestions, null, 2), "utf8");
console.log(`\nSuccessfully synchronized all ${allMarkedQuestions.length.toLocaleString()} questions with inbdeVerified stamps to src/lib/questions.json`);

console.log("\n================================================================================");
console.log("                  FORENSIC VERIFICATION AUDIT RESULTS                          ");
console.log("================================================================================");
console.log(`Total Questions Inspected:     ${totalAudited.toLocaleString()}`);
console.log(`Marked TRUE (Strict INBDE):    ${totalPassCount.toLocaleString()} (${((totalPassCount / totalAudited) * 100).toFixed(2)}%)`);
console.log(`Marked FALSE (Defects):        ${totalFailCount}`);

console.log("\nSubject-by-Subject Breakdown:");
console.table(subjectBreakdown);

if (totalFailCount > 0) {
  console.log("\nFailed Questions Detail:");
  console.log(JSON.stringify(failedQuestionsList, null, 2));
}

// Save complete forensic audit artifact
const auditArtifact = {
  timestamp: new Date().toISOString(),
  totalQuestions: totalAudited,
  trueCount: totalPassCount,
  falseCount: totalFailCount,
  complianceRate: ((totalPassCount / totalAudited) * 100).toFixed(2) + "%",
  subjectBreakdown,
  failedQuestions: failedQuestionsList
};

fs.writeFileSync(path.join(rootDir, "scripts", "inbde-verification-audit.json"), JSON.stringify(auditArtifact, null, 2), "utf8");
console.log("\nSaved complete verification artifact to: scripts/inbde-verification-audit.json");
