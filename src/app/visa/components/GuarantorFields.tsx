"use client";

import { GuarantorData } from "../types";
import { GARANT_DOCS_OPTIONS, GARANT_LIEN_OPTIONS, GARANT_STATUT_OPTIONS, OUI_NON } from "../options";
import { MultiSelectField, RadioField, SelectField, TextField, TextareaField } from "./Field";
import { warningClass } from "./fieldStyles";

interface Props {
  idPrefix: string;
  title: string;
  data: GuarantorData;
  onChange: (key: keyof GuarantorData, value: string | string[]) => void;
}

export default function GuarantorFields({ idPrefix, title, data, onChange }: Props) {
  const isFamilleElargie =
    data.garant_lien === "Oncle-Tante" || data.garant_lien === "Autre famille ≤ 4e degré";
  const isEnItalie = data.garant_lien === "Personne vivant en Italie";
  const isSansLien = data.garant_lien === "Sans lien familial";

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900">{title}</h3>

      <SelectField
        id={`${idPrefix}_lien`}
        label="Lien avec l'étudiant"
        required
        options={GARANT_LIEN_OPTIONS}
        value={data.garant_lien}
        onChange={(v) => onChange("garant_lien", v)}
      />

      {isSansLien && (
        <p className={warningClass}>
          Solution déconseillée : prévoir des ressources personnelles ou familiales en
          complément.
        </p>
      )}

      {isFamilleElargie && (
        <TextField
          id={`${idPrefix}_lien_detail`}
          label="Détail du lien (famille élargie)"
          hint="ex. « oncle maternel » — déclenche la chaîne d'actes"
          value={data.garant_lien_detail}
          onChange={(v) => onChange("garant_lien_detail", v)}
        />
      )}

      <SelectField
        id={`${idPrefix}_statut`}
        label="Statut professionnel"
        required
        options={GARANT_STATUT_OPTIONS}
        value={data.garant_statut}
        onChange={(v) => onChange("garant_statut", v)}
      />

      <TextField
        id={`${idPrefix}_revenus`}
        label="Revenus mensuels approximatifs (TND)"
        type="number"
        value={data.garant_revenus}
        onChange={(v) => onChange("garant_revenus", v)}
      />

      <TextareaField
        id={`${idPrefix}_patrimoine`}
        label="Patrimoine (maison, terrain, loyers…)"
        value={data.garant_patrimoine}
        onChange={(v) => onChange("garant_patrimoine", v)}
      />

      <MultiSelectField
        id={`${idPrefix}_docs`}
        label="Documents déjà disponibles"
        options={GARANT_DOCS_OPTIONS}
        value={data.garant_docs}
        onChange={(v) => onChange("garant_docs", v)}
      />

      {isEnItalie && (
        <>
          <RadioField
            id={`${idPrefix}_italie_sejour`}
            label="Titre de séjour valide + revenus déclarés ?"
            options={OUI_NON}
            value={data.garant_italie_sejour}
            onChange={(v) => onChange("garant_italie_sejour", v)}
          />
          <RadioField
            id={`${idPrefix}_italie_hebergement`}
            label="Hébergera-t-il l'étudiant ?"
            options={OUI_NON}
            value={data.garant_italie_hebergement}
            onChange={(v) => onChange("garant_italie_hebergement", v)}
          />
        </>
      )}
    </div>
  );
}
