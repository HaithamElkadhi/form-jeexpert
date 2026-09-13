"use client";

import { useState, type FormEvent } from "react";
import FamilyMembersSection from "./components/FamilyMembersSection";
import UploadZone from "./components/UploadZone";
import {
  btnPrimaryClass,
  errorClass,
  inputClass,
  labelClass,
  sectionTitleClass,
} from "./components/fieldStyles";
import { useSubmitBourseDocuments } from "./hooks/useSubmitBourseDocuments";
import {
  countAllFiles,
  createEmptyMember,
  initialFormData,
  type DocumentsBourseFormData,
  type IdentityData,
  type UploadZoneKey,
} from "./types";

type IdentityErrors = Partial<Record<keyof IdentityData, string>>;

export default function DocumentsBourseForm() {
  const [data, setData] = useState<DocumentsBourseFormData>(initialFormData);
  const [identityErrors, setIdentityErrors] = useState<IdentityErrors>({});
  const [submitted, setSubmitted] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    filesUploaded: number;
  } | null>(null);

  const { submit, submitting, uploadedCount, totalToUpload, error, setError } =
    useSubmitBourseDocuments();

  function updateIdentity<K extends keyof IdentityData>(key: K, value: IdentityData[K]) {
    setData((d) => ({ ...d, identity: { ...d.identity, [key]: value } }));
    setIdentityErrors((errs) => {
      if (!errs[key]) return errs;
      const next = { ...errs };
      delete next[key];
      return next;
    });
  }

  function setFiles(key: UploadZoneKey, files: File[]) {
    setData((d) => ({ ...d, files: { ...d.files, [key]: files } }));
  }

  function validateIdentity(): boolean {
    const errs: IdentityErrors = {};
    if (!data.identity.firstName.trim()) errs.firstName = "Le prénom est obligatoire.";
    if (!data.identity.lastName.trim()) errs.lastName = "Le nom est obligatoire.";
    if (!data.identity.email.trim()) errs.email = "L'e-mail est obligatoire.";
    setIdentityErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validateIdentity()) {
      document.getElementById("section-identity")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const result = await submit(data);
    if (result.success) {
      setSubmitted({
        firstName: data.identity.firstName.trim(),
        lastName: data.identity.lastName.trim(),
        email: data.identity.email.trim(),
        filesUploaded: result.filesUploaded,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (submitted) {
    return (
      <main className="flex flex-1 justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-2xl">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-8 sm:p-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-italy-green/15 text-italy-green">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
                  <path
                    d="M7 17L13 23L25 9"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Dossier envoyé</h2>
              <p className="max-w-md text-gray-600">
                Merci {submitted.firstName} {submitted.lastName}. Votre dossier de documents
                bourse a bien été reçu
                {submitted.filesUploaded > 0
                  ? ` avec ${submitted.filesUploaded} fichier${submitted.filesUploaded > 1 ? "s" : ""}`
                  : ""}
                .
              </p>
              <p className="text-sm text-gray-500">
                Un e-mail de suivi pourra être envoyé à{" "}
                <span className="font-medium text-gray-700">{submitted.email}</span>.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 justify-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-2xl">
        <header className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-italy-green">JEExpert</p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900 sm:text-3xl">
            Documents bourse
          </h1>
          <p className="mt-1 text-gray-500">
            Déposez les pièces justificatives pour votre dossier de bourse.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white"
          noValidate
        >
          <div className="flex flex-col gap-10 p-6 sm:p-8">
            {/* 1. Identity */}
            <section id="section-identity" className="flex flex-col gap-5">
              <h2 className={sectionTitleClass}>Vos informations</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass} htmlFor="firstName">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={inputClass}
                    value={data.identity.firstName}
                    onChange={(e) => updateIdentity("firstName", e.target.value)}
                    autoComplete="given-name"
                  />
                  {identityErrors.firstName && (
                    <p className={errorClass}>{identityErrors.firstName}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass} htmlFor="lastName">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={inputClass}
                    value={data.identity.lastName}
                    onChange={(e) => updateIdentity("lastName", e.target.value)}
                    autoComplete="family-name"
                  />
                  {identityErrors.lastName && (
                    <p className={errorClass}>{identityErrors.lastName}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className={labelClass} htmlFor="email">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={inputClass}
                    value={data.identity.email}
                    onChange={(e) => updateIdentity("email", e.target.value)}
                    autoComplete="email"
                  />
                  {identityErrors.email && <p className={errorClass}>{identityErrors.email}</p>}
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* 2. Family */}
            <FamilyMembersSection
              members={data.familyMembers}
              onChange={(familyMembers) => setData((d) => ({ ...d, familyMembers }))}
              onAdd={() =>
                setData((d) => ({
                  ...d,
                  familyMembers: [...d.familyMembers, createEmptyMember()],
                }))
              }
            />

            <hr className="border-gray-100" />

            {/* 3. Vie collective */}
            <section className="flex flex-col gap-5">
              <h2 className={sectionTitleClass}>Vie collective &amp; personnes du foyer</h2>
              <UploadZone
                label="Actes de naissance"
                description="Acte de naissance de chaque membre du foyer — traduit et apostillé."
                files={data.files.birthCertificates}
                onChange={(files) => setFiles("birthCertificates", files)}
              />
              <UploadZone
                label="Livret de famille / Attestation vie collective"
                files={data.files.familyBooklet}
                onChange={(files) => setFiles("familyBooklet", files)}
              />
            </section>

            <hr className="border-gray-100" />

            {/* 4. Propriété */}
            <section className="flex flex-col gap-5">
              <h2 className={sectionTitleClass}>Propriété immobilière</h2>
              <UploadZone
                label="Documents de propriété"
                description="Titre de propriété, acte notarié ou extrait cadastral. Un document par bien."
                files={data.files.propertyDocs}
                onChange={(files) => setFiles("propertyDocs", files)}
              />
            </section>

            <hr className="border-gray-100" />

            {/* 5. Non-propriété */}
            <section className="flex flex-col gap-5">
              <h2 className={sectionTitleClass}>Non-propriété</h2>
              <UploadZone
                label="Attestations de non-propriété"
                description="Une attestation par membre de la famille, délivrée par les autorités locales ou le notaire."
                files={data.files.nonPropertyDocs}
                onChange={(files) => setFiles("nonPropertyDocs", files)}
              />
            </section>

            <hr className="border-gray-100" />

            {/* 6. Bank */}
            <section className="flex flex-col gap-5">
              <h2 className={sectionTitleClass}>
                Relevés bancaires &amp; solde au 31/12/2025
              </h2>
              <UploadZone
                label="Attestation de solde au 31/12/2025"
                description="Document officiel signé et cacheté par la banque — un par compte."
                files={data.files.balanceAttestation}
                onChange={(files) => setFiles("balanceAttestation", files)}
              />
              <UploadZone
                label="Déclarations fiscales"
                files={data.files.taxDeclarations}
                onChange={(files) => setFiles("taxDeclarations", files)}
              />
            </section>

            <hr className="border-gray-100" />

            {/* 7. Other */}
            <section className="flex flex-col gap-5">
              <h2 className={sectionTitleClass}>Autres documents demandés</h2>
              <p className="text-sm leading-relaxed text-gray-600">
                Certaines bourses demandent des documents supplémentaires selon votre situation :
                certificat de scolarité, attestation de résidence, justificatif de situation
                particulière, attestation de bourse nationale, relevé de notes récent, lettre de
                motivation, ou tout autre document demandé par votre conseiller JEExpert.
              </p>
              <UploadZone
                files={data.files.otherDocuments}
                onChange={(files) => setFiles("otherDocuments", files)}
              />
            </section>

            {error && (
              <div className="rounded-lg border border-italy-terracotta/30 bg-italy-terracotta/5 px-4 py-3 text-sm text-italy-terracotta-dark">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6">
              {submitting && totalToUpload > 0 && (
                <p className="text-sm text-gray-500">
                  Envoi des fichiers… {uploadedCount}/{totalToUpload}
                </p>
              )}
              {submitting && totalToUpload === 0 && (
                <p className="text-sm text-gray-500">Création du dossier…</p>
              )}
              <button type="submit" className={btnPrimaryClass} disabled={submitting}>
                {(() => {
                  if (submitting) return "Envoi en cours…";
                  const n = countAllFiles(data.files);
                  if (n === 0) return "Envoyer le dossier";
                  return `Envoyer le dossier (${n} fichier${n > 1 ? "s" : ""})`;
                })()}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
