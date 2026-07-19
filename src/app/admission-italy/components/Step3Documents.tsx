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
}

const EMPTY_ENTRY: DocumentEntry = { file: null, language: "" };

export default function Step3Documents({
  academic,
  documents,
  onDocumentChange,
  onBack,
  onSubmit,
}: Props) {
  const hasGap = academic.gapYears > 1;
  const docList = useMemo(
    () => buildDocList(academic.diplomaLevel, hasGap, academic.gapDocTypes),
    [academic.diplomaLevel, academic.gapDocTypes, hasGap]
  );

  const uploaded = docList.filter((d) => documents[d.id]?.file).length;

  return (
    <div className="flex flex-col gap-5">
      <h2 className={sectionTitleClass}>Documents</h2>

      <DocProgressBar uploaded={uploaded} total={docList.length} />

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

      <div className="mt-2 flex items-center gap-3">
        <button type="button" onClick={onBack} className={btnSecondaryClass}>
          Back
        </button>
        <button type="button" onClick={onSubmit} className={btnPrimaryClass}>
          Submit dossier
        </button>
      </div>
    </div>
  );
}
