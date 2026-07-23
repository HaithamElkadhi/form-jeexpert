"use client";

import { useMemo, useState } from "react";
import { DOCUMENT_CATALOG } from "../catalog";
import {
  buildChecklistText,
  buildSummary,
  documentsToCsv,
  statusLabel,
} from "../engine/summary";
import { yearsMention } from "../engine/years";
import { DOCUMENT_STATUS_OPTIONS } from "../options";
import {
  DISCLAIMER,
  DEFAULT_PREPARATION,
  APOSTILLE_NOTE,
  type AcademicYear,
  type BourseFormData,
  type DocumentStatus,
  type GeneratedDocument,
} from "../types";
import { inputClass, labelClass, sectionTitleClass, warningClass } from "./fieldStyles";

interface Props {
  data: BourseFormData;
  documents: GeneratedDocument[];
  onDocumentsChange: (docs: GeneratedDocument[]) => void;
  onBack: () => void;
  onRestart: () => void;
}

export default function ResultStep({
  data,
  documents,
  onDocumentsChange,
  onBack,
  onRestart,
}: Props) {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedChecklist, setCopiedChecklist] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);

  const summary = useMemo(() => buildSummary(data), [data]);
  const academicYear = data.academicYear as AcademicYear;
  const yearsNote = academicYear ? yearsMention(academicYear) : "";

  const checklistText = useMemo(
    () =>
      buildChecklistText(
        summary,
        documents.map((d) => ({
          ...d,
          status: statusLabel(d.status),
        })),
        academicYear,
        DISCLAIMER
      ),
    [summary, documents, academicYear]
  );

  async function copyText(text: string, which: "summary" | "checklist") {
    try {
      await navigator.clipboard.writeText(text);
      if (which === "summary") {
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 1500);
      } else {
        setCopiedChecklist(true);
        setTimeout(() => setCopiedChecklist(false), 1500);
      }
    } catch {
      // ignore
    }
  }

  function downloadBlob(content: string, filename: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    const payload = {
      generatedAt: new Date().toISOString(),
      student: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        university: data.university,
        cityOrRegion: data.cityOrRegion,
        academicYear: data.academicYear,
      },
      summary,
      documents,
      disclaimer: DISCLAIMER,
    };
    downloadBlob(JSON.stringify(payload, null, 2), `checklist-bourse-${data.lastName || "export"}.json`, "application/json");
  }

  function exportCsv() {
    downloadBlob(
      documentsToCsv(documents),
      `checklist-bourse-${data.lastName || "export"}.csv`,
      "text/csv;charset=utf-8"
    );
  }

  function exportPdf() {
    window.print();
  }

  function shareLink() {
    try {
      const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ data, documents }))));
      const url = `${window.location.origin}${window.location.pathname}?view=${payload}`;
      void navigator.clipboard.writeText(url).then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 1500);
      });
    } catch {
      // ignore
    }
  }

  function updateDoc(id: string, patch: Partial<GeneratedDocument>) {
    onDocumentsChange(documents.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }

  function removeDoc(id: string) {
    onDocumentsChange(documents.filter((d) => d.id !== id));
  }

  function addDoc() {
    const entry = DOCUMENT_CATALOG.TUN_NON_IMPOSITION;
    const doc: GeneratedDocument = {
      id: `doc_manual_${Date.now()}`,
      documentCode: entry.code,
      documentName: entry.name,
      personId: "manual",
      personLabel: "À préciser",
      institution: entry.institution,
      years: [],
      yearsLabel: "—",
      instructions: `${DEFAULT_PREPARATION} ${APOSTILLE_NOTE}`,
      requiredInfo: "",
      required: false,
      status: "needs_verification",
      sourceRule: "manual.add",
      note: "",
    };
    onDocumentsChange([...documents, doc]);
    setEditingId(doc.id);
  }

  return (
    <div className="flex flex-col gap-6 print:gap-4">
      <div className="print:hidden">
        <h2 className={sectionTitleClass}>Résultat personnalisé</h2>
        <p className="mt-1 text-sm text-gray-600">
          Checklist proposée à vérifier et modifier avant validation JEExpert.
        </p>
      </div>

      <div className="hidden print:block">
        <h1 className="text-xl font-semibold">
          Checklist bourse — {data.lastName} {data.firstName}
        </h1>
        <p className="text-sm text-gray-600">
          {data.university} · {data.cityOrRegion} · {data.academicYear}
        </p>
        <p className="text-xs text-gray-500">
          Généré le {new Date().toLocaleDateString("fr-FR")}
        </p>
      </div>

      {yearsNote && (
        <p className={`${warningClass} print:border print:bg-transparent`}>
          {yearsNote}
        </p>
      )}

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 print:hidden">
          <h3 className="text-base font-semibold text-gray-900">Résumé</h3>
          <button
            type="button"
            onClick={() => copyText(summary, "summary")}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            {copiedSummary ? "Copié" : "Copier le résumé"}
          </button>
        </div>
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 print:max-h-none print:overflow-visible">
          {summary}
        </pre>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
          <h3 className="text-base font-semibold text-gray-900">
            Checklist ({documents.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={addDoc}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Ajouter un document
            </button>
            <button
              type="button"
              onClick={() => copyText(checklistText, "checklist")}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {copiedChecklist ? "Copié" : "Copier la checklist"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {documents.map((doc) => {
            const isEditing = editingId === doc.id;
            return (
              <article
                key={doc.id}
                className="rounded-lg border border-gray-200 bg-white p-4 print:break-inside-avoid"
              >
                {isEditing ? (
                  <div className="flex flex-col gap-3 print:hidden">
                    <label className="flex flex-col gap-1">
                      <span className={labelClass}>Nom du document</span>
                      <input
                        className={inputClass}
                        value={doc.documentName}
                        onChange={(e) => updateDoc(doc.id, { documentName: e.target.value })}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className={labelClass}>Personne concernée</span>
                      <input
                        className={inputClass}
                        value={doc.personLabel}
                        onChange={(e) => updateDoc(doc.id, { personLabel: e.target.value })}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className={labelClass}>Où demander</span>
                      <input
                        className={inputClass}
                        value={doc.institution}
                        onChange={(e) => updateDoc(doc.id, { institution: e.target.value })}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className={labelClass}>Années</span>
                      <input
                        className={inputClass}
                        value={doc.yearsLabel}
                        onChange={(e) => updateDoc(doc.id, { yearsLabel: e.target.value })}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className={labelClass}>Préparation</span>
                      <textarea
                        className={inputClass}
                        rows={2}
                        value={doc.instructions}
                        onChange={(e) => updateDoc(doc.id, { instructions: e.target.value })}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className={labelClass}>Note</span>
                      <textarea
                        className={inputClass}
                        rows={2}
                        value={doc.note}
                        onChange={(e) => updateDoc(doc.id, { note: e.target.value })}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className={labelClass}>Statut</span>
                      <select
                        className={inputClass}
                        value={doc.status}
                        onChange={(e) =>
                          updateDoc(doc.id, { status: e.target.value as DocumentStatus })
                        }
                      >
                        {DOCUMENT_STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={doc.required}
                        onChange={(e) => updateDoc(doc.id, { required: e.target.checked })}
                        className="h-4 w-4 accent-italy-green"
                      />
                      Document obligatoire
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-lg bg-italy-green px-3 py-1.5 text-sm font-medium text-white"
                      >
                        Enregistrer
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDoc(doc.id)}
                        className="rounded-lg border border-italy-terracotta/40 px-3 py-1.5 text-sm font-medium text-italy-terracotta-dark"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 text-sm text-gray-800">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-gray-900">{doc.documentName}</p>
                      <button
                        type="button"
                        onClick={() => setEditingId(doc.id)}
                        className="shrink-0 text-xs font-medium text-italy-green print:hidden"
                      >
                        Modifier
                      </button>
                    </div>
                    <p>
                      <span className="text-gray-500">Pour :</span> {doc.personLabel}
                    </p>
                    <p>
                      <span className="text-gray-500">Où :</span> {doc.institution}
                    </p>
                    <p>
                      <span className="text-gray-500">Années :</span> {doc.yearsLabel}
                    </p>
                    {doc.requiredInfo && (
                      <p>
                        <span className="text-gray-500">Informations :</span>{" "}
                        {doc.requiredInfo}
                      </p>
                    )}
                    <p>
                      <span className="text-gray-500">Préparation :</span> {doc.instructions}
                    </p>
                    <p>
                      <span className="text-gray-500">Statut :</span> {statusLabel(doc.status)}
                      {!doc.required && " · optionnel"}
                    </p>
                    {doc.note && (
                      <p>
                        <span className="text-gray-500">Note :</span> {doc.note}
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <p className="text-sm text-gray-600">{DISCLAIMER}</p>

      {validated && (
        <p className="rounded-lg border border-italy-green/30 bg-italy-green/5 px-3 py-2 text-sm text-italy-green print:hidden">
          Checklist validée par JEExpert (proposition confirmée manuellement).
        </p>
      )}

      <div className="flex flex-col gap-3 print:hidden">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportPdf}
            className="rounded-lg bg-italy-green px-4 py-2 text-sm font-medium text-white hover:bg-italy-green-dark"
          >
            Imprimer / PDF
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Exporter JSON
          </button>
          <button
            type="button"
            onClick={exportCsv}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Télécharger CSV
          </button>
          <button
            type="button"
            onClick={shareLink}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            {linkCopied ? "Lien copié" : "Lien de consultation"}
          </button>
          <button
            type="button"
            onClick={() => setValidated(true)}
            className="rounded-lg border border-italy-green px-4 py-2 text-sm font-medium text-italy-green hover:bg-italy-green/5"
          >
            Valider définitivement
          </button>
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
    </div>
  );
}
