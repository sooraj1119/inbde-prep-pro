import fs from "fs";
import path from "path";

const baseDir = "C:/Users/sooraj/.gemini/antigravity/playground/inbde-prep-pro";

// 1. STORE_METADATA.md
const storeMetadata = `# Dental Prep Pro: for INBDE - App Store & Google Play Metadata & Legal Assets

This document provides ready-to-use, legally compliant metadata, descriptions, keywords, and required disclosures for submitting **Dental Prep Pro: for INBDE** to **Apple App Store Connect** and **Google Play Console**.

---

## 1. Apple App Store Listing Details

### App Name (max 30 characters)
\`Dental Prep Pro: for INBDE\`

### Subtitle (max 30 characters)
\`US Dental Board Exam Prep\`

### Category
* **Primary:** Education
* **Secondary:** Reference

### Content Rating
* **4+** (No unmoderated user content, no gambling, medical study reference tool)

### Promotional Text (max 170 characters)
> Master the US INBDE dental boards with 14,000+ board-calibrated practice questions, SM-2 spaced repetition, full mock exams, and in-depth clinical rationales.

### Keywords (max 100 characters, comma-separated)
\`inbde,dental board,us dentist,dental exam,nbde,dentistry prep,spaced repetition,dental mcq,ada,jcnde\`

### Support URL
\`https://sooraj1119.github.io/inbde-prep-pro/terms.html\`

### Marketing URL
\`https://sooraj1119.github.io/inbde-prep-pro/terms.html\`

### Privacy Policy URL
\`https://sooraj1119.github.io/inbde-prep-pro/privacy.html\`

---

### Full Description (App Store & Google Play)

\`\`\`text
Prepare with confidence for the Integrated National Board Dental Examination (INBDE). Dental Prep Pro is an independent, comprehensive study companion featuring over 14,000 clinical questions, intelligent spaced repetition, and in-depth rationales derived from standard dental literature.

IMPORTANT DISCLAIMER, NON-AFFILIATION & NOMINATIVE FAIR USE TRADEMARK NOTICE:
INBDE® is a registered trademark of the Joint Commission on National Dental Examinations (JCNDE) and the American Dental Association (ADA). Dental Prep Pro is an independent study tool developed by clinicians and educators. This application is NOT affiliated with, sponsored by, endorsed by, authorized by, or in any way officially associated with the Joint Commission on National Dental Examinations (JCNDE) or the American Dental Association (ADA). Practice questions are independent simulations and NOT actual confidential or proprietary JCNDE exam items.

NO MEDICAL OR CLINICAL ADVICE:
All questions, rationales, and explanations are designed strictly for examination study aid purposes and do NOT constitute medical, dental, surgical, pharmacological, or clinical advice. Do not use this application for live patient care, clinical triage, or clinical decision-making.

NO PASS GUARANTEE:
The developers make no warranty or guarantee that using this application will result in passing the INBDE exam or achieving dental licensure. Examination results depend solely on individual candidate diligence and competence.

══════════════════════════════════════════════════════════
WHY CHOOSE DENTAL PREP PRO?
══════════════════════════════════════════════════════════

• 14,000+ COMPREHENSIVE QUESTIONS
Practice across all 22 INBDE Foundation Knowledge and Clinical Content areas, including Local Anesthesia, Anatomy, Pharmacology, Oral Pathology, Periodontics, Endodontics, Prosthodontics, Dental Materials, Medical Emergencies, and Ethics.

• DETAILED CLINICAL EXPLANATIONS
Every question includes in-depth explanations grounded in authoritative reference textbooks (Malamed, Neville, Carranza, Proffit, Cohen, Little & Falace).

• SM-2 SPACED REPETITION SYSTEM (DAILY REVIEW)
Never forget high-yield facts. Our intelligent spaced-repetition algorithm schedules questions for review right before memory decay occurs.

• TIMED EXAM SIMULATION
Simulate the real test day environment with customizable question counts, countdown timers, and detailed post-quiz performance breakdowns.

• MISTAKE VAULT & FLAGGED QUESTIONS
Target your weaknesses. Automatically track incorrect questions and bookmark challenging scenarios for focused review before exam day.

• 100% PRIVATE & OFFLINE-READY
Your study progress is saved securely on your device. Study anytime, anywhere without an active internet connection.

══════════════════════════════════════════════════════════
SUBSCRIPTION & IN-APP PURCHASE INFORMATION
══════════════════════════════════════════════════════════

Dental Prep Pro offers free access to foundational subjects and mock exams. Unlock full access to all 14,000+ questions, Spaced Repetition Daily Review, and advanced analytics with a Pro Subscription.

• Payment will be charged to your Apple ID / Google Account at confirmation of purchase.
• Subscription automatically renews unless auto-renew is cancelled at least 24 hours prior to the end of the current billing cycle.
• Your account will be charged for renewal within 24 hours prior to the end of the current period.
• You can manage and cancel your subscriptions at any time in your store account settings (Apple: https://apps.apple.com/account/subscriptions | Google Play: https://play.google.com/store/account/subscriptions).

Terms of Use (EULA): https://sooraj1119.github.io/inbde-prep-pro/terms.html
Privacy Policy: https://sooraj1119.github.io/inbde-prep-pro/privacy.html
\`\`\`
`;

fs.writeFileSync(path.join(baseDir, "STORE_METADATA.md"), storeMetadata, "utf8");
console.log("Created STORE_METADATA.md");

// 2. PRIVACY_POLICY.md
const privacyPolicy = `# Privacy Policy - Dental Prep Pro: for INBDE

**Last Updated:** October 2026  
**Published by:** Dental Prep Pro Publishing ("Company", "we", "us", "our")

Welcome to **Dental Prep Pro: for INBDE** (the "Application"). The Company respects your personal privacy and is committed to protecting it in compliance with the US Health Insurance Portability and Accountability Act (HIPAA), the California Consumer Privacy Act (CCPA), the Canadian *Personal Information Protection and Electronic Documents Act* (PIPEDA), the European Union *General Data Protection Regulation* (GDPR), the UK Data Protection Act 2018 (UK GDPR), the Australian *Privacy Act 1988* (APPs), and applicable international privacy legislation.

---

## 1. Zero Direct Personal Data Collection
This Application operates with an **offline-first, client-side architecture**. We do not require you to create an account, register a username, or submit personal identifiable information (PII) such as your legal name, physical address, or phone number.

---

## 2. On-Device Study Progress & Metrics
All study data—including your completed question histories, SM-2 spaced repetition intervals, accuracy metrics, flagged questions, custom bookmarks, and mock exam progress—are stored **strictly locally on your personal device** (using device local storage / preferences).
- This data is **never transmitted to, stored on, or synchronized with** any external servers operated by the Company.
- You maintain sole custody over your study data at all times.

---

## 3. In-App Subscriptions & Cross-Border Processing
Subscription payments and purchase validations are processed through Apple App Store (Apple Inc.) and Google Play Store (Google LLC), and managed via **RevenueCat Inc.**:
- The Company **never receives, processes, or stores** your credit card numbers, billing addresses, or banking details.
- RevenueCat uses an anonymous, randomly generated App User ID solely to verify your active Pro entitlements across app launches.
- **Cross-Border Transfer Notice:** By purchasing a Pro subscription, you acknowledge that transaction validation tokens are processed on secure servers located in the **United States**.

---

## 4. Legal Bases for Processing (EU GDPR)
If you reside within the European Economic Area (EEA), the United Kingdom, or Switzerland, we process information on the following legal bases:
- **Contractual Necessity (GDPR Art. 6(1)(b)):** Processing anonymous entitlement tokens is strictly necessary to unlock paid Pro study modules.
- **Legitimate Interests (GDPR Art. 6(1)(f)):** Ensuring local software integrity, crash resilience, and compliance with consumer subscription lifecycles.

---

## 5. Your Rights (CCPA, PIPEDA, GDPR, UK GDPR & Australian APPs)
Depending on your jurisdiction, you have statutory privacy rights, including:
- **Right to Erasure / Data Deletion:** You can erase 100% of your local study metrics, quiz logs, and cached configurations at any time by selecting **"Reset All Progress"** within the in-app settings.
- **Right to Access & Rectification:** Since we do not maintain personal accounts on external servers, all your study records are directly accessible and manageable on your local device.

---

## 6. No Real-World Patient Health Information (Strict HIPAA / PHI Disclaimer)
This application is solely an educational examination simulator. We do not collect, process, transmit, or store real-world Patient Health Information (PHI) under HIPAA or global health privacy regulations. Users must never input actual patient records, radiographs, charts, or clinical identifiers.

---

## 7. Contact & Privacy Officer
For any privacy inquiries or statutory requests, please contact our designated privacy officer at: **inbdepreppro@gmail.com**.
`;

fs.writeFileSync(path.join(baseDir, "PRIVACY_POLICY.md"), privacyPolicy, "utf8");
console.log("Created PRIVACY_POLICY.md");

// 3. TERMS_OF_USE.md
const termsOfUse = `# Terms of Use (End User License Agreement - EULA)

**Last Updated:** October 2026  
**Published by:** Dental Prep Pro Publishing ("Company", "we", "us", "our")

By downloading, installing, accessing, or using **Dental Prep Pro: for INBDE** (the "Application"), you agree to be bound by these Terms of Use and End User License Agreement ("EULA"). If you do not agree to all terms herein, do not access or use the Application.

---

## 1. Educational Study Aid Only (Strict Medical & Clinical Disclaimer)
This application is strictly designed as an independent educational reference and study aid for dental candidates preparing for the Integrated National Board Dental Examination (INBDE).
- **NO MEDICAL OR CLINICAL ADVICE:** The content, questions, answers, rationales, diagnostic images, and simulated cases do **NOT** provide medical, dental, diagnostic, surgical, pharmacological, or clinical advice.
- **PROHIBITION ON REAL-WORLD PATIENT CARE:** Under no circumstances should this application be used for live patient care, clinical decision-making, patient triage, surgical planning, or prescribing pharmaceuticals.
- **NO DOCTOR-PATIENT RELATIONSHIP:** Use of this application does not create a dentist-patient or healthcare provider relationship of any kind.

---

## 2. Artificial Intelligence (AI) Notice & Duty to Cross-Reference
Questions, rationales, and clinical explanations are synthesized, formulated, and audited utilizing Artificial Intelligence (AI) models and simulated clinical data.
- While systematic verification is performed, **generative AI models can occasionally make errors, miscalculate dosages, produce hallucinations, or reference outdated standards.**
- You maintain the sole and affirmative legal obligation to independently cross-reference all clinical facts, drug dosages, and treatment principles against accredited reference textbooks (e.g., Malamed, Little & Falace, Neville, Proffit, Cohen, Carranza) and official dental regulatory standards.

---

## 3. Affirmative Warranty of Independent Educational Simulation & No Exam Items
- **INDEPENDENT SIMULATIONS:** All questions, clinical vignettes, answer options, and clinical rationales are proprietary educational simulations developed independently using authoritative public dental literature.
- **NO CONFIDENTIAL EXAM QUESTIONS:** None of the materials contained in this Application represent actual, leaked, recalled, or confidential past or current examination items from the Joint Commission on National Dental Examinations (JCNDE), the American Dental Association (ADA), or any licensing authority.
- **ACADEMIC INTEGRITY:** The Company strictly prohibits and does not facilitate cheating, candidate recall harvesting, or unauthorized sharing of proprietary testing instruments.

---

## 4. No Guarantee of Examination Success or Board Licensure
The Company makes **no warranties or guarantees, express or implied, that use of this application will result in passing the INBDE exam**, attaining any specific score, or securing dental certification or licensure.
- Examination performance is determined solely by the candidate's personal academic competence and board evaluation.
- The Company expressly disclaims all liability for any direct or indirect costs associated with examination results, including registration fees, re-examination fees, travel costs, or delayed professional earnings.

---

## 5. Trademark Notice & Nominative Fair Use
**INBDE®** is a registered trademark of the Joint Commission on National Dental Examinations (JCNDE) and the American Dental Association (ADA). **Dental Prep Pro: for INBDE** is an independent educational tool published by third-party dental educators and is **NOT affiliated with, associated with, authorized by, sponsored by, or endorsed by the JCNDE, ADA, or any governmental dental licensing authority**. All trademark references are purely nominative.

---

## 6. Subscriptions & Cancellation
For subscriptions, you can manage or cancel auto-renewal directly through Apple (https://apps.apple.com/account/subscriptions) or Google Play (https://play.google.com/store/account/subscriptions), compliant with FTC Click-to-Cancel and California Automatic Renewal Law (ARL).

---

## 7. Contact
For legal inquiries, contact: **inbdepreppro@gmail.com**.
`;

fs.writeFileSync(path.join(baseDir, "TERMS_OF_USE.md"), termsOfUse, "utf8");
console.log("Created TERMS_OF_USE.md");
