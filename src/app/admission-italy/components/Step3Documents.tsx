"use client";

import { useMemo, useState } from "react";
import { buildDocList } from "../buildDocList";
import { downloadAdmissionPdf } from "../buildAdmissionPdf";
import type { AcademicData, AdmissionFormData, DocumentEntry, DocumentsState } from "../types";
import DocItem from "./DocItem";
import DocProgressBar from "./DocProgressBar";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  sectionTitleClass,
} from "./fieldStyles";

interface Props {
  data: AdmissionFormData;
  documents: DocumentsState;
  onDocumentChange: (id: string, entry: DocumentEntry) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  uploadedCount: number;
  totalToUpload: number;
  error: string | null;
}

const EMPTY_ENTRY: DocumentEntry = { file: null };

export default function Step3Documents({
  data,
  documents,
  onDocumentChange,
  onBack,
  onSubmit,
  submitting,
  uploadedCount,
  totalToUpload,
  error,
}: Props) {
  const [downloaded, setDownloaded] = useState(false);
  const academic: AcademicData = data.academic;
  const hasGap = academic.gapYears > 1;
  const docList = useMemo(
    () => buildDocList(academic.diplomaLevel, hasGap, academic.gapDocTypes),
    [academic.diplomaLevel, academic.gapDocTypes, hasGap]
  );

  const uploaded = docList.filter((d) => documents[d.id]?.file).length;

  const submitLabel = submitting
    ? totalToUpload > 0
      ? `Envoi… (${uploadedCount}/${totalToUpload})`
      : "Envoi…"
    : "Soumettre le dossier";

  function handleDownload() {
    downloadAdmissionPdf(data);
    setDownloaded(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className={sectionTitleClass}>Documents</h2>

      <DocProgressBar uploaded={uploaded} total={docList.length} />

      <p className="text-xs text-gray-500">
        Chaque fichier doit faire moins de 5 Mo (limite Airtable). Compressez les PDF volumineux
        avant de les envoyer. Le bouton PDF télécharge le résumé de l&apos;étudiant et la liste des
        documents requis.
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

      {downloaded && (
        <p className="rounded-lg border border-italy-green/30 bg-italy-green/5 px-3 py-2 text-sm text-italy-green-dark">
          PDF téléchargé.
        </p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className={`${btnSecondaryClass} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Retour
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={submitting}
          className={`${btnSecondaryClass} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Télécharger le PDF
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
