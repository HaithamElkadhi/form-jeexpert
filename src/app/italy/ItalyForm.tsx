"use client";

import { useState } from "react";
import { ItalyFormData } from "./types";
import ProgressBar from "./components/ProgressBar";
import FadeStep from "./components/FadeStep";
import WelcomeStep from "./components/WelcomeStep";
import AboutYouStep from "./components/AboutYouStep";
import AcademicStep from "./components/AcademicStep";
import ProjectStep from "./components/ProjectStep";
import CvStep from "./components/CvStep";
import SuccessScreen from "./components/SuccessScreen";

const initialData: ItalyFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthday: "",
  address: "",
  howHeard: "",
  lastAcademicLevel: "",
  lastDiploma: "",
  languages: "",
  entryLevel: "",
  preferredField: "",
  cvFile: null,
};

// 0 welcome, 1-4 field steps, 5 success
const TOTAL_FIELD_STEPS = 4;

export default function ItalyForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ItalyFormData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ItalyFormData>(key: K, value: ItalyFormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function handleSubmit() {
    if (!data.cvFile) return;
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("firstName", data.firstName);
      fd.append("lastName", data.lastName);
      fd.append("email", data.email);
      fd.append("phone", data.phone);
      fd.append("birthday", data.birthday);
      fd.append("address", data.address);
      fd.append("howHeard", data.howHeard);
      fd.append("lastAcademicLevel", data.lastAcademicLevel);
      fd.append("lastDiploma", data.lastDiploma);
      fd.append("languages", data.languages);
      fd.append("entryLevel", data.entryLevel);
      fd.append("preferredField", data.preferredField);
      fd.append("cvFile", data.cvFile);

      const res = await fetch("/api/submit-italy", { method: "POST", body: fd });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Something went wrong. Please try again.");
      }
      setStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const progressPercent =
    step <= 0 ? 0 : step >= 5 ? 100 : (step / TOTAL_FIELD_STEPS) * 100;
  const showProgress = step > 0 && step < 5;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white">
        {showProgress && (
          <div className="px-8 pt-6">
            <ProgressBar percent={progressPercent} />
          </div>
        )}
        <div className="p-8">
          <FadeStep stepKey={step}>
            {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
            {step === 1 && (
              <AboutYouStep data={data} update={update} onNext={() => setStep(2)} />
            )}
            {step === 2 && (
              <AcademicStep
                data={data}
                update={update}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <ProjectStep
                data={data}
                update={update}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <CvStep
                data={data}
                update={update}
                onBack={() => setStep(3)}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={error}
              />
            )}
            {step === 5 && <SuccessScreen />}
          </FadeStep>
        </div>
      </div>
    </main>
  );
}
