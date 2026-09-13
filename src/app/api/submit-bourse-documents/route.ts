import { NextRequest, NextResponse } from "next/server";
import { airtableNetworkErrorMessage } from "@/lib/airtable-fetch";
import {
  createBourseDocumentsRecord,
  createMinimalProspect,
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
    let prospectRecordId: string | null = null;
    let prospectCreated = false;

    // Link Prospect when possible, but don't block dossier creation on network blips.
    try {
      prospectRecordId = await findProspectByEmail(email);
      if (!prospectRecordId) {
        prospectRecordId = await createMinimalProspect({ firstName, lastName, email });
        prospectCreated = true;
      }
    } catch (prospectErr) {
      console.warn(
        "[submit-bourse-documents] Prospect link skipped:",
        airtableNetworkErrorMessage(prospectErr)
      );
    }

    const recordId = await createBourseDocumentsRecord({
      householdMembersText,
      prospectRecordId,
    });

    return NextResponse.json({
      success: true,
      recordId,
      prospectFound: Boolean(prospectRecordId) && !prospectCreated,
      prospectCreated,
      prospectLinked: Boolean(prospectRecordId),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        error: airtableNetworkErrorMessage(err),
      },
      { status: 502 }
    );
  }
}
