import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const QUESTIONS_DIR = path.join(ROOT, "public", "questions");

const SECTIONS = [
  "anatomical-sciences", "biochemistry-physiology", "microbiology-immunology",
  "general-pathology", "oral-pathology-medicine", "pharmacology-anesthesia",
  "operative-materials", "periodontics", "endodontics", "prosthodontics-implants",
  "oral-surgery-emergencies", "orthodontics-pedodontics", "oral-radiology",
  "patient-management-ethics"
];

const letters = ["A", "B", "C", "D"];

function cleanOptionText(text) {
  return (text || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function resolveOptionForNumber(numStr, surroundingText, options) {
  const num = parseInt(numStr, 10);
  if (num === 0) return 0; // Always Option A
  if (num === 4) return 3; // Always Option D (4th option)

  const cleanSurr = cleanOptionText(surroundingText);

  let bestIdx = -1;
  let bestScore = 0;

  for (let i = 0; i < 4; i++) {
    const words = options[i].split(/\s+/).slice(0, 4).map(cleanOptionText).filter(w => w.length > 2);
    let score = 0;
    for (const w of words) {
      if (cleanSurr.includes(w)) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  if (bestScore >= 2) {
    return bestIdx;
  }

  return num; // Default 0-indexed: 1->B, 2->C, 3->D
}

function auditAndCleanExplanations(dryRun = false) {
  let totalWithNumbers = 0;
  let resolvedReplacements = 0;
  const allQuestions = [];

  for (const sec of SECTIONS) {
    const file = path.join(QUESTIONS_DIR, `${sec}.json`);
    const questions = JSON.parse(fs.readFileSync(file, "utf8"));
    let modified = false;

    for (const q of questions) {
      let exp = q.explanation || "";
      if (/\bOption\s+[0-4]\b/i.test(exp) || /option\s+[1-4]\s*\(index\s*[0-3]\)/i.test(exp)) {
        totalWithNumbers++;

        // First clean explicit "option X (index Y)"
        let newExp = exp.replace(/option\s+([1-4])\s*\(index\s*([0-3])\)/gi, (m, oNum, iNum) => {
          resolvedReplacements++;
          const idx = parseInt(iNum, 10);
          return `Option ${letters[idx]}`;
        });

        // Replace patterns like: "(Option X)" or "Option X:" or "Option X (text)"
        newExp = newExp.replace(/(\bOption\s+([0-4])\b)(?:[\s:,-]*(\([^)]+\)|[A-Za-z0-9 '-]{3,30}))?/gi, (match, optPart, numStr) => {
          const surrounding = newExp.slice(Math.max(0, newExp.indexOf(match) - 60), Math.min(newExp.length, newExp.indexOf(match) + match.length + 60));
          const resolvedIdx = resolveOptionForNumber(numStr, surrounding, q.options);
          if (resolvedIdx >= 0 && resolvedIdx <= 3) {
            resolvedReplacements++;
            return match.replace(new RegExp(`Option\\s+${numStr}`, "i"), `Option ${letters[resolvedIdx]}`);
          }
          return match;
        });

        if (newExp !== exp) {
          modified = true;
          q.explanation = newExp;
        }
      }
      allQuestions.push(q);
    }

    if (!dryRun && modified) {
      fs.writeFileSync(file, JSON.stringify(questions, null, 2), "utf8");
    }
  }

  if (!dryRun) {
    const masterPath = path.join(ROOT, "src", "lib", "questions.json");
    fs.writeFileSync(masterPath, JSON.stringify(allQuestions, null, 2), "utf8");
    console.log(`Updated master questions.json with ${allQuestions.length} standardized questions.`);
  }

  console.log(`Execution completed. Cleaned ${totalWithNumbers} questions across all sections.`);
  console.log(`Total Option label replacements applied: ${resolvedReplacements}`);
}

auditAndCleanExplanations(false);
