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
    return NextResponse.json(
      { success: false, error: "Données d'envoi incomplètes. Rechargez la page et réessayez." },
      { status: 400 }
    );
  }

  if (file.size > MAX_ATTACHMENT_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return NextResponse.json(
      {
        success: false,
        error: `Le fichier « ${file.name} » fait ${mb} Mo. La limite est de 5 Mo — compressez-le et réessayez.`,
      },
      { status: 400 }
    );
  }

  const filename = renameFile(docId, lastName, firstName, file.name, certName || undefined);

  try {
    await uploadAdmissionAttachment(recordId, file, filename);
    return NextResponse.json({ success: true, filename });
  } catch (err) {
    console.error("[upload]", err);
    const message =
      err instanceof Error && err.message
        ? err.message
        : `Échec de l'envoi de « ${filename} ». Réessayez ou contactez-nous sur WhatsApp.`;
    // 400 for client-side issues (size, corrupt file), 502 for server/Airtable issues
    const isClientError =
      message.includes("5 Mo") ||
      message.includes("Resélectionnez") ||
      message.includes("format ou contenu");
    return NextResponse.json(
      { success: false, error: message },
      { status: isClientError ? 400 : 502 }
    );
  }
}
