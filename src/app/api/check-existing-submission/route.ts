import { NextRequest, NextResponse } from "next/server";
import { findExistingSubmission } from "@/lib/admission-airtable";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.trim() ?? "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ found: false }, { status: 200 });
  }

  try {
    const existing = await findExistingSubmission(email);
    if (!existing) {
      return NextResponse.json({ found: false });
    }
    return NextResponse.json({
      found: true,
      recordId: existing.recordId,
      submittedDocIds: existing.submittedDocIds,
    });
  } catch (err) {
    console.error("[check-existing-submission]", err);
    return NextResponse.json({ found: false });
  }
}
