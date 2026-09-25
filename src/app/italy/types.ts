export interface AcademicRecord {
  diploma: string;
  score: string;
  maxScore: string;
}

export interface LanguageRecord {
  language: string;
  level: string;
  certificate: string;
}

export interface ItalyFormData {
  // About you
  firstName: string;
  lastName: string;
  email: string;
  phoneCountry: string;
  phone: string;
  birthday: string;
  address: string;
  nationality: string;
  howHeard: string;

  // Academic profile
  currentStatus: string;
  academicLevel: string;
  obtainedDiploma: string[];
  academicRecords: AcademicRecord[];
  fieldOfPreviousStudies: string;
  yearOfGraduation: string;
  currentOccupation: string;
  languages: string[];
  languageRecords: LanguageRecord[];

  // Study preferences
  targetDegreeLevel: string;
  intendedIntake: string;

  // CV
  cvFile: File | null;
}

export type UpdateField = <K extends keyof ItalyFormData>(
  key: K,
  value: ItalyFormData[K]
) => void;
