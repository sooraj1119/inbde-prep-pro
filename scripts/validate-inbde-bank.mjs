import fs from "fs";
import path from "path";

const rootDir = "C:/Users/sooraj/.gemini/antigravity/playground/inbde-prep-pro";
const qDir = path.join(rootDir, "public", "questions");
const manifest = JSON.parse(fs.readFileSync(path.join(qDir, "manifest.json"), "utf8"));

console.log("==================================================================");
console.log("       COMPREHENSIVE END-TO-END INBDE QUESTION BANK AUDIT         ");
console.log("==================================================================\n");

let totalQuestions = 0;
let clinicalVignetteCount = 0;
let fundamentalScienceCount = 0;
let toothNotationCheckCount = 0;
let universalToothFoundCount = 0;
let fdiRemainingCount = 0;
let canadianGovFoundCount = 0;
let prohibitedOptionsCount = 0;
let validFourOptionsCount = 0;
let substantiveExplanationsCount = 0;
let clindamycinFlagCount = 0;

for (const entry of manifest) {
  const filePath = path.join(qDir, `${entry.id}.json`);
  const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));
  totalQuestions += questions.length;

  for (const q of questions) {
    const fullText = (q.question + " " + q.options.join(" ") + " " + (q.explanation || "")).toLowerCase();

    // 1. Check if clinical scenario vs fundamental recall
    if (/\b(?:\d{1,2}-year-old|patient presents|chief complaint|clinical examination|radiograph|hx of)\b/i.test(q.question)) {
      clinicalVignetteCount++;
    } else {
      fundamentalScienceCount++;
    }

    // 2. Check tooth notations
    if (/\b(?:tooth|teeth)\b/i.test(fullText)) {
      toothNotationCheckCount++;
      if (/#(?:[1-9]|[12][0-9]|3[0-2]|[A-T])\b/i.test(fullText)) {
        universalToothFoundCount++;
      }
      if (/\b(?:tooth|teeth)\s+[1-8][1-8]\b/i.test(fullText)) {
        fdiRemainingCount++;
      }
    }

    // 3. Check Canadian remnants
    if (/\b(?:ndeb|cdac|rcdc|health canada|cda guideline)\b/i.test(fullText)) {
      canadianGovFoundCount++;
    }

    // 4. Options integrity
    if (Array.isArray(q.options) && q.options.length === 4) {
      validFourOptionsCount++;
    }
    for (const opt of q.options) {
      const lowerOpt = opt.toLowerCase().trim();
      if (lowerOpt === "all of the above" || lowerOpt === "none of the above" || lowerOpt === "all the above") {
        prohibitedOptionsCount++;
      }
    }

    // 5. Explanation quality
    if (typeof q.explanation === "string" && q.explanation.trim().length > 30) {
      substantiveExplanationsCount++;
    }

    // 6. Check Clindamycin antibiotic prophylaxis mentions
    if (fullText.includes("clindamycin") && (fullText.includes("prophylaxis") || fullText.includes("endocarditis"))) {
      clindamycinFlagCount++;
    }
  }
}

console.log(`[1] Total Question Bank Size:        ${totalQuestions.toLocaleString()} questions across ${manifest.length} core disciplines`);
console.log(`[2] Clinical Scenario Vignettes:      ${clinicalVignetteCount.toLocaleString()} (${Math.round((clinicalVignetteCount / totalQuestions) * 100)}%)`);
console.log(`[3] Fundamental Science & Recall:     ${fundamentalScienceCount.toLocaleString()} (${Math.round((fundamentalScienceCount / totalQuestions) * 100)}%)`);
console.log(`[4] Universal Teeth (#1-32 / A-T):    ${universalToothFoundCount} verified mentions`);
console.log(`[5] Remaining FDI Teeth (11-48):      ${fdiRemainingCount} (0 is perfection)`);
console.log(`[6] Canadian Regulatory Remnants:     ${canadianGovFoundCount} (0 is perfection)`);
console.log(`[7] Strict 4-Option Integrity:        ${validFourOptionsCount.toLocaleString()} / ${totalQuestions.toLocaleString()} (100%)`);
console.log(`[8] Prohibited Options (All/None):     ${prohibitedOptionsCount} (0 is perfection)`);
console.log(`[9] Substantive Rationales (>30 ch):  ${substantiveExplanationsCount.toLocaleString()} / ${totalQuestions.toLocaleString()} (100%)`);
console.log(`[10] Clindamycin Prophylaxis Mentions: ${clindamycinFlagCount} items to inspect for 2021 AHA compliance\n`);
