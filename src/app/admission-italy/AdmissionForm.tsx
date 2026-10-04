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
import JeexpertFormHeader from "../components/JeexpertFormHeader";

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

  async function handleSubmit(existingRecordId?: string) {
    setError(null);
    const result = await submitDossier(data, existingRecordId);
    if (result.success) {
      setSuccessMeta({
        docsUploaded: result.docsUploaded,
        totalDocsExpected: result.totalDocsExpected,
      });
      setStep("success");
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-4 py-5 [font-family:var(--font-poppins)] sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-4xl">
        <JeexpertFormHeader />

        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm">
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
                onSubmit={(existingRecordId) => handleSubmit(existingRecordId)}
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
