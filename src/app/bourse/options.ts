import type {
  AcademicYear,
  BankOwnerKey,
  DocumentStatus,
  FatherEmployment,
  HouseholdMemberKey,
  MotherEmployment,
  ParentsStatus,
  PropertyOwnerKey,
  SiblingSituation,
  StudentIncomeOrigin,
} from "./types";

export const ACADEMIC_YEARS: AcademicYear[] = [
  "2025/2026",
  "2026/2027",
  "2027/2028",
  "2028/2029",
];

export const HOUSEHOLD_OPTIONS: { value: HouseholdMemberKey; label: string }[] = [
  { value: "father", label: "Père" },
  { value: "mother", label: "Mère" },
  { value: "brothers", label: "Frères" },
  { value: "sisters", label: "Sœurs" },
  { value: "spouse", label: "Conjoint" },
  { value: "children", label: "Enfants" },
  { value: "other", label: "Autre personne" },
];

export const PARENTS_STATUS_OPTIONS: { value: ParentsStatus; label: string }[] = [
  { value: "married_together", label: "Mariés et vivant ensemble" },
  { value: "separated", label: "Séparés" },
  { value: "divorced", label: "Divorcés" },
  { value: "father_deceased", label: "Père décédé" },
  { value: "mother_deceased", label: "Mère décédée" },
  { value: "both_deceased", label: "Les deux parents sont décédés" },
  { value: "other", label: "Autre situation" },
];

export const FATHER_EMPLOYMENT_OPTIONS: { value: FatherEmployment; label: string }[] = [
  { value: "employee", label: "Salarié" },
  { value: "retired", label: "Retraité" },
  { value: "self_employed", label: "Indépendant" },
  { value: "merchant", label: "Commerçant" },
  { value: "farmer", label: "Agriculteur" },
  { value: "unemployed", label: "Chômeur" },
  { value: "inactive", label: "Sans activité" },
  { value: "deceased", label: "Décédé" },
];

export const MOTHER_EMPLOYMENT_OPTIONS: { value: MotherEmployment; label: string }[] = [
  { value: "employee", label: "Salariée" },
  { value: "retired", label: "Retraitée" },
  { value: "self_employed", label: "Indépendante" },
  { value: "merchant", label: "Commerçante" },
  { value: "farmer", label: "Agricultrice" },
  { value: "unemployed", label: "Chômeuse" },
  { value: "homemaker", label: "Femme au foyer" },
  { value: "inactive", label: "Sans activité" },
  { value: "deceased", label: "Décédée" },
];

export const SIBLING_SITUATION_OPTIONS: { value: SiblingSituation; label: string }[] = [
  { value: "student", label: "Étudiant" },
  { value: "employee", label: "Salarié" },
  { value: "self_employed", label: "Indépendant" },
  { value: "inactive", label: "Sans activité" },
  { value: "retired", label: "Retraité" },
  { value: "other", label: "Autre situation" },
];

export const STUDENT_INCOME_OPTIONS: { value: StudentIncomeOrigin; label: string }[] = [
  { value: "salary", label: "Salaire" },
  { value: "self_employed", label: "Activité indépendante" },
  { value: "pension", label: "Pension" },
  { value: "scholarship", label: "Bourse" },
  { value: "foreign", label: "Revenu étranger" },
  { value: "other", label: "Autre" },
];

export const PROPERTY_OWNER_OPTIONS: { value: PropertyOwnerKey; label: string }[] = [
  { value: "father", label: "Père" },
  { value: "mother", label: "Mère" },
  { value: "student", label: "Étudiant" },
  { value: "sibling_adult", label: "Frère ou sœur majeur" },
  { value: "other_household", label: "Autre membre du foyer" },
  { value: "none", label: "Personne" },
];

export const BANK_OWNER_OPTIONS: { value: BankOwnerKey; label: string }[] = [
  { value: "father", label: "Père" },
  { value: "mother", label: "Mère" },
  { value: "student", label: "Étudiant" },
  { value: "sibling_adult", label: "Frère ou sœur majeur" },
  { value: "other_adult", label: "Autre membre majeur" },
  { value: "none", label: "Personne" },
];

export const DOCUMENT_STATUS_OPTIONS: { value: DocumentStatus; label: string }[] = [
  { value: "to_request", label: "À demander" },
  { value: "requested", label: "Demandé" },
  { value: "received", label: "Reçu" },
  { value: "to_translate", label: "À traduire" },
  { value: "to_apostille", label: "À apostiller" },
  { value: "complete", label: "Complet" },
  { value: "unavailable", label: "Document non disponible" },
  { value: "needs_verification", label: "Vérification nécessaire" },
];

export function labelOf<T extends string>(
  options: { value: T; label: string }[],
  value: T | "" | undefined
): string {
  if (!value) return "—";
  return options.find((o) => o.value === value)?.label ?? value;
}
