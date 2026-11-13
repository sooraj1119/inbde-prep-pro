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

const letterByIndex = ["A", "B", "C", "D"];

function fixConcordances() {
  const masterPath = path.join(ROOT, "src", "lib", "questions.json");
  const allMaster = [];
  let fixedCount = 0;

  for (const sec of SECTIONS) {
    const file = path.join(QUESTIONS_DIR, `${sec}.json`);
    const questions = JSON.parse(fs.readFileSync(file, "utf8"));
    let secChanged = false;

    for (const q of questions) {
      let exp = q.explanation || "";
      const correctLetter = letterByIndex[q.correctAnswer];

      // Check if explanation has mismatched "The correct answer is Option X"
      const m = exp.match(/\b(?:the\s+correct\s+answer\s+is\s+(?:option\s+)?([A-D])\b|(?:option\s+)?([A-D])\s+is\s+the\s+correct\b|why\s+option\s+([A-D])\s+is\s+correct\b|hence,?\s+the\s+correct\s+answer\s+is\s+option\s+([A-D])\b|therefore,?\s+(?:option\s+([A-D])\s+is\s+the\s+correct|the\s+correct\s+answer\s+is\s+option\s+([A-D]))\b)/i);
      
      if (m) {
        const stated = (m[1] || m[2] || m[3] || m[4] || m[5] || m[6]).toUpperCase();
        if (stated !== correctLetter) {
          fixedCount++;
          secChanged = true;

          // Specific fixes
          if (q.id === "patient-management-ethics-636") {
            exp = exp.replace(/The correct answer is Option [A-D]/i, `The correct answer is Option D`);
            exp = exp.replace(/Option A \(Two-handed scoop\)/i, `Option B (Two-handed scoop)`);
            exp = exp.replace(/Option A \(One-handed scoop without device\)/i, `Option C (One-handed scoop without device)`);
          } else if (q.id === "anatomical-sciences-47") {
            exp = exp.replace(/Le Fort II \(Option [A-D]\)/i, `Le Fort II (Option C)`);
            exp = exp.replace(/Option [A-D] is the correct choice/i, `Option C is the correct choice`);
          } else if (q.id === "oral-radiology-7") {
            exp = exp.replace(/The correct answer is a diameter exceeding 1 cm\./i, `The correct answer is Option C (A diameter exceeding 1 cm).`);
          } else {
            // General clean realignment of stated letter
            exp = exp.replace(new RegExp(`\\bThe\\s+correct\\s+answer\\s+is\\s+Option\\s+${stated}\\b`, "i"), `The correct answer is Option ${correctLetter}`);
            exp = exp.replace(new RegExp(`\\bHence,?\\s+the\\s+correct\\s+answer\\s+is\\s+Option\\s+${stated}\\b`, "i"), `Hence, the correct answer is Option ${correctLetter}`);
            exp = exp.replace(new RegExp(`\\bTherefore,?\\s+the\\s+correct\\s+answer\\s+is\\s+Option\\s+${stated}\\b`, "i"), `Therefore, the correct answer is Option ${correctLetter}`);
            exp = exp.replace(new RegExp(`\\bTherefore,?\\s+Option\\s+${stated}\\s+is\\s+the\\s+correct\\s+answer\\b`, "i"), `Therefore, Option ${correctLetter} is the correct answer`);
            exp = exp.replace(new RegExp(`\\bOption\\s+${stated}\\s+is\\s+the\\s+correct\\s+choice\\b`, "i"), `Option ${correctLetter} is the correct choice`);
            exp = exp.replace(new RegExp(`\\bConsequently,?\\s+the\\s+correct\\s+answer\\s+is\\s+Option\\s+${stated}\\b`, "i"), `Consequently, the correct answer is Option ${correctLetter}`);
          }

          q.explanation = exp;
          console.log(`[REALIGNED] ${q.id}: Stated Option ${stated} -> Option ${correctLetter} (${q.options[q.correctAnswer].slice(0, 40)})`);
        }
      }

      allMaster.push(q);
    }

    if (secChanged) {
      fs.writeFileSync(file, JSON.stringify(questions, null, 2), "utf8");
    }
  }

  fs.writeFileSync(masterPath, JSON.stringify(allMaster, null, 2), "utf8");
  console.log(`\nMaster bundle synchronized. Total realignments: ${fixedCount}`);
}

fixConcordances();
