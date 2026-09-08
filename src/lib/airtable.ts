// Server-only helpers for writing to the Prospects table via the plain Airtable REST API.
import "server-only";
import { AIRTABLE, getAirtableApiKey } from "@/lib/airtable-config";

const { baseId } = AIRTABLE;
const prospects = AIRTABLE.tables.prospects;
const F = prospects.fields;

export interface ItalyProspectFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string;
  address: string;
  howHeard: string;
  lastAcademicLevel: string;
  lastDiploma: string;
  languages: string[];
  entryLevel: string;
  preferredField: string;
}

export async function createItalyProspect(data: ItalyProspectFields): Promise<string> {
  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${prospects.id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAirtableApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      typecast: true,
      records: [
        {
          fields: {
            [F.name]: data.firstName,
            [F.surname]: data.lastName,
            [F.email]: data.email,
            [F.phone]: data.phone,
            [F.whatsapp]: data.phone,
            [F.birthday]: data.birthday,
            [F.fullAddress]: data.address,
            [F.howHeard]: data.howHeard,
            [F.lastAcademicLevel]: data.lastAcademicLevel,
            [F.lastDiploma]: data.lastDiploma,
            [F.languages]: data.languages,
            [F.entryLevel]: [data.entryLevel],
            [F.preferredField]: data.preferredField,
          },
        },
      ],
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
