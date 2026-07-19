"use client";

import { useMemo } from "react";
import { buildDocList } from "../buildDocList";
import type { AcademicData, DocumentEntry, DocumentsState } from "../types";
import DocItem from "./DocItem";
import DocProgressBar from "./DocProgressBar";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  sectionTitleClass,
} from "./fieldStyles";

interface Props {
  academic: AcademicData;
  documents: DocumentsState;
  onDocumentChange: (id: string, entry: DocumentEntry) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  uploadedCount: number;
  totalToUpload: number;
  error: string | null;
}

const EMPTY_ENTRY: DocumentEntry = { file: null, language: "" };

export default function Step3Documents({
  academic,
  documents,
  onDocumentChange,
  onBack,
  onSubmit,
  submitting,
  uploadedCount,
  totalToUpload,
  error,
}: Props) {
  const hasGap = academic.gapYears > 1;
  const docList = useMemo(
    () => buildDocList(academic.diplomaLevel, hasGap, academic.gapDocTypes),
    [academic.diplomaLevel, academic.gapDocTypes, hasGap]
  );

  const uploaded = docList.filter((d) => documents[d.id]?.file).length;

  const submitLabel = submitting
    ? totalToUpload > 0
      ? `Uploading… (${uploadedCount}/${totalToUpload})`
      : "Uploading…"
    : "Submit dossier";

  return (
    <div className="flex flex-col gap-5">
      <h2 className={sectionTitleClass}>Documents</h2>

      <DocProgressBar uploaded={uploaded} total={docList.length} />

      <p className="text-xs text-gray-500">
        Each file must be under 5 MB (Airtable limit). Compress large PDFs before uploading.
      </p>

      <div className="flex flex-col gap-3">
        {docList.map((def) => (
          <DocItem
            key={def.id}
            def={def}
            entry={documents[def.id] ?? EMPTY_ENTRY}
            onChange={(entry) => onDocumentChange(def.id, entry)}
          />
        ))}
      </div>

      {error && (
        <p className="rounded-lg border border-italy-terracotta/30 bg-italy-terracotta/5 px-3 py-2 text-sm text-italy-terracotta-dark">
          {error}
        </p>
      )}

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className={`${btnSecondaryClass} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className={`${btnPrimaryClass} disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
