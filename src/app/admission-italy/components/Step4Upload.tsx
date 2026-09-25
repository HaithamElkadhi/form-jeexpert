"use client";

import { useMemo } from "react";
import { buildDocList, type DocDef } from "../buildDocList";
import type { AcademicData, AdmissionFormData, DocumentEntry } from "../types";
import DocItem from "./DocItem";
import DocProgressBar from "./DocProgressBar";
import { btnPrimaryClass, btnSecondaryClass, sectionTitleClass } from "./fieldStyles";

interface Props {
  data: AdmissionFormData;
  onDocumentChange: (id: string, entry: DocumentEntry) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  uploadedCount: number;
  totalToUpload: number;
  error: string | null;
}

const SECTIONS: { key: DocDef["category"]; label: string }[] = [
  { key: "general",    label: "Général" },
  { key: "academic",   label: "Académique" },
  { key: "experience", label: "Expérience" },
];

const EMPTY_ENTRY: DocumentEntry = { file: null };

export default function Step4Upload({
  data,
  onDocumentChange,
  onBack,
  onSubmit,
  submitting,
  uploadedCount,
  totalToUpload,
  error,
}: Props) {
  const academic: AcademicData = data.academic;
  const hasGap = academic.hasGap && academic.gapYears > 0;
  const docList = useMemo(
    () => buildDocList(academic.diplomaLevel, hasGap, academic.gapDocTypes, academic.gapOtherDocLabel, academic.studyLanguage),
    [academic.diplomaLevel, academic.gapDocTypes, academic.gapOtherDocLabel, academic.studyLanguage, hasGap]
  );

  const uploaded = docList.filter((d) => data.documents[d.id]?.file).length;

  const submitLabel = submitting
    ? totalToUpload > 0
      ? `Envoi… (${uploadedCount}/${totalToUpload})`
      : "Envoi…"
    : "Soumettre le dossier";

  return (
    <div className="flex flex-col gap-6">
      <h2 className={sectionTitleClass}>Téléversement des documents</h2>

      <DocProgressBar uploaded={uploaded} total={docList.length} />

      <p className="text-xs text-gray-500">
        Chaque fichier doit faire moins de 5 Mo. Compressez les PDF volumineux avant de les envoyer.
      </p>

      <div className="flex flex-col gap-5">
        {SECTIONS.map(({ key, label }) => {
          const docs = docList.filter((d) => d.category === key);
          if (docs.length === 0) return null;
          return (
            <div key={key} className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
              {docs.map((def) => (
                <DocItem
                  key={def.id}
                  def={def}
                  entry={data.documents[def.id] ?? EMPTY_ENTRY}
                  onChange={(entry) => onDocumentChange(def.id, entry)}
                />
              ))}
            </div>
          );
        })}
      </div>

      {error && (
        <p className="rounded-lg border border-italy-terracotta/30 bg-italy-terracotta/5 px-3 py-2 text-sm text-italy-terracotta-dark">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
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
