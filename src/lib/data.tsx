/* eslint-disable react-refresh/only-export-components */

import type { Topic } from "./types";
import { FileText, FlaskConical, Bone, Microscope, Atom, Bug, Scaling, X, Scissors, Smile, ShieldCheck, Biohazard } from 'lucide-react';
import type { ComponentProps } from 'react';

const Tooth = (props: ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9.34 2.126a2 2 0 0 1 3.32 0l3.832 4.053a4 4 0 0 1 .98 2.583V16a2 2 0 0 1-2 2h-1.14a2 2 0 0 0-1.789 1.106L12 21.11l-1.543-2.001a2 2 0 0 0-1.789-1.106H7.5a2 2 0 0 1-2-2v-7.238a4 4 0 0 1 .98-2.583L9.34 2.126Z" />
    <path d="M7 13h10" />
  </svg>
);

const ProsthodonticsIcon = (props: ComponentProps<'svg'>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M19.1,17.2l-3.2-3.2" />
        <path d="M14.2,12.3l-1.9,1.9" />
        <path d="M12.3,14.2l-1.9,1.9" />
        <path d="M10.4,16.1l-3,3" />
        <path d="M18,22l-4.5-4.5" />
        <path d="M2.3,18.7l5-5" />
        <path d="M15.1,1.4c-0.3,0-0.5,0.1-0.7,0.2l-2.6,1.4c-0.3,0.2-0.5,0.5-0.5,0.9v2.8c0,0.4,0.2,0.8,0.5,0.9l2.6,1.4c0.4,0.2,0.9,0.2,1.3-0.1l2.5-1.5c0.3-0.2,0.5-0.5,0.5-0.9V4.2c0-0.4-0.2-0.8-0.5-0.9L16.2,1.8C15.8,1.5,15.5,1.4,15.1,1.4z" />
        <path d="M4.9,7.8C4.6,7.8,4.3,7.9,4.2,8l-2.6,1.4C1.2,9.6,1,9.9,1,10.3v2.8c0,0.4,0.2,0.8,0.5,0.9l2.6,1.4c0.4,0.2,0.9,0.2,1.3-0.1l2.5-1.5c0.3-0.2,0.5-0.5,0.5-0.9v-2.8c0-0.4-0.2-0.8-0.5-0.9L5.8,8.2C5.5,7.9,5.2,7.8,4.9,7.8z" />
    </svg>
);

export const topics: Topic[] = [
  { id: "operative-materials", name: "Operative Dentistry & Dental Materials", icon: FileText },
  { id: "biochemistry-physiology", name: "Biochemistry & Physiology", icon: Atom },
  { id: "microbiology-immunology", name: "Microbiology & Immunology", icon: Bug },
  { id: "oral-pathology-medicine", name: "Oral Pathology & Oral Medicine", icon: Biohazard },
  { id: "periodontics", name: "Periodontics", icon: Scaling },
  { id: "oral-radiology", name: "Oral & Maxillofacial Radiology", icon: X },
  { id: "oral-surgery-emergencies", name: "Oral Surgery & Medical Emergencies", icon: Scissors },
  { id: "anatomical-sciences", name: "Anatomical Sciences", icon: Bone, isPremiumOnly: true },
  { id: "general-pathology", name: "General & Systemic Pathology", icon: Microscope, isPremiumOnly: true },
  { id: "pharmacology-anesthesia", name: "Pharmacology & Local Anesthesia", icon: FlaskConical, isPremiumOnly: true },
  { id: "endodontics", name: "Endodontics", icon: Tooth, isPremiumOnly: true },
  { id: "prosthodontics-implants", name: "Prosthodontics & Implantology", icon: ProsthodonticsIcon, isPremiumOnly: true },
  { id: "orthodontics-pedodontics", name: "Orthodontics & Pediatric Dentistry", icon: Smile, isPremiumOnly: true },
  { id: "patient-management-ethics", name: "Patient Management, Ethics & Infection Control", icon: ShieldCheck, isPremiumOnly: true },
];
