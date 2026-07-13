export interface ItalyFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string;
  address: string;
  howHeard: string;
  lastAcademicLevel: string;
  lastDiploma: string;
  languages: string;
  entryLevel: string;
  preferredField: string;
  cvFile: File | null;
}

export type UpdateField = <K extends keyof ItalyFormData>(
  key: K,
  value: ItalyFormData[K]
) => void;
