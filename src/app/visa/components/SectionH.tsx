"use client";

import { FormEvent } from "react";
import { UpdateField, VisaFormData } from "../types";
import {
  ASSURANCE_OPTIONS,
  COHERENCE_NOMS_OPTIONS,
  LOGEMENT_TYPE_OPTIONS,
  MINEUR_OPTIONS,
} from "../options";
import { RadioField, SelectField, TextareaField } from "./Field";
import { sectionTitleClass, warningClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: VisaFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

export default function SectionH({ data, update, onNext, onBack }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  const showLogementWarning =
    data.logement_type === "Liste d'attente" || data.logement_type === "Rien encore";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className={sectionTitleClass}>Logement, assurance, transport</h2>

      <SelectField
        id="logement_type"
        label="Logement prévu"
        required
        options={LOGEMENT_TYPE_OPTIONS}
        value={data.logement_type}
        onChange={(v) => update("logement_type", v)}
      />

      {showLogementWarning && (
        <p className={warningClass}>Liste d&apos;attente ≠ réservation confirmée.</p>
      )}

      {data.logement_type === "Hébergement chez un proche" && (
        <TextareaField
          id="hebergeant_details"
          label="Identité, statut, logement de l'hébergeant"
          value={data.hebergeant_details}
          onChange={(v) => update("hebergeant_details", v)}
        />
      )}

      <SelectField
        id="assurance"
        label="Assurance médicale valable en Italie ?"
        required
        options={ASSURANCE_OPTIONS}
        value={data.assurance}
        onChange={(v) => update("assurance", v)}
      />

      <RadioField
        id="mineur"
        label="L'étudiant est-il mineur ?"
        required
        options={MINEUR_OPTIONS}
        value={data.mineur}
        onChange={(v) => update("mineur", v)}
      />

      {data.mineur === "Oui" && (
        <p className={warningClass}>
          Étudiant mineur : prévoir l&apos;autorisation parentale dans le dossier.
        </p>
      )}

      <RadioField
        id="coherence_noms"
        label="Noms/dates identiques sur passeport, diplômes, actes civils ?"
        required
        options={COHERENCE_NOMS_OPTIONS}
        value={data.coherence_noms}
        onChange={(v) => update("coherence_noms", v)}
      />

      <TextareaField
        id="notes_libres"
        label="Autres informations"
        value={data.notes_libres}
        onChange={(v) => update("notes_libres", v)}
      />

      <StepNav onBack={onBack} submitLabel="Voir le résumé" />
    </form>
  );
}
