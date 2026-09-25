// Server-only helpers for writing to the Prospects table via the plain Airtable REST API.
import "server-only";
import { AIRTABLE, getAirtableApiKey } from "@/lib/airtable-config";

const { baseId } = AIRTABLE;
const prospects = AIRTABLE.tables.prospects;
const F = prospects.fields;

export interface ItalyProspectFields {
  // Personal info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string;
  address: string;
  nationality: string;
  howHeard: string;

  // Academic profile
  currentStatus: string;
  academicLevel: string;
  obtainedDiploma: string;
  academicRecords: string;
  fieldOfPreviousStudies: string;
  yearOfGraduation: string;
  currentOccupation: string;
  languages: string[];
  languageRecords: string;

  // Study preferences
  targetDegreeLevel: string;
  intendedIntake: string;
}

function buildAcademicDescription(json: string): string {
  try {
    const records = JSON.parse(json) as { diploma: string; score: string; maxScore: string }[];
    if (!Array.isArray(records) || records.length === 0) return "";
    return records
      .filter((r) => r.diploma)
      .map((r) => {
        const score = r.score ? `${r.score}/${r.maxScore || 20}` : "—";
        const gpa =
          r.score && r.maxScore
            ? ` (GPA: ${((Number(r.score) / Number(r.maxScore)) * 4).toFixed(2)})`
            : "";
        return `${r.diploma}: ${score}${gpa}`;
      })
      .join("\n");
  } catch {
    return "";
  }
}

function buildLanguageDescription(json: string): string {
  try {
    const records = JSON.parse(json) as { language: string; level: string; certificate: string }[];
    if (!Array.isArray(records) || records.length === 0) return "";
    return records
      .filter((r) => r.language)
      .map((r) => {
        const level = r.level || "—";
        const cert = r.certificate && r.certificate !== "None" ? ` (${r.certificate})` : "";
        return `${r.language}: ${level}${cert}`;
      })
      .join("\n");
  } catch {
    return "";
  }
}

export async function createItalyProspect(data: ItalyProspectFields): Promise<string> {
  const academicDescription = buildAcademicDescription(data.academicRecords);
  const languageDescription = buildLanguageDescription(data.languageRecords);

  const fields: Record<string, unknown> = {
    [F.name]: data.firstName,
    [F.surname]: data.lastName,
    [F.email]: data.email,
    [F.phone]: data.phone,
    [F.whatsapp]: data.phone,
    [F.birthday]: data.birthday || undefined,
    [F.fullAddress]: data.address,
    [F.nationality]: data.nationality ? [data.nationality] : undefined,
    [F.howHeard]: data.howHeard,

    [F.currentStatus]: data.currentStatus || undefined,
    [F.academicLevel]: data.academicLevel || undefined,
    [F.lastAcademicLevel]: data.academicLevel || undefined,
    [F.obtainedDiplomas]: data.obtainedDiploma
      ? data.obtainedDiploma.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined,
    [F.fieldOfPreviousStudies]: data.fieldOfPreviousStudies || undefined,
    [F.yearOfGraduation]: data.yearOfGraduation ? Number(data.yearOfGraduation) || undefined : undefined,
    [F.currentOccupation]: data.currentOccupation || undefined,
    [F.languages]: data.languages.length > 0 ? data.languages : undefined,

    [F.targetDegreeLevel]: data.targetDegreeLevel || undefined,
    [F.entryLevel]: data.targetDegreeLevel ? [data.targetDegreeLevel] : undefined,
    [F.intendedIntake]: data.intendedIntake ? [data.intendedIntake] : undefined,
  };

  // Academic records description
  if (academicDescription) {
    fields[F.academicRecordDescription] = academicDescription;
  }

  if (languageDescription) {
    fields[F.languageRecordDescription] = languageDescription;
  }

  // Strip undefined values
  const cleanFields = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v !== undefined)
  );

  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${prospects.id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAirtableApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      typecast: true,
      records: [{ fields: cleanFields }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable record creation failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  const recordId = json?.records?.[0]?.id;
  if (!recordId) {
    throw new Error("Airtable record creation returned no record id");
  }
  return recordId;
}

export async function uploadCvAttachment(
  recordId: string,
  file: File
): Promise<void> {
  const arrayBuffer = await file.arrayBuffer();
  const base64File = Buffer.from(arrayBuffer).toString("base64");

  const res = await fetch(
    `https://content.airtable.com/v0/${baseId}/${recordId}/${encodeURIComponent(F.cv)}/uploadAttachment`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAirtableApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contentType: file.type || "application/pdf",
        filename: file.name || "cv.pdf",
        file: base64File,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable CV upload failed (${res.status}): ${text}`);
  }
}
