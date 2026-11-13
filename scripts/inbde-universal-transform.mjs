import fs from "fs";
import path from "path";

const rootDir = "C:/Users/sooraj/.gemini/antigravity/playground/inbde-prep-pro";
const qDir = path.join(rootDir, "public", "questions");
const manifest = JSON.parse(fs.readFileSync(path.join(qDir, "manifest.json"), "utf8"));

console.log("Starting Strict INBDE Universal Transformation...");

const FDI_PERM = {
  "18": { u: "#1", name: "maxillary right third molar" },
  "17": { u: "#2", name: "maxillary right second molar" },
  "16": { u: "#3", name: "maxillary right first molar" },
  "15": { u: "#4", name: "maxillary right second premolar" },
  "14": { u: "#5", name: "maxillary right first premolar" },
  "13": { u: "#6", name: "maxillary right canine" },
  "12": { u: "#7", name: "maxillary right lateral incisor" },
  "11": { u: "#8", name: "maxillary right central incisor" },
  "21": { u: "#9", name: "maxillary left central incisor" },
  "22": { u: "#10", name: "maxillary left lateral incisor" },
  "23": { u: "#11", name: "maxillary left canine" },
  "24": { u: "#12", name: "maxillary left first premolar" },
  "25": { u: "#13", name: "maxillary left second premolar" },
  "26": { u: "#14", name: "maxillary left first molar" },
  "27": { u: "#15", name: "maxillary left second molar" },
  "28": { u: "#16", name: "maxillary left third molar" },
  "31": { u: "#24", name: "mandibular left central incisor" },
  "32": { u: "#23", name: "mandibular left lateral incisor" },
  "33": { u: "#22", name: "mandibular left canine" },
  "34": { u: "#21", name: "mandibular left first premolar" },
  "35": { u: "#20", name: "mandibular left second premolar" },
  "36": { u: "#19", name: "mandibular left first molar" },
  "37": { u: "#18", name: "mandibular left second molar" },
  "38": { u: "#17", name: "mandibular left third molar" },
  "41": { u: "#25", name: "mandibular right central incisor" },
  "42": { u: "#26", name: "mandibular right lateral incisor" },
  "43": { u: "#27", name: "mandibular right canine" },
  "44": { u: "#28", name: "mandibular right first premolar" },
  "45": { u: "#29", name: "mandibular right second premolar" },
  "46": { u: "#30", name: "mandibular right first molar" },
  "47": { u: "#31", name: "mandibular right second molar" },
  "48": { u: "#32", name: "mandibular right third molar" }
};

const FDI_PRIM = {
  "51": { u: "tooth E", name: "primary maxillary right central incisor" },
  "52": { u: "tooth D", name: "primary maxillary right lateral incisor" },
  "53": { u: "tooth C", name: "primary maxillary right canine" },
  "54": { u: "tooth B", name: "primary maxillary right first molar" },
  "55": { u: "tooth A", name: "primary maxillary right second molar" },
  "61": { u: "tooth F", name: "primary maxillary left central incisor" },
  "62": { u: "tooth G", name: "primary maxillary left lateral incisor" },
  "63": { u: "tooth H", name: "primary maxillary left canine" },
  "64": { u: "tooth I", name: "primary maxillary left first molar" },
  "65": { u: "tooth J", name: "primary maxillary left second molar" },
  "71": { u: "tooth O", name: "primary mandibular left central incisor" },
  "72": { u: "tooth N", name: "primary mandibular left lateral incisor" },
  "73": { u: "tooth M", name: "primary mandibular left canine" },
  "74": { u: "tooth L", name: "primary mandibular left first molar" },
  "75": { u: "tooth K", name: "primary mandibular left second molar" },
  "81": { u: "tooth P", name: "primary mandibular right central incisor" },
  "82": { u: "tooth Q", name: "primary mandibular right lateral incisor" },
  "83": { u: "tooth R", name: "primary mandibular right canine" },
  "84": { u: "tooth S", name: "primary mandibular right first molar" },
  "85": { u: "tooth T", name: "primary mandibular right second molar" }
};

function transformText(text) {
  if (!text || typeof text !== "string") return text;
  let s = text;

  s = s.replace(/National Dental Examining Board of Canada \(INBDE\)/gi, "Joint Commission on National Dental Examinations (JCNDE)");
  s = s.replace(/National Dental Examining Board of Canada/gi, "Joint Commission on National Dental Examinations (JCNDE)");
  s = s.replace(/American Dental Association \(CDA\)/gi, "American Dental Association (ADA)");
  s = s.replace(/\(CDA\)/gi, "(ADA)");
  s = s.replace(/\bCDA Code of Ethics\b/gi, "ADA Principles of Ethics and Code of Professional Conduct");
  s = s.replace(/\bCDA guidelines\b/gi, "ADA clinical guidelines");
  s = s.replace(/\bCDA guideline\b/gi, "ADA clinical guideline");
  s = s.replace(/\bCDA Infection[‑-]control\b/gi, "CDC and ADA infection control");
  s = s.replace(/\bCDA infection[‑-]control\b/gi, "CDC and ADA infection control");
  s = s.replace(/\bCDA Endodontic Guidelines\b/gi, "American Association of Endodontists (AAE) guidelines");
  s = s.replace(/\bCDA pediatric guidelines\b/gi, "American Academy of Pediatric Dentistry (AAPD) guidelines");
  s = s.replace(/\bCDA periodontic guidelines\b/gi, "American Academy of Periodontology (AAP) guidelines");
  s = s.replace(/\bthe CDA\b/g, "the ADA");
  s = s.replace(/\bCDA\b/g, "ADA");
  s = s.replace(/Canadian Dental Association/gi, "American Dental Association");
  
  s = s.replace(/Canadian dental infection control guidelines/gi, "CDC and OSHA infection control guidelines");
  s = s.replace(/Canadian infection control guidelines for dental practices/gi, "CDC infection control guidelines for dental healthcare settings");
  s = s.replace(/Canadian infection control guidelines/gi, "CDC infection control guidelines");
  s = s.replace(/Canadian infection prevention and control guidelines/gi, "CDC and OSHA infection prevention and control guidelines");
  s = s.replace(/Canadian infection prevention and control standards/gi, "CDC and OSHA infection control standards");
  s = s.replace(/Canadian infection[‑-]control standards/gi, "CDC infection control standards");
  s = s.replace(/Canadian infection[‑-]prevention guidelines/gi, "CDC infection control guidelines");
  s = s.replace(/Canadian infection[‑-]control guidelines/gi, "CDC infection control guidelines");
  s = s.replace(/Canadian IPAC standards/gi, "CDC infection prevention and control standards");
  s = s.replace(/Canadian IPAC/gi, "CDC infection prevention guidelines");

  s = s.replace(/Canadian dental regulatory bodies/gi, "State dental boards");
  s = s.replace(/Canadian dental regulatory authorities/gi, "State dental boards");
  s = s.replace(/Canadian dental regulatory frameworks/gi, "State dental practice acts");
  s = s.replace(/Canadian dental regulatory statutes/gi, "State dental practice acts");
  s = s.replace(/Canadian dental regulatory guidelines/gi, "State dental board regulations");
  s = s.replace(/Canadian dental regulatory standards/gi, "State dental board standards");
  s = s.replace(/Canadian provincial dental regulatory authorities/gi, "State dental boards");
  s = s.replace(/Canadian provincial dental regulatory bodies/gi, "State dental boards");
  s = s.replace(/provincial dental regulatory bodies in Canada/gi, "state dental boards");
  s = s.replace(/provincial dental regulatory bodies/gi, "state dental boards");
  s = s.replace(/provincial dental regulatory body \(e\.g\., RCDSO, CDHO\)/gi, "state dental board");
  s = s.replace(/provincial dental regulatory body \(e\.g\., RCDSO, ODQ, CDHBC\)/gi, "state dental board");
  s = s.replace(/provincial dental regulatory body \(e\.g\., RCDSO\)/gi, "state dental board");
  s = s.replace(/provincial dental regulatory body/gi, "state dental board");
  s = s.replace(/provincial dental licensing boards/gi, "state dental licensing boards");
  s = s.replace(/provincial dental colleges/gi, "state dental boards");
  s = s.replace(/provincial dental college/gi, "state dental board");
  s = s.replace(/provincial regulatory bodies/gi, "state dental boards");
  s = s.replace(/provincial regulatory body/gi, "state dental board");
  s = s.replace(/provincial colleges/gi, "state dental boards");
  s = s.replace(/provincial college/gi, "state dental board");
  s = s.replace(/provincial dental association standards/gi, "state dental association standards");
  s = s.replace(/provincial dental associations/gi, "state dental associations");
  s = s.replace(/provincial dental association/gi, "state dental association");
  s = s.replace(/provincial dental practice act/gi, "state dental practice act");
  s = s.replace(/provincial dental act/gi, "state dental practice act");
  s = s.replace(/provincial statutes/gi, "state statutes");
  s = s.replace(/provincial legislation/gi, "state legislation");
  s = s.replace(/provincial guidelines/gi, "state dental board guidelines");
  s = s.replace(/provincial protocol/gi, "state guidelines");
  s = s.replace(/provincial threshold/gi, "CDC/EPA threshold");
  s = s.replace(/provincial regulatory threshold/gi, "CDC/EPA regulatory threshold");
  s = s.replace(/provincial/gi, "state");
  s = s.replace(/\bprovinces\b/gi, "states");
  s = s.replace(/\bprovince\b/gi, "state");

  s = s.replace(/RCDSO Guidelines on Facial Fracture Management/gi, "AAOMS Guidelines on Facial Fracture Management");
  s = s.replace(/RCDSO pediatric emergency protocol/gi, "AAPD pediatric emergency protocol");
  s = s.replace(/RCDSO provincial protocol/gi, "ADA and CDC protocols");
  s = s.replace(/RCDSO’s Public Protection Act/gi, "the State Dental Practice Act");
  s = s.replace(/RCDSO\/ODQ guidelines/gi, "ADA guidelines");
  s = s.replace(/RCDSO\/ODQ/gi, "ADA/state guidelines");
  s = s.replace(/RCDSO/gi, "state dental board");
  s = s.replace(/CDHO/gi, "state dental hygiene board");
  s = s.replace(/ODQ/gi, "state dental board");
  s = s.replace(/CDSPI/gi, "dental professional liability insurer");
  s = s.replace(/CDSBC/gi, "state dental board");
  s = s.replace(/CDOBC/gi, "state dental board");
  s = s.replace(/Ontario Dental Association/gi, "State Dental Association");
  s = s.replace(/College of Dental Surgeons of British Columbia/gi, "State Dental Board");
  s = s.replace(/College of Dental Surgeons of Ontario/gi, "State Dental Board");
  s = s.replace(/College of Dentists in Ontario/gi, "State Dental Board");
  s = s.replace(/Dental Association of British Columbia/gi, "State Dental Association");
  s = s.replace(/a dental clinic in Ontario/gi, "a dental clinic");
  s = s.replace(/in Ontario/gi, "in the state");
  s = s.replace(/in British Columbia/gi, "in the state");
  s = s.replace(/in Alberta/gi, "in the state");

  s = s.replace(/Personal Information Protection and Electronic Documents Act \(PIPEDA\) or provincial health information privacy legislation \(e\.g\., PHIPA in Ontario\)/gi, "HIPAA (Health Insurance Portability and Accountability Act)");
  s = s.replace(/provincial health information privacy legislation \(e\.g\., PHIPA in Ontario\) or PIPEDA \(if no provincial legislation applies\)/gi, "HIPAA regulations");
  s = s.replace(/privacy legislation \(e\.g\., PHIPA in Ontario\)/gi, "privacy regulations (e.g., HIPAA)");
  s = s.replace(/Canadian privacy legislation \(e\.g\., PHIPA in Ontario\)/gi, "HIPAA privacy regulations");
  s = s.replace(/Health Care Consent Act in Ontario/gi, "State Health Care Consent Statutes");
  s = s.replace(/Family Law Act in Ontario/gi, "State Family Law Statutes");
  s = s.replace(/Health Protection and Promotion Act/gi, "State Public Health Statutes");
  s = s.replace(/Health Information Act in BC/gi, "State Health Privacy Statutes");
  s = s.replace(/PIPEDA/gi, "HIPAA");
  s = s.replace(/PHIPA/gi, "HIPAA");

  s = s.replace(/Public Health Agency of Canada \(PHAC\)/gi, "Centers for Disease Control and Prevention (CDC)");
  s = s.replace(/Public Health Agency of Canada/gi, "Centers for Disease Control and Prevention (CDC)");
  s = s.replace(/Health Canada/gi, "US Public Health Service and CDC");
  s = s.replace(/\bPHAC\b/gi, "CDC");

  s = s.replace(/Canadian Cardiovascular Society/gi, "American Heart Association (AHA) and American College of Cardiology (ACC)");
  s = s.replace(/Canadian pediatric dentistry guidelines/gi, "American Academy of Pediatric Dentistry (AAPD) guidelines");
  s = s.replace(/Canadian radiation safety guidelines/gi, "ADA and FDA radiation safety guidelines (ALARA principles)");
  s = s.replace(/Canadian radiation protection guidelines/gi, "ADA and FDA radiation safety guidelines");
  s = s.replace(/Safety Code 30/gi, "ADA/FDA radiation protection guidelines");

  s = s.replace(/Canadian dental ethics guidelines/gi, "ADA Principles of Ethics and Code of Professional Conduct");
  s = s.replace(/Canadian dental ethical principles/gi, "ADA Principles of Ethics and Code of Professional Conduct");
  s = s.replace(/Canadian dental ethical guidelines/gi, "ADA Principles of Ethics");
  s = s.replace(/Canadian dental ethics principles/gi, "ADA Principles of Ethics");
  s = s.replace(/Canadian dental ethics/gi, "ADA Code of Ethics");
  s = s.replace(/Canadian dental jurisprudence and ethical principles/gi, "ADA Code of Ethics and state jurisprudence");
  s = s.replace(/Canadian dental jurisprudence and the standard of care/gi, "Dental jurisprudence and the US standard of care");
  s = s.replace(/Canadian dental jurisprudence/gi, "Dental jurisprudence and state dental practice acts");
  s = s.replace(/In Canadian dental jurisprudence/gi, "In dental jurisprudence");
  s = s.replace(/In the context of Canadian dental ethics/gi, "In dental ethics");
  s = s.replace(/In Canadian dental ethics/gi, "In dental ethics");
  s = s.replace(/According to the ethical principles guiding dental practice in Canada/gi, "According to the ADA Principles of Ethics and Code of Professional Conduct");
  s = s.replace(/According to the ethical principles of dental practice in Canada/gi, "According to the ADA Principles of Ethics and Code of Professional Conduct");
  s = s.replace(/Canadian dental professional ethics and jurisprudence/gi, "ADA Code of Ethics and dental jurisprudence");
  s = s.replace(/Canadian dental professional ethics and guidelines/gi, "ADA Principles of Ethics and Code of Professional Conduct");
  s = s.replace(/Canadian dental professional ethics and standards/gi, "ADA Principles of Ethics and professional standards");
  s = s.replace(/Canadian dental professional ethics/gi, "ADA Principles of Ethics and Code of Professional Conduct");
  s = s.replace(/Canadian dental professional standards/gi, "ADA clinical standards of care");
  s = s.replace(/Canadian dental professional codes of conduct/gi, "ADA Principles of Ethics and Code of Professional Conduct");
  s = s.replace(/Canadian dental professional codes/gi, "ADA Code of Professional Conduct");

  s = s.replace(/According to current Canadian dental guidelines and evidence[‑-]based practice/gi, "According to current ADA clinical guidelines and evidence-based practice");
  s = s.replace(/According to current Canadian dental standards and ADA clinical guidelines/gi, "According to ADA clinical guidelines and US standards of care");
  s = s.replace(/According to Canadian dental standards and ADA clinical guidelines/gi, "According to ADA clinical guidelines and US standards of care");
  s = s.replace(/According to current Canadian dental guidelines/gi, "According to current ADA clinical guidelines");
  s = s.replace(/According to current Canadian dental standards/gi, "According to current ADA clinical guidelines");
  s = s.replace(/According to Canadian dental standards/gi, "According to ADA clinical standards of care");
  s = s.replace(/According to Canadian dental guidelines/gi, "According to ADA clinical guidelines");
  s = s.replace(/Current Canadian dental guidelines/gi, "Current ADA clinical guidelines");
  s = s.replace(/Canadian dental standards and literature/gi, "Contemporary dental literature and clinical standards");
  s = s.replace(/Canadian dental standards and guidelines/gi, "ADA clinical standards and guidelines");
  s = s.replace(/Canadian dental standards/gi, "ADA clinical standards of care");
  s = s.replace(/Canadian dental guidelines/gi, "ADA clinical guidelines");
  s = s.replace(/Canadian dental recommendations/gi, "ADA clinical recommendations");
  s = s.replace(/Canadian dental emergency management guidelines/gi, "ADA and AHA emergency management guidelines");
  s = s.replace(/Canadian dental emergency guidelines/gi, "ADA and AHA emergency guidelines");
  s = s.replace(/Canadian dental emergency protocols/gi, "Emergency management protocols");
  s = s.replace(/Canadian dental emergency preparedness guidelines/gi, "ADA emergency preparedness guidelines");
  s = s.replace(/Canadian dental safety standards/gi, "OSHA and ADA safety standards");
  s = s.replace(/Canadian dental public health principles/gi, "US dental public health principles");
  s = s.replace(/Canadian dental public health recommendations/gi, "CDC and US public health recommendations");
  s = s.replace(/Canadian dental public health guidelines/gi, "CDC and US public health guidelines");
  s = s.replace(/Canadian dental public health/gi, "US dental public health");
  s = s.replace(/In Canadian dental public health/gi, "In US dental public health");
  s = s.replace(/Canadian public health guidelines/gi, "CDC and US public health guidelines");
  s = s.replace(/Canadian dental practice guidelines/gi, "ADA clinical practice guidelines");
  s = s.replace(/In Canadian dental practice/gi, "In dental practice");
  s = s.replace(/In the context of Canadian dental practice/gi, "In dental practice");
  s = s.replace(/Canadian dental practice/gi, "contemporary US dental practice");
  s = s.replace(/Canadian dental practices/gi, "dental practices");
  s = s.replace(/Canadian dental offices/gi, "dental offices");
  s = s.replace(/Canadian dental office/gi, "dental office");
  s = s.replace(/Canadian dental clinics/gi, "dental clinics");
  s = s.replace(/Canadian dental clinic/gi, "dental clinic");
  s = s.replace(/Canadian dental settings/gi, "dental settings");
  s = s.replace(/Canadian dental context/gi, "clinical dental context");
  s = s.replace(/Canadian dental education/gi, "CODA-accredited dental education");
  s = s.replace(/Canadian dental curricula/gi, "CODA-accredited dental curricula");
  s = s.replace(/Canadian dental curriculum/gi, "CODA-accredited dental curriculum");
  s = s.replace(/Canadian dental schools/gi, "CODA-accredited dental schools");
  s = s.replace(/Canadian dental board examinations/gi, "INBDE examination");
  s = s.replace(/Canadian dental board standards/gi, "INBDE examination standards");
  s = s.replace(/Canadian dental licensure/gi, "US dental licensure");
  s = s.replace(/Canadian dental literature/gi, "contemporary dental literature");
  s = s.replace(/Canadian dental materials literature/gi, "dental materials literature");
  s = s.replace(/Canadian dental pathology curricula/gi, "oral pathology curricula");
  s = s.replace(/Canadian dental pathology texts/gi, "oral pathology textbooks");
  s = s.replace(/Canadian dental anatomy texts/gi, "dental anatomy textbooks");
  s = s.replace(/Canadian dental anatomy curricula/gi, "dental anatomy curricula");
  s = s.replace(/Canadian dental pharmacology guidelines/gi, "ADA pharmacology guidelines");
  s = s.replace(/Canadian dental pharmacology texts/gi, "dental pharmacology textbooks");
  s = s.replace(/Canadian dental anesthetic guidelines/gi, "ADA dental local anesthesia guidelines");
  s = s.replace(/Canadian dental trauma protocols/gi, "International Association of Dental Traumatology (IADT) guidelines");
  s = s.replace(/Canadian dental advertising guidelines/gi, "ADA advertising ethics guidelines");
  s = s.replace(/Canadian dental waste management guidelines/gi, "EPA and ADA waste management guidelines");
  s = s.replace(/Canadian dental professionals/gi, "dental professionals");
  s = s.replace(/Canadian dental programs/gi, "CODA-accredited dental programs");
  s = s.replace(/Canadian dentists/gi, "dentists");
  s = s.replace(/Canadian dentistry/gi, "US dentistry");
  s = s.replace(/Canadian dental/gi, "dental");

  s = s.replace(/in Canada/gi, "in the United States");
  s = s.replace(/across Canada/gi, "across the United States");
  s = s.replace(/for Canadians/gi, "for the public");
  s = s.replace(/Canadian citizens/gi, "US patients");
  s = s.replace(/Canadian edition/gi, "US edition");

  s = s.replace(/\ba the US Public Health Service\b/g, "the US Public Health Service");
  s = s.replace(/\ba the American\b/g, "the American");
  s = s.replace(/\ba the CDC\b/g, "the CDC");

  // --- B. Tooth Numbering Conversions (FDI -> Universal) ---
  s = s.replace(/\(?FDI\s*#?([1-8][1-8])\)?/gi, (match, digits) => {
    if (FDI_PERM[digits]) return FDI_PERM[digits].u;
    if (FDI_PRIM[digits]) return FDI_PRIM[digits].u;
    return match;
  });

  s = s.replace(/\b(?:tooth|teeth)\s*#?([5-8][1-5])\b/gi, (match, digits) => {
    return FDI_PRIM[digits] ? FDI_PRIM[digits].u : match;
  });
  s = s.replace(/#([5-8][1-5])\b/g, (match, digits) => {
    return FDI_PRIM[digits] ? FDI_PRIM[digits].u : match;
  });

  s = s.replace(/\b(?:tooth|teeth)\s*#?(4[1-8])\b/gi, (match, digits) => {
    return FDI_PERM[digits] ? `tooth ${FDI_PERM[digits].u}` : match;
  });
  s = s.replace(/#(4[1-8])\b/g, (match, digits) => {
    return FDI_PERM[digits] ? FDI_PERM[digits].u : match;
  });

  s = s.replace(/\b(?:tooth|teeth)\s*#?(3[3-8])\b/gi, (match, digits) => {
    return FDI_PERM[digits] ? `tooth ${FDI_PERM[digits].u}` : match;
  });
  s = s.replace(/#(3[3-8])\b/g, (match, digits) => {
    return FDI_PERM[digits] ? FDI_PERM[digits].u : match;
  });

  s = s.replace(/(?:tooth\s*)?#31\s*\((?:mandibular\s*(?:left\s*)?)?(?:central\s*)?incisor\)/gi, "tooth #24 (mandibular left central incisor)");
  s = s.replace(/(?:mandibular\s*(?:left\s*)?)?(?:central\s*)?incisor\s*\(#31\)/gi, "mandibular left central incisor (#24)");
  s = s.replace(/tooth\s*#31\s*\(mandibular\s*left\s*central\s*incisor\)/gi, "tooth #24 (mandibular left central incisor)");
  s = s.replace(/tooth\s*#31\s*\(mandibular\s*right\s*central\s*incisor\)/gi, "tooth #25 (mandibular right central incisor)");
  s = s.replace(/mobile\s*tooth\s*#31\s*\(mandibular\s*right\s*central\s*incisor\)/gi, "mobile tooth #25 (mandibular right central incisor)");
  s = s.replace(/mandibular\s*right\s*lateral\s*incisor\s*\(#32\)/gi, "mandibular right lateral incisor (#26)");
  s = s.replace(/lower\s*front\s*tooth\s*\(#31\)/gi, "lower front tooth (#24)");
  s = s.replace(/mandibular\s*permanent\s*incisor\s*\(#31\)/gi, "mandibular permanent central incisor (#24)");

  s = s.replace(/maxillary\s*central\s*incisors\s*\(#11\s*and\s*#21\)/gi, "maxillary central incisors (#8 and #9)");
  s = s.replace(/teeth\s*#11\s*and\s*#21/gi, "teeth #8 and #9");
  s = s.replace(/#11\s*and\s*#21/gi, "#8 and #9");
  s = s.replace(/maxillary\s*right\s*central\s*incisor\s*\(#11\)/gi, "maxillary right central incisor (#8)");
  s = s.replace(/maxillary\s*left\s*central\s*incisor\s*\(#21\)/gi, "maxillary left central incisor (#9)");
  s = s.replace(/permanent\s*maxillary\s*central\s*incisor\s*\(#11\)/gi, "permanent maxillary right central incisor (#8)");
  s = s.replace(/permanent\s*maxillary\s*central\s*incisor\s*\(#21\)/gi, "permanent maxillary left central incisor (#9)");
  s = s.replace(/anterior\s*crossbite\s*involving\s*tooth\s*#21/gi, "anterior crossbite involving tooth #9");
  s = s.replace(/shows\s*#21\s*in\s*crossbite/gi, "shows #9 in crossbite");

  s = s.replace(/teeth\s*#16\s*and\s*#26/gi, "teeth #3 and #14");
  s = s.replace(/#16\s*and\s*#26/gi, "#3 and #14");
  s = s.replace(/permanent\s*maxillary\s*(?:right\s*)?first\s*molar\s*\(#16\)/gi, "permanent maxillary right first molar (#3)");
  s = s.replace(/maxillary\s*right\s*first\s*molar\s*\(#16\)/gi, "maxillary right first molar (#3)");
  s = s.replace(/permanent\s*maxillary\s*(?:left\s*)?first\s*molar\s*\(#26\)/gi, "permanent maxillary left first molar (#14)");
  s = s.replace(/maxillary\s*left\s*first\s*molar\s*\(#26\)/gi, "maxillary left first molar (#14)");
  s = s.replace(/furcation\s*involvement\s*on\s*tooth\s*#16/gi, "furcation involvement on tooth #3");
  s = s.replace(/bone\s*loss\s*around\s*tooth\s*#16/gi, "bone loss around tooth #3");
  s = s.replace(/around\s*tooth\s*#16/gi, "around tooth #3");
  s = s.replace(/Class\s*II\s*cavity\s*on\s*tooth\s*#26/gi, "Class II cavity on tooth #14");
  s = s.replace(/crossbite\s*involving\s*tooth\s*#26/gi, "crossbite involving tooth #14");

  s = s.replace(/maxillary\s*right\s*posterior\s*region\s*on\s*tooth\s*#17/gi, "maxillary right posterior region on tooth #2");
  s = s.replace(/maxillary\s*right\s*second\s*molar\s*\(#17\)/gi, "maxillary right second molar (#2)");
  s = s.replace(/maxillary\s*left\s*second\s*molar\s*\(#27\)/gi, "maxillary left second molar (#15)");

  s = s.replace(/maxillary\s*right\s*first\s*premolar\s*\(tooth\s*#14\)/gi, "maxillary right first premolar (tooth #5)");
  s = s.replace(/maxillary\s*right\s*first\s*premolar\s*\(#14\)/gi, "maxillary right first premolar (#5)");
  s = s.replace(/permanent\s*maxillary\s*first\s*premolar\s*\(#14\)/gi, "permanent maxillary right first premolar (#5)");
  s = s.replace(/maxillary\s*left\s*first\s*premolar\s*\(#24\)/gi, "maxillary left first premolar (#12)");
  s = s.replace(/permanent\s*maxillary\s*(?:right\s*)?second\s*premolar\s*\(#15\)/gi, "permanent maxillary right second premolar (#4)");
  s = s.replace(/permanent\s*successor\s*\(#15\)/gi, "permanent successor (#4)");
  s = s.replace(/maxillary\s*left\s*second\s*premolar\s*\(#25\)/gi, "maxillary left second premolar (#13)");

  s = s.replace(/maxillary\s*right\s*canine\s*\(#13\)/gi, "maxillary right canine (#6)");
  s = s.replace(/maxillary\s*left\s*canine\s*\(#23\)/gi, "maxillary left canine (#11)");

  s = s.replace(/maxillary\s*right\s*lateral\s*incisor\s*\(#12\)/gi, "maxillary right lateral incisor (#7)");
  s = s.replace(/maxillary\s*left\s*lateral\s*incisor\s*\(#22\)/gi, "maxillary left lateral incisor (#10)");

  return s;
}

let modifiedFiles = 0;
let modifiedQuestions = 0;

for (const entry of manifest) {
  const filePath = path.join(qDir, `${entry.id}.json`);
  const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let fileChanged = false;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    let qChanged = false;

    if (q.id === "oral-pathology-medicine-624") {
      q.question = "A 48-year-old patient presents with an asymptomatic, discrete, 3 mm bluish-black macule on the mandibular buccal gingiva adjacent to an amalgam restoration on tooth #30. Radiographs reveal tiny radiopaque specks within the submucosa. Biopsy of this lesion would characteristically reveal which histological finding?";
      q.options = [
        "Foreign silver-staining pigment coating collagen bundles and vascular basement membranes",
        "Malignant proliferation of atypical junctional melanocytes",
        "Submucosal pooling of extravasated mucin surrounded by granulation tissue",
        "Chronic granulomatous inflammation with multinucleated Langerhans giant cells"
      ];
      q.correctAnswer = 0;
      q.explanation = "The clinical presentation and radiographic specks adjacent to an amalgam restoration are classic for an amalgam tattoo (focal argyrosis). Histopathologically, amalgam particles appear as dark brown or black foreign silver-staining granules preferentially deposited along collagen fibers, basement membranes of mucosal blood vessels, and reticulin fibers with little to no inflammatory response. Proliferation of atypical melanocytes characterizes mucosal melanoma, extravasated mucin defines a mucocele, and granulomatous inflammation indicates chronic foreign-body or infectious granulomas.";
      qChanged = true;
    } else if (q.id === "prosthodontics-implants-679") {
      q.question = "During recording of eccentric records and border movements for complete denture fabrication, which muscle is primarily responsible for the forward protrusion of the mandible?";
      q.options = [
        "Lateral pterygoid muscle",
        "Temporalis muscle",
        "Masseter muscle",
        "Medial pterygoid muscle"
      ];
      q.correctAnswer = 0;
      q.explanation = "The lateral pterygoid muscle (specifically bilateral contraction of the inferior heads) is the primary muscle responsible for the forward protrusion of the mandible during border movements. The temporalis elevates and retracts the mandible, while the masseter and medial pterygoid muscles are primarily elevators that close the jaw in centric relation.";
      qChanged = true;
    } else if (q.id === "pharmacology-anesthesia-1813") {
      q.question = "Which of the following statements MOST accurately describes the role of the American Dental Association (ADA) in US dentistry?";
      q.options = [
        "The ADA is the federal regulatory body responsible for issuing dental licenses in each state.",
        "The ADA is a national professional organization representing US dentists and establishing voluntary standards and guidelines.",
        "The ADA directly enforces disciplinary actions and revokes licenses for professional misconduct.",
        "The ADA mandates nationwide fixed fee schedules for all clinical dental procedures."
      ];
      q.correctAnswer = 1;
      q.explanation = "The American Dental Association (ADA) is the premier national voluntary professional organization representing dentists in the United States. It advocates for public oral health, establishes ethical guidelines through the ADA Code of Ethics, and provides clinical recommendations, but it is not a government or regulatory agency. State dental boards hold statutory legal authority for licensing and disciplinary actions, and the ADA does not set mandatory fee schedules.";
      qChanged = true;
    } else if (q.id === "patient-management-ethics-373") {
      q.question = "A patient files a formal complaint against a dentist with the state dental board. What is the primary statutory mission of the board in this situation?";
      q.options = [
        "To provide legal representation for the patient during the complaint process.",
        "To provide legal defense for the dentist against the patient's allegations.",
        "To investigate the complaint thoroughly to determine if professional misconduct or violation of the dental practice act occurred and protect public safety.",
        "To mediate a financial settlement and fee refund between the patient and the dentist."
      ];
      q.correctAnswer = 2;
      q.explanation = "The primary statutory mandate of state dental boards is to protect the health, safety, and welfare of the public. When a complaint is filed, the board investigates whether the licensee violated the state dental practice act, minimum standards of clinical care, or ethical codes, and enforces disciplinary sanctions if warranted. State dental boards do not represent either party legally or negotiate monetary settlements.";
      qChanged = true;
    } else if (q.id === "patient-management-ethics-241") {
      q.question = "A dentist is retiring and closing their private practice. Under HIPAA guidelines and most US state dental board regulations, what is the widely recognized minimum retention period for adult patient dental records from the date of the last treatment entry?";
      q.options = [
        "2 years",
        "4 years",
        "7 years",
        "25 years"
      ];
      q.correctAnswer = 2;
      q.explanation = "Under HIPAA regulations and the vast majority of US state dental practice acts, adult dental records must be retained for a minimum of 7 years from the date of the last treatment entry (with pediatric records kept for 7 years or until the patient reaches the age of majority plus the state statute of limitations). Records must be securely stored or transferred to another custodian upon retirement.";
      qChanged = true;
    } else if (q.id === "pharmacology-anesthesia-1837") {
      q.question = "What is the primary role of the American Dental Association (ADA) in the United States healthcare system?";
      q.options = [
        "To regulate the practice of dentistry and issue licenses to practitioners in each US state.",
        "To advocate for the dental profession, promote oral health for the public, and advance dental science and education.",
        "To directly manage and administer federal dental Medicaid and Medicare programs.",
        "To establish mandatory nationwide fee schedules for all private dental clinics."
      ];
      q.correctAnswer = 1;
      q.explanation = "The American Dental Association (ADA) is the premier national voluntary professional organization representing dentists in the United States. Its primary roles include advocating for the dental profession, promoting public oral health, providing clinical practice guidelines, and supporting dental research and education. Regulation and licensing are state-level responsibilities governed by individual State Dental Boards, not the ADA. The ADA also does not administer federal Medicaid programs or mandate fee schedules.";
      qChanged = true;
    }

    const oldQ = q.question;
    const newQ = transformText(q.question);
    if (oldQ !== newQ) {
      q.question = newQ;
      qChanged = true;
    }

    if (Array.isArray(q.options)) {
      for (let j = 0; j < q.options.length; j++) {
        const oldOpt = q.options[j];
        const newOpt = transformText(oldOpt);
        if (oldOpt !== newOpt) {
          q.options[j] = newOpt;
          qChanged = true;
        }
      }
    }

    const oldExp = q.explanation;
    const newExp = transformText(q.explanation);
    if (oldExp !== newExp) {
      q.explanation = newExp;
      qChanged = true;
    }

    if (qChanged) {
      modifiedQuestions++;
      fileChanged = true;
    }
  }

  if (fileChanged) {
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), "utf8");
    modifiedFiles++;
    console.log(`Updated ${entry.id}.json`);
  }
}

console.log(`\nTransformation complete:`);
console.log(`- Files updated: ${modifiedFiles}`);
console.log(`- Questions updated: ${modifiedQuestions}`);
