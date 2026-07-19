import { NextRequest, NextResponse } from "next/server";
import {
  MAX_ATTACHMENT_BYTES,
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

  if (file.size > MAX_ATTACHMENT_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return NextResponse.json(
      {
        success: false,
        error: `"${file.name}" is ${mb} MB. Airtable only accepts files up to 5 MB — please compress it and try again.`,
      },
      { status: 400 }
    );
  }

  const filename = renameFile(docId, lastName, firstName, file.name, certName || undefined);

  try {
    await uploadAdmissionAttachment(recordId, file, filename);
    return NextResponse.json({ success: true, filename });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "File upload failed";
    const status = message.includes("5 MB") ? 400 : 502;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
