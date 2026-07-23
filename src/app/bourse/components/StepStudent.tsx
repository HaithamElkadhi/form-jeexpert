"use client";

import type { BourseFormData, UpdateField } from "../types";
import { ACADEMIC_YEARS } from "../options";
import { getEconomicYears } from "../engine/years";
import { TextField, SelectField } from "./Field";
import { sectionTitleClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: BourseFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

export default function StepStudent({ data, update, onNext, onBack }: Props) {
  const yearsHint =
    data.academicYear &&
    (() => {
      const y = getEconomicYears(data.academicYear);
      return `Documents économiques à préparer : ${y.yearOld} et ${y.yearRecent}`;
    })();

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <h2 className={sectionTitleClass}>Étudiant</h2>
      <TextField
        id="lastName"
        label="Nom"
        required
        value={data.lastName}
        onChange={(v) => update("lastName", v)}
      />
      <TextField
        id="firstName"
        label="Prénom"
        required
        value={data.firstName}
        onChange={(v) => update("firstName", v)}
      />
      <TextField
        id="email"
        label="Adresse e-mail"
        type="email"
        required
        value={data.email}
        onChange={(v) => update("email", v)}
      />
      <TextField
        id="university"
        label="Université italienne"
        required
        value={data.university}
        onChange={(v) => update("university", v)}
      />
      <TextField
        id="cityOrRegion"
        label="Ville ou région de l’université"
        required
        value={data.cityOrRegion}
        onChange={(v) => update("cityOrRegion", v)}
      />
      <SelectField
        id="academicYear"
        label="Année universitaire demandée"
        required
        value={data.academicYear}
        onChange={(v) => update("academicYear", v as BourseFormData["academicYear"])}
        options={ACADEMIC_YEARS.map((y) => ({ value: y, label: y }))}
        hint={yearsHint || undefined}
      />
      <StepNav onBack={onBack} />
    </form>
  );
}
