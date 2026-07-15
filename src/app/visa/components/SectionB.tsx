"use client";

import { FormEvent } from "react";
import { UpdateField, VisaFormData } from "../types";
import {
  CHANGEMENT_DOMAINE_OPTIONS,
  DIPLOME_FINAL_OPTIONS,
  OUI_NON,
  RELEVES_COMPLETS_OPTIONS,
} from "../options";
import { RadioField, TextField, TextareaField } from "./Field";
import { sectionTitleClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: VisaFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

export default function SectionB({ data, update, onNext, onBack }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className={sectionTitleClass}>Parcours académique</h2>

      <TextField
        id="dernier_diplome"
        label="Dernier diplôme obtenu"
        required
        hint="ex. « Master informatique »"
        value={data.dernier_diplome}
        onChange={(v) => update("dernier_diplome", v)}
      />

      <TextField
        id="etablissement"
        label="Établissement + ville"
        required
        value={data.etablissement}
        onChange={(v) => update("etablissement", v)}
      />

      <TextField
        id="annee_diplome"
        label="Année d'obtention"
        type="number"
        required
        value={data.annee_diplome}
        onChange={(v) => update("annee_diplome", v)}
      />

      <RadioField
        id="diplome_final_en_main"
        label="Diplôme final disponible ?"
        required
        options={DIPLOME_FINAL_OPTIONS}
        value={data.diplome_final_en_main}
        onChange={(v) => update("diplome_final_en_main", v)}
      />

      <RadioField
        id="releves_complets"
        label="Relevés de notes de toutes les années disponibles ?"
        required
        options={RELEVES_COMPLETS_OPTIONS}
        value={data.releves_complets}
        onChange={(v) => update("releves_complets", v)}
      />

      <RadioField
        id="gap"
        label="Interruption entre le dernier diplôme et maintenant ?"
        required
        options={OUI_NON}
        value={data.gap}
        onChange={(v) => update("gap", v)}
      />

      {data.gap === "Oui" && (
        <TextField
          id="gap_duree"
          label="Durée du gap (années)"
          type="number"
          value={data.gap_duree}
          onChange={(v) => update("gap_duree", v)}
        />
      )}

      <RadioField
        id="etudes_abandonnees"
        label="Études commencées puis abandonnées ?"
        required
        options={OUI_NON}
        value={data.etudes_abandonnees}
        onChange={(v) => update("etudes_abandonnees", v)}
      />

      {data.etudes_abandonnees === "Oui" && (
        <TextareaField
          id="abandon_details"
          label="Où, quand, pourquoi (court)"
          value={data.abandon_details}
          onChange={(v) => update("abandon_details", v)}
        />
      )}

      <RadioField
        id="changement_domaine"
        label="Le nouveau cursus est-il dans le même domaine ?"
        required
        options={CHANGEMENT_DOMAINE_OPTIONS}
        value={data.changement_domaine}
        onChange={(v) => update("changement_domaine", v)}
      />

      {data.changement_domaine === "Non" && (
        <TextareaField
          id="lien_domaines"
          label="Lien entre ancien et nouveau parcours + objectif pro"
          value={data.lien_domaines}
          onChange={(v) => update("lien_domaines", v)}
        />
      )}

      <StepNav onBack={onBack} />
    </form>
  );
}
