"use client";

import { useState } from "react";
import {
  AdmissionFormData,
  AdmissionStep,
  AcademicData,
  DocumentEntry,
  ProfileData,
  initialAdmissionData,
} from "./types";
import StepBar from "./components/StepBar";
import Step1Profile from "./components/Step1Profile";
import Step2Academic from "./components/Step2Academic";
import Step3Documents from "./components/Step3Documents";
import SuccessScreen from "./components/SuccessScreen";

export default function AdmissionForm() {
  const [step, setStep] = useState<AdmissionStep>(1);
  const [data, setData] = useState<AdmissionFormData>(initialAdmissionData);

  function updateProfile<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setData((d) => ({ ...d, profile: { ...d.profile, [key]: value } }));
  }

  function updateAcademic<K extends keyof AcademicData>(key: K, value: AcademicData[K]) {
    setData((d) => ({ ...d, academic: { ...d.academic, [key]: value } }));
  }

  function updateDocument(id: string, entry: DocumentEntry) {
    setData((d) => ({
      ...d,
      documents: { ...d.documents, [id]: entry },
    }));
  }

  function handleSubmit() {
    // Placeholder — API wiring TBD per spec
    setStep("success");
  }

  return (
    <main className="flex flex-1 justify-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-2xl">
        <header className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-italy-green">JEExpert</p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900 sm:text-3xl">
            Italy admission
          </h1>
          <p className="mt-1 text-gray-500">Dossier builder</p>
        </header>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {step !== "success" && (
            <div className="border-b border-gray-100 px-6 pt-6 pb-4 sm:px-8">
              <StepBar current={step} />
            </div>
          )}

          <div className="p-6 sm:p-8">
            {step === 1 && (
              <Step1Profile
                data={data.profile}
                update={updateProfile}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <Step2Academic
                data={data.academic}
                update={updateAcademic}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step3Documents
                academic={data.academic}
                documents={data.documents}
                onDocumentChange={updateDocument}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
              />
            )}
            {step === "success" && <SuccessScreen />}
          </div>
        </div>
      </div>
    </main>
  );
}
