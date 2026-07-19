"use client";

import { FormEvent } from "react";
import type { AcademicData, DiplomaLevel, ScoreFormat } from "../types";
import {
  DIPLOMA_LEVEL_OPTIONS,
  SCORE_FORMAT_OPTIONS,
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
      <h2 className={sectionTitleClass}>Academic background</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="diplomaLevel">
            Diploma level
          </label>
          <select
            id="diplomaLevel"
            className={inputClass}
            value={data.diplomaLevel}
            onChange={(e) => update("diplomaLevel", e.target.value as DiplomaLevel)}
          >
            <option value="" disabled>
              Select…
            </option>
            {DIPLOMA_LEVEL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="fieldOfStudy">
            Field of study
          </label>
          <input
            id="fieldOfStudy"
            className={inputClass}
            placeholder="Computer Science, Law, Medicine…"
            value={data.fieldOfStudy}
            onChange={(e) => update("fieldOfStudy", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="scoreFormat">
            Score format
          </label>
          <select
            id="scoreFormat"
            className={inputClass}
            value={data.scoreFormat}
            onChange={(e) => update("scoreFormat", e.target.value as ScoreFormat)}
          >
            <option value="" disabled>
              Select…
            </option>
            {SCORE_FORMAT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="scoreValue">
            Score value
          </label>
          <input
            id="scoreValue"
            className={inputClass}
            placeholder="16.5 / Très Bien / 3.8…"
            value={data.scoreValue}
            onChange={(e) => update("scoreValue", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="yearObtained">
            Year obtained
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
              Select…
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
            Years of professional experience
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
          Back
        </button>
        <button type="submit" className={btnPrimaryClass}>
          Continue
        </button>
      </div>
    </form>
  );
}
