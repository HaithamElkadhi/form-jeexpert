"use client";

import { FormEvent } from "react";
import { UpdateField, VisaFormData } from "../types";
import { BLOCAGE_COMPTE_OPTIONS, OUI_NON, SOURCE_FINANCEMENT_OPTIONS } from "../options";
import { RadioField, SelectField, TextareaField } from "./Field";
import { sectionTitleClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: VisaFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

export default function SectionD({ data, update, onNext, onBack }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className={sectionTitleClass}>Financement</h2>

      <SelectField
        id="source_financement"
        label="Qui finance ?"
        required
        options={SOURCE_FINANCEMENT_OPTIONS}
        value={data.source_financement}
        onChange={(v) => update("source_financement", v)}
      />

      <SelectField
        id="blocage_compte"
        label="Le blocage bancaire (~10 180 €) sera fait sur le compte de…"
        required
        options={BLOCAGE_COMPTE_OPTIONS}
        value={data.blocage_compte}
        onChange={(v) => update("blocage_compte", v)}
      />

      <RadioField
        id="historique_6mois"
        label="Historique bancaire ≥ 6 mois disponible ?"
        required
        options={OUI_NON}
        value={data.historique_6mois}
        onChange={(v) => update("historique_6mois", v)}
      />

      <RadioField
        id="gros_depots"
        label="Dépôts importants récents à expliquer ?"
        required
        options={OUI_NON}
        value={data.gros_depots}
        onChange={(v) => update("gros_depots", v)}
      />

      {data.gros_depots === "Oui" && (
        <TextareaField
          id="depots_details"
          label="Origine des dépôts"
          value={data.depots_details}
          onChange={(v) => update("depots_details", v)}
        />
      )}

      {data.source_financement === "Autofinancement" && (
        <TextareaField
          id="origine_epargne"
          label="Origine de l'épargne"
          hint="salaire, vente, héritage…"
          value={data.origine_epargne}
          onChange={(v) => update("origine_epargne", v)}
        />
      )}

      <StepNav onBack={onBack} />
    </form>
  );
}
