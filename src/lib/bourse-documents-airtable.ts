import "server-only";
import { AIRTABLE, getAirtableApiKey } from "@/lib/airtable-config";
export { findProspectByEmail } from "@/lib/airtable-prospects";

const { baseId } = AIRTABLE;
const table = AIRTABLE.tables.bourseDocuments;
const F = table.fields;

/** Airtable content upload API accepts at most 5 MB per file. */
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

export type BourseUploadFieldKey =
  | "birthCertificates"
  | "familyBooklet"
  | "propertyDocs"
  | "nonPropertyDocs"
  | "balanceAttestation"
  | "taxDeclarations"
  | "otherDocuments";

export const BOURSE_UPLOAD_FIELD_IDS: Record<BourseUploadFieldKey, string> = {
  birthCertificates: F.birthCertificates,
  familyBooklet: F.familyBooklet,
  propertyDocs: F.propertyDocs,
  nonPropertyDocs: F.nonPropertyDocs,
  balanceAttestation: F.balanceAttestation,
  taxDeclarations: F.taxDeclarations,
  otherDocuments: F.otherDocuments,
};

export interface CreateBourseDocumentsRecordInput {
  householdMembersText: string;
  prospectRecordId: string | null;
}

export async function createBourseDocumentsRecord(
  input: CreateBourseDocumentsRecordInput
): Promise<string> {
  const fields: Record<string, unknown> = {
    [F.submissionDate]: new Date().toISOString().split("T")[0],
    [F.dossierStatus]: "Reçu",
  };

  if (input.householdMembersText.trim()) {
    fields[F.householdMembers] = input.householdMembersText.trim();
  }
  if (input.prospectRecordId) {
    fields[F.prospect] = [input.prospectRecordId];
  }

  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${table.id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAirtableApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      typecast: true,
      fields,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bourse-Documents record creation failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  const recordId = json?.id;
  if (!recordId) {
    throw new Error("Bourse-Documents record creation returned no record id");
  }
  return recordId;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function uploadBourseAttachment(
  recordId: string,
  fieldKey: BourseUploadFieldKey,
  file: File,
  filename: string
): Promise<void> {
  if (file.size > MAX_ATTACHMENT_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `"${filename}" is ${mb} MB. Airtable only accepts files up to 5 MB — please compress it and try again.`
    );
  }

  const fieldId = BOURSE_UPLOAD_FIELD_IDS[fieldKey];
  if (!fieldId) {
    throw new Error(`Unknown upload field: ${fieldKey}`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64File = Buffer.from(arrayBuffer).toString("base64");
  const body = JSON.stringify({
    contentType: file.type || "application/octet-stream",
    filename,
    file: base64File,
  });

  const url = `https://content.airtable.com/v0/${baseId}/${recordId}/${fieldId}/uploadAttachment`;
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAirtableApiKey()}`,
        "Content-Type": "application/json",
      },
      body,
    });

    if (res.ok) return;

    const text = await res.text();

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
