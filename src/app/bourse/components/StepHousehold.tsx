"use client";

import type { AdultSibling, BourseFormData, UpdateField } from "../types";
import { HOUSEHOLD_OPTIONS, SIBLING_SITUATION_OPTIONS } from "../options";
import { MultiSelectField, SelectField, TextField } from "./Field";
import { cardClass, sectionTitleClass, warningClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: BourseFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
}

function syncAdultSiblings(
  count: number,
  current: AdultSibling[]
): AdultSibling[] {
  const next = current.slice(0, count);
  while (next.length < count) {
    next.push({
      id: `sib_${Date.now()}_${next.length}`,
      situation: "student",
    });
  }
  return next;
}

export default function StepHousehold({ data, update, onNext, onBack }: Props) {
  const hasSiblings =
    data.householdMembers.includes("brothers") ||
    data.householdMembers.includes("sisters");

  const total = Number(data.siblingsTotal) || 0;
  const adults = Number(data.siblingsAdultCount) || 0;
  const adultsExceedTotal = hasSiblings && adults > total && data.siblingsTotal !== "";
  const emptyHousehold = data.householdMembers.length === 0;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (adultsExceedTotal || emptyHousehold) return;
        onNext();
      }}
    >
      <h2 className={sectionTitleClass}>Composition du foyer</h2>
      <MultiSelectField
        id="household"
        label="Qui vit officiellement dans le même foyer familial que vos parents ?"
        required
        value={data.householdMembers}
        onChange={(v) => {
          update("householdMembers", v as BourseFormData["householdMembers"]);
          const stillHasSiblings =
            v.includes("brothers") || v.includes("sisters");
          if (!stillHasSiblings) {
            update("siblingsTotal", "");
            update("siblingsAdultCount", "");
            update("adultSiblings", []);
          }
        }}
        options={HOUSEHOLD_OPTIONS}
        hint="Le père et la mère sont présélectionnés ; vous pouvez les retirer dans les cas particuliers."
      />

      {hasSiblings && (
        <div className="flex flex-col gap-4">
          <TextField
            id="siblingsTotal"
            label="Nombre total de frères et sœurs vivant dans le foyer"
            type="number"
            required
            min={0}
            value={data.siblingsTotal}
            onChange={(v) => {
              update("siblingsTotal", v);
              const t = Number(v) || 0;
              const a = Math.min(Number(data.siblingsAdultCount) || 0, t);
              update("siblingsAdultCount", data.siblingsAdultCount === "" ? "" : String(a));
              update("adultSiblings", syncAdultSiblings(a, data.adultSiblings));
            }}
          />
          <TextField
            id="siblingsAdultCount"
            label="Nombre de frères et sœurs majeurs"
            type="number"
            required
            min={0}
            value={data.siblingsAdultCount}
            onChange={(v) => {
              update("siblingsAdultCount", v);
              const a = Number(v) || 0;
              update("adultSiblings", syncAdultSiblings(a, data.adultSiblings));
            }}
            hint="Les mineurs apparaissent dans la composition familiale mais ne génèrent généralement pas de documents économiques."
          />
          {adultsExceedTotal && (
            <p className={warningClass}>
              Le nombre de majeurs ne peut pas dépasser le nombre total de frères et sœurs.
            </p>
          )}
          {data.adultSiblings.map((sib, index) => (
            <div key={sib.id} className={cardClass}>
              <p className="text-sm font-medium text-gray-800">
                Frère / sœur majeur {index + 1}
              </p>
              <SelectField
                id={`sib_sit_${sib.id}`}
                label="Situation"
                required
                value={sib.situation}
                onChange={(v) => {
                  const next = data.adultSiblings.map((s) =>
                    s.id === sib.id
                      ? { ...s, situation: v as AdultSibling["situation"] }
                      : s
                  );
                  update("adultSiblings", next);
                }}
                options={SIBLING_SITUATION_OPTIONS}
              />
            </div>
          ))}
        </div>
      )}

      {emptyHousehold && (
        <p className={warningClass}>Sélectionnez au moins un membre du foyer.</p>
      )}

      <StepNav onBack={onBack} />
    </form>
  );
}
