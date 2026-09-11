import type { DiplomaLevel, GapDocType } from "./types";

export interface DocDef {
  id: string;
  name: string;
  hint: string;
  extraField?: "expiryDate" | "certName";
}

const ALWAYS_DOCS: DocDef[] = [
  {
    id: "photo",
    name: "Photo d'identité",
    hint: "Récente, fond blanc · JPG",
  },
  {
    id: "passport",
    name: "Passeport",
    hint: "Toutes les pages · PDF ou JPG",
    extraField: "expiryDate",
  },
  {
    id: "cv",
    name: "CV",
    hint: "Format Europass recommandé · PDF",
  },
  {
    id: "lang",
    name: "Certificat de langue",
    hint: "",
    extraField: "certName",
  },
  {
    id: "ddv",
    name: "Dichiarazione di Valore",
    hint: "Délivrée par le consulat italien · PDF",
  },
];

const BAC_DOCS_BAC_ONLY: DocDef[] = [
  {
    id: "bac_dip",
    name: "Diplôme du Baccalauréat",
    hint: "Certificat officiel · PDF",
  },
  {
    id: "bac_tr",
    name: "Relevé de notes Bac — 3ème année secondaire",
    hint: "Notes officielles · PDF",
  },
];

const BAC_DOCS_HIGHER: DocDef[] = [
  {
    id: "bac_dip",
    name: "Diplôme du Baccalauréat",
    hint: "Certificat officiel · PDF",
  },
  {
    id: "bac_tr",
    name: "Relevé de notes Bac",
    hint: "Notes officielles · PDF",
  },
];

const LICENCE_DOCS: DocDef[] = [
  {
    id: "lic_dip",
    name: "Diplôme de Licence",
    hint: "Certificat officiel · PDF",
  },
  {
    id: "lic_tr1",
    name: "Relevé de notes Licence — année 1",
    hint: "Notes officielles · PDF",
  },
  {
    id: "lic_tr2",
    name: "Relevé de notes Licence — année 2",
    hint: "Notes officielles · PDF",
  },
  {
    id: "lic_tr3",
    name: "Relevé de notes Licence — année 3",
    hint: "Notes officielles · PDF",
  },
];

const MASTER_DOCS: DocDef[] = [
  {
    id: "mas_dip",
    name: "Diplôme de Master / Ingénieur",
    hint: "Certificat officiel · PDF",
  },
  {
    id: "mas_tr1",
    name: "Relevé de notes Master — année 1",
    hint: "Notes officielles · PDF",
  },
  {
    id: "mas_tr2",
    name: "Relevé de notes Master — année 2",
    hint: "Notes officielles · PDF",
  },
];

const PHD_DOCS: DocDef[] = [
  {
    id: "phd_dip",
    name: "Diplôme de Doctorat / PhD",
    hint: "Certificat officiel · PDF",
  },
];

const GAP_DOC_MAP: Record<Exclude<GapDocType, "No document">, DocDef> = {
  "Internship / Stage": {
    id: "gap_stage",
    name: "Attestation de stage",
    hint: "Pour justifier la période d'interruption · PDF",
  },
  "Work certificate": {
    id: "gap_work",
    name: "Attestation de travail",
    hint: "Pour justifier la période d'interruption · PDF",
  },
  "Training / Formation": {
    id: "gap_training",
    name: "Attestation de formation",
    hint: "Pour justifier la période d'interruption · PDF",
  },
  "Other document": {
    id: "gap_other",
    name: "Document justificatif (interruption)",
    hint: "Pour justifier la période d'interruption · PDF",
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
