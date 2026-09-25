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
import { useSubmitDossier } from "./hooks/useSubmitDossier";
import StepBar from "./components/StepBar";
import Step1Profile from "./components/Step1Profile";
import Step2Academic from "./components/Step2Academic";
import Step3Documents from "./components/Step3Documents";
import Step4Upload from "./components/Step4Upload";
import SuccessScreen from "./components/SuccessScreen";

export default function AdmissionForm() {
  const [step, setStep] = useState<AdmissionStep>(1);
  const [data, setData] = useState<AdmissionFormData>(initialAdmissionData);
  const [successMeta, setSuccessMeta] = useState<{
    docsUploaded: number;
    totalDocsExpected: number;
  } | null>(null);

  const { submitDossier, submitting, uploadedCount, totalToUpload, error, setError } =
    useSubmitDossier();

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

  async function handleSubmit() {
    setError(null);
    const result = await submitDossier(data);
    if (result.success) {
      setSuccessMeta({
        docsUploaded: result.docsUploaded,
        totalDocsExpected: result.totalDocsExpected,
      });
      setStep("success");
    }
  }

  return (
    <main className="flex flex-1 justify-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0D3272]">
              <span className="text-sm font-black text-[#F5A623]">J</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#0D3272]">Jee</span><span className="text-base font-bold text-[#F5A623]">expert</span>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-base font-semibold text-gray-900">Dossier d&apos;admission — Italie</h1>
            <p className="text-xs text-gray-400">Votre avenir, notre expertise</p>
          </div>
        </header>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
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
                data={data}
                onBack={() => setStep(2)}
                onNext={() => setStep(4)}
              />
            )}
            {step === 4 && (
              <Step4Upload
                data={data}
                onDocumentChange={updateDocument}
                onBack={() => setStep(3)}
                onSubmit={handleSubmit}
                submitting={submitting}
                uploadedCount={uploadedCount}
                totalToUpload={totalToUpload}
                error={error}
              />
            )}
            {step === "success" && successMeta && (
              <SuccessScreen
                docsUploaded={successMeta.docsUploaded}
                totalDocsExpected={successMeta.totalDocsExpected}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
