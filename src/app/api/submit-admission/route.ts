import { NextRequest, NextResponse } from "next/server";
import { buildDocList } from "@/app/admission-italy/buildDocList";
import type { DiplomaLevel, GapDocType } from "@/app/admission-italy/types";
import {
  createAdmissionRecord,
  findProspectByEmail,
} from "@/lib/admission-airtable";

export async function POST(req: NextRequest) {
  let body: {
    profile?: {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
    academic?: {
      diplomaLevel?: string;
      fieldOfStudy?: string;
      scoreFormat?: string;
      scoreValue?: string;
      gapYears?: number;
      gapDescription?: string;
      gapDocTypes?: string[];
    };
    passportExpiry?: string | null;
    languageCertName?: string;
    docsUploadedCount?: number;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const firstName = String(body.profile?.firstName ?? "").trim();
  const lastName = String(body.profile?.lastName ?? "").trim();
  const email = String(body.profile?.email ?? "").trim();

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { error: "First name, last name, and email are required." },
      { status: 400 }
    );
  }

  const academic = body.academic ?? {};
  const diplomaLevel = (academic.diplomaLevel ?? "") as DiplomaLevel;
  const gapDocTypes = (academic.gapDocTypes ?? []) as GapDocType[];
  const gapYears = Number(academic.gapYears) || 0;
  const hasGap = gapYears > 1;
  const totalDocsExpected = buildDocList(diplomaLevel, hasGap, gapDocTypes).length;
  const totalDocsUploaded = Number(body.docsUploadedCount) || 0;

  try {
    const prospectRecordId = await findProspectByEmail(email);
    const recordId = await createAdmissionRecord({
      firstName,
      lastName,
      email,
      diplomaLevel: academic.diplomaLevel ?? "",
      fieldOfStudy: academic.fieldOfStudy ?? "",
      scoreFormat: academic.scoreFormat ?? "",
      scoreValue: academic.scoreValue ?? "",
      gapYears,
      gapDescription: academic.gapDescription ?? "",
      gapDocTypes: gapDocTypes,
      passportExpiry: body.passportExpiry || null,
      languageCertName: body.languageCertName ?? "",
      totalDocsExpected,
      totalDocsUploaded,
      prospectRecordId,
    });

    return NextResponse.json({
      success: true,
      recordId,
      prospectFound: Boolean(prospectRecordId),
      totalDocsExpected,
      totalDocsUploaded,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Could not create your dossier. Please try again.",
      },
      { status: 502 }
    );
  }
}
