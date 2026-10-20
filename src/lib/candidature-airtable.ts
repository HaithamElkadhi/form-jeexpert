import "server-only";
import { AIRTABLE_CANDIDATURES, getAirtableApiKey } from "@/lib/airtable-config";
import { airtableFetch } from "@/lib/airtable-fetch";

const { baseId, tableId, fields: F } = AIRTABLE_CANDIDATURES;

export const MAX_CV_BYTES = 5 * 1024 * 1024;

export interface CreateCandidatureInput {
  lastName: string;
  firstName: string;
  birthDate: string;
  age: number;
  whatsapp: string;
  governorate: string;
  cityAddress: string;
  contractTypes: string[];
  workMode: string;
  availableFrom: string;
  expectedSalary: number;
  lastDiploma: string;
  arabic: string;
  french: string;
  english: string;
  italian: string;
  experience: string;
  italyInterest: string;
}

const CONTRACT_TYPES = ["CDI", "CDD", "Freelance", "Temps partiel", "Stage"];
const GOVERNORATES = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
  "Kairouan", "Kasserine", "Kébili", "Le Kef", "Mahdia", "La Manouba",
  "Médenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana",
  "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan", "Hors Tunisie",
];
const LANGUAGE_LEVELS = ["Courant", "Intermédiaire", "Débutant", "Aucun"];
const WORK_MODES = ["Présentiel", "À distance", "Les deux"];
const ITALY_INTEREST = ["Oui, contactez-moi", "Non merci"];

function isChoice(value: string, choices: string[]): boolean {
  return choices.includes(value);
}

export async function createCandidature(input: CreateCandidatureInput): Promise<string> {
  const { lastName, firstName } = input;
  const fields: Record<string, unknown> = {
    [F.fullName]: `${firstName} ${lastName}`.trim(),
    [F.lastName]: lastName,
    [F.firstName]: firstName,
    [F.birthDate]: input.birthDate,
    [F.age]: input.age,
    [F.whatsapp]: input.whatsapp,
    [F.governorate]: input.governorate,
    [F.cityAddress]: input.cityAddress,
    [F.contractTypes]: input.contractTypes,
    [F.availableFrom]: input.availableFrom,
    [F.expectedSalary]: input.expectedSalary,
    [F.lastDiploma]: input.lastDiploma,
    [F.arabic]: input.arabic,
    [F.french]: input.french,
    [F.english]: input.english,
    [F.italian]: input.italian,
    [F.experience]: input.experience,
    [F.italyInterest]: input.italyInterest,
    [F.dataConsent]: true,
    [F.status]: "À examiner",
  };

  if (input.workMode) fields[F.workMode] = input.workMode;

  const res = await airtableFetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAirtableApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[createCandidature] Airtable ${res.status}: ${body}`);
    throw new Error("La candidature n’a pas pu être enregistrée. Réessayez dans quelques instants.");
  }

  const data = (await res.json()) as { id?: string };
  if (!data.id) throw new Error("Airtable n’a pas renvoyé la référence de candidature.");
  return data.id;
}

export async function uploadCandidatureCv(recordId: string, file: File): Promise<void> {
  if (file.size === 0 || file.size > MAX_CV_BYTES) {
    throw new Error("Le CV doit faire moins de 5 Mo.");
  }

  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (![".pdf", ".doc", ".docx"].includes(extension)) {
    throw new Error("Le CV doit être au format PDF ou Word.");
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const res = await airtableFetch(
    `https://content.airtable.com/v0/${baseId}/${recordId}/${F.cv}/uploadAttachment`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAirtableApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contentType: file.type || "application/octet-stream",
        filename: file.name,
        file: base64,
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    console.error(`[uploadCandidatureCv] Airtable ${res.status}: ${body}`);
    throw new Error("La candidature est enregistrée, mais le CV n’a pas pu être ajouté.");
  }
}

export function validateCandidatureChoices(input: CreateCandidatureInput): boolean {
  return (
    input.contractTypes.length > 0 &&
    input.contractTypes.every((choice) => isChoice(choice, CONTRACT_TYPES)) &&
    isChoice(input.governorate, GOVERNORATES) &&
    (!input.workMode || isChoice(input.workMode, WORK_MODES)) &&
    isChoice(input.arabic, LANGUAGE_LEVELS.slice(0, 3)) &&
    isChoice(input.french, LANGUAGE_LEVELS) &&
    isChoice(input.english, LANGUAGE_LEVELS) &&
    isChoice(input.italian, LANGUAGE_LEVELS) &&
    isChoice(input.italyInterest, ITALY_INTEREST)
  );
}
