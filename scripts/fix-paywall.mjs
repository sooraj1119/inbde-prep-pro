import fs from "fs";
const paywallPath = "C:/Users/sooraj/.gemini/antigravity/playground/inbde-prep-pro/src/PaywallModal.tsx";
let lines = fs.readFileSync(paywallPath, "utf8").split("\n");
lines[198] = "                        {pkg.product.title.replace(/\\s*\\([^)]*(?:dentalprep|INBDEprep|ndeb)[^)]*\\)/gi, '').replace(/\\s*\\(unreviewed\\)/gi, '').trim() || pkg.product.title}\r";
fs.writeFileSync(paywallPath, lines.join("\n"), "utf8");
console.log("Replaced line 198 successfully!");
