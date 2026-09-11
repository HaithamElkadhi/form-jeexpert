"use client";

import { useMemo } from "react";
import { DOCUMENT_CATALOG, type DocumentCategory } from "@/app/bourse/catalog";
import { yearsMention } from "@/app/bourse/engine/years";
import {
  GENERAL_RULE,
  type AcademicYear,
  type BourseFormData,
  type GeneratedDocument,
} from "@/app/bourse/types";
import { sectionTitleClass, warningClass } from "@/app/bourse/components/fieldStyles";
import DocumentFieldCard from "./DocumentFieldCard";

interface Props {
  data: BourseFormData;
  documents: GeneratedDocument[];
  files: Record<string, File | null>;
  onFileChange: (key: string, file: File | null) => void;
  onBack: () => void;
  onRestart: () => void;
}

type SectionKey = "identity" | "civil" | "income" | "property" | "bank";

function sectionKeyFor(category: DocumentCategory | undefined): SectionKey {
  if (category === "university" || category === "identity") return "identity";
  if (category === "property") return "property";
  if (category === "bank") return "bank";
  if (category === "income") return "income";
  return "civil";
}

const SECTION_ORDER: SectionKey[] = ["identity", "civil", "income", "property", "bank"];

const SECTION_LABELS: Record<SectionKey, string> = {
  identity: "Identité & université",
  civil: "État civil",
  income: "Revenus",
  property: "Patrimoine immobilier",
  bank: "Comptes bancaires",
};

interface PersonField {
  fieldKey: string;
  personLabel: string;
  docs: GeneratedDocument[];
}

/** One upload field per (category, person) — not one per document. */
function groupIntoFields(documents: GeneratedDocument[]): Map<SectionKey, PersonField[]> {
  const bySection = new Map<SectionKey, Map<string, PersonField>>();
  for (const doc of documents) {
    const entry = DOCUMENT_CATALOG[doc.documentCode];
    const section = sectionKeyFor(entry?.category);
    if (!bySection.has(section)) bySection.set(section, new Map());
    const fields = bySection.get(section)!;
    const key = `${section}__${doc.personId}`;
    if (!fields.has(key)) {
      fields.set(key, { fieldKey: key, personLabel: doc.personLabel, docs: [] });
    }
    fields.get(key)!.docs.push(doc);
  }
  const result = new Map<SectionKey, PersonField[]>();
  for (const [section, fields] of bySection) {
    result.set(section, Array.from(fields.values()));
  }
  return result;
}

export default function StepDocumentsUpload({
  data,
  documents,
  files,
  onFileChange,
  onBack,
  onRestart,
}: Props) {
  const academicYear = data.academicYear as AcademicYear;
  const yearsNote = academicYear ? yearsMention(academicYear) : "";
  const sections = useMemo(() => groupIntoFields(documents), [documents]);
  const allFields = useMemo(() => Array.from(sections.values()).flat(), [sections]);
  const uploadedCount = allFields.filter((f) => files[f.fieldKey]).length;
  const total = allFields.length;
  const percent = total === 0 ? 0 : (uploadedCount / total) * 100;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className={sectionTitleClass}>Documents à fournir</h2>
        <p className="mt-1 text-sm text-gray-600">
          Un seul fichier par champ : regroupez-y les documents listés en dessous.
        </p>
      </div>

      {yearsNote && <p className={warningClass}>{yearsNote}</p>}

      <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
        {GENERAL_RULE}
      </p>

      <div className="flex flex-col gap-3">
        <p className="text-2xl font-semibold text-gray-900">
          {uploadedCount} <span className="text-gray-400">/ {total} fichiers</span>
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-italy-green transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {SECTION_ORDER.filter((key) => (sections.get(key)?.length ?? 0) > 0).map((key) => (
          <section key={key} className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-gray-900">{SECTION_LABELS[key]}</h3>
            <div className="flex flex-col gap-3">
              {sections.get(key)!.map((field) => (
                <DocumentFieldCard
                  key={field.fieldKey}
                  personLabel={field.personLabel}
                  docs={field.docs}
                  file={files[field.fieldKey] ?? null}
                  onChange={(file) => onFileChange(field.fieldKey, file)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100"
        >
          Retour
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100"
        >
          Nouveau formulaire
        </button>
      </div>
    </div>
  );
}
