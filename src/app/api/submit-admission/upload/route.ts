import { NextRequest, NextResponse } from "next/server";
import {
  renameFile,
  uploadAdmissionAttachment,
} from "@/lib/admission-airtable";

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
  }

  const recordId = String(formData.get("recordId") ?? "").trim();
  const docId = String(formData.get("docId") ?? "").trim();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const certName = String(formData.get("certName") ?? "").trim();
  const file = formData.get("file");

  if (!recordId || !docId || !firstName || !lastName || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing required upload fields" }, { status: 400 });
  }

  const filename = renameFile(docId, lastName, firstName, file.name, certName || undefined);

  try {
    await uploadAdmissionAttachment(recordId, file, filename);
    return NextResponse.json({ success: true, filename });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "File upload failed",
      },
      { status: 502 }
    );
  }
}
