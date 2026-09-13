import { NextRequest, NextResponse } from "next/server";
import {
  createBourseDocumentsRecord,
  findProspectByEmail,
} from "@/lib/bourse-documents-airtable";

export async function POST(req: NextRequest) {
  let body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    householdMembersText?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const householdMembersText = String(body.householdMembersText ?? "");

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { error: "Le prénom, le nom et l'e-mail sont obligatoires." },
      { status: 400 }
    );
  }

  try {
    const prospectRecordId = await findProspectByEmail(email);
    const recordId = await createBourseDocumentsRecord({
      householdMembersText,
      prospectRecordId,
    });

    return NextResponse.json({
      success: true,
      recordId,
      prospectFound: Boolean(prospectRecordId),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Impossible de créer le dossier. Réessayez.",
      },
      { status: 502 }
    );
  }
}
