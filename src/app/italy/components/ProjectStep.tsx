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

// Must match the exact Airtable "Entry Level" multi-select option names.
const ENTRY_LEVELS = ["Bachelor", "Master"];

export default function ProjectStep({ data, update, onNext, onBack }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-gray-900">Your project</h2>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="entryLevel">
          Entry level
        </label>
        <select
          id="entryLevel"
          required
          className={inputClass}
          value={data.entryLevel}
          onChange={(e) => update("entryLevel", e.target.value)}
        >
          <option value="" disabled>
            Select a level
          </option>
          {ENTRY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="preferredField">
          Preferred field of study
        </label>
        <input
          id="preferredField"
          required
          className={inputClass}
          value={data.preferredField}
          onChange={(e) => update("preferredField", e.target.value)}
        />
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
