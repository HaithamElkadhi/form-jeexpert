"use client";

import { FormEvent } from "react";
import type { AcademicData, DiplomaLevel } from "../types";
import {
  DIPLOMA_LEVEL_OPTIONS,
  YEAR_OPTIONS,
  YEARS_EXPERIENCE_OPTIONS,
  computeGapYears,
} from "../options";
import GapBox from "./GapBox";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  inputClass,
  labelClass,
  sectionTitleClass,
} from "./fieldStyles";

interface Props {
  data: AcademicData;
  update: <K extends keyof AcademicData>(key: K, value: AcademicData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Academic({ data, update, onNext, onBack }: Props) {
  function syncGap(yearObtained: string, yearsExperience: string) {
    update("gapYears", computeGapYears(yearObtained, yearsExperience));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  const showGap = data.gapYears > 1;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
        <label className={labelClass} htmlFor="scoreValue">
          Moyenne générale (/20)
        </label>
        <input
          id="scoreValue"
          className={inputClass}
          placeholder="16,5"
          value={data.scoreValue}
          onChange={(e) => update("scoreValue", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="yearObtained">
            Année d&apos;obtention
          </label>
          <select
            id="yearObtained"
            className={inputClass}
            value={data.yearObtained}
            onChange={(e) => {
              const year = e.target.value;
              update("yearObtained", year);
              syncGap(year, data.yearsExperience);
            }}
          >
            <option value="" disabled>
              Sélectionner…
            </option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="yearsExperience">
            Années d&apos;expérience professionnelle
          </label>
          <select
            id="yearsExperience"
            className={inputClass}
            value={data.yearsExperience}
            onChange={(e) => {
              const years = e.target.value;
              update("yearsExperience", years);
              syncGap(data.yearObtained, years);
            }}
          >
            {YEARS_EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showGap && (
        <GapBox
          gapYears={data.gapYears}
          gapDescription={data.gapDescription}
          gapDocTypes={data.gapDocTypes}
          onDescriptionChange={(v) => update("gapDescription", v)}
          onDocTypesChange={(types) => update("gapDocTypes", types)}
        />
      )}

      <div className="mt-2 flex items-center gap-3">
        <button type="button" onClick={onBack} className={btnSecondaryClass}>
          Retour
        </button>
        <button type="submit" className={btnPrimaryClass}>
          Continuer
        </button>
      </div>
    </form>
  );
}
