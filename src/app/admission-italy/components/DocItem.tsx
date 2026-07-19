"use client";

import { useRef } from "react";
import type { DocDef } from "../buildDocList";
import type { DocLanguage, DocumentEntry } from "../types";
import { DOC_LANGUAGE_OPTIONS } from "../options";
import {
  hintClass,
  inputClass,
  labelClass,
  pillActiveClass,
  pillClass,
  pillIdleClass,
} from "./fieldStyles";

interface Props {
  def: DocDef;
  entry: DocumentEntry;
  onChange: (entry: DocumentEntry) => void;
}

function truncateName(name: string, max = 34): string {
  if (name.length <= max) return name;
  return `${name.slice(0, max - 1)}…`;
}

function DocIcon({ uploaded }: { uploaded: boolean }) {
  if (uploaded) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-italy-green/15 text-italy-green">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M4 10.5L8 14.5L16 5.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M6 2.5h5.5L16 7v10.5a1 1 0 01-1 1H6a1 1 0 01-1-1V3.5a1 1 0 011-1z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M11.5 2.5V7H16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export default function DocItem({ def, entry, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploaded = Boolean(entry.file);

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border p-4 transition-colors ${
        uploaded ? "border-italy-green/40 bg-italy-green/5" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <DocIcon uploaded={uploaded} />

        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900">{def.name}</p>
          <p className={hintClass}>
            {uploaded && entry.file ? truncateName(entry.file.name) : def.hint || "PDF or image"}
          </p>
        </div>

        {uploaded ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-italy-green text-white"
            aria-label={`${def.name} uploaded — replace`}
            title="Replace file"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 8.5L6.5 12L13 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Upload
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            onChange({ ...entry, file });
            e.target.value = "";
          }}
        />
      </div>

      {def.extraField === "expiryDate" && (
        <div className="flex max-w-xs flex-col gap-1.5 pl-[3.25rem]">
          <label className={labelClass} htmlFor={`${def.id}-expiry`}>
            Expiry date
          </label>
          <input
            id={`${def.id}-expiry`}
            type="date"
            className={inputClass}
            value={entry.expiryDate ?? ""}
            onChange={(e) => onChange({ ...entry, expiryDate: e.target.value })}
          />
        </div>
      )}

      {def.extraField === "certName" && (
        <div className="flex flex-col gap-1.5 pl-[3.25rem]">
          <label className={labelClass} htmlFor={`${def.id}-cert`}>
            Certificate name
          </label>
          <input
            id={`${def.id}-cert`}
            type="text"
            className={inputClass}
            placeholder="IELTS, TOEFL, DALF, EF SET, CILS…"
            value={entry.certName ?? ""}
            onChange={(e) => onChange({ ...entry, certName: e.target.value })}
          />
        </div>
      )}

      {def.showLanguage && (
        <div className="flex flex-wrap gap-2 pl-[3.25rem]">
          {DOC_LANGUAGE_OPTIONS.map((lang) => {
            const selected = entry.language === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() =>
                  onChange({
                    ...entry,
                    language: (selected ? "" : lang) as DocLanguage,
                  })
                }
                className={`${pillClass} ${selected ? pillActiveClass : pillIdleClass}`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
