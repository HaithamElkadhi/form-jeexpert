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
  | "merchant"
  | "farmer"
  | "unemployed"
  | "inactive"
  | "deceased";

export type MotherEmployment =
  | "employee"
  | "retired"
  | "self_employed"
  | "merchant"
  | "farmer"
  | "unemployed"
  | "homemaker"
  | "inactive"
  | "deceased";

export type SiblingSituation =
  | "student"
  | "employee"
  | "self_employed"
  | "inactive"
  | "retired"
  | "other";

export type StudentIncomeOrigin =
  | "salary"
  | "self_employed"
  | "pension"
  | "scholarship"
  | "foreign"
  | "other";

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

export type DocumentStatus =
  | "to_request"
  | "requested"
  | "received"
  | "to_translate"
  | "to_apostille"
  | "complete"
  | "unavailable"
  | "needs_verification";

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
  isClosed: boolean;
  openingYear: string;
  closingYear: string;
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
  yearsLabel: string;
  instructions: string;
  requiredInfo: string;
  required: boolean;
  status: DocumentStatus;
  sourceRule: string;
  note: string;
}

export const DEFAULT_PREPARATION =
  "Préparez l’original, une traduction complète en italien, l’apostille lorsque l’organisme régional l’exige, deux copies couleur et un scan PDF lisible.";

export const APOSTILLE_NOTE =
  "Apostille à prévoir, sauf confirmation contraire de l’organisme régional ou du CAF conventionné.";

export const DISCLAIMER =
  "Cette checklist est générée à partir des informations fournies par l’étudiant. Les exigences peuvent varier selon la région italienne, l’université, le CAF conventionné et le bando annuel. JeExpert doit vérifier la liste avant validation définitive.";
