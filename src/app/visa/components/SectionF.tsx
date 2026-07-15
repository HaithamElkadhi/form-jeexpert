"use client";

import { FormEvent } from "react";
import { GuarantorData, UpdateField, UpdateGuarantor, VisaFormData } from "../types";
import { OUI_NON } from "../options";
import { RadioField, TextareaField } from "./Field";
import { sectionTitleClass } from "./fieldStyles";
import StepNav from "./StepNav";
import GuarantorFields from "./GuarantorFields";

interface Props {
  data: VisaFormData;
  update: UpdateField;
  updateGuarantor: UpdateGuarantor;
  onNext: () => void;
  onBack: () => void;
}

export default function SectionF({ data, update, updateGuarantor, onNext, onBack }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className={sectionTitleClass}>Garant(s)</h2>

      <GuarantorFields
        idPrefix="garant1"
        title="Garant principal"
        data={data.garant1}
        onChange={(key: keyof GuarantorData, value) => updateGuarantor("garant1", key, value)}
      />

      <RadioField
        id="deuxieme_garant"
        label="Ajouter un 2e garant complémentaire ?"
        required
        options={OUI_NON}
        value={data.deuxieme_garant}
        onChange={(v) => update("deuxieme_garant", v)}
      />

      {data.deuxieme_garant === "Oui" && (
        <>
          <GuarantorFields
            idPrefix="garant2"
            title="Garant complémentaire"
            data={data.garant2}
            onChange={(key: keyof GuarantorData, value) => updateGuarantor("garant2", key, value)}
          />
          <TextareaField
            id="repartition"
            label="Répartition des dépenses"
            hint="ex. « père = blocage, mère = revenus mensuels »"
            value={data.repartition}
            onChange={(v) => update("repartition", v)}
          />
        </>
      )}

      <StepNav onBack={onBack} />
    </form>
  );
}
