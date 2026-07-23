"use client";

import type { BourseFormData, UpdateField } from "../types";
import { PARENTS_STATUS_OPTIONS } from "../options";
import { RadioField, TextField } from "./Field";
import { sectionTitleClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: BourseFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

export default function StepParentsStatus({ data, update, onNext, onBack }: Props) {
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <h2 className={sectionTitleClass}>Situation familiale des parents</h2>
      <RadioField
        id="parentsStatus"
        label="Quelle est la situation actuelle de vos parents ?"
        required
        value={data.parentsStatus}
        onChange={(v) => {
          update("parentsStatus", v as BourseFormData["parentsStatus"]);
          if (v === "father_deceased" || v === "both_deceased") {
            update("fatherEmployment", "deceased");
          }
          if (v === "mother_deceased" || v === "both_deceased") {
            update("motherEmployment", "deceased");
          }
        }}
        options={PARENTS_STATUS_OPTIONS}
      />
      {data.parentsStatus === "other" && (
        <TextField
          id="parentsStatusOther"
          label="Précisez la situation"
          required
          value={data.parentsStatusOther}
          onChange={(v) => update("parentsStatusOther", v)}
        />
      )}
      <StepNav onBack={onBack} />
    </form>
  );
}
