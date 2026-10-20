import { NextRequest, NextResponse } from "next/server";
import {
  createCandidature,
  MAX_CV_BYTES,
  uploadCandidatureCv,
  validateCandidatureChoices,
  type CreateCandidatureInput,
} from "@/lib/candidature-airtable";

const MAX_FIELD_LENGTH = 5000;

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Le formulaire envoyé est invalide." }, { status: 400 });
  }

  const cvEntry = formData.get("cv");
  if (!(cvEntry instanceof File) || cvEntry.size === 0) {
    return NextResponse.json({ error: "Ajoutez votre CV pour envoyer la candidature." }, { status: 400 });
  }

  const ageValue = field(formData, "age");
  const salaryValue = field(formData, "expectedSalary");
  const contracts = formData.getAll("contractTypes");
  if (contracts.some((value) => typeof value !== "string")) {
    return NextResponse.json({ error: "Le type de contrat sélectionné est invalide." }, { status: 400 });
  }

  const input: CreateCandidatureInput = {
    lastName: field(formData, "lastName"),
    firstName: field(formData, "firstName"),
    birthDate: field(formData, "birthDate"),
    age: Number(ageValue),
    whatsapp: field(formData, "whatsapp"),
    governorate: field(formData, "governorate"),
    cityAddress: field(formData, "cityAddress"),
    contractTypes: contracts as string[],
    workMode: field(formData, "workMode"),
    availableFrom: field(formData, "availableFrom"),
    expectedSalary: Number(salaryValue),
    lastDiploma: field(formData, "lastDiploma"),
    arabic: field(formData, "arabic"),
    french: field(formData, "french"),
    english: field(formData, "english"),
    italian: field(formData, "italian"),
    experience: field(formData, "experience"),
    italyInterest: field(formData, "italyInterest"),
  };

  const requiredText = [
    input.lastName,
    input.firstName,
    input.whatsapp,
    input.cityAddress,
    input.lastDiploma,
    input.experience,
  ];
  if (requiredText.some((value) => !value) || field(formData, "consent") !== "true") {
    return NextResponse.json({ error: "Complétez les champs obligatoires et acceptez le consentement." }, { status: 400 });
  }
  if (requiredText.some((value) => value.length > MAX_FIELD_LENGTH)) {
    return NextResponse.json({ error: "Un des champs dépasse la longueur autorisée." }, { status: 400 });
  }
  if (!isIsoDate(input.birthDate) || !isIsoDate(input.availableFrom)) {
    return NextResponse.json({ error: "Vérifiez les dates saisies." }, { status: 400 });
  }
  if (!Number.isInteger(input.age) || input.age < 16 || input.age > 70) {
    return NextResponse.json({ error: "L’âge doit être compris entre 16 et 70 ans." }, { status: 400 });
  }
  if (!Number.isFinite(input.expectedSalary) || input.expectedSalary < 0) {
    return NextResponse.json({ error: "Le salaire attendu doit être un nombre positif ou nul." }, { status: 400 });
  }
  if (!validateCandidatureChoices(input)) {
    return NextResponse.json({ error: "Vérifiez les choix sélectionnés dans le formulaire." }, { status: 400 });
  }
  if (cvEntry.size > MAX_CV_BYTES) {
    return NextResponse.json({ error: "Le CV dépasse la limite de 5 Mo." }, { status: 400 });
  }

  let recordId: string;
  try {
    recordId = await createCandidature(input);
  } catch (error) {
    console.error("[submit-candidature] record creation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "La candidature n’a pas pu être enregistrée." },
      { status: 502 }
    );
  }

  try {
    await uploadCandidatureCv(recordId, cvEntry);
  } catch (error) {
    console.error("[submit-candidature] CV upload failed:", error);
    return NextResponse.json({ ok: true, cvUploaded: false, recordId }, { status: 200 });
  }

  return NextResponse.json({ ok: true, cvUploaded: true, recordId });
}
