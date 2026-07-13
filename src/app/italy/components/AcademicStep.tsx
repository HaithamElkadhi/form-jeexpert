"use client";

import { FormEvent } from "react";
import { ItalyFormData, UpdateField } from "../types";
import { inputClass, labelClass } from "./fieldStyles";

interface Props {
  data: ItalyFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

// Must match the exact Airtable "Last Academic Level" single-select option names.
const ACADEMIC_LEVELS = ["High School", "Bachelor", "Master"];

export default function AcademicStep({ data, update, onNext, onBack }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-gray-900">Academic background</h2>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="lastAcademicLevel">
          Last academic level
        </label>
        <select
          id="lastAcademicLevel"
          required
          className={inputClass}
          value={data.lastAcademicLevel}
          onChange={(e) => update("lastAcademicLevel", e.target.value)}
        >
          <option value="" disabled>
            Select a level
          </option>
          {ACADEMIC_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="lastDiploma">
          Last diploma obtained
        </label>
        <input
          id="lastDiploma"
          required
          className={inputClass}
          value={data.lastDiploma}
          onChange={(e) => update("lastDiploma", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="languages">
          Languages you speak
        </label>
        <input
          id="languages"
          required
          placeholder="e.g. English, Italian, French"
          className={inputClass}
          value={data.languages}
          onChange={(e) => update("languages", e.target.value)}
        />
        <span className="text-xs text-gray-400">
          Separate multiple languages with a comma
        </span>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg px-4 py-3 font-medium text-gray-500 transition-colors hover:text-gray-700"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-italy-green px-6 py-3 font-medium text-white transition-colors hover:bg-italy-green-dark"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
