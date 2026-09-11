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

/** Always sent to Airtable as Score /20. */
export const FIXED_SCORE_FORMAT = "Score /20" as const;

export type GapDocType =
  | "Internship / Stage"
  | "Work certificate"
  | "Training / Formation"
  | "Other document"
  | "No document";

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
  scoreValue: string;
  yearObtained: string;
  yearsExperience: string;
  gapYears: number;
  gapDescription: string;
  gapDocTypes: GapDocType[];
}

export interface DocumentEntry {
  file: File | null;
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
