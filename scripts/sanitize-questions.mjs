import fs from "fs";
import path from "path";

const baseDir = "C:/Users/sooraj/.gemini/antigravity/playground/inbde-prep-pro";

const replacements = [
  [/NDEB_AUDITED/g, "INBDE_AUDITED"],
  [/NDEB AFK blueprint/gi, "INBDE Foundation Knowledge blueprint"],
  [/NDEB AFK curriculum/gi, "INBDE curriculum"],
  [/NDEB AFK expectations/gi, "INBDE expectations"],
  [/NDEB AFK questions/gi, "INBDE questions"],
  [/NDEB AFK question/gi, "INBDE question"],
  [/NDEB AFK exam/gi, "INBDE exam"],
  [/NDEB AFK/gi, "INBDE"],
  [/for the AFK/gi, "for the INBDE"],
  [/NDEB board exam/gi, "INBDE exam"],
  [/NDEB board key/gi, "INBDE board key"],
  [/NDEB-targeted answer/gi, "INBDE-targeted answer"],
  [/NDEB clinical guidelines/gi, "ADA and CDC clinical guidelines"],
  [/NDEB guidelines/gi, "ADA clinical guidelines"],
  [/NDEB expectations/gi, "INBDE expectations"],
  [/NDEB questions/gi, "INBDE questions"],
  [/standard NDEB values/gi, "standard board exam values"],
  [/standard NDEB guidelines/gi, "standard board guidelines"],
  [/referenced by the NDEB/gi, "tested on the INBDE"],
  [/used by the NDEB/gi, "tested on the INBDE"],
  [/Canadian Dental Association infection[‑-]control guidelines/gi, "CDC and ADA infection control guidelines"],
  [/Canadian Dental Association/gi, "American Dental Association"],
  [/Canadian dental education/gi, "US dental board education"],
  [/Canadian dental anatomy curricula/gi, "dental board anatomy curricula"],
  [/Canadian consensus/gi, "evidence-based consensus"],
  [/Current Canadian and AHA guidelines/gi, "Current AHA and ADA guidelines"],
  [/Canadian guidelines/gi, "ADA guidelines"],
  [/African-Canadian/gi, "African-American"],
  [/\bNDEB\b/g, "INBDE"],
  [/\bAFK\b/g, "INBDE"]
];

function sanitizeContent(raw) {
  let content = raw;
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  return content;
}

// 1. Process public/questions/*.json
const qDir = path.join(baseDir, "public/questions");
const files = fs.readdirSync(qDir).filter(f => f.endsWith(".json") && f !== "manifest.json");

let totalFilesUpdated = 0;
for (const file of files) {
  const filePath = path.join(qDir, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const sanitized = sanitizeContent(raw);
  if (sanitized !== raw) {
    // Validate JSON before saving
    JSON.parse(sanitized);
    fs.writeFileSync(filePath, sanitized, "utf8");
    console.log(`Sanitized: ${file}`);
    totalFilesUpdated++;
  }
}

// 2. Process src/lib/questions.json if exists
const libQPath = path.join(baseDir, "src/lib/questions.json");
if (fs.existsSync(libQPath)) {
  const raw = fs.readFileSync(libQPath, "utf8");
  const sanitized = sanitizeContent(raw);
  if (sanitized !== raw) {
    JSON.parse(sanitized);
    fs.writeFileSync(libQPath, sanitized, "utf8");
    console.log("Sanitized: src/lib/questions.json");
    totalFilesUpdated++;
  }
}

console.log(`Total files sanitized: ${totalFilesUpdated}`);
