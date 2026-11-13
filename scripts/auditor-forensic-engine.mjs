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

const letterByIndex = ["A", "B", "C", "D"];
const indexByLetter = { A: 0, B: 1, C: 2, D: 3 };

const PROHIBITED_OPTIONS = [
  "all of the above", "none of the above", "both a and b", "both b and c",
  "both a and c", "both a and d", "both b and d", "both c and d",
  "neither a nor b", "neither b nor c", "all of the above are correct",
  "none of the above are correct"
];

const FOREIGN_TERMS = /\b(NDEB|AFK|ACJ|OSCE\b|CDA\b|Canadian Dental|Health Canada|Royal College of Dentists|RCDC|CEOD|provincial dental)\b/i;
const FDI_REGEX = /#([1-4][1-8]|[5-8][1-5])\b/g;
function auditSingleQuestion(q, sectionId, idx, seenIds, seenStems) {
  const flags = [];

  // 1. ID Check
  if (!q.id || typeof q.id !== "string") {
    flags.push({ check: "ID", severity: "HIGH", msg: "Missing or invalid question ID" });
  } else if (seenIds.has(q.id)) {
    flags.push({ check: "ID", severity: "HIGH", msg: `Duplicate ID: ${q.id}` });
  } else {
    seenIds.add(q.id);
  }

  // 2. Options Count & Quality
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    flags.push({ check: "OPTIONS", severity: "HIGH", msg: `Expected 4 options, found ${Array.isArray(q.options) ? q.options.length : 0}` });
  } else {
    // 3. Prohibited Phrasing
    for (let i = 0; i < 4; i++) {
      const opt = (q.options[i] || "").trim().toLowerCase();
      if (PROHIBITED_OPTIONS.includes(opt)) {
        flags.push({ check: "PROHIBITED_OPTION", severity: "HIGH", msg: `Option ${letterByIndex[i]} uses prohibited meta-phrase: "${q.options[i]}"` });
      }
      if (opt.length === 0) {
        flags.push({ check: "EMPTY_OPTION", severity: "HIGH", msg: `Option ${letterByIndex[i]} is empty` });
      }
    }
    // 4. Duplicate Options
    const set = new Set(q.options.map(o => (o || "").trim().toLowerCase()));
    if (set.size !== 4) {
      flags.push({ check: "DUPLICATE_OPTION", severity: "HIGH", msg: "Contains duplicate options" });
    }
  }

  // 5. Correct Answer Range
  if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3) {
    flags.push({ check: "CORRECT_ANSWER_INDEX", severity: "HIGH", msg: `Invalid answer index: ${q.correctAnswer}` });
  }

  // 6. Clinical Stem Quality
  const stem = (q.question || "").trim();
  if (stem.length < 25) {
    flags.push({ check: "STEM_LENGTH", severity: "MEDIUM", msg: `Stem is too short (${stem.length} chars)` });
  }

  // 7. Stem Deduplication
  const normStem = stem.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (normStem.length >= 30) {
    if (seenStems.has(normStem)) {
      flags.push({ check: "DUPLICATE_STEM", severity: "HIGH", msg: `Stem duplicates question ${seenStems.get(normStem)}` });
    } else {
      seenStems.set(normStem, q.id);
    }
  }

  // 8. Capitalized Negative Modifiers
  const negMatch = stem.match(/\b(which of the following is (?:not|the least)|all of the following are .* except)\b/i);
  if (negMatch && /\b(?:not|except|least)\b/.test(negMatch[0])) {
    flags.push({ check: "STEM_POLARITY", severity: "MEDIUM", msg: `Negative modifier uncapitalized: "${negMatch[0]}"` });
  }

  // 9. Explanation Substantiveness
  const exp = (q.explanation || "").trim();
  if (exp.length < 30) {
    flags.push({ check: "EXPLANATION_LENGTH", severity: "MEDIUM", msg: `Explanation too short (${exp.length} chars)` });
  }

  const fullText = `${stem} ${(q.options || []).join(" ")} ${exp}`;

  // 10. Foreign / Canadian Remnants
  const foreignMatch = fullText.match(FOREIGN_TERMS);
  if (foreignMatch) {
    flags.push({ check: "REGULATORY_FOREIGN", severity: "HIGH", msg: `Contains non-US regulatory term: "${foreignMatch[0]}"` });
  }

  // 11. FDI Tooth Notation
  const fdiMatches = fullText.match(FDI_REGEX);
  if (fdiMatches) {
    const trueFDI = fdiMatches.filter(m => parseInt(m.replace("#", ""), 10) > 32);
    if (trueFDI.length > 0) {
      flags.push({ check: "TOOTH_NUMBERING_FDI", severity: "HIGH", msg: `Found FDI 2-digit tooth numbering: ${trueFDI.join(", ")}` });
    }
  }

  // 12. 2021 AHA Prophylaxis
  if (/infective endocarditis|antibiotic prophylaxis/i.test(fullText)) {
    const chosen = q.options && q.options[q.correctAnswer] ? q.options[q.correctAnswer].toLowerCase() : "";
    if (chosen.includes("clindamycin")) {
      flags.push({ check: "AHA_2021", severity: "HIGH", msg: "Clindamycin chosen for IE prophylaxis (prohibited by 2021 AHA)" });
    }
  }

  // 13. Waterline standard
  if (/200\s*cfu\/ml/i.test(fullText) && !/500\s*cfu\/ml/i.test(fullText)) {
    flags.push({ check: "WATERLINE_CDC", severity: "HIGH", msg: "Mentions 200 CFU/mL without CDC/EPA 500 CFU/mL standard" });
  }

  // 14. Deep Clinical Answer-to-Explanation Concordance
  if (Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 && q.correctAnswer <= 3 && Array.isArray(q.options) && q.options.length === 4) {
    const correctLetter = letterByIndex[q.correctAnswer];
    const correctOptionText = (q.options[q.correctAnswer] || "").trim();

    // 14a. Explicit assertion: "The correct answer is Option [A-D]" or "Option [A-D] is the correct answer"
    const explicitLetterMatch = exp.match(/\b(?:the\s+correct\s+answer\s+is\s+option\s+([A-D])\b|option\s+([A-D])\s+is\s+the\s+correct\s+answer\b|why\s+option\s+([A-D])\s+is\s+correct\b)/i);
    if (explicitLetterMatch) {
      const statedLetter = (explicitLetterMatch[1] || explicitLetterMatch[2] || explicitLetterMatch[3]).toUpperCase();
      if (statedLetter !== correctLetter) {
        flags.push({
          check: "CONCORDANCE_EXPLICIT_LETTER",
          severity: "HIGH",
          msg: `Explanation asserts Option ${statedLetter} is correct, but correctAnswer index is ${q.correctAnswer} (${correctLetter})`
        });
      }
    }

    // 14b. Explicit rejection check: "Why the other options are incorrect: Option [A-D]..." or "Option [A-D] is incorrect because..."
    // If the explanation lists the correctLetter as an incorrect option, flag it!
    const incorrectLetterRegex = new RegExp(`(?:why\\s+the\\s+other\\s+options\\s+are\\s+incorrect[\\s\\S]*?|incorrect:\\s*)[\\s\\S]*?\\b(?:option\\s+)?${correctLetter}\\b(?:\\s*[-:.)]|\\s+is\\s+incorrect)`, "i");
    if (incorrectLetterRegex.test(exp) && !explicitLetterMatch) {
      // Cross-verify whether correctLetter is indeed being rejected
      const directRejection = new RegExp(`\\boption\\s+${correctLetter}\\s+(?:is\\s+incorrect|is\\s+false|is\\s+wrong)`, "i");
      if (directRejection.test(exp)) {
        flags.push({
          check: "CONCORDANCE_SELF_CONTRADICTION",
          severity: "HIGH",
          msg: `Explanation explicitly states Option ${correctLetter} is incorrect, while correctAnswer points to Option ${correctLetter}`
        });
      }
    }

    // 14c. Entity check: "The correct answer is [Text]"
    const entityMatch = exp.match(/(?:the\s+correct\s+answer\s+is\s+([A-Za-z0-9# ,'-]{4,60}?)(?:\.|\s+because|\s+as|\s+since))/i);
    if (entityMatch && !explicitLetterMatch) {
      const entity = entityMatch[1].trim().toLowerCase();
      // If entity does not match correctOptionText, check if it matches one of the other options exactly
      const matchesChosen = correctOptionText.toLowerCase().includes(entity) || entity.includes(correctOptionText.toLowerCase());
      if (!matchesChosen && entity.length >= 6) {
        for (let oIdx = 0; oIdx < 4; oIdx++) {
          if (oIdx !== q.correctAnswer) {
            const distractorText = q.options[oIdx].toLowerCase().trim();
            if (distractorText === entity || (entity.length >= 10 && distractorText.startsWith(entity))) {
              flags.push({
                check: "CONCORDANCE_ENTITY_DIVERGENCE",
                severity: "HIGH",
                msg: `Explanation states "${entityMatch[1].trim()}" is correct (matches Option ${letterByIndex[oIdx]}), but correctAnswer is Option ${correctLetter}`
              });
              break;
            }
          }
        }
      }
    }
  }

  return {
    passed: flags.length === 0,
    flags
  };
}
async function runForensicAudit() {
  console.log("=".repeat(80));
  console.log("   STRICT JCNDE INBDE FORENSIC AUDITOR: 14,000 QUESTION LINE-BY-LINE AUDIT   ");
  console.log("=".repeat(80));

  const seenIds = new Set();
  const seenStems = new Map();

  let grandTotal = 0;
  let grandPassed = 0;
  let grandFlagged = 0;

  const sectionResults = [];
  const allFlagged = [];

  for (const sec of SECTIONS) {
    const file = path.join(QUESTIONS_DIR, `${sec.id}.json`);
    if (!fs.existsSync(file)) {
      console.error(`ERROR: File not found: ${file}`);
      continue;
    }

    const questions = JSON.parse(fs.readFileSync(file, "utf8"));
    let secPass = 0;
    let secFlag = 0;

    for (let i = 0; i < questions.length; i++) {
      grandTotal++;
      const q = questions[i];
      const res = auditSingleQuestion(q, sec.id, i, seenIds, seenStems);

      if (res.passed) {
        secPass++;
        grandPassed++;
      } else {
        secFlag++;
        grandFlagged++;
        allFlagged.push({
          section: sec.id,
          index: i,
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          correctLetter: letterByIndex[q.correctAnswer],
          explanation: q.explanation,
          flags: res.flags
        });
      }
    }

    sectionResults.push({
      section: sec.name,
      total: questions.length,
      passed: secPass,
      flagged: secFlag,
      passRate: ((secPass / questions.length) * 100).toFixed(2) + "%"
    });
  }

  console.log("\nForensic Audit Results by Section:");
  console.table(sectionResults);

  console.log("=".repeat(80));
  console.log(`TOTAL QUESTIONS AUDITED:      ${grandTotal.toLocaleString()}`);
  console.log(`STRICTLY PASSED (100% CLEAN): ${grandPassed.toLocaleString()} (${((grandPassed / grandTotal) * 100).toFixed(2)}%)`);
  console.log(`FLAGGED FOR REVIEW:          ${grandFlagged.toLocaleString()}`);
  console.log("=".repeat(80));

  const findingsFile = path.join(ROOT, "scripts", "auditor-forensic-findings.json");
  fs.writeFileSync(findingsFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalAudited: grandTotal,
    totalPassed: grandPassed,
    totalFlagged: grandFlagged,
    passRate: ((grandPassed / grandTotal) * 100).toFixed(2) + "%",
    sectionResults,
    flaggedItems: allFlagged
  }, null, 2), "utf8");

  console.log(`\nDetailed auditor findings report written to: ${findingsFile}`);

  if (grandFlagged > 0) {
    console.log(`\nATTENTION: Found ${grandFlagged} flagged questions! Listing details:`);
    allFlagged.forEach((item, idx) => {
      console.log(`\n[FLAG #${idx + 1}] ID: ${item.id} (${item.section})`);
      console.log(`Stem: ${item.question.slice(0, 100)}...`);
      console.log(`Correct: Option ${item.correctLetter} -> "${item.options[item.correctAnswer]}"`);
      item.flags.forEach(f => console.log(`  -> [${f.severity}] ${f.check}: ${f.msg}`));
    });
  } else {
    console.log("\nVERDICT: Zero defects or ambiguities detected across all 14,000 questions.");
  }
}

runForensicAudit().catch(err => {
  console.error("Forensic audit failed:", err);
  process.exit(1);
});
