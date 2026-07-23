"use client";

import type { BourseFormData, UpdateField } from "../types";
import { FATHER_EMPLOYMENT_OPTIONS } from "../options";
import { RadioField } from "./Field";
import { sectionTitleClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: BourseFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

export default function StepFatherJob({ data, update, onNext, onBack }: Props) {
  const locked =
    data.parentsStatus === "father_deceased" || data.parentsStatus === "both_deceased";

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <h2 className={sectionTitleClass}>Situation professionnelle du père</h2>
      {locked ? (
        <p className="text-sm text-gray-600">
          Le père est déclaré décédé. Un extrait d’acte de décès sera ajouté à la
          checklist. Aucun document de revenu ne sera généré pour le père.
        </p>
      ) : (
        <RadioField
          id="fatherEmployment"
          label="Quelle est la situation professionnelle du père ?"
          required
          value={data.fatherEmployment}
          onChange={(v) => update("fatherEmployment", v as BourseFormData["fatherEmployment"])}
          options={FATHER_EMPLOYMENT_OPTIONS}
        />
      )}
      <StepNav onBack={onBack} />
    </form>
  );
}
