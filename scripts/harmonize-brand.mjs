import fs from "fs";
import path from "path";

const basePath = "C:/Users/sooraj/.gemini/antigravity/playground/inbde-prep-pro";

// 1. Update src/Quiz.tsx
const quizPath = path.join(basePath, "src/Quiz.tsx");
let quiz = fs.readFileSync(quizPath, "utf8");
quiz = quiz.replace('setTopicName("Simulated AFK Exam");', 'setTopicName("Simulated INBDE Exam");');
quiz = quiz.replace(/ndebpreppro@gmail\.com/g, "inbdepreppro@gmail.com");
fs.writeFileSync(quizPath, quiz, "utf8");
console.log("Updated Quiz.tsx");

// 2. Update src/lib/ai.ts
const aiPath = path.join(basePath, "src/lib/ai.ts");
let ai = fs.readFileSync(aiPath, "utf8");
ai = ai.replace(
  "helping a student prepare for the NDEB AFK exam.",
  "helping a student prepare for the INBDE (Integrated National Board Dental Examination)."
);
fs.writeFileSync(aiPath, ai, "utf8");
console.log("Updated ai.ts");

// 3. Update src/PaywallModal.tsx
const paywallPath = path.join(basePath, "src/PaywallModal.tsx");
let paywall = fs.readFileSync(paywallPath, "utf8");
paywall = paywall.replace(
  "{pkg.product.title.replace(/\\(com\\.ndeb\\.INBDEprep \\(unreviewed\\)\\)/g, '').trim()}",
  "{pkg.product.title.replace(/\\s*\\([^)]*dentalprep[^)]*\\)/gi, '').replace(/\\s*\\(unreviewed\\)/gi, '').trim() || pkg.product.title}"
);
fs.writeFileSync(paywallPath, paywall, "utf8");
console.log("Updated PaywallModal.tsx");

// 4. Update src/main.tsx
const mainPath = path.join(basePath, "src/main.tsx");
let main = fs.readFileSync(mainPath, "utf8");
main = main.replace(
  "const PREMIUM_KEY = 'ndeb_prep_is_premium';",
  "const PREMIUM_KEY = 'inbde_prep_is_premium';"
);
fs.writeFileSync(mainPath, main, "utf8");
console.log("Updated main.tsx");

// 5. Update index.html
const indexPath = path.join(basePath, "index.html");
let index = fs.readFileSync(indexPath, "utf8");
index = index.replace(
  "var stored = localStorage.getItem('ndeb_theme');",
  "var stored = localStorage.getItem('inbde_theme') || localStorage.getItem('ndeb_theme');"
);
index = index.replace(
  "<!-- Dark mode BEFORE first paint (uses same key as App.tsx: ndeb_theme) -->",
  "<!-- Dark mode BEFORE first paint (uses same key as App.tsx: inbde_theme) -->"
);
fs.writeFileSync(indexPath, index, "utf8");
console.log("Updated index.html");

// 6. Update public/200.html & public/index.html
const p200Path = path.join(basePath, "public/200.html");
let p200 = fs.readFileSync(p200Path, "utf8");
p200 = p200.replace("<title>Dental Prep Pro: for NDEB AFK</title>", "<title>Dental Prep Pro: for INBDE</title>");
fs.writeFileSync(p200Path, p200, "utf8");

const pIndexPath = path.join(basePath, "public/index.html");
let pIndex = fs.readFileSync(pIndexPath, "utf8");
pIndex = pIndex.replace("<title>NDEB Prep</title>", "<title>Dental Prep Pro: for INBDE</title>");
fs.writeFileSync(pIndexPath, pIndex, "utf8");
console.log("Updated public/200.html and public/index.html");

// 7. Update public/privacy.html
const privPath = path.join(basePath, "public/privacy.html");
let priv = fs.readFileSync(privPath, "utf8");
priv = priv.replace(/Dental Prep Pro: for NDEB AFK/g, "Dental Prep Pro: for INBDE");
priv = priv.replace(/ndebpreppro@gmail\.com/g, "inbdepreppro@gmail.com");
fs.writeFileSync(privPath, priv, "utf8");
console.log("Updated privacy.html");

// 8. Update public/terms.html
const termsPath = path.join(basePath, "public/terms.html");
let terms = fs.readFileSync(termsPath, "utf8");
terms = terms.replace(/Dental Prep Pro: for NDEB AFK/g, "Dental Prep Pro: for INBDE");
terms = terms.replace(/Assessment of Fundamental Knowledge \(AFK\) examination/g, "Integrated National Board Dental Examination (INBDE)");
terms = terms.replace(/NDEB AFK exam/g, "INBDE exam");
terms = terms.replace(
  /<strong>NDEB&reg;<\/strong> and <strong>AFK&reg;<\/strong> are registered trademarks of the National Dental Examining Board of Canada\./g,
  "<strong>INBDE&reg;</strong> is a registered trademark of the Joint Commission on National Dental Examinations (JCNDE) and the American Dental Association (ADA)."
);
terms = terms.replace(
  /NDEB, CDAC, or any governmental dental licensing authority/g,
  "JCNDE, ADA, or any governmental dental licensing authority"
);
terms = terms.replace(
  /National Dental Examining Board of Canada \(NDEB\) or any licensing board/g,
  "Joint Commission on National Dental Examinations (JCNDE), the ADA, or any licensing board"
);
terms = terms.replace(/ndebpreppro@gmail\.com/g, "inbdepreppro@gmail.com");
fs.writeFileSync(termsPath, terms, "utf8");
console.log("Updated terms.html");
