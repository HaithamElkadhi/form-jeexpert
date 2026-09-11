"use client";

import { useRef } from "react";
import type { GeneratedDocument } from "@/app/bourse/types";
import { hintClass } from "@/app/bourse/components/fieldStyles";

interface Props {
  personLabel: string;
  docs: GeneratedDocument[];
  file: File | null;
  onChange: (file: File | null) => void;
}

const MAX_BYTES = 10 * 1024 * 1024;

function truncateName(name: string, max = 34): string {
  if (name.length <= max) return name;
  return `${name.slice(0, max - 1)}…`;
}

function UploadIcon({ uploaded }: { uploaded: boolean }) {
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

export default function DocumentFieldCard({ personLabel, docs, file, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploaded = Boolean(file);
  const tooLarge = Boolean(file && file.size > MAX_BYTES);
  const sameInstitution = docs.every((d) => d.institution === docs[0].institution);

  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border p-4 transition-colors ${
        tooLarge
          ? "border-italy-terracotta/40 bg-italy-terracotta/5"
          : uploaded
            ? "border-italy-green/40 bg-italy-green/5"
            : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <UploadIcon uploaded={uploaded} />

        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900">{personLabel}</p>
          <p className={hintClass}>
            {uploaded && file
              ? truncateName(file.name)
              : sameInstitution
                ? docs[0].institution
                : `${docs.length} documents à regrouper dans un seul fichier`}
          </p>
          {tooLarge && file && (
            <p className="mt-1 text-xs text-italy-terracotta-dark">
              Fichier de {(file.size / (1024 * 1024)).toFixed(1)} Mo — max 10 Mo. Merci de le
              compresser.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={
            uploaded
              ? "shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              : "shrink-0 rounded-lg bg-italy-green px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-italy-green-dark"
          }
        >
          {uploaded ? "Remplacer" : "Ajouter"}
        </button>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={(e) => {
            const next = e.target.files?.[0] ?? null;
            onChange(next);
            e.target.value = "";
          }}
        />
      </div>

      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3">
        <p className={`${hintClass} mb-1.5 font-medium text-gray-600`}>
          {docs.length > 1
            ? "Ce fichier doit regrouper les documents suivants :"
            : "Ce fichier doit contenir :"}
        </p>
        <ul className="flex flex-col gap-1.5">
          {docs.map((doc) => (
            <li key={doc.id} className="text-sm text-gray-700">
              <span className="font-medium">{doc.documentName}</span>
              {!sameInstitution && (
                <span className="text-gray-500"> — {doc.institution}</span>
              )}
              {doc.requiredInfo && (
                <span className={`${hintClass} block`}>{doc.requiredInfo}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
