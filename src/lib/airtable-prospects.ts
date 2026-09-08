import "server-only";
import { AIRTABLE, getAirtableApiKey } from "@/lib/airtable-config";

const { baseId } = AIRTABLE;
const prospects = AIRTABLE.tables.prospects;

function escapeFormulaValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** Case-insensitive email match on Prospects. Returns record id or null. */
export async function findProspectByEmail(email: string): Promise<string | null> {
  const formula = `LOWER({${prospects.fields.email}}) = LOWER("${escapeFormulaValue(email.trim())}")`;
  const url = new URL(`https://api.airtable.com/v0/${baseId}/${prospects.id}`);
  url.searchParams.set("filterByFormula", formula);
  url.searchParams.set("maxRecords", "1");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${getAirtableApiKey()}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Prospect lookup failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  return json?.records?.[0]?.id ?? null;
}
