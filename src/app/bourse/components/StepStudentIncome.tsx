"use client";

import type { BourseFormData, UpdateField } from "../types";
import { STUDENT_INCOME_OPTIONS } from "../options";
import { MultiSelectField, RadioField } from "./Field";
import { sectionTitleClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: BourseFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

export default function StepStudentIncome({ data, update, onNext, onBack }: Props) {
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (data.studentHasIncome === "yes" && data.studentIncomeOrigins.length === 0) {
          return;
        }
        onNext();
      }}
    >
      <h2 className={sectionTitleClass}>Situation économique de l’étudiant</h2>
      <RadioField
        id="studentHasIncome"
        label="L’étudiant a-t-il travaillé ou reçu un revenu pendant l’une des années concernées ?"
        required
        value={data.studentHasIncome}
        onChange={(v) => {
          update("studentHasIncome", v as BourseFormData["studentHasIncome"]);
          if (v === "no") update("studentIncomeOrigins", []);
        }}
        options={[
          { value: "yes", label: "Oui" },
          { value: "no", label: "Non" },
        ]}
      />
      {data.studentHasIncome === "yes" && (
        <MultiSelectField
          id="studentIncomeOrigins"
          label="Quelle est l’origine du revenu ?"
          required
          value={data.studentIncomeOrigins}
          onChange={(v) =>
            update("studentIncomeOrigins", v as BourseFormData["studentIncomeOrigins"])
          }
          options={STUDENT_INCOME_OPTIONS}
        />
      )}
      {data.studentHasIncome === "no" && (
        <p className="text-sm text-gray-600">
          Une attestation de non-imposition sera demandée pour les deux années
          économiques calculées.
        </p>
      )}
      <StepNav onBack={onBack} />
    </form>
  );
}
