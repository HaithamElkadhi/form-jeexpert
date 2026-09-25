"use client";

import { DragEvent, useRef, useState } from "react";
import { ItalyFormData, UpdateField } from "../types";

interface Props {
  data: ItalyFormData;
  update: UpdateField;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}

export default function CvStep({ data, update, onBack, onSubmit, submitting, error }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function acceptFile(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setFileError("Veuillez envoyer un fichier PDF.");
      return;
    }
    setFileError(null);
    update("cvFile", file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    acceptFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-gray-900">Votre CV</h2>
        <p className="text-sm text-gray-500">Facultatif. Vous pouvez envoyer le formulaire sans CV.</p>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragActive ? "border-italy-green bg-italy-green/5" : "border-italy-green/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => acceptFile(e.target.files?.[0])}
        />
        {data.cvFile ? (
          <p className="font-medium text-italy-green">{data.cvFile.name}</p>
        ) : (
          <>
            <p className="font-medium text-italy-green">Déposez votre CV ici</p>
            <p className="text-sm text-gray-500">ou cliquez pour parcourir — PDF uniquement</p>
          </>
        )}
      </div>

      {(fileError || error) && <p className="text-sm text-red-600">{fileError || error}</p>}

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-lg px-4 py-3 font-medium text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-50"
        >
          Retour
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 rounded-lg bg-italy-terracotta px-6 py-3 font-medium text-white transition-colors hover:bg-italy-terracotta-dark disabled:opacity-60"
        >
          {submitting ? "Envoi…" : "Envoyer"}
        </button>
      </div>
    </div>
  );
}
