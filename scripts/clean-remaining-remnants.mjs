import fs from "fs";
import path from "path";

const rootDir = "C:/Users/sooraj/.gemini/antigravity/playground/inbde-prep-pro";
const qDir = path.join(rootDir, "public", "questions");
const manifest = JSON.parse(fs.readFileSync(path.join(qDir, "manifest.json"), "utf8"));

console.log("Starting targeted cleanup of remaining remnants...");

function cleanText(text) {
  if (!text || typeof text !== "string") return text;
  let s = text;

  // 1. Heart and Stroke Foundation of Canada -> AHA
  s = s.replace(/Heart\s*&?\s*Stroke\s*Foundation\s*of\s*Canada\s*BLS\s*guidelines/gi, "American Heart Association (AHA) BLS guidelines");
  s = s.replace(/Heart\s*&?\s*Stroke\s*Foundation\s*of\s*Canada\s*guidelines/gi, "American Heart Association (AHA) guidelines");
  s = s.replace(/Heart\s*and\s*Stroke\s*Foundation\s*of\s*Canada/gi, "American Heart Association (AHA)");
  s = s.replace(/Resuscitation Council of Canada/gi, "American Heart Association (AHA)");

  // 2. Accreditation & Royal College remnants
  s = s.replace(/Commission on Dental Accreditation of Canada \(ADA\s*\/\s*CODA\)/gi, "Commission on Dental Accreditation (CODA)");
  s = s.replace(/Commission on Dental Accreditation of Canada/gi, "Commission on Dental Accreditation (CODA)");
  s = s.replace(/Royal College of Dentists of Canada \(American Board of Dental Specialties\)/gi, "American Board of Dental Specialties (ABDS)");
  s = s.replace(/Royal College of Dentists of Canada/gi, "American Board of Dental Specialties");
  s = s.replace(/Royal College of Dental Surgeons of Canada/gi, "recognized specialty certifying boards");
  s = s.replace(/IPAC Canada/gi, "CDC and OSHA infection control guidelines");

  // 3. Narrative references
  s = s.replace(/A 35-year-old female patient, a new immigrant to Canada,/gi, "A 35-year-old female patient, a new patient presenting to your office,");
  s = s.replace(/new immigrant to Canada/gi, "new patient to the clinic");
  s = s.replace(/\(and parts of Central\/Eastern Canada\)/gi, "");
  s = s.replace(/\(and parts of central Canada\)/gi, "");
  s = s.replace(/\bCanada;\b/gi, "United States;");

  // 4. Canadian adjectives and associations
  s = s.replace(/under Canadian INBDE standards/gi, "under INBDE standards");
  s = s.replace(/under Canadian ADA clinical guidelines/gi, "under ADA clinical guidelines");
  s = s.replace(/Canadian INBDE reference standards/gi, "INBDE reference standards");
  s = s.replace(/Canadian INBDE standards/gi, "INBDE standards");
  s = s.replace(/standard Canadian anatomical teaching/gi, "standard dental anatomical curricula");
  s = s.replace(/peer‑reviewed Canadian literature/gi, "contemporary peer-reviewed dental literature");
  s = s.replace(/peer-reviewed Canadian literature/gi, "contemporary peer-reviewed dental literature");
  s = s.replace(/recognized by Canadian and international/gi, "recognized by US and international");
  s = s.replace(/Canadian and international public health organizations/gi, "US and international public health organizations (including the CDC and ADA)");
  s = s.replace(/Canadian and international guidelines/gi, "ADA and AAPD clinical guidelines");
  s = s.replace(/Canadian endodontic guidelines/gi, "AAE (American Association of Endodontists) guidelines");
  s = s.replace(/Canadian Paediatric Dentistry guidelines/gi, "American Academy of Pediatric Dentistry (AAPD) guidelines");
  s = s.replace(/Canadian periodontal literature/gi, "Contemporary periodontal literature");
  s = s.replace(/Canadian clinical guidelines/gi, "Contemporary clinical guidelines");
  s = s.replace(/CDC\/CDC \(Canadian\)/gi, "CDC and ADA");
  s = s.replace(/A Canadian public health dental hygienist/gi, "A public health dental hygienist");
  s = s.replace(/A Canadian public health dentist/gi, "A public health dentist");
  s = s.replace(/Canadian public health/gi, "US public health");
  s = s.replace(/Canadian dental/gi, "dental");
  s = s.replace(/\bCanadian\b/gi, "US");
  s = s.replace(/\bCanada\b/gi, "the United States");

  // 5. Waterline CFU replacement: <= 500 CFU/mL (EPA/CDC standard)
  s = s.replace(/threshold of 200 CFU\/mL/gi, "EPA/CDC threshold of ≤ 500 CFU/mL");
  s = s.replace(/below 200 CFU\/mL/gi, "below 500 CFU/mL");
  s = s.replace(/<200 CFU\/mL/gi, "≤ 500 CFU/mL");
  s = s.replace(/<\s*200\s*cfu\/ml/gi, "≤ 500 CFU/mL");
  s = s.replace(/regulatory threshold of 200 CFU\/mL/gi, "CDC and EPA standard of ≤ 500 CFU/mL");
  s = s.replace(/threshold of 200 CFU\/mL/gi, "threshold of ≤ 500 CFU/mL");
  s = s.replace(/meeting the 200 CFU\/mL standard/gi, "meeting the ≤ 500 CFU/mL EPA/CDC drinking water standard");

  // 6. Double-word and formatting cleanup
  s = s.replace(/the the\b/gi, "the");
  s = s.replace(/a a\b/gi, "a");
  s = s.replace(/in in\b/gi, "in");
  s = s.replace(/of of\b/gi, "of");
  s = s.replace(/\s+/g, " ");

  return s;
}

// Custom handler for specific clinical questions
function patchSpecificQuestions(q) {
  // 1. Clindamycin updates (AHA 2021)
  if (q.id === "pharmacology-anesthesia-449") {
    q.question = "A 35-year-old female patient requires extraction of an acutely infected tooth. She has a documented history of severe penicillin allergy, manifesting as an anaphylactic reaction with respiratory distress. According to updated ADA and AHA guidelines, what is the MOST appropriate antibiotic for prophylactic coverage in this patient, if indicated?";
    q.options = [
      "Amoxicillin 2 g",
      "Cephalexin 2 g",
      "Azithromycin 500 mg",
      "Clindamycin 600 mg"
    ];
    q.correctAnswer = 2; // Azithromycin
    q.explanation = "According to updated AHA and ADA guidelines, Clindamycin is NO LONGER recommended for antibiotic prophylaxis due to its high association with severe and potentially fatal Clostridioides difficile colitis. For patients with a severe, IgE-mediated (anaphylactic) penicillin allergy, oral Azithromycin (500 mg) or Clarithromycin (500 mg) administered 30-60 minutes prior to the procedure is the first-line recommended prophylactic regimen. Amoxicillin and Cephalexin are strictly contraindicated due to direct cross-allergenicity risks in patients with anaphylaxis.";
  }

  if (q.id === "pharmacology-anesthesia-591") {
    q.question = "A 62-year-old male patient presents for the extraction of a mobile, periodontally compromised tooth #17. His medical history includes a prosthetic mechanical heart valve for which he takes warfarin daily. He also has a documented history of penicillin allergy, manifesting as hives. His last INR was 2.8 one week ago. What is the MOST appropriate pre-operative management regarding his medical conditions?";
    q.options = [
      "Discontinue warfarin 3 days prior to extraction and administer amoxicillin 2 g orally.",
      "Proceed with the extraction without altering warfarin, and administer azithromycin 500 mg orally 30-60 minutes prior.",
      "Consult his cardiologist to stop warfarin and administer cephalexin 2 g orally.",
      "Administer a single dose of oral amoxicillin 1 hour prior to the procedure."
    ];
    q.correctAnswer = 1;
    q.explanation = "According to ADA and AHA guidelines, patients with prosthetic cardiac valves require antibiotic prophylaxis for invasive dental procedures involving gingival manipulation or extraction. For patients allergic to penicillin, azithromycin 500 mg (or clarithromycin 500 mg) is the recommended regimen; clindamycin was discontinued by the AHA in 2021 due to C. difficile risk. Anticoagulation therapy with warfarin does not need to be interrupted for simple single extractions when the therapeutic INR is ≤ 3.5, as local hemostatic measures (gelatin sponge, sutures, tranexamic acid) effectively control bleeding without exposing the patient to thromboembolic risk.";
  }

  // 2. FDI keyword questions
  if (q.id === "operative-materials-886") {
    q.question = "A 7-year-old male patient presents with a chief complaint of pain in his lower right jaw. His mother reports he had a fall yesterday. Clinical examination reveals a non-mobile, discolored (greyish) primary mandibular right second molar (tooth T). There is no extraoral swelling or signs of alveolar fracture. Periapical radiograph shows no periapical pathology but reveals the succedaneous permanent second premolar (#29) is present and developing. What is the MOST appropriate management strategy for the primary tooth?";
  }

  if (q.id === "prosthodontics-implants-693") {
    q.question = "A 7-year-old male patient presents to your dental office with a fractured maxillary left central incisor (tooth #9) due to a fall an hour ago. Clinical examination shows a crown fracture involving enamel and dentin, with a small pinpoint pulp exposure (less than 1 mm). The tooth is not mobile, and there is no displacement. Sensitivity to cold air is reported. What is the MOST appropriate immediate management?";
  }

  if (q.id === "prosthodontics-implants-696") {
    q.question = "A 40-year-old male patient presents with numbness on the right side of his tongue and lip following a wisdom tooth extraction of the mandibular right third molar (tooth #32) 2 hours ago under local anesthesia. Clinical examination confirms persistent numbness of the right lower lip and chin, and the anterior two-thirds of the right side of the tongue. Which of the following nerves was MOST likely affected during the extraction procedure?";
  }

  if (q.id === "prosthodontics-implants-701") {
    q.question = "A 55-year-old female patient requests an extraction of her asymptomatic maxillary right first molar (tooth #3) for 'personal reasons,' despite your clinical assessment showing the tooth is restorable with a crown. Tooth #3 has a large, failing amalgam restoration, but no pain, mobility, or periapical pathology. Pulp vitality is normal. According to the American Dental Association Code of Ethics, what is the MOST appropriate action to take in this situation?";
  }

  if (q.id === "prosthodontics-implants-702") {
    q.question = "A 25-year-old female patient presents with severe throbbing pain in her lower right jaw, accompanied by swelling, for the past 2 days. Clinical examination reveals a partially erupted mandibular right third molar (tooth #32) with significant pericoronal inflammation, erythema, and purulent exudate upon pressure. Trismus is present, limiting opening to 30 mm. No significant facial swelling or lymphadenopathy. What is the MOST appropriate initial management?";
  }

  if (q.id === "prosthodontics-implants-706") {
    q.question = "A 9-year-old male patient presents because his parents are concerned about a dark stain on his maxillary right central incisor (tooth #8). Clinical examination reveals a localized, intrinsic dark grey discoloration on the incisal third of the maxillary right central incisor. The tooth responds normally to vitality testing. No caries or restorations are present. His medical history includes prolonged use of minocycline during early childhood for acne treatment. What is the MOST likely cause of the tooth discoloration?";
  }

  if (q.id === "prosthodontics-implants-708") {
    q.question = "A 38-year-old female patient presents with sensitivity to cold and sweets on her maxillary right first molar (tooth #3) for the past month. Clinical examination reveals an existing Class II amalgam restoration on tooth #3 with a visible fracture line extending from the margin into the occlusal surface. No pain on percussion, and vitality testing is within normal limits. Radiographs show no periapical pathology. What is the MOST appropriate definitive treatment for this tooth?";
  }
}

let allQuestions = [];
let totalUpdated = 0;

for (const entry of manifest) {
  const filePath = path.join(qDir, `${entry.id}.json`);
  const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let changed = false;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    let qChanged = false;

    patchSpecificQuestions(q);

    const oldQ = q.question;
    const newQ = cleanText(q.question);
    if (oldQ !== newQ) {
      q.question = newQ;
      qChanged = true;
    }

    if (Array.isArray(q.options)) {
      for (let j = 0; j < q.options.length; j++) {
        const oldO = q.options[j];
        const newO = cleanText(q.options[j]);
        if (oldO !== newO) {
          q.options[j] = newO;
          qChanged = true;
        }
      }
    }

    const oldExp = q.explanation;
    const newExp = cleanText(q.explanation);
    if (oldExp !== newExp) {
      q.explanation = newExp;
      qChanged = true;
    }

    if (qChanged) {
      totalUpdated++;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), "utf8");
    console.log(`Cleaned ${entry.id}.json`);
  }
  allQuestions = allQuestions.concat(questions);
}

fs.writeFileSync(path.join(rootDir, "src", "lib", "questions.json"), JSON.stringify(allQuestions, null, 2), "utf8");
console.log(`\nCleanup finished: ${totalUpdated} questions updated. Synchronized src/lib/questions.json (${allQuestions.length} questions).`);
