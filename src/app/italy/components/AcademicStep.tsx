"use client";

import { FormEvent, useState } from "react";
import { AcademicRecord, ItalyFormData, LanguageRecord, UpdateField } from "../types";
import { inputClass, labelClass } from "./fieldStyles";

interface Props {
  data: ItalyFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

const CURRENT_STATUS_OPTIONS = [
  { value: "Student", label: "Étudiant(e)" },
  { value: "Employed", label: "Employé(e)" },
  { value: "Unemployed", label: "Sans emploi" },
  { value: "Freelancer", label: "Freelance" },
];

const ACADEMIC_LEVEL_OPTIONS = [
  { value: "Pre Bac", label: "Pré-bac" },
  { value: "Bac (en cours)", label: "Bac (en cours)" },
  { value: "Bac accompli", label: "Bac accompli" },
  { value: "Bac +1", label: "Bac +1" },
  { value: "Bac +2 (BTS / BTP / DUT / équivalent)", label: "Bac +2 (BTS/BTP/DUT)" },
  { value: "Bac +3 (en cours)", label: "Bac +3 (en cours)" },
  { value: "Bac +3 accompli (Licence)", label: "Bac +3 — Licence" },
  { value: "Bac +4 (en cours)", label: "Bac +4 (en cours)" },
  { value: "Bac +5 (en cours – Master)", label: "Bac +5 (en cours)" },
  { value: "Bac +5 accompli (Master)", label: "Bac +5 — Master" },
  { value: "Bac +6+ (Doctorat / PhD)", label: "Doctorat / PhD" },
];

const DIPLOMA_OPTIONS = ["Bac", "BTS", "BTP", "Licence", "Master", "Engineering Degree", "PhD"];

const LANGUAGE_OPTIONS = ["Arabic", "English", "French", "Italian", "Spanish", "German", "Other"];
const LANGUAGE_LEVEL_OPTIONS = ["A1", "A2", "B1", "B2", "C1", "C2", "Native"];
const LANGUAGE_CERT_OPTIONS = ["IELTS", "TOEFL", "TOEIC", "Cambridge", "Duolingo", "DELF", "DALF", "None"];

const LANG_LABELS: Record<string, string> = {
  Arabic: "Arabe",
  English: "Anglais",
  French: "Français",
  Italian: "Italien",
  Spanish: "Espagnol",
  German: "Allemand",
  Other: "Autre",
};

function computeGpa(score: string, maxScore: string): string {
  const s = Number(score);
  const m = Number(maxScore);
  if (!Number.isFinite(s) || !Number.isFinite(m) || m <= 0) return "";
  return ((s / m) * 4).toFixed(2);
}

export default function AcademicStep({ data, update, onNext, onBack }: Props) {
  const [langError, setLangError] = useState<string | null>(null);

  function toggleDiploma(diploma: string) {
    const selected = data.obtainedDiploma.includes(diploma)
      ? data.obtainedDiploma.filter((d) => d !== diploma)
      : [...data.obtainedDiploma, diploma];
    const map = new Map(data.academicRecords.map((r) => [r.diploma, r]));
    const records: AcademicRecord[] = selected.map(
      (d) => map.get(d) ?? { diploma: d, score: "", maxScore: "20" }
    );
    update("obtainedDiploma", selected);
    update("academicRecords", records);
  }

  function updateRecord(idx: number, key: keyof AcademicRecord, value: string) {
    const next = data.academicRecords.map((r, i) =>
      i === idx ? { ...r, [key]: value } : r
    );
    update("academicRecords", next);
  }

  function toggleLanguage(lang: string) {
    const selected = data.languages.includes(lang)
      ? data.languages.filter((l) => l !== lang)
      : [...data.languages, lang];
    const map = new Map(data.languageRecords.map((r) => [r.language, r]));
    const records: LanguageRecord[] = selected.map(
      (l) => map.get(l) ?? { language: l, level: "", certificate: "" }
    );
    update("languages", selected);
    update("languageRecords", records);
    if (selected.length > 0) setLangError(null);
  }

  function updateLangRecord(idx: number, key: keyof LanguageRecord, value: string) {
    const next = data.languageRecords.map((r, i) =>
      i === idx ? { ...r, [key]: value } : r
    );
    update("languageRecords", next);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (data.languages.length === 0) {
      setLangError("Sélectionnez au moins une langue.");
      return;
    }
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-gray-900">Profil académique</h2>

      {/* Current status */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="currentStatus">
          Situation actuelle
        </label>
        <select
          id="currentStatus"
          required
          className={inputClass}
          value={data.currentStatus}
          onChange={(e) => update("currentStatus", e.target.value)}
        >
          <option value="" disabled>
            Sélectionner
          </option>
          {CURRENT_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {data.currentStatus === "Employed" && (
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="currentOccupation">
            Profession actuelle
          </label>
          <input
            id="currentOccupation"
            className={inputClass}
            placeholder="Ex. Développeur logiciel"
            value={data.currentOccupation}
            onChange={(e) => update("currentOccupation", e.target.value)}
          />
        </div>
      )}

      {/* Academic level */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="academicLevel">
          Niveau d&apos;études actuel
        </label>
        <select
          id="academicLevel"
          required
          className={inputClass}
          value={data.academicLevel}
          onChange={(e) => update("academicLevel", e.target.value)}
        >
          <option value="" disabled>
            Sélectionner un niveau
          </option>
          {ACADEMIC_LEVEL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Obtained diplomas */}
      <div className="flex flex-col gap-2">
        <p className={labelClass}>Diplômes obtenus</p>
        <div className="flex flex-wrap gap-2">
          {DIPLOMA_OPTIONS.map((d) => {
            const selected = data.obtainedDiploma.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDiploma(d)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  selected
                    ? "border-italy-green bg-italy-green/10 text-italy-green-dark"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>

        {data.academicRecords.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            {data.academicRecords.map((rec, idx) => {
              const gpa = computeGpa(rec.score, rec.maxScore);
              return (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_5rem_5rem_4.5rem] items-end gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  <div>
                    <p className="mb-1 text-xs text-gray-500">Diplôme</p>
                    <div className="flex h-9 items-center rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900">
                      {rec.diploma}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-gray-500">Note</p>
                    <input
                      type="number"
                      placeholder="14"
                      className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm outline-none focus:border-italy-green"
                      value={rec.score}
                      onChange={(e) => updateRecord(idx, "score", e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-gray-500">Sur</p>
                    <div className="flex h-9 items-center rounded-md border border-gray-200 bg-gray-100 px-2 text-sm text-gray-500">
                      20
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-gray-500">GPA</p>
                    <div
                      className={`flex h-9 items-center justify-center rounded-md border px-2 text-sm font-bold ${
                        gpa
                          ? "border-italy-green/30 bg-italy-green/5 text-italy-green-dark"
                          : "border-gray-200 bg-white text-gray-400"
                      }`}
                    >
                      {gpa || "—"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Study history */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="fieldOfPreviousStudies">
            Domaine d&apos;études précédent
          </label>
          <input
            id="fieldOfPreviousStudies"
            className={inputClass}
            placeholder="Informatique, droit…"
            value={data.fieldOfPreviousStudies}
            onChange={(e) => update("fieldOfPreviousStudies", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="yearOfGraduation">
            Année d&apos;obtention du dernier diplôme
          </label>
          <input
            id="yearOfGraduation"
            type="number"
            min={1990}
            max={2100}
            placeholder="2024"
            className={inputClass}
            value={data.yearOfGraduation}
            onChange={(e) => update("yearOfGraduation", e.target.value)}
          />
        </div>
      </div>

      {/* Language profile */}
      <div className="flex flex-col gap-2">
        <p className={labelClass}>Langues parlées</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => {
            const selected = data.languages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  selected
                    ? "border-italy-green bg-italy-green/10 text-italy-green-dark"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {LANG_LABELS[lang] ?? lang}
              </button>
            );
          })}
        </div>
        {langError && <p className="text-xs text-red-600">{langError}</p>}

        {data.languageRecords.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            {data.languageRecords.map((rec, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 items-end gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <div>
                  <p className="mb-1 text-xs text-gray-500">Langue</p>
                  <div className="flex h-9 items-center rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900">
                    {LANG_LABELS[rec.language] ?? rec.language}
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-500">Niveau</p>
                  <select
                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-sm outline-none focus:border-italy-green"
                    value={rec.level}
                    onChange={(e) => updateLangRecord(idx, "level", e.target.value)}
                  >
                    <option value="">—</option>
                    {LANGUAGE_LEVEL_OPTIONS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-500">Certificat</p>
                  <select
                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-sm outline-none focus:border-italy-green"
                    value={rec.certificate}
                    onChange={(e) => updateLangRecord(idx, "certificate", e.target.value)}
                  >
                    <option value="">—</option>
                    {LANGUAGE_CERT_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg px-4 py-3 font-medium text-gray-500 transition-colors hover:text-gray-700"
        >
          Retour
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-italy-green px-6 py-3 font-medium text-white transition-colors hover:bg-italy-green-dark"
        >
          Continuer
        </button>
      </div>
    </form>
  );
}
