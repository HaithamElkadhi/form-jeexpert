"use client";

import { FormEvent, useRef, useState } from "react";
import JeexpertFormHeader from "../components/JeexpertFormHeader";

const inputClass = "min-h-11 w-full rounded-lg border border-[#CFD8E3] bg-white px-3 py-2.5 text-[15px] text-[#1A1A2E] outline-none transition focus:border-[#246BCE] focus:ring-2 focus:ring-[#246BCE]/15";
const labelClass = "mb-1.5 block text-sm font-medium text-[#1A1A2E]";
const requiredMark = <span className="text-[#B83232]" aria-hidden="true"> *</span>;
const contractOptions = ["CDI", "CDD", "Freelance", "Temps partiel", "Stage"];
const governorates = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
  "Kairouan", "Kasserine", "Kébili", "Le Kef", "Mahdia", "La Manouba",
  "Médenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana",
  "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan", "Hors Tunisie",
];
const languageLevels = ["Courant", "Intermédiaire", "Débutant", "Aucun"];

function SectionCard({ title, children, accent = false }: { title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <section className={`rounded-xl border bg-white p-5 shadow-[0_2px_8px_rgba(23,59,101,0.06)] sm:p-6 ${accent ? "border-[#80C4EA]/70 bg-[#F4FAFE]" : "border-[#E8EDF3]"}`}>
      <h2 className="mb-5 border-l-4 pl-3 text-lg font-semibold tracking-tight text-[#173B65]" style={{ borderColor: accent ? "#80C4EA" : "#F5A623" }}>{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, htmlFor, required = false, hint, children }: { label: string; htmlFor: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass} htmlFor={htmlFor}>{label}{required && requiredMark}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-[#5B6478]">{hint}</p>}
    </div>
  );
}

export default function CandidatureForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const contractRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<"form" | "success">("form");
  const [contractTypes, setContractTypes] = useState<string[]>([]);
  const [cv, setCv] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvUploadFailed, setCvUploadFailed] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  function toggleContract(option: string) {
    setContractTypes((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
  }

  function selectCv(file: File | undefined) {
    setCvError(null);
    if (!file) {
      setCv(null);
      return;
    }
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (![".pdf", ".doc", ".docx"].includes(extension)) {
      setCvError("Le CV doit être un fichier PDF ou Word.");
      setCv(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError("Le CV doit faire 5 Mo maximum.");
      setCv(null);
      return;
    }
    setCv(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (contractTypes.length === 0) {
      setError("Sélectionnez au moins un type de contrat souhaité.");
      contractRef.current?.focus();
      return;
    }
    if (!cv) {
      setCvError("Ajoutez votre CV à jour pour envoyer la candidature.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);
      contractTypes.forEach((type) => formData.append("contractTypes", type));
      formData.set("cv", cv);
      formData.set("consent", "true");

      const response = await fetch("/api/submit-candidature", { method: "POST", body: formData });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "La candidature n’a pas pu être envoyée.");

      setCvUploadFailed(result.cvUploaded === false);
      setApplicationId(typeof result.recordId === "string" ? result.recordId : null);
      setPhase("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Une erreur est survenue. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    formRef.current?.reset();
    setContractTypes([]);
    setCv(null);
    setCvError(null);
    setError(null);
    setCvUploadFailed(false);
    setApplicationId(null);
    setPhase("form");
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-4 py-5 [font-family:var(--font-inter)] sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-3xl">
        <JeexpertFormHeader />
        {phase === "success" ? (
          <section className="rounded-xl border border-[#E8EDF3] bg-white p-7 text-center shadow-[0_2px_8px_rgba(23,59,101,0.06)] sm:p-10" aria-live="polite">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF6FC] text-2xl font-semibold text-[#173B65]" aria-hidden="true">✓</div>
            <p className="mb-2 inline-flex rounded-full bg-[#EAF6FC] px-3 py-1 text-sm font-medium text-[#173B65]">Candidature envoyée</p>
            <h1 className="mb-2 text-2xl font-semibold text-[#173B65]">Merci pour votre candidature !</h1>
            <p className="mx-auto max-w-xl text-sm leading-6 text-[#5B6478]">Notre équipe étudiera votre profil et vous contactera sur WhatsApp si votre candidature est retenue.</p>
            {applicationId && <p className="mt-4 text-xs text-[#5B6478]">Référence : {applicationId}</p>}
            {cvUploadFailed && <p className="mx-auto mt-5 max-w-xl rounded-lg border border-[#E9B7B7] bg-[#FFF5F5] p-3 text-left text-sm text-[#8D2929]" role="alert">Votre candidature a été enregistrée, mais le CV n’a pas pu être joint. Contactez-nous sur WhatsApp en indiquant votre référence.</p>}
            <button type="button" onClick={resetForm} className="mt-7 min-h-11 rounded-lg bg-[#173B65] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#102E50] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80C4EA] focus-visible:ring-offset-2">Envoyer une autre candidature</button>
          </section>
        ) : (
          <>
            <div className="mb-6 text-center sm:mb-7">
              <h1 className="text-2xl font-semibold text-[#173B65] sm:text-[28px]">Rejoignez l’équipe Jeexpert</h1>
              <p className="mt-2 text-sm text-[#5B6478]">Formulaire de candidature · environ 5 minutes</p>
              <div className="mx-auto mt-4 h-0.5 w-14 bg-[#F5A623]" aria-hidden="true" />
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
              <SectionCard title="Informations personnelles">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nom" htmlFor="lastName" required><input id="lastName" className={inputClass} name="lastName" autoComplete="family-name" maxLength={120} required /></Field>
                  <Field label="Prénom" htmlFor="firstName" required><input id="firstName" className={inputClass} name="firstName" autoComplete="given-name" maxLength={120} required /></Field>
                  <Field label="Date de naissance" htmlFor="birthDate" required><input id="birthDate" className={inputClass} name="birthDate" type="date" required /></Field>
                  <Field label="Âge" htmlFor="age" required><input id="age" className={inputClass} name="age" type="number" min="16" max="70" step="1" required /></Field>
                  <Field label="Numéro WhatsApp" htmlFor="whatsapp" required hint="Ex. +216 XX XXX XXX"><input id="whatsapp" className={inputClass} name="whatsapp" type="tel" autoComplete="tel" placeholder="+216 XX XXX XXX" maxLength={40} required /></Field>
                  <Field label="Gouvernorat" htmlFor="governorate" required>
                    <select id="governorate" className={inputClass} name="governorate" defaultValue="" required><option value="" disabled>Choisir…</option>{governorates.map((governorate) => <option key={governorate}>{governorate}</option>)}</select>
                  </Field>
                  <div className="sm:col-span-2"><Field label="Ville / adresse" htmlFor="cityAddress" required><input id="cityAddress" className={inputClass} name="cityAddress" autoComplete="street-address" maxLength={300} required /></Field></div>
                </div>
              </SectionCard>

              <SectionCard title="Le poste">
                <fieldset>
                  <legend className={labelClass}>Type de contrat souhaité{requiredMark}</legend>
                  <div className="flex flex-wrap gap-2">
                    {contractOptions.map((option, index) => {
                      const checked = contractTypes.includes(option);
                      return <label key={option} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition ${checked ? "border-[#246BCE] bg-[#246BCE]/5 font-medium text-[#173B65]" : "border-[#CFD8E3] bg-white text-[#1A1A2E] hover:border-[#246BCE]"}`}>
                        <input ref={index === 0 ? contractRef : undefined} type="checkbox" checked={checked} onChange={() => toggleContract(option)} className="accent-[#246BCE]" aria-label={option} />{option}
                      </label>;
                    })}
                  </div>
                  <p className="mt-1 text-xs text-[#5B6478]">Plusieurs choix possibles</p>
                </fieldset>
                <fieldset className="mt-5">
                  <legend className={labelClass}>Mode de travail</legend>
                  <div className="flex flex-wrap gap-2">
                    {["Présentiel", "À distance", "Les deux"].map((mode) => <label key={mode} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-[#CFD8E3] bg-white px-3.5 py-2 text-sm hover:border-[#246BCE] has-[:checked]:border-[#246BCE] has-[:checked]:bg-[#246BCE]/5 has-[:checked]:text-[#173B65]"><input type="radio" name="workMode" value={mode} className="accent-[#246BCE]" />{mode}</label>)}
                  </div>
                </fieldset>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Disponible à partir du" htmlFor="availableFrom" required><input id="availableFrom" className={inputClass} name="availableFrom" type="date" required /></Field>
                  <Field label="Salaire mensuel attendu (DT)" htmlFor="expectedSalary" required><input id="expectedSalary" className={inputClass} name="expectedSalary" type="number" min="0" step="1" placeholder="Saisir le montant souhaité" required /></Field>
                </div>
              </SectionCard>

              <SectionCard title="Profil">
                <div className="flex flex-col gap-4">
                  <Field label="Dernier diplôme obtenu" htmlFor="lastDiploma" required hint="Ex. Licence en gestion, Université de Sousse"><input id="lastDiploma" className={inputClass} name="lastDiploma" maxLength={300} required /></Field>
                  <fieldset>
                    <legend className={`${labelClass} mb-2`}>Langues{requiredMark}</legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { name: "arabic", label: "Arabe", initial: "Courant", choices: ["Courant", "Intermédiaire", "Débutant"] },
                        { name: "french", label: "Français", initial: "Intermédiaire", choices: languageLevels },
                        { name: "english", label: "Anglais", initial: "Intermédiaire", choices: languageLevels },
                        { name: "italian", label: "Italien", initial: "Aucun", choices: languageLevels },
                      ].map((language) => <label key={language.name} className="grid grid-cols-[92px_1fr] items-center gap-2 text-sm text-[#1A1A2E]"><span>{language.label}</span><select className={inputClass} name={language.name} defaultValue={language.initial} required>{language.choices.map((level) => <option key={level}>{level}</option>)}</select></label>)}
                    </div>
                  </fieldset>
                  <Field label="Parlez-nous de votre expérience professionnelle" htmlFor="experience" required hint="Postes occupés, missions, durée…"><textarea id="experience" className={`${inputClass} min-h-32 resize-y`} name="experience" maxLength={5000} required /></Field>
                  <Field label="CV à jour" htmlFor="cvPicker" required hint="PDF ou Word · 5 Mo maximum">
                    <div className="rounded-lg border-2 border-dashed border-[#CFD8E3] bg-[#F4F7FB] p-4 sm:p-5">
                      <input id="cvPicker" className="block w-full text-sm text-[#1A1A2E] file:mr-3 file:min-h-10 file:rounded-lg file:border-0 file:bg-white file:px-3 file:font-medium file:text-[#173B65] hover:file:bg-[#EAF0F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80C4EA]" name="cvPicker" type="file" accept=".pdf,.doc,.docx" required onChange={(event) => selectCv(event.currentTarget.files?.[0])} />
                      {cv && <p className="mt-2 truncate text-sm text-[#173B65]">{cv.name} · {(cv.size / 1024 / 1024).toFixed(1)} Mo</p>}
                    </div>
                    {cvError && <p className="mt-1 text-sm text-[#B83232]" role="alert">{cvError}</p>}
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Études en Italie" accent>
                <fieldset>
                  <legend className={labelClass}>Si votre candidature n’est pas retenue, seriez-vous intéressé(e) par des études en Italie avec bourse ?{requiredMark}</legend>
                  <div className="mt-3 flex flex-col gap-2">
                    <label className="flex min-h-11 cursor-pointer items-start gap-2 rounded-lg border border-[#CFD8E3] bg-white p-3 text-sm leading-5 hover:border-[#246BCE] has-[:checked]:border-[#246BCE] has-[:checked]:bg-[#246BCE]/5"><input className="mt-1 accent-[#246BCE]" type="radio" name="italyInterest" value="Oui, contactez-moi" required />Oui, j’accepte que Jeexpert me contacte à ce sujet</label>
                    <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-[#CFD8E3] bg-white p-3 text-sm hover:border-[#246BCE] has-[:checked]:border-[#246BCE] has-[:checked]:bg-[#246BCE]/5"><input className="accent-[#246BCE]" type="radio" name="italyInterest" value="Non merci" />Non merci</label>
                  </div>
                </fieldset>
              </SectionCard>

              <section className="rounded-xl border border-[#E8EDF3] bg-white p-5 shadow-[0_2px_8px_rgba(23,59,101,0.06)] sm:p-6">
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#1A1A2E]"><input className="mt-1 accent-[#246BCE]" type="checkbox" name="consentCheckbox" required /><span>J’accepte que Jeexpert conserve mes données personnelles dans le cadre de ce recrutement.{requiredMark}</span></label>
                <p className="mt-2 pl-7 text-xs leading-5 text-[#5B6478]">Vos informations seront utilisées uniquement pour l’étude de votre candidature.</p>
              </section>

              {error && <p className="rounded-lg border border-[#E9B7B7] bg-[#FFF5F5] px-4 py-3 text-sm text-[#8D2929]" role="alert">{error}</p>}
              <button type="submit" disabled={submitting} className="min-h-12 w-full rounded-lg bg-[#246BCE] px-5 py-3 font-medium text-white transition-colors hover:bg-[#1D5AB0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80C4EA] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">{submitting ? "Envoi en cours…" : "Envoyer ma candidature"}</button>
            </form>
          </>
        )}
        <footer className="pb-2 pt-6 text-center text-xs text-[#5B6478]">Jeexpert · OUR EXPERTISE, YOUR FUTURE</footer>
      </div>
    </main>
  );
}
