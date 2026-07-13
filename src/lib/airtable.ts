// Server-only helpers for writing to the Prospects table via the plain Airtable REST API.
import "server-only";

const BASE_ID = "appkqvTuc8F0AhWPp";
const PROSPECTS_TABLE_ID = "tblQPh56AAmCe1bTj";
const CV_FIELD_NAME = "CV";

function getApiKey(): string {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) {
    throw new Error("AIRTABLE_API_KEY is not set");
  }
  return key;
}

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
  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${PROSPECTS_TABLE_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      typecast: true,
      records: [
        {
          fields: {
            Name: data.firstName,
            Surname: data.lastName,
            Email: data.email,
            Phone: data.phone,
            "WhatsApp Number": data.phone,
            Birthday: data.birthday,
            "Full Address": data.address,
            "How did you hear about us": data.howHeard,
            "Last Academic Level": data.lastAcademicLevel,
            "Last Diploma Obtained": data.lastDiploma,
            Languages: data.languages,
            "Entry Level": [data.entryLevel],
            "Preferred Field of Study": data.preferredField,
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
    `https://content.airtable.com/v0/${BASE_ID}/${recordId}/${encodeURIComponent(CV_FIELD_NAME)}/uploadAttachment`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
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
