"use client";

import { FormEvent } from "react";
import { UpdateField, VisaFormData } from "../types";
import { BOURSE_COUVERTURE_OPTIONS, BOURSE_STATUT_OPTIONS } from "../options";
import { MultiSelectField, SelectField, TextField } from "./Field";
import { sectionTitleClass, warningClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: VisaFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

export default function SectionG({ data, update, onNext, onBack }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className={sectionTitleClass}>Bourse</h2>

      <SelectField
        id="bourse_statut"
        label="Statut"
        required
        options={BOURSE_STATUT_OPTIONS}
        value={data.bourse_statut}
        onChange={(v) => update("bourse_statut", v)}
      />

      {data.bourse_statut && data.bourse_statut !== "Attribuée officiellement" && (
        <p className={warningClass}>
          Ne remplace pas les preuves de ressources — la section Garant(s) est requise.
        </p>
      )}

      <TextField
        id="bourse_organisme"
        label="Organisme"
        value={data.bourse_organisme}
        onChange={(v) => update("bourse_organisme", v)}
      />

      <TextField
        id="bourse_montant"
        label="Montant + durée + date de début"
        value={data.bourse_montant}
        onChange={(v) => update("bourse_montant", v)}
      />

      <MultiSelectField
        id="bourse_couverture"
        label="Dépenses couvertes"
        options={BOURSE_COUVERTURE_OPTIONS}
        value={data.bourse_couverture}
        onChange={(v) => update("bourse_couverture", v)}
      />

      <StepNav onBack={onBack} />
    </form>
  );
}
