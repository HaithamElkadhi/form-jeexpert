"use client";

import { useState } from "react";
import { warningClass } from "./fieldStyles";

interface Props {
  situationText: string;
  warnings: string[];
  onBack: () => void;
}

export default function ResultStep({ situationText, warnings, onBack }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(situationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard permission denied or unavailable — silently ignore.
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-gray-900">Résumé de la situation</h2>
      <p className="text-sm text-gray-600">
        Copiez ce texte dans l&apos;étape 1 de l&apos;Assistant Visa pour générer la
        checklist finale.
      </p>

      {warnings.length > 0 && (
        <div className="flex flex-col gap-2">
          {warnings.map((w) => (
            <p key={w} className={warningClass}>
              {w}
            </p>
          ))}
        </div>
      )}

      <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
        {situationText}
      </pre>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          Retour
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg bg-italy-green px-6 py-3 font-medium text-white transition-colors hover:bg-italy-green-dark"
        >
          {copied ? "Copié" : "Copier le texte"}
        </button>
      </div>
    </div>
  );
}
