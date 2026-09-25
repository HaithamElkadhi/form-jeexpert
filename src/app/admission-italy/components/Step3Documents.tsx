"use client";

import { useMemo, useState } from "react";
import { buildDocList, type DocDef } from "../buildDocList";
import { downloadAdmissionPdf } from "../buildAdmissionPdf";
import type { AcademicData, AdmissionFormData } from "../types";
import { btnPrimaryClass, btnSecondaryClass, sectionTitleClass } from "./fieldStyles";

interface Props {
  data: AdmissionFormData;
  onBack: () => void;
  onNext: () => void;
}

const SECTIONS: { key: DocDef["category"]; label: string }[] = [
  { key: "general",    label: "Général" },
  { key: "academic",   label: "Académique" },
  { key: "experience", label: "Expérience" },
];

function FileIcon() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M6 2.5h5.5L16 7v10.5a1 1 0 01-1 1H6a1 1 0 01-1-1V3.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11.5 2.5V7H16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export default function Step3Documents({ data, onBack, onNext }: Props) {
  const [downloaded, setDownloaded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const academic: AcademicData = data.academic;
  const hasGap = academic.hasGap && academic.gapYears > 0;
  const docList = useMemo(
    () => buildDocList(academic.diplomaLevel, hasGap, academic.gapDocTypes, academic.gapOtherDocLabel, academic.studyLanguage),
    [academic.diplomaLevel, academic.gapDocTypes, academic.gapOtherDocLabel, academic.studyLanguage, hasGap]
  );

  async function handleDownload() {
    setGenerating(true);
    try {
      await downloadAdmissionPdf(data);
      setDownloaded(true);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className={sectionTitleClass}>Documents à fournir</h2>

      <p className="text-sm text-gray-500">
        Voici la liste des documents requis pour votre dossier. Téléchargez le PDF pour la conserver.
      </p>

      <div className="flex flex-col gap-5">
        {SECTIONS.map(({ key, label }) => {
          const docs = docList.filter((d) => d.category === key);
          if (docs.length === 0) return null;
          return (
            <div key={key} className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
              {docs.map((def) => (
                <div
                  key={def.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
                >
                  <FileIcon />
                  <p className="text-sm font-medium text-gray-900">{def.name}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {downloaded && (
        <p className="rounded-lg border border-italy-green/30 bg-italy-green/5 px-3 py-2 text-sm text-italy-green-dark">
          PDF téléchargé.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onBack} className={btnSecondaryClass}>
          Retour
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={generating}
          className={`${btnSecondaryClass} disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {generating ? "Génération…" : "Télécharger le PDF"}
        </button>
        <button type="button" onClick={onNext} className={btnPrimaryClass}>
          Suivant →
        </button>
      </div>
    </div>
  );
}
