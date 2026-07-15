"use client";

import { FormEvent } from "react";
import { UpdateField, VisaFormData } from "../types";
import { CERTIFICAT_LANGUE_OPTIONS, EXEMPTION_UNIVERSITE_OPTIONS } from "../options";
import { RadioField, SelectField, TextField } from "./Field";
import { sectionTitleClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: VisaFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

export default function SectionC({ data, update, onNext, onBack }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className={sectionTitleClass}>Langue</h2>

      <SelectField
        id="certificat_langue"
        label="Certificat possédé"
        required
        options={CERTIFICAT_LANGUE_OPTIONS}
        value={data.certificat_langue}
        onChange={(v) => update("certificat_langue", v)}
      />

      {data.certificat_langue && data.certificat_langue !== "Aucun" && (
        <TextField
          id="certificat_details"
          label="Score + date d'obtention"
          value={data.certificat_details}
          onChange={(v) => update("certificat_details", v)}
        />
      )}

      <RadioField
        id="exemption_universite"
        label="La lettre d'admission mentionne exemption / vérification linguistique ?"
        required
        options={EXEMPTION_UNIVERSITE_OPTIONS}
        value={data.exemption_universite}
        onChange={(v) => update("exemption_universite", v)}
      />

      <StepNav onBack={onBack} />
    </form>
  );
}
