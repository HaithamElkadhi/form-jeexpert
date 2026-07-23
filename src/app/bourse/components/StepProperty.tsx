"use client";

import type { BourseFormData, PropertyDetail, PropertyOwnerKey, UpdateField } from "../types";
import { PROPERTY_OWNER_OPTIONS } from "../options";
import { MultiSelectField, RadioField } from "./Field";
import { cardClass, sectionTitleClass, warningClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: BourseFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

function syncDetails(
  owners: PropertyOwnerKey[],
  current: PropertyDetail[]
): PropertyDetail[] {
  if (owners.includes("none")) return [];
  return owners
    .filter((o): o is Exclude<PropertyOwnerKey, "none"> => o !== "none")
    .map((ownerId) => {
      const existing = current.find((d) => d.ownerId === ownerId);
      return existing ?? { ownerId, registered: "yes" };
    });
}

export default function StepProperty({ data, update, onNext, onBack }: Props) {
  const owners = data.propertyOwners;
  const hasNone = owners.includes("none");
  const hasOwners = owners.some((o) => o !== "none");
  const conflict = hasNone && hasOwners;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (owners.length === 0 || conflict) return;
        onNext();
      }}
    >
      <h2 className={sectionTitleClass}>Patrimoine immobilier</h2>
      <MultiSelectField
        id="propertyOwners"
        label="Qui possède une maison, un appartement, un terrain, un local, un garage ou une part dans un bien immobilier ?"
        required
        value={owners}
        exclusiveValue="none"
        onChange={(v) => {
          const next = v as PropertyOwnerKey[];
          update("propertyOwners", next);
          update("propertyDetails", syncDetails(next, data.propertyDetails));
        }}
        options={PROPERTY_OWNER_OPTIONS}
        hint="L’option « Personne » est exclusive."
      />
      {conflict && (
        <p className={warningClass}>
          « Personne » est incompatible avec la sélection d’un propriétaire.
        </p>
      )}
      {!hasNone &&
        data.propertyDetails.map((detail) => (
          <div key={detail.ownerId} className={cardClass}>
            <p className="text-sm font-medium text-gray-800">
              {PROPERTY_OWNER_OPTIONS.find((o) => o.value === detail.ownerId)?.label}
            </p>
            <RadioField
              id={`reg_${detail.ownerId}`}
              label="Le bien est-il immatriculé au registre foncier ?"
              required
              value={detail.registered}
              onChange={(v) => {
                update(
                  "propertyDetails",
                  data.propertyDetails.map((d) =>
                    d.ownerId === detail.ownerId
                      ? { ...d, registered: v as PropertyDetail["registered"] }
                      : d
                  )
                );
              }}
              options={[
                { value: "yes", label: "Oui" },
                { value: "no", label: "Non" },
                { value: "unknown", label: "Je ne sais pas" },
              ]}
            />
          </div>
        ))}
      {owners.length === 0 && (
        <p className={warningClass}>Sélectionnez au moins une option.</p>
      )}
      <StepNav onBack={onBack} />
    </form>
  );
}
