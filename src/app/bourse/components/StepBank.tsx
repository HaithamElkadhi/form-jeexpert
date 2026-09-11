"use client";

import type { BankAccountDetail, BankOwnerKey, BourseFormData, UpdateField } from "../types";
import { BANK_OWNER_OPTIONS } from "../options";
import { MultiSelectField, TextField } from "./Field";
import { cardClass, sectionTitleClass, warningClass } from "./fieldStyles";
import StepNav from "./StepNav";

interface Props {
  data: BourseFormData;
  update: UpdateField;
  onNext: () => void;
  onBack: () => void;
  submitLabel?: string;
}

function emptyAccount(ownerId: Exclude<BankOwnerKey, "none">): BankAccountDetail {
  return {
    id: `bank_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    ownerId,
    institution: "",
    accountCount: "1",
  };
}

function syncAccounts(
  owners: BankOwnerKey[],
  current: BankAccountDetail[]
): BankAccountDetail[] {
  if (owners.includes("none")) return [];
  const active = owners.filter((o): o is Exclude<BankOwnerKey, "none"> => o !== "none");
  const kept = current.filter((a) => active.includes(a.ownerId));
  for (const ownerId of active) {
    if (!kept.some((a) => a.ownerId === ownerId)) {
      kept.push(emptyAccount(ownerId));
    }
  }
  return kept;
}

export default function StepBank({
  data,
  update,
  onNext,
  onBack,
  submitLabel = "Générer la checklist",
}: Props) {
  const owners = data.bankOwners;
  const hasNone = owners.includes("none");
  const hasOwners = owners.some((o) => o !== "none");
  const conflict = hasNone && hasOwners;
  const missingInstitution =
    !hasNone && data.bankAccounts.some((a) => !a.institution.trim());

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (owners.length === 0 || conflict || missingInstitution) return;
        onNext();
      }}
    >
      <h2 className={sectionTitleClass}>Comptes bancaires et postaux</h2>
      <MultiSelectField
        id="bankOwners"
        label="Qui possède ou a possédé un compte bancaire ou postal pendant les années concernées ?"
        required
        value={owners}
        exclusiveValue="none"
        onChange={(v) => {
          const next = v as BankOwnerKey[];
          update("bankOwners", next);
          update("bankAccounts", syncAccounts(next, data.bankAccounts));
        }}
        options={BANK_OWNER_OPTIONS}
        hint="L’option « Personne » est exclusive."
      />
      {conflict && (
        <p className={warningClass}>
          « Personne » est incompatible avec la sélection d’un titulaire.
        </p>
      )}

      {!hasNone &&
        data.bankAccounts.map((account) => {
          const ownerLabel = BANK_OWNER_OPTIONS.find((o) => o.value === account.ownerId)?.label;
          return (
            <div key={account.id} className={cardClass}>
              <p className="text-sm font-medium text-gray-800">{ownerLabel}</p>
              <TextField
                id={`inst_${account.id}`}
                label="Nom de la banque ou de la Poste Tunisienne"
                required
                value={account.institution}
                onChange={(v) =>
                  update(
                    "bankAccounts",
                    data.bankAccounts.map((a) =>
                      a.id === account.id ? { ...a, institution: v } : a
                    )
                  )
                }
              />
              <TextField
                id={`count_${account.id}`}
                label="Nombre de comptes"
                type="number"
                min={1}
                required
                value={account.accountCount}
                onChange={(v) =>
                  update(
                    "bankAccounts",
                    data.bankAccounts.map((a) =>
                      a.id === account.id ? { ...a, accountCount: v } : a
                    )
                  )
                }
              />
            </div>
          );
        })}

      {owners.length === 0 && (
        <p className={warningClass}>Sélectionnez au moins une option.</p>
      )}
      <StepNav onBack={onBack} submitLabel={submitLabel} />
    </form>
  );
}
