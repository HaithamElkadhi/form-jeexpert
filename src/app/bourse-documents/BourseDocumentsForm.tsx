"use client";

import { useMemo, useState } from "react";
import { generateDocuments } from "@/app/bourse/engine/generateDocuments";
import type { BourseFormData, GeneratedDocument } from "@/app/bourse/types";
import { initialBourseData } from "@/app/bourse/types";
import ProgressBar from "@/app/bourse/components/ProgressBar";
import FadeStep from "@/app/bourse/components/FadeStep";
import WelcomeStep from "@/app/bourse/components/WelcomeStep";
import StepStudent from "@/app/bourse/components/StepStudent";
import StepHousehold from "@/app/bourse/components/StepHousehold";
import StepParentsStatus from "@/app/bourse/components/StepParentsStatus";
import StepFatherJob from "@/app/bourse/components/StepFatherJob";
import StepMotherJob from "@/app/bourse/components/StepMotherJob";
import StepStudentIncome from "@/app/bourse/components/StepStudentIncome";
import StepProperty from "@/app/bourse/components/StepProperty";
import StepBank from "@/app/bourse/components/StepBank";
import StepDocumentsUpload from "./components/StepDocumentsUpload";

/**
 * Passeport, codice fiscale et lettre d'admission sont déjà collectés via le
 * formulaire admission-italy — pas la peine de les redemander ici.
 */
const ALREADY_COLLECTED_CODES = new Set([
  "DOC_PASSPORT",
  "DOC_CODICE_FISCALE",
  "DOC_ADMISSION_LETTER",
]);

const STEP_ORDER = [
  "welcome",
  "student",
  "household",
  "parents",
  "father",
  "mother",
  "income",
  "property",
  "bank",
  "documents",
] as const;

type Step = (typeof STEP_ORDER)[number];

function isStepVisible(step: Step, data: BourseFormData): boolean {
  if (step === "father") {
    return !(
      data.parentsStatus === "father_deceased" || data.parentsStatus === "both_deceased"
    );
  }
  if (step === "mother") {
    return !(
      data.parentsStatus === "mother_deceased" || data.parentsStatus === "both_deceased"
    );
  }
  return true;
}

function nextStep(current: Step, data: BourseFormData): Step {
  const idx = STEP_ORDER.indexOf(current);
  for (let i = idx + 1; i < STEP_ORDER.length; i++) {
    if (isStepVisible(STEP_ORDER[i], data)) return STEP_ORDER[i];
  }
  return current;
}

function prevStep(current: Step, data: BourseFormData): Step {
  const idx = STEP_ORDER.indexOf(current);
  for (let i = idx - 1; i >= 0; i--) {
    if (isStepVisible(STEP_ORDER[i], data)) return STEP_ORDER[i];
  }
  return current;
}

export default function BourseDocumentsForm() {
  const [step, setStep] = useState<Step>("welcome");
  const [data, setData] = useState<BourseFormData>(initialBourseData);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [files, setFiles] = useState<Record<string, File | null>>({});

  function update<K extends keyof BourseFormData>(key: K, value: BourseFormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function onFileChange(key: string, file: File | null) {
    setFiles((f) => ({ ...f, [key]: file }));
  }

  function goToDocuments() {
    const generated = generateDocuments(data).filter(
      (doc) => !ALREADY_COLLECTED_CODES.has(doc.documentCode)
    );
    setDocuments(generated);
    setStep("documents");
  }

  function restart() {
    setData(initialBourseData);
    setDocuments([]);
    setFiles({});
    setStep("welcome");
  }

  const visibleFieldSteps = useMemo(
    () =>
      STEP_ORDER.filter((s) => s !== "welcome" && s !== "documents" && isStepVisible(s, data)),
    [data]
  );
  const currentFieldIndex = visibleFieldSteps.indexOf(
    step as (typeof visibleFieldSteps)[number]
  );
  const progressPercent =
    step === "welcome"
      ? 0
      : step === "documents"
        ? 100
        : ((currentFieldIndex + 1) / visibleFieldSteps.length) * 100;
  const showProgress = step !== "welcome" && step !== "documents";

  return (
    <main className="flex flex-1 items-start justify-center px-4 py-12">
      <div
        className={`w-full overflow-hidden rounded-xl border border-gray-200 bg-white ${
          step === "documents" ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        {showProgress && (
          <div className="px-8 pt-6">
            <ProgressBar percent={progressPercent} />
          </div>
        )}
        <div className="p-8">
          <FadeStep stepKey={step}>
            {step === "welcome" && (
              <WelcomeStep onNext={() => setStep(nextStep("welcome", data))} />
            )}
            {step === "student" && (
              <StepStudent
                data={data}
                update={update}
                onNext={() => setStep(nextStep("student", data))}
                onBack={() => setStep(prevStep("student", data))}
              />
            )}
            {step === "household" && (
              <StepHousehold
                data={data}
                update={update}
                onNext={() => setStep(nextStep("household", data))}
                onBack={() => setStep(prevStep("household", data))}
              />
            )}
            {step === "parents" && (
              <StepParentsStatus
                data={data}
                update={update}
                onNext={() => setStep(nextStep("parents", data))}
                onBack={() => setStep(prevStep("parents", data))}
              />
            )}
            {step === "father" && (
              <StepFatherJob
                data={data}
                update={update}
                onNext={() => setStep(nextStep("father", data))}
                onBack={() => setStep(prevStep("father", data))}
              />
            )}
            {step === "mother" && (
              <StepMotherJob
                data={data}
                update={update}
                onNext={() => setStep(nextStep("mother", data))}
                onBack={() => setStep(prevStep("mother", data))}
              />
            )}
            {step === "income" && (
              <StepStudentIncome
                data={data}
                update={update}
                onNext={() => setStep(nextStep("income", data))}
                onBack={() => setStep(prevStep("income", data))}
              />
            )}
            {step === "property" && (
              <StepProperty
                data={data}
                update={update}
                onNext={() => setStep(nextStep("property", data))}
                onBack={() => setStep(prevStep("property", data))}
              />
            )}
            {step === "bank" && (
              <StepBank
                data={data}
                update={update}
                onNext={goToDocuments}
                onBack={() => setStep(prevStep("bank", data))}
                submitLabel="Voir les documents à fournir"
              />
            )}
            {step === "documents" && (
              <StepDocumentsUpload
                data={data}
                documents={documents}
                files={files}
                onFileChange={onFileChange}
                onBack={() => setStep(prevStep("documents", data))}
                onRestart={restart}
              />
            )}
          </FadeStep>
        </div>
      </div>
    </main>
  );
}
