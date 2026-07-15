"use client";

import { FormEvent } from "react";
import { UpdateField, VisaFormData } from "../types";
import {
  ADMISSION_STATUT_OPTIONS,
  ALMAVIVA_OPTIONS,
  CIMEA_DOV_OPTIONS,
  CURSUS_TYPE_OPTIONS,
  LANGUE_CURSUS_OPTIONS,
  NATIONALITE_OPTIONS,
  OUI_NON,
  PASSEPORT_VALIDITE_OPTIONS,
  UNIVERSITALY_STATUT_OPTIONS,
} from "../options";
import { RadioField, SelectField, TextField, TextareaField } from "./Field";
import { sectionTitleClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: VisaFormData;
  update: UpdateField;
  onNext: () => void;
}

export default function SectionA({ data, update, onNext }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className={sectionTitleClass}>Profil et admission</h2>

      <TextField
        id="nom"
        label="Nom complet de l'étudiant(e)"
        required
        value={data.nom}
        onChange={(v) => update("nom", v)}
      />

      <TextField
        id="age"
        label="Âge"
        type="number"
        required
        value={data.age}
        onChange={(v) => update("age", v)}
      />

      <RadioField
        id="nationalite"
        label="Nationalité"
        required
        options={NATIONALITE_OPTIONS}
        value={data.nationalite}
        onChange={(v) => update("nationalite", v)}
      />

      {data.nationalite === "Autre" && (
        <RadioField
          id="residence_legale"
          label="Justificatif de résidence légale en Tunisie ?"
          options={OUI_NON}
          value={data.residence_legale}
          onChange={(v) => update("residence_legale", v)}
        />
      )}

      <RadioField
        id="passeport_validite"
        label="Passeport valide > 15 mois au dépôt ?"
        required
        options={PASSEPORT_VALIDITE_OPTIONS}
        value={data.passeport_validite}
        onChange={(v) => update("passeport_validite", v)}
      />

      <SelectField
        id="cursus_type"
        label="Type de cursus"
        required
        options={CURSUS_TYPE_OPTIONS}
        value={data.cursus_type}
        onChange={(v) => update("cursus_type", v)}
      />

      <TextField
        id="universite"
        label="Université"
        required
        value={data.universite}
        onChange={(v) => update("universite", v)}
      />

      <TextField
        id="ville"
        label="Ville"
        required
        value={data.ville}
        onChange={(v) => update("ville", v)}
      />

      <TextField
        id="programme"
        label="Intitulé du programme"
        required
        value={data.programme}
        onChange={(v) => update("programme", v)}
      />

      <RadioField
        id="langue_cursus"
        label="Langue du cursus"
        required
        options={LANGUE_CURSUS_OPTIONS}
        value={data.langue_cursus}
        onChange={(v) => update("langue_cursus", v)}
      />

      <SelectField
        id="universitaly_statut"
        label="Statut Universitaly"
        required
        options={UNIVERSITALY_STATUT_OPTIONS}
        value={data.universitaly_statut}
        onChange={(v) => update("universitaly_statut", v)}
      />

      <RadioField
        id="almaviva"
        label="Contacté(e) par ALMAVIVA ?"
        options={ALMAVIVA_OPTIONS}
        value={data.almaviva}
        onChange={(v) => update("almaviva", v)}
      />

      <SelectField
        id="admission_statut"
        label="Lettre d'admission"
        required
        options={ADMISSION_STATUT_OPTIONS}
        value={data.admission_statut}
        onChange={(v) => update("admission_statut", v)}
      />

      {data.admission_statut === "Reçue conditionnelle" && (
        <TextareaField
          id="admission_conditions"
          label="Conditions restantes (test, acompte…)"
          value={data.admission_conditions}
          onChange={(v) => update("admission_conditions", v)}
        />
      )}

      <SelectField
        id="cimea_dov"
        label="Ce que demande l'université / Universitaly"
        required
        options={CIMEA_DOV_OPTIONS}
        value={data.cimea_dov}
        onChange={(v) => update("cimea_dov", v)}
      />

      <StepNav />
    </form>
  );
}
