import { NextRequest, NextResponse } from "next/server";
import { airtableNetworkErrorMessage } from "@/lib/airtable-fetch";
import {
  BOURSE_UPLOAD_FIELD_IDS,
  MAX_ATTACHMENT_BYTES,
  uploadBourseAttachment,
  type BourseUploadFieldKey,
} from "@/lib/bourse-documents-airtable";

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
  }

  const recordId = String(formData.get("recordId") ?? "").trim();
  const fieldKey = String(formData.get("fieldKey") ?? "").trim() as BourseUploadFieldKey;
  const file = formData.get("file");

  if (
    !recordId ||
    !fieldKey ||
    !(fieldKey in BOURSE_UPLOAD_FIELD_IDS) ||
    !(file instanceof File) ||
    file.size === 0
  ) {
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

  // Spec: keep original filenames unchanged.
  const filename = file.name;

  try {
    await uploadBourseAttachment(recordId, fieldKey, file, filename);
    return NextResponse.json({ success: true, filename });
  } catch (err) {
    console.error(err);
    const message = airtableNetworkErrorMessage(err);
    const status = message.includes("5 MB") ? 400 : 502;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
