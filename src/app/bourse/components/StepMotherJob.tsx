"use client";

import type { BourseFormData, UpdateField } from "../types";
import { MOTHER_EMPLOYMENT_OPTIONS } from "../options";
import { RadioField } from "./Field";
import { sectionTitleClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: BourseFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

export default function StepMotherJob({ data, update, onNext, onBack }: Props) {
  const locked =
    data.parentsStatus === "mother_deceased" || data.parentsStatus === "both_deceased";

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <h2 className={sectionTitleClass}>Situation professionnelle de la mère</h2>
      {locked ? (
        <p className="text-sm text-gray-600">
          La mère est déclarée décédée. Un extrait d’acte de décès sera ajouté à
          la checklist. Aucun document de revenu ne sera généré pour la mère.
        </p>
      ) : (
        <RadioField
          id="motherEmployment"
          label="Quelle est la situation professionnelle de la mère ?"
          required
          value={data.motherEmployment}
          onChange={(v) => update("motherEmployment", v as BourseFormData["motherEmployment"])}
          options={MOTHER_EMPLOYMENT_OPTIONS}
        />
      )}
      <StepNav onBack={onBack} />
    </form>
  );
}
