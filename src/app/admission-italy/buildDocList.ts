import type { DiplomaLevel, GapDocType } from "./types";

export interface DocDef {
  id: string;
  name: string;
  hint: string;
  showLanguage: boolean;
  extraField?: "expiryDate" | "certName";
}

const ALWAYS_DOCS: DocDef[] = [
  {
    id: "photo",
    name: "Passport photo",
    hint: "Recent, white background · JPG",
    showLanguage: false,
  },
  {
    id: "passport",
    name: "Passport",
    hint: "All pages · PDF or JPG",
    showLanguage: false,
    extraField: "expiryDate",
  },
  {
    id: "cv",
    name: "CV / Résumé",
    hint: "Europass format preferred · PDF",
    showLanguage: true,
  },
  {
    id: "lang",
    name: "Language certificate",
    hint: "",
    showLanguage: true,
    extraField: "certName",
  },
  {
    id: "ddv",
    name: "Dichiarazione di Valore",
    hint: "Issued by Italian consulate · PDF",
    showLanguage: true,
  },
];

const BAC_DOCS_BAC_ONLY: DocDef[] = [
  {
    id: "bac_dip",
    name: "Baccalauréat diploma",
    hint: "Official certificate · PDF",
    showLanguage: false,
  },
  {
    id: "bac_tr",
    name: "Bac — transcript 3ème année secondaire",
    hint: "Official grades · PDF",
    showLanguage: false,
  },
];

const BAC_DOCS_HIGHER: DocDef[] = [
  {
    id: "bac_dip",
    name: "Baccalauréat diploma",
    hint: "Official certificate · PDF",
    showLanguage: false,
  },
  {
    id: "bac_tr",
    name: "Bac — transcript",
    hint: "Official grades · PDF",
    showLanguage: false,
  },
];

const LICENCE_DOCS: DocDef[] = [
  {
    id: "lic_dip",
    name: "Licence diploma",
    hint: "Official certificate · PDF",
    showLanguage: false,
  },
  {
    id: "lic_tr1",
    name: "Licence — transcript year 1",
    hint: "Official grades · PDF",
    showLanguage: false,
  },
  {
    id: "lic_tr2",
    name: "Licence — transcript year 2",
    hint: "Official grades · PDF",
    showLanguage: false,
  },
  {
    id: "lic_tr3",
    name: "Licence — transcript year 3",
    hint: "Official grades · PDF",
    showLanguage: false,
  },
];

const MASTER_DOCS: DocDef[] = [
  {
    id: "mas_dip",
    name: "Master / Ingénieur diploma",
    hint: "Official certificate · PDF",
    showLanguage: false,
  },
  {
    id: "mas_tr1",
    name: "Master — transcript year 1",
    hint: "Official grades · PDF",
    showLanguage: false,
  },
  {
    id: "mas_tr2",
    name: "Master — transcript year 2",
    hint: "Official grades · PDF",
    showLanguage: false,
  },
];

const PHD_DOCS: DocDef[] = [
  {
    id: "phd_dip",
    name: "PhD / Doctorat diploma",
    hint: "Official certificate · PDF",
    showLanguage: false,
  },
];

const GAP_DOC_MAP: Record<Exclude<GapDocType, "No document">, DocDef> = {
  "Internship / Stage": {
    id: "gap_stage",
    name: "Internship / Stage certificate",
    hint: "To justify your gap period · PDF",
    showLanguage: true,
  },
  "Work certificate": {
    id: "gap_work",
    name: "Work certificate",
    hint: "To justify your gap period · PDF",
    showLanguage: true,
  },
  "Training / Formation": {
    id: "gap_training",
    name: "Training / Formation certificate",
    hint: "To justify your gap period · PDF",
    showLanguage: true,
  },
  "Other document": {
    id: "gap_other",
    name: "Supporting document (gap)",
    hint: "To justify your gap period · PDF",
    showLanguage: true,
  },
};

function diplomaDocs(diplomaLevel: DiplomaLevel): DocDef[] {
  switch (diplomaLevel) {
    case "Baccalauréat":
      return [...BAC_DOCS_BAC_ONLY];
    case "Licence (Bachelor's)":
      return [...BAC_DOCS_HIGHER, ...LICENCE_DOCS];
    case "Master":
    case "Ingénieur":
      return [...BAC_DOCS_HIGHER, ...LICENCE_DOCS, ...MASTER_DOCS];
    case "Doctorat":
    case "PhD":
      return [...BAC_DOCS_HIGHER, ...LICENCE_DOCS, ...MASTER_DOCS, ...PHD_DOCS];
    default:
      return [];
  }
}

function gapDocs(hasGap: boolean, gapDocTypes: GapDocType[]): DocDef[] {
  if (!hasGap) return [];
  if (gapDocTypes.includes("No document") || gapDocTypes.length === 0) return [];

  return gapDocTypes
    .filter((t): t is Exclude<GapDocType, "No document"> => t !== "No document")
    .map((t) => GAP_DOC_MAP[t]);
}

export function buildDocList(
  diplomaLevel: DiplomaLevel,
  hasGap: boolean,
  gapDocTypes: GapDocType[]
): DocDef[] {
  return [...ALWAYS_DOCS, ...diplomaDocs(diplomaLevel), ...gapDocs(hasGap, gapDocTypes)];
}
