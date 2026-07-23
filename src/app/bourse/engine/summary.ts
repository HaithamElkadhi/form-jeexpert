import { DOCUMENT_CATALOG } from "../catalog";
import {
  BANK_OWNER_OPTIONS,
  FATHER_EMPLOYMENT_OPTIONS,
  HOUSEHOLD_OPTIONS,
  labelOf,
  MOTHER_EMPLOYMENT_OPTIONS,
  PARENTS_STATUS_OPTIONS,
  PROPERTY_OWNER_OPTIONS,
  SIBLING_SITUATION_OPTIONS,
  STUDENT_INCOME_OPTIONS,
} from "../options";
import type { AcademicYear, BourseFormData } from "../types";
import { formatYears, getEconomicYears, yearsMention } from "./years";

export function buildSummary(data: BourseFormData): string {
  const academicYear = data.academicYear as AcademicYear;
  const years = academicYear ? getEconomicYears(academicYear) : null;

  const householdLabels = data.householdMembers
    .map((m) => labelOf(HOUSEHOLD_OPTIONS, m))
    .join(", ");

  const propertyOwners = data.propertyOwners.includes("none")
    ? "Personne"
    : data.propertyOwners.map((o) => labelOf(PROPERTY_OWNER_OPTIONS, o)).join(", ");

  const withoutProperty = buildWithoutPropertyLabels(data);

  const bankHolders = data.bankOwners.includes("none")
    ? "Personne"
    : data.bankOwners.map((o) => labelOf(BANK_OWNER_OPTIONS, o)).join(", ");

  const accountCount = data.bankAccounts.reduce(
    (sum, a) => sum + (Number(a.accountCount) || 1),
    0
  );
  const closedAccounts = data.bankAccounts.filter((a) => a.isClosed).length;

  const special = buildSpecialSituations(data);

  const adultSiblingsSummary =
    data.adultSiblings.length > 0
      ? data.adultSiblings
          .map((s, i) => `Frère/sœur majeur ${i + 1}: ${labelOf(SIBLING_SITUATION_OPTIONS, s.situation)}`)
          .join(" ; ")
      : "Aucun";

  const studentIncome =
    data.studentHasIncome === "yes"
      ? `Oui — ${data.studentIncomeOrigins.map((o) => labelOf(STUDENT_INCOME_OPTIONS, o)).join(", ")}`
      : data.studentHasIncome === "no"
        ? "Non"
        : "—";

  return [
    "ÉTUDIANT",
    `Nom et prénom : ${data.lastName} ${data.firstName}`.trim(),
    `Adresse e-mail : ${data.email}`,
    `Université : ${data.university}`,
    `Ville / région : ${data.cityOrRegion}`,
    `Année universitaire : ${data.academicYear || "—"}`,
    "",
    "FOYER FAMILIAL",
    `Membres du foyer : ${householdLabels || "—"}`,
    `Nombre de frères et sœurs : ${data.siblingsTotal || "0"}`,
    `Nombre de frères et sœurs majeurs : ${data.siblingsAdultCount || "0"}`,
    "",
    "SITUATION ÉCONOMIQUE",
    `Situation du père : ${labelOf(FATHER_EMPLOYMENT_OPTIONS, data.fatherEmployment)}`,
    `Situation de la mère : ${labelOf(MOTHER_EMPLOYMENT_OPTIONS, data.motherEmployment)}`,
    `Revenu de l’étudiant : ${studentIncome}`,
    `Autres membres majeurs : ${adultSiblingsSummary}`,
    "",
    "PATRIMOINE IMMOBILIER",
    `Propriétaires : ${propertyOwners || "—"}`,
    `Personnes sans propriété : ${withoutProperty}`,
    "",
    "COMPTES BANCAIRES",
    `Titulaires : ${bankHolders || "—"}`,
    `Nombre de comptes : ${data.bankOwners.includes("none") ? "0" : accountCount}`,
    `Comptes fermés : ${closedAccounts}`,
    "",
    "ANNÉES À PRÉPARER",
    `Année ancienne : ${years?.yearOld ?? "—"}`,
    `Année récente : ${years?.yearRecent ?? "—"}`,
    years && academicYear ? yearsMention(academicYear) : "",
    "",
    "SITUATIONS PARTICULIÈRES",
    `Divorce : ${special.divorce}`,
    `Séparation : ${special.separation}`,
    `Décès : ${special.death}`,
    `Autre : ${special.other}`,
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n");
}

function buildWithoutPropertyLabels(data: BourseFormData): string {
  if (data.propertyOwners.includes("none")) {
    return "Père, mère, étudiant (et majeurs du foyer le cas échéant)";
  }
  const owners = new Set(data.propertyOwners);
  const candidates: { key: PropertyOwnerCandidate; label: string }[] = [
    { key: "father", label: "Père" },
    { key: "mother", label: "Mère" },
    { key: "student", label: "Étudiant" },
  ];
  if (Number(data.siblingsAdultCount) > 0) {
    candidates.push({ key: "sibling_adult", label: "Frère/sœur majeur" });
  }
  const without = candidates.filter((c) => !owners.has(c.key)).map((c) => c.label);
  return without.length > 0 ? without.join(", ") : "—";
}

type PropertyOwnerCandidate = "father" | "mother" | "student" | "sibling_adult";

function buildSpecialSituations(data: BourseFormData) {
  const status = data.parentsStatus;
  return {
    divorce: status === "divorced" ? "Oui" : "Non",
    separation: status === "separated" ? "Oui" : "Non",
    death:
      status === "father_deceased" ||
      status === "mother_deceased" ||
      status === "both_deceased" ||
      data.fatherEmployment === "deceased" ||
      data.motherEmployment === "deceased"
        ? labelOf(PARENTS_STATUS_OPTIONS, status) !== "—"
          ? labelOf(PARENTS_STATUS_OPTIONS, status)
          : "Oui"
        : "Non",
    other:
      status === "other"
        ? data.parentsStatusOther || "Oui"
        : "Non",
  };
}

export function buildChecklistText(
  summary: string,
  documents: {
    documentName: string;
    personLabel: string;
    institution: string;
    yearsLabel: string;
    instructions: string;
    requiredInfo: string;
    status: string;
    note: string;
  }[],
  academicYear: string,
  disclaimer: string
): string {
  const blocks = documents.map((doc) => {
    const lines = [
      `Document : ${doc.documentName}`,
      `Pour : ${doc.personLabel}`,
      `Où : ${doc.institution}`,
      `Années : ${doc.yearsLabel}`,
      `Préparation : ${doc.instructions}`,
      `Statut : ${doc.status}`,
    ];
    if (doc.requiredInfo) lines.push(`Informations requises : ${doc.requiredInfo}`);
    if (doc.note) lines.push(`Note : ${doc.note}`);
    return lines.join("\n");
  });

  return [
    summary,
    "",
    "CHECKLIST PERSONNALISÉE",
    `Année universitaire : ${academicYear}`,
    "",
    ...blocks.flatMap((b, i) => (i === 0 ? [b] : ["", b])),
    "",
    disclaimer,
  ].join("\n");
}

export function documentsToCsv(
  documents: {
    documentCode: string;
    documentName: string;
    personLabel: string;
    institution: string;
    yearsLabel: string;
    instructions: string;
    status: string;
    required: boolean;
    note: string;
    sourceRule: string;
  }[]
): string {
  const header = [
    "code",
    "document",
    "personne",
    "organisme",
    "annees",
    "preparation",
    "statut",
    "obligatoire",
    "note",
    "regle",
  ];
  const rows = documents.map((d) =>
    [
      d.documentCode,
      d.documentName,
      d.personLabel,
      d.institution,
      d.yearsLabel,
      d.instructions,
      d.status,
      d.required ? "oui" : "non",
      d.note,
      d.sourceRule,
    ].map(csvEscape).join(",")
  );
  return [header.join(","), ...rows].join("\n");
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    to_request: "À demander",
    requested: "Demandé",
    received: "Reçu",
    to_translate: "À traduire",
    to_apostille: "À apostiller",
    complete: "Complet",
    unavailable: "Document non disponible",
    needs_verification: "Vérification nécessaire",
  };
  return map[status] ?? status;
}

export function catalogName(code: string): string {
  return DOCUMENT_CATALOG[code]?.name ?? code;
}

export { formatYears };
