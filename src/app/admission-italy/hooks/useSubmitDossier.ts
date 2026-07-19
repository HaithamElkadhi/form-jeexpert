"use client";

import { useState } from "react";
import { buildDocList } from "../buildDocList";
import type { AdmissionFormData } from "../types";

/** Must match Airtable content upload limit (see admission-airtable.ts). */
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

export interface SubmitResult {
  success: true;
  recordId: string;
  prospectFound: boolean;
  docsUploaded: number;
  totalDocsExpected: number;
}

export interface SubmitError {
  success: false;
  error: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

export function useSubmitDossier() {
  const [submitting, setSubmitting] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [totalToUpload, setTotalToUpload] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function submitDossier(
    formState: AdmissionFormData
  ): Promise<SubmitResult | SubmitError> {
    setSubmitting(true);
    setError(null);
    setUploadedCount(0);

    const { profile, academic, documents } = formState;
    const hasGap = academic.gapYears > 1;
    const docList = buildDocList(academic.diplomaLevel, hasGap, academic.gapDocTypes);
    const filesToUpload = docList.filter((d) => documents[d.id]?.file);

    setTotalToUpload(filesToUpload.length);

    try {
      // Fail fast on oversized files before creating the Airtable record.
      for (const def of filesToUpload) {
        const file = documents[def.id]?.file;
        if (file && file.size > MAX_ATTACHMENT_BYTES) {
          throw new Error(
            `"${def.name}" is ${formatMb(file.size)} MB. Airtable only accepts files up to 5 MB — please compress it and try again.`
          );
        }
      }

      const createRes = await fetch("/api/submit-admission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
          },
          academic: {
            diplomaLevel: academic.diplomaLevel,
            fieldOfStudy: academic.fieldOfStudy,
            scoreFormat: academic.scoreFormat,
            scoreValue: academic.scoreValue,
            gapYears: academic.gapYears,
            gapDescription: academic.gapDescription,
            gapDocTypes: academic.gapDocTypes,
          },
          passportExpiry: documents.passport?.expiryDate || null,
          languageCertName: documents.lang?.certName || "",
          docsUploadedCount: filesToUpload.length,
        }),
      });

      const createJson = await createRes.json().catch(() => ({}));
      if (!createRes.ok || !createJson.success || !createJson.recordId) {
        throw new Error(
          createJson.error ||
            "Something went wrong. Please try again or contact us on WhatsApp."
        );
      }

      const recordId = createJson.recordId as string;
      let docsUploaded = 0;

      for (const def of filesToUpload) {
        const entry = documents[def.id];
        if (!entry?.file) continue;

        // Stay under Airtable's 5 req/s base limit when uploading many files.
        if (docsUploaded > 0) await sleep(250);

        const fd = new FormData();
        fd.append("recordId", recordId);
        fd.append("docId", def.id);
        fd.append("firstName", profile.firstName);
        fd.append("lastName", profile.lastName);
        fd.append("file", entry.file);
        if (entry.certName) fd.append("certName", entry.certName);

        const uploadRes = await fetch("/api/submit-admission/upload", {
          method: "POST",
          body: fd,
        });
        const uploadJson = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok || !uploadJson.success) {
          const detail =
            typeof uploadJson.error === "string" ? uploadJson.error : "";
          throw new Error(
            detail ||
              `Failed while uploading "${def.name}" (${docsUploaded}/${filesToUpload.length} done). Please try again or contact us on WhatsApp.`
          );
        }

        docsUploaded += 1;
        setUploadedCount(docsUploaded);
      }

      const result: SubmitResult = {
        success: true,
        recordId,
        prospectFound: Boolean(createJson.prospectFound),
        docsUploaded,
        totalDocsExpected: Number(createJson.totalDocsExpected) || docList.length,
      };
      return result;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or contact us on WhatsApp.";
      console.error("[submitDossier]", message);
      setError(message);
      return { success: false, error: message };
    } finally {
      setSubmitting(false);
    }
  }

  return {
    submitDossier,
    submitting,
    uploadedCount,
    totalToUpload,
    error,
    setError,
  };
}
