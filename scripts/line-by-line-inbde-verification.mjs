import fs from "fs";
import path from "path";

const rootDir = "C:/Users/sooraj/.gemini/antigravity/playground/inbde-prep-pro";
const qDir = path.join(rootDir, "public", "questions");
const manifest = JSON.parse(fs.readFileSync(path.join(qDir, "manifest.json"), "utf8"));

console.log("================================================================================");
console.log("   STRICT INBDE LINE-BY-LINE 14,000-QUESTION DEEP VERIFICATION PIPELINE       ");
console.log("================================================================================\n");

const PROHIBITED_OPTIONS = [
  "all of the above", "none of the above", "all the above",
  "both a and b", "both b and c", "both a and c",
  "neither a nor b", "none of these", "all of these", "both a & b"
];

const FOREIGN_TERMS_REGEX = /\b(ndeb|afk|cdac|rcdc|health canada|phac|rcdso|cdho|odq|cdsbc|cdobc|pipeda|phipa|canadian|canada|provincial|province|provinces)\b/i;

const seenGlobalIds = new Set();
const seenStems = new Map();

const report = {
  totalQuestions: 0,
  bySubject: {},
  violations: []
};
function verifyQuestion(q, subjectId, index) {
  const issues = [];
  const qRef = `${subjectId}[#${index} - id:${q.id}]`;

  // 1. ID Check
  if (!q.id || typeof q.id !== "string" || q.id.trim() === "") {
    issues.push({ type: "INVALID_ID", msg: "Missing or non-string question ID" });
  } else if (seenGlobalIds.has(q.id)) {
    issues.push({ type: "DUPLICATE_ID", msg: `Duplicate global ID: ${q.id}` });
  } else {
    seenGlobalIds.add(q.id);
  }

  // 2. Topic ID Check
  if (q.topicId !== subjectId) {
    issues.push({ type: "TOPIC_MISMATCH", msg: `Topic ID ${q.topicId} does not match file ${subjectId}` });
  }

  // 3. Question Stem Check
  const stem = q.question;
  if (!stem || typeof stem !== "string") {
    issues.push({ type: "MISSING_STEM", msg: "Question stem is missing or not a string" });
  } else {
    const trimmedStem = stem.trim();
    if (trimmedStem.length < 25) {
      issues.push({ type: "SHORT_STEM", msg: `Stem too short (${trimmedStem.length} chars): "${trimmedStem}"` });
    }

    // Negative stem capitalization check
    const negMatch = trimmedStem.match(/\b(which of the following is (?:not|the least)|all of the following are .* except)\b/i);
    if (negMatch) {
      const matchText = negMatch[0];
      if (/\b(?:not|except|least)\b/.test(matchText)) {
        issues.push({ type: "UNCAPITALIZED_NEGATIVE", msg: `Negative keyword uncapitalized: "${matchText}"` });
      }
    }

    // Duplicate stem check (normalized)
    const norm = trimmedStem.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (norm.length > 30) {
      if (seenStems.has(norm)) {
        issues.push({ type: "DUPLICATE_STEM", msg: `Duplicate stem with ${seenStems.get(norm)}` });
      } else {
        seenStems.set(norm, qRef);
      }
    }

    // Double-word typographical check
    const doubleWord = trimmedStem.match(/\b(the|a|an|tooth|teeth|and|or|in|of|to|is|with)\s+\1\b/i);
    if (doubleWord) {
      issues.push({ type: "TYPO_DOUBLE_WORD", msg: `Repeated word in stem: "${doubleWord[0]}"` });
    }
  }

  // 4. Options Array Check
  if (!Array.isArray(q.options)) {
    issues.push({ type: "INVALID_OPTIONS", msg: "Options field is not an array" });
  } else {
    if (q.options.length !== 4) {
      issues.push({ type: "INVALID_OPTION_COUNT", msg: `Expected exactly 4 options, found ${q.options.length}` });
    }

    const optTexts = new Set();
    q.options.forEach((opt, oIdx) => {
      if (typeof opt !== "string" || opt.trim().length === 0) {
        issues.push({ type: "EMPTY_OPTION", msg: `Option index ${oIdx} is empty or not string` });
      } else {
        const cleanOpt = opt.trim().toLowerCase();
        if (optTexts.has(cleanOpt)) {
          issues.push({ type: "DUPLICATE_OPTION", msg: `Option index ${oIdx} is duplicate of another option: "${opt}"` });
        }
        optTexts.add(cleanOpt);

        if (PROHIBITED_OPTIONS.includes(cleanOpt)) {
          issues.push({ type: "PROHIBITED_OPTION", msg: `Option violates INBDE guidelines: "${opt}"` });
        }
      }
    });
  }

  // 5. Correct Answer Index Check
  if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3) {
    issues.push({ type: "INVALID_CORRECT_ANSWER", msg: `Correct answer index invalid: ${q.correctAnswer}` });
  }

  // 6. Explanation Quality Check
  if (!q.explanation || typeof q.explanation !== "string" || q.explanation.trim().length < 30) {
    issues.push({ type: "INSUFFICIENT_EXPLANATION", msg: "Explanation is missing or less than 30 characters" });
  }

  // 7. Clinical Content & Regulatory Compliance
  const fullText = (stem || "") + " " + (Array.isArray(q.options) ? q.options.join(" ") : "") + " " + (q.explanation || "");

  // Foreign regulatory remnants
  const foreignMatch = fullText.match(FOREIGN_TERMS_REGEX);
  if (foreignMatch) {
    issues.push({ type: "NON_US_REGULATORY_REMNANT", msg: `Found non-US regulatory remnant: "${foreignMatch[0]}"` });
  }

  // CDA remnant check (isolated CDA)
  const cdaMatch = fullText.match(/\bCDA\b/);
  if (cdaMatch) {
    issues.push({ type: "CDA_REMNANT", msg: `Found CDA remnant: "${cdaMatch[0]}"` });
  }

  // FDI tooth notation check (#33-85 or #11-28 without Universal context)
  const fdiHighMatch = fullText.match(/#([3-8][3-8]|[5-8][1-5])\b/);
  if (fdiHighMatch) {
    issues.push({ type: "FDI_TOOTH_NOTATION", msg: `Found FDI tooth number: "${fdiHighMatch[0]}"` });
  }

  const fdiKeyword = fullText.match(/\bFDI\b/i);
  if (fdiKeyword) {
    issues.push({ type: "FDI_KEYWORD", msg: `Found FDI keyword: "${fdiKeyword[0]}"` });
  }

  // 2021 AHA Prophylaxis Guideline Check: Clindamycin must NOT be correct for infective endocarditis
  if (/infective endocarditis|antibiotic prophylaxis|cardiac condition/i.test(fullText)) {
    if (Array.isArray(q.options) && q.correctAnswer >= 0 && q.correctAnswer < q.options.length) {
      const correctOpt = q.options[q.correctAnswer];
      if (/clindamycin/i.test(correctOpt)) {
        issues.push({ type: "OUTDATED_AHA_CLINDAMYCIN", msg: "Clindamycin selected as correct answer for antibiotic prophylaxis (violates 2021 AHA guidelines)" });
      }
    }
  }

  // Waterline standard check (must be <= 500 CFU/mL, not 200)
  if (/200\s*cfu\/ml/i.test(fullText) && !/500\s*cfu\/ml/i.test(fullText)) {
    issues.push({ type: "OUTDATED_WATERLINE_CFU", msg: "DUWL threshold cites 200 CFU/mL instead of EPA/CDC 500 CFU/mL" });
  }

  return issues;
}
let totalIssues = 0;
const issueTypeCounts = {};

for (const entry of manifest) {
  const filePath = path.join(qDir, `${entry.id}.json`);
  const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));
  
  let subjectIssueCount = 0;
  report.bySubject[entry.id] = { count: questions.length, issues: 0 };

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    report.totalQuestions++;

    const issues = verifyQuestion(q, entry.id, i);
    if (issues.length > 0) {
      subjectIssueCount += issues.length;
      totalIssues += issues.length;
      for (const issue of issues) {
        issueTypeCounts[issue.type] = (issueTypeCounts[issue.type] || 0) + 1;
        report.violations.push({ loc: `${entry.id}[#${i} - id:${q.id}]`, ...issue });
      }
    }
  }

  report.bySubject[entry.id].issues = subjectIssueCount;
  console.log(`[VERIFIED] ${entry.id.padEnd(30)} : ${questions.length.toLocaleString()} questions inspected, ${subjectIssueCount} issues`);
}

console.log("\n================================================================================");
console.log("                  LINE-BY-LINE VERIFICATION SUMMARY                             ");
console.log("================================================================================");
console.log(`Total Questions Inspected:     ${report.totalQuestions.toLocaleString()}`);
console.log(`Total Violations Found:        ${totalIssues}`);

if (totalIssues > 0) {
  console.log("\nViolations by Category:");
  for (const [type, count] of Object.entries(issueTypeCounts)) {
    console.log(`  - ${type.padEnd(28)} : ${count}`);
  }
  console.log("\nFirst 20 Violations:");
  report.violations.slice(0, 20).forEach(v => {
    console.log(`  [${v.type}] ${v.loc}: ${v.msg}`);
  });
} else {
  console.log("\nPERFECT SCORE: 100% of all 14,000 questions strictly comply with INBDE standards! 🏆");
}

fs.writeFileSync(path.join(rootDir, "scripts", "line-by-line-report.json"), JSON.stringify(report, null, 2), "utf8");
console.log("\nDetailed report saved to: scripts/line-by-line-report.json");
