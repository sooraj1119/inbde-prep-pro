import fs from "fs";
const paywallPath = "C:/Users/sooraj/.gemini/antigravity/playground/inbde-prep-pro/src/PaywallModal.tsx";
let lines = fs.readFileSync(paywallPath, "utf8").split("\n");
console.log("Line 198:", JSON.stringify(lines[198]));
console.log("Line 199:", JSON.stringify(lines[199]));
console.log("Line 200:", JSON.stringify(lines[200]));
