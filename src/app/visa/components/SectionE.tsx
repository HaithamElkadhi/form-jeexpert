"use client";

import { FormEvent } from "react";
import { UpdateField, VisaFormData } from "../types";
import { GAP_ACTIVITES_OPTIONS, GAP_PREUVES_OPTIONS } from "../options";
import { MultiSelectField, TextareaField } from "./Field";
import { sectionTitleClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: VisaFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

export default function SectionE({ data, update, onNext, onBack }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className={sectionTitleClass}>Gap year</h2>

      <MultiSelectField
        id="gap_activites"
        label="Activités pendant le gap"
        required
        options={GAP_ACTIVITES_OPTIONS}
        value={data.gap_activites}
        onChange={(v) => update("gap_activites", v)}
      />

      <MultiSelectField
        id="gap_preuves"
        label="Preuves disponibles"
        required
        options={GAP_PREUVES_OPTIONS}
        value={data.gap_preuves}
        onChange={(v) => update("gap_preuves", v)}
      />

      <TextareaField
        id="gap_motivation"
        label="Pourquoi reprendre maintenant, pourquoi l'Italie ?"
        required
        hint="Alimente la lettre chronologique."
        value={data.gap_motivation}
        onChange={(v) => update("gap_motivation", v)}
      />

      <StepNav onBack={onBack} />
    </form>
  );
}
