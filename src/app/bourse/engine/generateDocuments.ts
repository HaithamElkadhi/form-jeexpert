import { DOCUMENT_CATALOG, type DocumentCatalogEntry } from "../catalog";
import {
  APOSTILLE_NOTE,
  DEFAULT_PREPARATION,
  type AcademicYear,
  type BankAccountDetail,
  type BourseFormData,
  type FatherEmployment,
  type GeneratedDocument,
  type MotherEmployment,
  type SiblingSituation,
  type StudentIncomeOrigin,
} from "../types";
import { formatYears, getEconomicYears } from "./years";

type DraftDoc = Omit<GeneratedDocument, "id"> & { dedupeKey: string };

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function preparationFor(entry: DocumentCatalogEntry): string {
  if (!entry.translationDefault && entry.apostilleDefault === "no") {
    return "Original ou copie officielle, et scan PDF lisible.";
  }
  if (entry.apostilleDefault === "verify") {
    return `${DEFAULT_PREPARATION} ${APOSTILLE_NOTE}`;
  }
  return DEFAULT_PREPARATION;
}

function makeDoc(opts: {
  code: string;
  personId: string;
  personLabel: string;
  years: number[];
  sourceRule: string;
  institutionOverride?: string;
  nameOverride?: string;
  requiredInfoOverride?: string;
}): DraftDoc {
  const entry = DOCUMENT_CATALOG[opts.code];
  if (!entry) {
    throw new Error(`Unknown document code: ${opts.code}`);
  }
  const years = entry.requiresYear ? opts.years : [];
  const yearsPart = years.length > 0 ? years.join("_") : "na";
  const institution = opts.institutionOverride ?? entry.institution;
  return {
    dedupeKey: `${opts.code}_${opts.personId}_${yearsPart}_${institution}`,
    documentCode: opts.code,
    documentName: opts.nameOverride ?? entry.name,
    personId: opts.personId,
    personLabel: opts.personLabel,
    institution,
    years,
    yearsLabel: formatYears(years),
    instructions: preparationFor(entry),
    requiredInfo: opts.requiredInfoOverride ?? entry.requiredInfo ?? "",
    required: true,
    status: "to_request",
    sourceRule: opts.sourceRule,
    note: "",
  };
}

function dedupe(docs: DraftDoc[]): GeneratedDocument[] {
  const seen = new Set<string>();
  const result: GeneratedDocument[] = [];
  for (const doc of docs) {
    if (seen.has(doc.dedupeKey)) continue;
    seen.add(doc.dedupeKey);
    const { dedupeKey: _, ...rest } = doc;
    result.push({ ...rest, id: uid("doc") });
  }
  return result;
}

function isFatherDeceased(data: BourseFormData): boolean {
  return (
    data.fatherEmployment === "deceased" ||
    data.parentsStatus === "father_deceased" ||
    data.parentsStatus === "both_deceased"
  );
}

function isMotherDeceased(data: BourseFormData): boolean {
  return (
    data.motherEmployment === "deceased" ||
    data.parentsStatus === "mother_deceased" ||
    data.parentsStatus === "both_deceased"
  );
}

function addBaseDocs(out: DraftDoc[]) {
  out.push(
    makeDoc({
      code: "DOC_PASSPORT",
      personId: "student",
      personLabel: "Étudiant",
      years: [],
      sourceRule: "base.passport",
    })
  );
  out.push(
    makeDoc({
      code: "DOC_CODICE_FISCALE",
      personId: "student",
      personLabel: "Étudiant",
      years: [],
      sourceRule: "base.codice_fiscale",
    })
  );
  out.push(
    makeDoc({
      code: "DOC_ADMISSION_LETTER",
      personId: "student",
      personLabel: "Étudiant",
      years: [],
      sourceRule: "base.admission",
    })
  );
  out.push(
    makeDoc({
      code: "TUN_FAMILY_RECORD",
      personId: "household",
      personLabel: "Foyer familial",
      years: [],
      sourceRule: "base.family_record",
    })
  );
}

function addParentsStatusDocs(data: BourseFormData, out: DraftDoc[]) {
  switch (data.parentsStatus) {
    case "separated":
      out.push(
        makeDoc({
          code: "TUN_SEPARATION_JUDGMENT",
          personId: "parents",
          personLabel: "Parents",
          years: [],
          sourceRule: "parents.status=separated",
        })
      );
      break;
    case "divorced":
      out.push(
        makeDoc({
          code: "TUN_DIVORCE_JUDGMENT",
          personId: "parents",
          personLabel: "Parents",
          years: [],
          sourceRule: "parents.status=divorced",
        })
      );
      out.push(
        makeDoc({
          code: "TUN_NON_APPEAL",
          personId: "parents",
          personLabel: "Parents",
          years: [],
          sourceRule: "parents.status=divorced",
        })
      );
      break;
    case "father_deceased":
      out.push(
        makeDoc({
          code: "TUN_DEATH_EXTRACT",
          personId: "father",
          personLabel: "Père",
          years: [],
          sourceRule: "parents.status=father_deceased",
        })
      );
      break;
    case "mother_deceased":
      out.push(
        makeDoc({
          code: "TUN_DEATH_EXTRACT",
          personId: "mother",
          personLabel: "Mère",
          years: [],
          sourceRule: "parents.status=mother_deceased",
        })
      );
      break;
    case "both_deceased":
      out.push(
        makeDoc({
          code: "TUN_DEATH_EXTRACT",
          personId: "father",
          personLabel: "Père",
          years: [],
          sourceRule: "parents.status=both_deceased",
        })
      );
      out.push(
        makeDoc({
          code: "TUN_DEATH_EXTRACT",
          personId: "mother",
          personLabel: "Mère",
          years: [],
          sourceRule: "parents.status=both_deceased",
        })
      );
      out.push(
        makeDoc({
          code: "TUN_GUARDIANSHIP",
          personId: "student",
          personLabel: "Étudiant",
          years: [],
          sourceRule: "parents.status=both_deceased → tutelle si applicable",
        })
      );
      break;
    default:
      break;
  }
}

function addEmploymentDocs(
  status: FatherEmployment | MotherEmployment | "",
  personId: string,
  personLabel: string,
  years: number[],
  out: DraftDoc[],
  isDeceasedAlreadyCovered: boolean
) {
  if (!status) return;

  if (status === "deceased") {
    if (!isDeceasedAlreadyCovered) {
      out.push(
        makeDoc({
          code: "TUN_DEATH_EXTRACT",
          personId,
          personLabel,
          years: [],
          sourceRule: `${personId}.employment=deceased`,
        })
      );
    }
    return;
  }

  if (status === "employee") {
    out.push(
      makeDoc({
        code: "TUN_SALARY_TAX_WITHHOLDING",
        personId,
        personLabel,
        years,
        sourceRule: `${personId}.employment=employee`,
      })
    );
    out.push(
      makeDoc({
        code: "TUN_SALARY_CERTIFICATE",
        personId,
        personLabel,
        years,
        sourceRule: `${personId}.employment=employee`,
      })
    );
    return;
  }

  if (status === "retired") {
    out.push(
      makeDoc({
        code: "TUN_PENSION_BENEFIT",
        personId,
        personLabel,
        years,
        sourceRule: `${personId}.employment=retired`,
      })
    );
    out.push(
      makeDoc({
        code: "TUN_PENSION_STATEMENT",
        personId,
        personLabel,
        years,
        sourceRule: `${personId}.employment=retired`,
      })
    );
    out.push(
      makeDoc({
        code: "TUN_PENSION_TAX_WITHHOLDING",
        personId,
        personLabel,
        years,
        sourceRule: `${personId}.employment=retired`,
      })
    );
    return;
  }

  if (status === "self_employed" || status === "merchant") {
    out.push(
      makeDoc({
        code: "TUN_DECLARED_INCOME",
        personId,
        personLabel,
        years,
        sourceRule: `${personId}.employment=${status}`,
      })
    );
    out.push(
      makeDoc({
        code: "TUN_RNE_EXTRACT",
        personId,
        personLabel,
        years: [],
        sourceRule: `${personId}.employment=${status}`,
      })
    );
    return;
  }

  if (status === "farmer") {
    out.push(
      makeDoc({
        code: "TUN_DECLARED_INCOME",
        personId,
        personLabel,
        years,
        sourceRule: `${personId}.employment=farmer`,
      })
    );
    out.push(
      makeDoc({
        code: "TUN_AGRICULTURAL_LAND",
        personId,
        personLabel,
        years,
        sourceRule: `${personId}.employment=farmer`,
      })
    );
    out.push(
      makeDoc({
        code: "TUN_PROPERTY_CERTIFICATE",
        personId,
        personLabel,
        years,
        sourceRule: `${personId}.employment=farmer → terrains`,
        nameOverride: "Actes ou certificats de propriété des terrains agricoles",
      })
    );
    return;
  }

  if (status === "unemployed") {
    out.push(
      makeDoc({
        code: "TUN_NON_IMPOSITION",
        personId,
        personLabel,
        years,
        sourceRule: `${personId}.employment=unemployed`,
      })
    );
    out.push(
      makeDoc({
        code: "TUN_UNEMPLOYMENT_CERT",
        personId,
        personLabel,
        years: [],
        sourceRule: `${personId}.employment=unemployed`,
      })
    );
    return;
  }

  if (status === "inactive" || status === "homemaker") {
    out.push(
      makeDoc({
        code: "TUN_NON_IMPOSITION",
        personId,
        personLabel,
        years,
        sourceRule: `${personId}.employment=${status}`,
      })
    );
  }
}

function addStudentIncomeDocs(data: BourseFormData, years: number[], out: DraftDoc[]) {
  if (data.studentHasIncome === "no") {
    out.push(
      makeDoc({
        code: "TUN_NON_IMPOSITION",
        personId: "student",
        personLabel: "Étudiant",
        years,
        sourceRule: "student.hasIncome=no",
      })
    );
    return;
  }

  if (data.studentHasIncome !== "yes") return;

  const origins = new Set(data.studentIncomeOrigins);
  if (origins.has("salary")) {
    out.push(
      makeDoc({
        code: "TUN_SALARY_CERTIFICATE",
        personId: "student",
        personLabel: "Étudiant",
        years,
        sourceRule: "student.income=salary",
      })
    );
    out.push(
      makeDoc({
        code: "TUN_SALARY_TAX_WITHHOLDING",
        personId: "student",
        personLabel: "Étudiant",
        years,
        sourceRule: "student.income=salary",
      })
    );
  }
  if (origins.has("self_employed")) {
    out.push(
      makeDoc({
        code: "TUN_DECLARED_INCOME",
        personId: "student",
        personLabel: "Étudiant",
        years,
        sourceRule: "student.income=self_employed",
      })
    );
  }
  if (origins.has("pension")) {
    out.push(
      makeDoc({
        code: "TUN_PENSION_BENEFIT",
        personId: "student",
        personLabel: "Étudiant",
        years,
        sourceRule: "student.income=pension",
      })
    );
  }
  if (origins.has("scholarship")) {
    out.push(
      makeDoc({
        code: "TUN_SCHOLARSHIP_PROOF",
        personId: "student",
        personLabel: "Étudiant",
        years,
        sourceRule: "student.income=scholarship",
      })
    );
  }
  if (origins.has("foreign")) {
    out.push(
      makeDoc({
        code: "TUN_FOREIGN_INCOME",
        personId: "student",
        personLabel: "Étudiant",
        years,
        sourceRule: "student.income=foreign",
      })
    );
  }
  if (origins.has("other") || origins.size === 0) {
    out.push(
      makeDoc({
        code: "TUN_OTHER_INCOME",
        personId: "student",
        personLabel: "Étudiant",
        years,
        sourceRule: "student.income=other",
      })
    );
  }
}

function addSiblingDocs(
  situation: SiblingSituation,
  index: number,
  years: number[],
  out: DraftDoc[]
) {
  const personId = `sibling_adult_${index + 1}`;
  const personLabel = `Frère/sœur majeur ${index + 1}`;
  switch (situation) {
    case "student":
      out.push(
        makeDoc({
          code: "TUN_SIBLING_STUDENT_PROOF",
          personId,
          personLabel,
          years,
          sourceRule: `${personId}.situation=student`,
        })
      );
      out.push(
        makeDoc({
          code: "TUN_NON_IMPOSITION",
          personId,
          personLabel,
          years,
          sourceRule: `${personId}.situation=student`,
        })
      );
      break;
    case "employee":
      out.push(
        makeDoc({
          code: "TUN_SALARY_CERTIFICATE",
          personId,
          personLabel,
          years,
          sourceRule: `${personId}.situation=employee`,
        })
      );
      out.push(
        makeDoc({
          code: "TUN_SALARY_TAX_WITHHOLDING",
          personId,
          personLabel,
          years,
          sourceRule: `${personId}.situation=employee`,
        })
      );
      break;
    case "self_employed":
      out.push(
        makeDoc({
          code: "TUN_DECLARED_INCOME",
          personId,
          personLabel,
          years,
          sourceRule: `${personId}.situation=self_employed`,
        })
      );
      break;
    case "retired":
      out.push(
        makeDoc({
          code: "TUN_PENSION_BENEFIT",
          personId,
          personLabel,
          years,
          sourceRule: `${personId}.situation=retired`,
        })
      );
      break;
    case "inactive":
    case "other":
    default:
      out.push(
        makeDoc({
          code: "TUN_NON_IMPOSITION",
          personId,
          personLabel,
          years,
          sourceRule: `${personId}.situation=${situation}`,
        })
      );
      break;
  }
}

function propertyPersonLabel(key: string): string {
  const map: Record<string, string> = {
    father: "Père",
    mother: "Mère",
    student: "Étudiant",
    sibling_adult: "Frère ou sœur majeur",
    other_household: "Autre membre du foyer",
  };
  return map[key] ?? key;
}

function addPropertyDocs(data: BourseFormData, years: number[], out: DraftDoc[]) {
  const none = data.propertyOwners.includes("none");
  const owners = new Set(data.propertyOwners.filter((o) => o !== "none"));

  const candidates: string[] = ["father", "mother", "student"];
  if (Number(data.siblingsAdultCount) > 0 || owners.has("sibling_adult")) {
    candidates.push("sibling_adult");
  }
  if (owners.has("other_household")) {
    candidates.push("other_household");
  }

  if (none) {
    for (const personId of ["father", "mother", "student"]) {
      if (personId === "father" && isFatherDeceased(data)) continue;
      if (personId === "mother" && isMotherDeceased(data)) continue;
      out.push(
        makeDoc({
          code: "TUN_NON_PROPERTY_CERTIFICATE",
          personId,
          personLabel: propertyPersonLabel(personId),
          years,
          sourceRule: "property.owners=none",
        })
      );
    }
    if (Number(data.siblingsAdultCount) > 0) {
      out.push(
        makeDoc({
          code: "TUN_NON_PROPERTY_CERTIFICATE",
          personId: "sibling_adult",
          personLabel: "Frère ou sœur majeur",
          years,
          sourceRule: "property.owners=none → majeurs",
        })
      );
    }
    return;
  }

  for (const personId of candidates) {
    if (personId === "father" && isFatherDeceased(data)) continue;
    if (personId === "mother" && isMotherDeceased(data)) continue;

    if (owners.has(personId as never)) {
      out.push(
        makeDoc({
          code: "TUN_PROPERTY_CERTIFICATE",
          personId,
          personLabel: propertyPersonLabel(personId),
          years,
          sourceRule: `property.owner=${personId}`,
        })
      );
      const detail = data.propertyDetails.find((p) => p.ownerId === personId);
      if (detail && (detail.registered === "no" || detail.registered === "unknown")) {
        out.push(
          makeDoc({
            code: "TUN_UNREGISTERED_DEED",
            personId,
            personLabel: propertyPersonLabel(personId),
            years: [],
            sourceRule: `property.owner=${personId}.registered=${detail.registered}`,
          })
        );
      }
    } else if (personId === "father" || personId === "mother" || personId === "student") {
      out.push(
        makeDoc({
          code: "TUN_NON_PROPERTY_CERTIFICATE",
          personId,
          personLabel: propertyPersonLabel(personId),
          years,
          sourceRule: `property.owner!=${personId}`,
        })
      );
    }
  }
}

function isPostal(institution: string): boolean {
  return /poste/i.test(institution);
}

function addBankDocsForAccount(
  account: BankAccountDetail,
  years: number[],
  out: DraftDoc[]
) {
  const labelMap: Record<string, string> = {
    father: "Père",
    mother: "Mère",
    student: "Étudiant",
    sibling_adult: "Frère ou sœur majeur",
    other_adult: "Autre membre majeur",
  };
  const ownerLabel = labelMap[account.ownerId] ?? account.ownerId;
  const institutionName = account.institution.trim() || "Banque / Poste Tunisienne";
  const postal = isPostal(institutionName);
  const statementsCode = postal ? "TUN_POSTAL_STATEMENTS" : "TUN_BANK_STATEMENTS";
  const where = postal
    ? "Poste Tunisienne"
    : `Agence bancaire (${institutionName}) ou espace client bancaire officiel`;

  out.push(
    makeDoc({
      code: statementsCode,
      personId: account.ownerId,
      personLabel: ownerLabel,
      years,
      sourceRule: `bank.account=${account.id}`,
      institutionOverride: where,
    })
  );
  out.push(
    makeDoc({
      code: "TUN_BALANCE_DEC31",
      personId: account.ownerId,
      personLabel: ownerLabel,
      years,
      sourceRule: `bank.account=${account.id}`,
      institutionOverride: where,
    })
  );
  out.push(
    makeDoc({
      code: "TUN_AVERAGE_BALANCE",
      personId: account.ownerId,
      personLabel: ownerLabel,
      years,
      sourceRule: `bank.account=${account.id}`,
      institutionOverride: where,
    })
  );

  if (account.isClosed) {
    out.push(
      makeDoc({
        code: "TUN_ACCOUNT_CLOSURE",
        personId: account.ownerId,
        personLabel: ownerLabel,
        years: [],
        sourceRule: `bank.account=${account.id}.closed`,
        institutionOverride: where,
        requiredInfoOverride: account.closingYear
          ? `Compte fermé en ${account.closingYear}. Inclure les relevés du 1er janvier à la date de clôture et le solde à la date de clôture.`
          : undefined,
      })
    );
  }
}

function addBankDocs(data: BourseFormData, years: number[], out: DraftDoc[]) {
  if (data.bankOwners.includes("none")) return;

  for (const account of data.bankAccounts) {
    if (account.ownerId === "father" && isFatherDeceased(data)) continue;
    if (account.ownerId === "mother" && isMotherDeceased(data)) continue;
    addBankDocsForAccount(account, years, out);
  }
}

/**
 * Moteur de règles — séparé de l’UI.
 * Génère uniquement les documents correspondant aux réponses.
 */
export function generateDocuments(data: BourseFormData): GeneratedDocument[] {
  if (!data.academicYear) return [];

  const { yearOld, yearRecent } = getEconomicYears(data.academicYear as AcademicYear);
  const years = [yearOld, yearRecent];
  const out: DraftDoc[] = [];

  addBaseDocs(out);
  addParentsStatusDocs(data, out);

  addEmploymentDocs(
    data.fatherEmployment,
    "father",
    "Père",
    years,
    out,
    data.parentsStatus === "father_deceased" || data.parentsStatus === "both_deceased"
  );
  addEmploymentDocs(
    data.motherEmployment,
    "mother",
    "Mère",
    years,
    out,
    data.parentsStatus === "mother_deceased" || data.parentsStatus === "both_deceased"
  );

  addStudentIncomeDocs(data, years, out);

  data.adultSiblings.forEach((sibling, index) => {
    addSiblingDocs(sibling.situation, index, years, out);
  });

  addPropertyDocs(data, years, out);
  addBankDocs(data, years, out);

  return dedupe(out);
}

export type { StudentIncomeOrigin };
