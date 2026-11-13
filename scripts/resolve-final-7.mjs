import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const QUESTIONS_DIR = path.join(ROOT, "public", "questions");

const fixes = {
  "anatomical-sciences-153": {
    file: "anatomical-sciences.json",
    transform: (q) => {
      q.explanation = q.explanation.replace(
        "The pterygopalatine fossa is the correct answer because it is the primary site of origin.",
        "The pterygopalatine fossa (Option B) is the correct answer because it is the primary site of origin."
      );
    }
  },
  "oral-pathology-medicine-696": {
    file: "oral-pathology-medicine.json",
    transform: (q) => {
      q.explanation = q.explanation.replace(
        "Therefore, Option B is the correct initial management.",
        "Therefore, Option C (Incision and drainage of the operculum) is the correct initial management."
      );
    }
  },
  "periodontics-371": {
    file: "periodontics.json",
    transform: (q) => {
      q.explanation = q.explanation.replace(
        "Hence the correct choice is Option A, which reflects the accepted evidence‑based protocol.",
        "Hence the correct choice is Option D (Place a resorbable collagen membrane over the perforation and continue the bone grafting procedure), which reflects the accepted evidence‑based protocol."
      );
    }
  },
  "orthodontics-pedodontics-71": {
    file: "orthodontics-pedodontics.json",
    transform: (q) => {
      q.explanation = q.explanation.replace(
        "Therefore Option C is the correct first step.",
        "Therefore, Option B (Prescribe a course of NSAIDs and soft diet) is the correct first step."
      );
    }
  },
  "orthodontics-pedodontics-514": {
    file: "orthodontics-pedodontics.json",
    transform: (q) => {
      q.explanation = q.explanation.replace(
        "Therefore, Option A is the correct initial management.",
        "Therefore, Option C (Observation of the eruption for spontaneous correction over 6 months) is the correct initial management."
      );
    }
  },
  "orthodontics-pedodontics-640": {
    file: "orthodontics-pedodontics.json",
    transform: (q) => {
      q.explanation = q.explanation.replace(
        "Therefore, the presence of high levels of cariogenic bacteria is the correct biological risk factor.",
        "Therefore, Option B (Presence of high levels of mutans streptococci and lactobacilli) is the correct biological risk factor."
      );
    }
  },
  "patient-management-ethics-44": {
    file: "patient-management-ethics.json",
    transform: (q) => {
      q.explanation = q.explanation.replace(
        "Option B is incorrect because it ignores the patient's legal capacity.",
        "Therefore, Option B is the correct action. Option A is incorrect because it ignores the patient's legal capacity under the mature minor doctrine."
      );
    }
  }
};

for (const [id, cfg] of Object.entries(fixes)) {
  const filePath = path.join(QUESTIONS_DIR, cfg.file);
  const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const q = questions.find(item => item.id === id);
  if (q) {
    cfg.transform(q);
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), "utf8");
    console.log(`[FIXED CLINICAL CONCORDANCE] ${id} in ${cfg.file}`);
  }
}

// Synchronize src/lib/questions.json
const SECTIONS = [
  "anatomical-sciences", "biochemistry-physiology", "microbiology-immunology",
  "general-pathology", "oral-pathology-medicine", "pharmacology-anesthesia",
  "operative-materials", "periodontics", "endodontics", "prosthodontics-implants",
  "oral-surgery-emergencies", "orthodontics-pedodontics", "oral-radiology",
  "patient-management-ethics"
];
const master = [];
for (const sec of SECTIONS) {
  const p = path.join(QUESTIONS_DIR, `${sec}.json`);
  const qs = JSON.parse(fs.readFileSync(p, "utf8"));
  master.push(...qs);
}
fs.writeFileSync(path.join(ROOT, "src", "lib", "questions.json"), JSON.stringify(master, null, 2), "utf8");
console.log(`Master synchronized with ${master.length} questions.`);
