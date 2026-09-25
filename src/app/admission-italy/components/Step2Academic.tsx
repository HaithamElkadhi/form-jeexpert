"use client";

import { FormEvent } from "react";
import type { AcademicData, DiplomaLevel, GapDocType, StudyLanguage } from "../types";
import { DIPLOMA_LEVEL_OPTIONS } from "../options";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  inputClass,
  labelClass,
  pillActiveClass,
  pillClass,
  pillIdleClass,
  sectionTitleClass,
} from "./fieldStyles";

interface Props {
  data: AcademicData;
  update: <K extends keyof AcademicData>(key: K, value: AcademicData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

const hasOther = (types: GapDocType[]) => types.includes("Other document");

const STUDY_LANGUAGE_OPTIONS: { value: StudyLanguage; label: string }[] = [
  { value: "Anglais", label: "Anglais" },
  { value: "Italien", label: "Italien" },
];

const EXTRA_DOC_OPTIONS: { value: GapDocType; label: string }[] = [
  { value: "Work certificate", label: "Attestation de travail" },
  { value: "Internship / Stage", label: "Stage" },
  { value: "Training / Formation", label: "Formation" },
  { value: "Other document", label: "Autre" },
];

function YesNo({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-3">
      {(["Oui", "Non"] as const).map((label) => {
        const v = label === "Oui";
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(v)}
            className={`h-9 rounded-lg border-2 px-5 text-sm font-medium transition-colors ${
              value === v
                ? "border-italy-green bg-italy-green/10 text-italy-green-dark"
                : "border-gray-300 text-gray-600 hover:border-gray-400"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function Step2Academic({ data, update, onNext, onBack }: Props) {
  function toggleDocType(type: GapDocType) {
    const next = data.gapDocTypes.includes(type)
      ? data.gapDocTypes.filter((t) => t !== type)
      : [...data.gapDocTypes, type];
    update("gapDocTypes", next);
    if (type === "Other document" && data.gapDocTypes.includes(type)) {
      update("gapOtherDocLabel", "");
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h2 className={sectionTitleClass}>Parcours académique</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="diplomaLevel">
            Dernier diplôme obtenu
          </label>
          <select
            id="diplomaLevel"
            className={inputClass}
            value={data.diplomaLevel}
            onChange={(e) => update("diplomaLevel", e.target.value as DiplomaLevel)}
          >
            <option value="" disabled>
              Sélectionner…
            </option>
            {DIPLOMA_LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="fieldOfStudy">
            Nom du diplôme
          </label>
          <input
            id="fieldOfStudy"
            className={inputClass}
            placeholder="Licence en Informatique, Master en Droit…"
            value={data.fieldOfStudy}
            onChange={(e) => update("fieldOfStudy", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="yearObtained">
          Année d&apos;obtention
        </label>
        <input
          id="yearObtained"
          className={inputClass}
          placeholder="Ex. 2022"
          value={data.yearObtained}
          onChange={(e) => update("yearObtained", e.target.value)}
        />
      </div>

      {/* Study language */}
      <div className="flex flex-col gap-2">
        <p className={labelClass}>Langue d&apos;enseignement souhaitée</p>
        <div className="flex gap-3">
          {STUDY_LANGUAGE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => update("studyLanguage", data.studyLanguage === value ? "" : value)}
              className={`h-9 rounded-lg border-2 px-5 text-sm font-medium transition-colors ${
                data.studyLanguage === value
                  ? "border-italy-green bg-italy-green/10 text-italy-green-dark"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Gap years */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col gap-2">
          <p className={labelClass}>Avez-vous des années de gap ?</p>
          <YesNo
            value={data.hasGap}
            onChange={(v) => {
              update("hasGap", v);
              if (!v) update("gapYears", 0);
            }}
          />
        </div>

        {data.hasGap && (
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="gapYears">
              Combien d&apos;années ?
            </label>
            <input
              id="gapYears"
              type="number"
              min={1}
              max={20}
              className={`${inputClass} w-32`}
              placeholder="Ex. 2"
              value={data.gapYears || ""}
              onChange={(e) => update("gapYears", Number(e.target.value) || 0)}
            />
          </div>
        )}
      </div>

      {/* Extra documents */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col gap-1">
          <p className={labelClass}>Documents complémentaires</p>
          <p className="text-xs text-gray-400">
            Sélectionnez les documents que vous possédez — un emplacement d&apos;envoi sera ajouté pour chacun.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXTRA_DOC_OPTIONS.map(({ value, label }) => {
            const selected = data.gapDocTypes.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleDocType(value)}
                className={`${pillClass} ${selected ? pillActiveClass : pillIdleClass}`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {hasOther(data.gapDocTypes) && (
          <div className="flex flex-col gap-1.5 pt-1">
            <label className={labelClass} htmlFor="gapOtherDocLabel">
              Nom du document
            </label>
            <input
              id="gapOtherDocLabel"
              className={inputClass}
              placeholder="Ex. Certificat de bénévolat"
              value={data.gapOtherDocLabel}
              onChange={(e) => update("gapOtherDocLabel", e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button type="button" onClick={onBack} className={btnSecondaryClass}>
          Retour
        </button>
        <button type="submit" className={btnPrimaryClass}>
          Continuer
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg px-4 py-3 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600"
        >
          Passer →
        </button>
      </div>
    </form>
  );
}
