import { NextRequest, NextResponse } from "next/server";
import { createItalyProspect, uploadCvAttachment } from "@/lib/airtable";

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
  }

  const g = (key: string) => String(formData.get(key) ?? "").trim();

  const firstName = g("firstName");
  const lastName = g("lastName");
  const email = g("email");
  const phone = g("phone");
  const birthday = g("birthday");
  const address = g("address");
  const nationality = g("nationality");
  const howHeard = g("howHeard");

  const currentStatus = g("currentStatus");
  const academicLevel = g("academicLevel");
  const obtainedDiploma = g("obtainedDiploma");
  const academicRecords = g("academicRecords");
  const fieldOfPreviousStudies = g("fieldOfPreviousStudies");
  const yearOfGraduation = g("yearOfGraduation");
  const currentOccupation = g("currentOccupation");
  const languagesRaw = g("languages");
  const languageRecords = g("languageRecords");

  const targetDegreeLevel = g("targetDegreeLevel");
  const intendedIntake = g("intendedIntake");

  const cvEntry = formData.get("cvFile");
  const cvFile = cvEntry instanceof File && cvEntry.size > 0 ? cvEntry : null;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !birthday ||
    !address ||
    !nationality ||
    !howHeard ||
    !currentStatus ||
    !academicLevel ||
    !languagesRaw ||
    !targetDegreeLevel ||
    !intendedIntake
  ) {
    return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
  }

  const languages = languagesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let recordId: string;
  try {
    recordId = await createItalyProspect({
      firstName,
      lastName,
      email,
      phone,
      birthday,
      address,
      nationality,
      howHeard,
      currentStatus,
      academicLevel,
      obtainedDiploma,
      academicRecords,
      fieldOfPreviousStudies,
      yearOfGraduation,
      currentOccupation,
      languages,
      languageRecords,
      targetDegreeLevel,
      intendedIntake,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Impossible d'enregistrer votre candidature. Réessayez." },
      { status: 502 }
    );
  }

  if (cvFile) {
    try {
      await uploadCvAttachment(recordId, cvFile);
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        {
          error:
            "Votre candidature a été enregistrée, mais l'envoi du CV a échoué. Contactez-nous.",
          recordId,
        },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ ok: true, recordId });
}
