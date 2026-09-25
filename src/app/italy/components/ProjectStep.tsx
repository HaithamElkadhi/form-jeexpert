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

const DEGREE_LEVELS = [
  { value: "bachelor", label: "Bachelor / Licence" },
  { value: "master", label: "Master" },
  { value: "researcher", label: "Researcher" },
  { value: "phd", label: "Doctorat / PhD" },
  { value: "formation-prof", label: "Formation professionnelle" },
];

const INTAKE_OPTIONS = [
  { value: "2025/2026", label: "2025/2026" },
  { value: "2026/2027", label: "2026/2027" },
  { value: "2027/2028", label: "2027/2028" },
  { value: "Flexible", label: "Flexible" },
];

export default function ProjectStep({ data, update, onNext, onBack }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-gray-900">Projet d&apos;études</h2>
        <p className="text-sm text-gray-500">Ce que vous comptez étudier en Italie.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="targetDegreeLevel">
          Niveau visé
        </label>
        <select
          id="targetDegreeLevel"
          required
          className={inputClass}
          value={data.targetDegreeLevel}
          onChange={(e) => update("targetDegreeLevel", e.target.value)}
        >
          <option value="" disabled>
            Sélectionner un niveau
          </option>
          {DEGREE_LEVELS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="intendedIntake">
          Année d&apos;entrée souhaitée
        </label>
        <select
          id="intendedIntake"
          required
          className={inputClass}
          value={data.intendedIntake}
          onChange={(e) => update("intendedIntake", e.target.value)}
        >
          <option value="" disabled>
            Sélectionner
          </option>
          {INTAKE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
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
