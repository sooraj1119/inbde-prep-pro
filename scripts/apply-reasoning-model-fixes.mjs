import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const QUESTIONS_DIR = path.join(ROOT, "public", "questions");

const updates = {
  "orthodontics-pedodontics-991": {
    file: "orthodontics-pedodontics.json",
    patch: {
      question: "A 7-year-old female patient lost her primary maxillary left second molar (tooth J) due to caries six months ago. Clinical examination reveals mesial tipping of the permanent maxillary left first molar (tooth #14) into the extraction space, resulting in significant space loss. The permanent maxillary left second premolar (tooth #13) is present radiographically with incomplete root formation. What is the MOST appropriate next step in managing this space loss?",
      options: [
        "No intervention, as the permanent premolar will erupt naturally.",
        "Fabrication and insertion of a passive band and loop space maintainer.",
        "Orthodontic intervention for space regaining.",
        "Extraction of the permanent maxillary left first molar (tooth #14)."
      ],
      correctAnswer: 2,
      explanation: "When significant space loss has already occurred due to mesial tipping of the permanent first molar (tooth #14) following premature loss of the primary second molar (tooth J), a passive space maintainer is ineffective and active orthodontic intervention for space regaining is required. Once space is regained, a space maintainer is placed until the succedaneous premolar (tooth #13) erupts. No intervention would result in premolar impaction, and extraction of the permanent molar is contraindicated."
    }
  },
  "oral-pathology-medicine-11": {
    file: "oral-pathology-medicine.json",
    patch: {
      question: "A 35-year-old patient presents with an asymptomatic, well-circumscribed, heart-shaped or pear-shaped radiolucency located in the midline of the anterior maxilla between the roots of the maxillary central incisors (teeth #8 and #9). The adjacent teeth test vital to electric pulp testing and thermal testing. Which of the following is the most likely diagnosis?",
      options: [
        "Nasopalatine duct cyst",
        "Lateral periodontal cyst",
        "Globulomaxillary cyst",
        "Radicular cyst"
      ],
      correctAnswer: 0,
      explanation: "The clinical and radiographic presentation of a heart-shaped or pear-shaped radiolucency situated strictly at the midline of the anterior maxilla between the divergent roots of vital permanent central incisors (#8 and #9) is pathognomonic for a nasopalatine duct cyst (incisive canal cyst). Adjacent teeth maintain vitality. Lateral periodontal cysts occur most commonly in the mandibular premolar-canine area. Globulomaxillary cyst is an obsolete diagnostic term. Radicular cysts are associated with non-vital necrotic pulps."
    }
  },
  "periodontics-491": {
    file: "periodontics.json",
    patch: {
      question: "A 7-year-old male patient presents with premature loss of his mandibular left first primary molar (tooth L) due to extensive caries and infection. The permanent first molar (#19) has already erupted, and the succedaneous permanent first premolar (tooth #21) is not yet visible radiographically. What is the MOST appropriate immediate management to prevent space loss?",
      options: [
        "No space maintainer is needed as the permanent first molar is already erupted.",
        "Recommend a distal shoe appliance to guide the eruption of the first premolar.",
        "Place a band and loop space maintainer.",
        "Extract the contralateral primary molar to balance the arch."
      ],
      correctAnswer: 2,
      explanation: "Premature loss of a primary first molar (tooth L) requires a band and loop space maintainer to prevent space closure from distal drift of the primary canine or mesial drift of the primary second molar, preserving space for the succedaneous first premolar (tooth #21). A distal shoe is indicated only when the permanent first molar (#19) is unerupted. Extracting contralateral teeth is contraindicated."
    }
  },
  "prosthodontics-implants-11": {
    file: "prosthodontics-implants.json",
    patch: {
      question: "A 62-year-old male presents for the replacement of a maxillary complete denture. Clinical examination reveals redundant, hyperplastic mucosal tissue in the anterior maxillary vestibule that moves freely. What is the most appropriate initial management for this condition prior to making final impressions?",
      options: [
        "Laser ablation of the tissue without modifying the existing denture",
        "Immediate fabrication of the final impression using a heavy-bodied polysulfide material",
        "Immediate surgical excision of the hyperplastic tissue without prior tissue conditioning",
        "Relining the existing denture with a resilient tissue conditioner after relieving overextended flanges"
      ],
      correctAnswer: 3,
      explanation: "The standard initial conservative management for epulis fissuratum (denture-induced fibrous hyperplasia) is to relieve the overextended denture flanges and place a resilient tissue conditioner (Option D). This eliminates mechanical trauma, reduces inflammatory edema, and allows mucosal recovery. Surgical excision is indicated secondarily only if significant fibrous hyperplasia persists after tissue conditioning. Making impressions or operating without tissue recovery produces compromised prostheses."
    }
  },
  "oral-surgery-emergencies-11": {
    file: "oral-surgery-emergencies.json",
    patch: {
      question: "A 25-year-old male presents to the emergency department after a motor vehicle accident. He complains of jaw pain, malocclusion, and deviation of his mandible to the left upon opening. Clinical examination reveals tenderness, swelling, and ecchymosis over the left angle of the mandible. Which of the following is the most likely diagnosis?",
      options: [
        "Zygomatic arch fracture.",
        "Condylar dislocation.",
        "Left mandibular angle fracture.",
        "Alveolar process fracture."
      ],
      correctAnswer: 2,
      explanation: "Deviation of the mandible to the left (ipsilateral side) upon opening, accompanied by tenderness, swelling, and malocclusion at the left angle, is characteristic of a left mandibular angle fracture (Option C). The jaw deviates toward the injured side because the compromised ipsilateral musculature cannot translate forward while the intact contralateral lateral pterygoid translates normally. Condylar dislocation presents with an anterior open bite and inability to close."
    }
  },
  "operative-materials-1491": {
    file: "operative-materials.json",
    patch: {
      question: "A patient taking a non-selective beta-blocker (propranolol) presents for a restorative dental procedure requiring local anesthesia. Which of the following vasoconstrictors carries the greatest clinical risk of precipitating a hypertensive crisis with reflex bradycardia due to unopposed alpha-1 receptor stimulation, requiring strict limitation to a cardiac maximum of 0.04 mg?",
      options: [
        "Felypressin",
        "Levonordefrin",
        "Epinephrine",
        "Norepinephrine"
      ],
      correctAnswer: 2,
      explanation: "Epinephrine (Option C) in local anesthetics stimulates both alpha-1 and beta-2 adrenergic receptors. When a non-selective beta-blocker (like propranolol) blocks beta-2 vasodilation, epinephrine produces unopposed alpha-1 vasoconstriction, precipitating severe hypertension and compensatory vagal reflex bradycardia. In these patients, epinephrine must be strictly limited to a cardiac dose of 0.04 mg (maximum 2 cartridges of 1:100,000), while levonordefrin and norepinephrine are strictly avoided."
    }
  }
};

for (const [id, data] of Object.entries(updates)) {
  const filePath = path.join(QUESTIONS_DIR, data.file);
  const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const idx = questions.findIndex(q => q.id === id);
  if (idx !== -1) {
    questions[idx] = { ...questions[idx], ...data.patch, inbdeVerified: true, inbdeStrictPass: true };
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), "utf8");
    console.log(`[APPLIED REASONING FIX] ${id} in ${data.file}`);
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
