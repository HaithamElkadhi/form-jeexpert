import { NextRequest, NextResponse } from "next/server";
import { createItalyProspect, uploadCvAttachment } from "@/lib/airtable";

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
  }

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const birthday = String(formData.get("birthday") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const howHeard = String(formData.get("howHeard") ?? "").trim();
  const lastAcademicLevel = String(formData.get("lastAcademicLevel") ?? "").trim();
  const lastDiploma = String(formData.get("lastDiploma") ?? "").trim();
  const languagesRaw = String(formData.get("languages") ?? "").trim();
  const entryLevel = String(formData.get("entryLevel") ?? "").trim();
  const preferredField = String(formData.get("preferredField") ?? "").trim();
  const cvFile = formData.get("cvFile");

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !birthday ||
    !address ||
    !howHeard ||
    !lastAcademicLevel ||
    !lastDiploma ||
    !languagesRaw ||
    !entryLevel ||
    !preferredField ||
    !(cvFile instanceof File) ||
    cvFile.size === 0
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const languages = languagesRaw
    .split(",")
    .map((s) => s.trim().toUpperCase())
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
      howHeard,
      lastAcademicLevel,
      lastDiploma,
      languages,
      entryLevel,
      preferredField,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save your application. Please try again." }, { status: 502 });
  }

  try {
    await uploadCvAttachment(recordId, cvFile);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Your application was saved but the CV upload failed. Please contact us.", recordId },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, recordId });
}
