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

const FINANCING_PLAN_OPTIONS = [
  { value: "scholarship-only", label: "Bourse uniquement" },
  { value: "scholarship-plus-personal", label: "Bourse + fonds personnels" },
  { value: "personal-family-only", label: "Fonds personnels / familiaux" },
  { value: "not-sure-yet", label: "Pas encore décidé(e)" },
];

const GUARANTOR_OPTIONS = [
  { value: "self", label: "Moi-même" },
  { value: "parent", label: "Parent" },
  { value: "relative", label: "Membre de la famille" },
  { value: "sponsor", label: "Sponsor" },
];

const YES_NO_OPTIONS = [
  { value: "yes", label: "Oui" },
  { value: "no", label: "Non" },
];

export default function FinancialStep({ data, update, onNext, onBack }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-gray-900">Situation financière</h2>
        <p className="text-sm text-gray-500">
          Votre stratégie de financement pour les études en Italie.
        </p>
      </div>

      {/* Financing plan */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="financingPlan">
          Comment financerez-vous vos études ?
        </label>
        <select
          id="financingPlan"
          required
          className={inputClass}
          value={data.financingPlan}
          onChange={(e) => update("financingPlan", e.target.value)}
        >
          <option value="" disabled>
            Sélectionner
          </option>
          {FINANCING_PLAN_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Financial guarantor */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="financialGuarantor">
          Garant financier
        </label>
        <select
          id="financialGuarantor"
          required
          className={inputClass}
          value={data.financialGuarantor}
          onChange={(e) => update("financialGuarantor", e.target.value)}
        >
          <option value="" disabled>
            Sélectionner
          </option>
          {GUARANTOR_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Blocked account */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="blockedAccount">
            Compte bloqué possible ?
          </label>
          <select
            id="blockedAccount"
            required
            className={inputClass}
            value={data.blockedAccount}
            onChange={(e) => update("blockedAccount", e.target.value)}
          >
            <option value="" disabled>
              Sélectionner
            </option>
            {YES_NO_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Abroad support */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="hasAbroadSupport">
            Soutien financier depuis l&apos;étranger ?
          </label>
          <select
            id="hasAbroadSupport"
            required
            className={inputClass}
            value={data.hasAbroadSupport}
            onChange={(e) => {
              update("hasAbroadSupport", e.target.value);
              if (e.target.value !== "yes") update("abroadSupportDetails", "");
            }}
          >
            <option value="" disabled>
              Sélectionner
            </option>
            {YES_NO_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {data.hasAbroadSupport === "yes" && (
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="abroadSupportDetails">
            Précisez pays et lien de parenté
          </label>
          <input
            id="abroadSupportDetails"
            placeholder="Ex. France – oncle"
            className={inputClass}
            value={data.abroadSupportDetails}
            onChange={(e) => update("abroadSupportDetails", e.target.value)}
          />
        </div>
      )}

      {/* Budget */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="projectBudget">
          Budget disponible (€){" "}
          <span className="font-normal text-gray-400">(optionnel)</span>
        </label>
        <input
          id="projectBudget"
          type="number"
          min={0}
          placeholder="Ex. 5000"
          className={inputClass}
          value={data.projectBudget}
          onChange={(e) => update("projectBudget", e.target.value)}
        />
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
