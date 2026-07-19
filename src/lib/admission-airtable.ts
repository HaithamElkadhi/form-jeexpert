import "server-only";

const BASE_ID = "appkqvTuc8F0AhWPp";
const DOCUMENTS_TABLE_ID = "tbl4qg0oCDDMm6nfc";
const PROSPECTS_TABLE_ID = "tblQPh56AAmCe1bTj";

/** Airtable content upload API accepts at most 5 MB per file. */
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

const FIELDS = {
  name: "flduCzBz6r4mbeyR6",
  prospect: "flddLbOxT5ONdCPWX",
  email: "fldvXXUGFdfSKRAjl",
  submissionDate: "fld8DrbLEdxg0D4JE",
  diplomaLevel: "fldo1JjqlT5kcO9eZ",
  fieldOfStudy: "fldLz8dT90dTAEQed",
  scoreFormat: "fldhfzzwpyesvUG2p",
  scoreValue: "fldByb2VC7zf4PvLp",
  gapYears: "flduV0meKEUlon4xz",
  gapDescription: "fldp6UeYZT5Q9Tbe2",
  gapDocTypes: "fldPj1ZezVOODe5EY",
  passportExpiry: "fldZA6EiC0DH6h8G3",
  languageCertName: "fldM0K2xgtpbanO1z",
  documents: "fldlw19MuDmTwg7iy",
  documentsStatus: "fldif76Ukh0xKQDoH",
  dossierSubmitted: "fldHe22CIKSrHo9aK",
  totalExpected: "fldjiRsKUUxt7Ra78",
  submittedCount: "fldTT09a4RdZmRvOh",
  prospectEmail: "fldWBOtlmuPIXdsep",
} as const;

const DOC_LABELS: Record<string, string> = {
  photo: "PassportPhoto",
  passport: "Passport",
  cv: "CV",
  lang: "LanguageCert",
  ddv: "DeclarationDeValeur",
  bac_dip: "BacDiploma",
  bac_tr: "BacTranscript",
  lic_dip: "LicenceDiploma",
  lic_tr1: "LicenceTranscriptY1",
  lic_tr2: "LicenceTranscriptY2",
  lic_tr3: "LicenceTranscriptY3",
  mas_dip: "MasterDiploma",
  mas_tr1: "MasterTranscriptY1",
  mas_tr2: "MasterTranscriptY2",
  phd_dip: "PhDDiploma",
  gap_stage: "GapDoc_Stage",
  gap_work: "GapDoc_Work",
  gap_training: "GapDoc_Training",
  gap_other: "GapDoc_Other",
};

function getApiKey(): string {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) {
    throw new Error("AIRTABLE_API_KEY is not set");
  }
  return key;
}

function escapeFormulaValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function stripAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function formatLastName(lastName: string): string {
  return stripAccents(lastName.trim())
    .toUpperCase()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9-]/g, "");
}

function formatFirstName(firstName: string): string {
  const cleaned = stripAccents(firstName.trim()).replace(/[^A-Za-z0-9 -]/g, "");
  if (!cleaned) return "";
  const lower = cleaned.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function sanitizeExtraLabel(label: string): string {
  return stripAccents(label.trim())
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9-_]/g, "");
}

export function renameFile(
  docId: string,
  studentLastName: string,
  studentFirstName: string,
  originalFilename: string,
  extraLabel?: string
): string {
  const ext = originalFilename.includes(".")
    ? originalFilename.slice(originalFilename.lastIndexOf("."))
    : "";
  const last = formatLastName(studentLastName) || "STUDENT";
  const first = formatFirstName(studentFirstName) || "Student";
  const label = DOC_LABELS[docId] ?? docId;

  let base = `${last}_${first}_${label}`;
  if (docId === "lang" && extraLabel?.trim()) {
    const extra = sanitizeExtraLabel(extraLabel);
    if (extra) base += `_${extra}`;
  }

  return `${base}${ext}`;
}

export async function findProspectByEmail(email: string): Promise<string | null> {
  const formula = `LOWER({${FIELDS.prospectEmail}}) = LOWER("${escapeFormulaValue(email.trim())}")`;
  const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${PROSPECTS_TABLE_ID}`);
  url.searchParams.set("filterByFormula", formula);
  url.searchParams.set("maxRecords", "1");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${getApiKey()}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Prospect lookup failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  return json?.records?.[0]?.id ?? null;
}

export interface CreateAdmissionRecordInput {
  firstName: string;
  lastName: string;
  email: string;
  diplomaLevel: string;
  fieldOfStudy: string;
  scoreFormat: string;
  scoreValue: string;
  gapYears: number;
  gapDescription: string;
  gapDocTypes: string[];
  passportExpiry: string | null;
  languageCertName: string;
  totalDocsExpected: number;
  totalDocsUploaded: number;
  prospectRecordId: string | null;
}

export async function createAdmissionRecord(
  input: CreateAdmissionRecordInput
): Promise<string> {
  const gapDocTypes = input.gapDocTypes.filter((t) => t && t !== "No document");

  const fields: Record<string, unknown> = {
    [FIELDS.name]: `${input.lastName.toUpperCase()}_${input.firstName}`,
    [FIELDS.email]: input.email,
    [FIELDS.submissionDate]: new Date().toISOString().split("T")[0],
    [FIELDS.documentsStatus]: "Pending",
    [FIELDS.dossierSubmitted]: true,
    [FIELDS.totalExpected]: input.totalDocsExpected,
    [FIELDS.submittedCount]: input.totalDocsUploaded,
  };

  if (input.diplomaLevel) fields[FIELDS.diplomaLevel] = input.diplomaLevel;
  if (input.fieldOfStudy) fields[FIELDS.fieldOfStudy] = input.fieldOfStudy;
  if (input.scoreFormat) fields[FIELDS.scoreFormat] = input.scoreFormat;
  if (input.scoreValue) fields[FIELDS.scoreValue] = input.scoreValue;
  if (Number.isFinite(input.gapYears)) fields[FIELDS.gapYears] = input.gapYears;
  if (input.gapDescription) fields[FIELDS.gapDescription] = input.gapDescription;
  if (gapDocTypes.length > 0) fields[FIELDS.gapDocTypes] = gapDocTypes;
  if (input.passportExpiry) fields[FIELDS.passportExpiry] = input.passportExpiry;
  if (input.languageCertName) fields[FIELDS.languageCertName] = input.languageCertName;
  if (input.prospectRecordId) fields[FIELDS.prospect] = [input.prospectRecordId];

  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${DOCUMENTS_TABLE_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      typecast: true,
      fields,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Documents record creation failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  const recordId = json?.id;
  if (!recordId) {
    throw new Error("Documents record creation returned no record id");
  }
  return recordId;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function uploadAdmissionAttachment(
  recordId: string,
  file: File,
  filename: string
): Promise<void> {
  if (file.size > MAX_ATTACHMENT_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `"${filename}" is ${mb} MB. Airtable only accepts files up to 5 MB — please compress it and try again.`
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64File = Buffer.from(arrayBuffer).toString("base64");
  const body = JSON.stringify({
    contentType: file.type || "application/octet-stream",
    filename,
    file: base64File,
  });

  // content.airtable.com is the attachment host; api.airtable.com also accepts this path.
  const url = `https://content.airtable.com/v0/${BASE_ID}/${recordId}/${FIELDS.documents}/uploadAttachment`;
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
      },
      body,
    });

    if (res.ok) return;

    const text = await res.text();

    // Airtable requires waiting ~30s after a 429 before retrying.
    if (res.status === 429 && attempt < maxAttempts) {
      console.warn(
        `Airtable rate limit on "${filename}" — waiting 30s (attempt ${attempt}/${maxAttempts})`
      );
      await sleep(30_000);
      continue;
    }

    if (res.status >= 500 && attempt < maxAttempts) {
      await sleep(1500 * attempt);
      continue;
    }

    throw new Error(`Attachment upload failed (${res.status}): ${text}`);
  }
}
