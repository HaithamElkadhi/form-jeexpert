export type AcademicYear = "2025/2026" | "2026/2027" | "2027/2028" | "2028/2029";

export type HouseholdMemberKey =
  | "father"
  | "mother"
  | "brothers"
  | "sisters"
  | "spouse"
  | "children"
  | "other";

export type ParentsStatus =
  | "married_together"
  | "separated"
  | "divorced"
  | "father_deceased"
  | "mother_deceased"
  | "both_deceased"
  | "other";

export type FatherEmployment =
  | "employee"
  | "retired"
  | "self_employed"
  | "inactive"
  | "deceased";

export type MotherEmployment =
  | "employee"
  | "retired"
  | "self_employed"
  | "inactive"
  | "deceased";

export type SiblingSituation = "student" | "employee" | "scholarship" | "no_income";

export type StudentIncomeOrigin = "salary" | "scholarship";

export type PropertyOwnerKey =
  | "father"
  | "mother"
  | "student"
  | "sibling_adult"
  | "other_household"
  | "none";

export type BankOwnerKey =
  | "father"
  | "mother"
  | "student"
  | "sibling_adult"
  | "other_adult"
  | "none";

export type PropertyRegistered = "yes" | "no" | "unknown";

export interface AdultSibling {
  id: string;
  situation: SiblingSituation;
}

export interface PropertyDetail {
  ownerId: PropertyOwnerKey;
  registered: PropertyRegistered;
}

export interface BankAccountDetail {
  id: string;
  ownerId: Exclude<BankOwnerKey, "none">;
  institution: string;
  accountCount: string;
}

export interface BourseFormData {
  firstName: string;
  lastName: string;
  email: string;
  university: string;
  cityOrRegion: string;
  academicYear: AcademicYear | "";

  householdMembers: HouseholdMemberKey[];

  siblingsTotal: string;
  siblingsAdultCount: string;
  adultSiblings: AdultSibling[];

  parentsStatus: ParentsStatus | "";
  parentsStatusOther: string;

  fatherEmployment: FatherEmployment | "";
  motherEmployment: MotherEmployment | "";

  studentHasIncome: "yes" | "no" | "";
  studentIncomeOrigins: StudentIncomeOrigin[];

  propertyOwners: PropertyOwnerKey[];
  propertyDetails: PropertyDetail[];

  bankOwners: BankOwnerKey[];
  bankAccounts: BankAccountDetail[];
}

export const initialBourseData: BourseFormData = {
  firstName: "",
  lastName: "",
  email: "",
  university: "",
  cityOrRegion: "",
  academicYear: "",

  householdMembers: ["father", "mother"],

  siblingsTotal: "",
  siblingsAdultCount: "",
  adultSiblings: [],

  parentsStatus: "",
  parentsStatusOther: "",

  fatherEmployment: "",
  motherEmployment: "",

  studentHasIncome: "",
  studentIncomeOrigins: [],

  propertyOwners: [],
  propertyDetails: [],

  bankOwners: [],
  bankAccounts: [],
};

export type UpdateField = <K extends keyof BourseFormData>(
  key: K,
  value: BourseFormData[K]
) => void;

export interface GeneratedDocument {
  id: string;
  documentCode: string;
  documentName: string;
  personId: string;
  personLabel: string;
  institution: string;
  years: number[];
  requiredInfo: string;
  required: boolean;
  sourceRule: string;
  note: string;
}

export const GENERAL_RULE =
  "Sauf passeport, codice fiscale et lettre d’admission : original + traduction italienne jurée + apostille (si exigée) + scan PDF.";

export const DISCLAIMER =
  "Cette checklist est générée à partir des informations fournies par l’étudiant. Les exigences peuvent varier selon la région italienne, l’université, le CAF conventionné et le bando annuel. JeExpert doit vérifier la liste avant validation définitive.";
