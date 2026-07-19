export type ProgramType =
  | "Laurea Magistrale (Master's)"
  | "Laurea Triennale (Bachelor's)"
  | "Dottorato (PhD)"
  | "";

export type DiplomaLevel =
  | "Baccalauréat"
  | "Licence (Bachelor's)"
  | "Master"
  | "Ingénieur"
  | "Doctorat"
  | "PhD"
  | "";

export type ScoreFormat =
  | "Mention (Très Bien / Bien / Assez Bien / Passable)"
  | "Score /20"
  | "Score /100"
  | "GPA /4"
  | "Pass / Fail"
  | "";

export type GapDocType =
  | "Internship / Stage"
  | "Work certificate"
  | "Training / Formation"
  | "Other document"
  | "No document";

export type DocLanguage = "EN" | "FR" | "AR" | "Other" | "";

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  programType: ProgramType;
}

export interface AcademicData {
  diplomaLevel: DiplomaLevel;
  fieldOfStudy: string;
  scoreFormat: ScoreFormat;
  scoreValue: string;
  yearObtained: string;
  yearsExperience: string;
  gapYears: number;
  gapDescription: string;
  gapDocTypes: GapDocType[];
}

export interface DocumentEntry {
  file: File | null;
  language: DocLanguage;
  expiryDate?: string;
  certName?: string;
}

export type DocumentsState = Record<string, DocumentEntry>;

export interface AdmissionFormData {
  profile: ProfileData;
  academic: AcademicData;
  documents: DocumentsState;
}

export const initialAdmissionData: AdmissionFormData = {
  profile: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    programType: "",
  },
  academic: {
    diplomaLevel: "",
    fieldOfStudy: "",
    scoreFormat: "",
    scoreValue: "",
    yearObtained: "",
    yearsExperience: "0",
    gapYears: 0,
    gapDescription: "",
    gapDocTypes: [],
  },
  documents: {},
};

export type AdmissionStep = 1 | 2 | 3 | "success";
