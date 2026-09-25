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
import { dialCodeFor } from "./phoneCountries";

const initialData: ItalyFormData = {
  // About you
  firstName: "",
  lastName: "",
  email: "",
  phoneCountry: "TN",
  phone: "",
  birthday: "",
  address: "",
  nationality: "",
  howHeard: "",

  // Academic profile
  currentStatus: "",
  academicLevel: "",
  obtainedDiploma: [],
  academicRecords: [],
  fieldOfPreviousStudies: "",
  yearOfGraduation: "",
  currentOccupation: "",
  languages: [],
  languageRecords: [],

  // Study preferences
  targetDegreeLevel: "",
  intendedIntake: "",

  // CV
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
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("firstName", data.firstName);
      fd.append("lastName", data.lastName);
      fd.append("email", data.email);
      fd.append("phone", `${dialCodeFor(data.phoneCountry)} ${data.phone}`.trim());
      fd.append("birthday", data.birthday);
      fd.append("address", data.address);
      fd.append("nationality", data.nationality);
      fd.append("howHeard", data.howHeard);

      fd.append("currentStatus", data.currentStatus);
      fd.append("academicLevel", data.academicLevel);
      fd.append("obtainedDiploma", data.obtainedDiploma.join(", "));
      fd.append("academicRecords", JSON.stringify(data.academicRecords));
      fd.append("fieldOfPreviousStudies", data.fieldOfPreviousStudies);
      fd.append("yearOfGraduation", data.yearOfGraduation);
      fd.append("currentOccupation", data.currentOccupation);
      fd.append("languages", data.languages.join(", "));
      fd.append("languageRecords", JSON.stringify(data.languageRecords));

      fd.append("targetDegreeLevel", data.targetDegreeLevel);
      fd.append("intendedIntake", data.intendedIntake);

      if (data.cvFile) fd.append("cvFile", data.cvFile);

      const res = await fetch("/api/submit-italy", { method: "POST", body: fd });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Une erreur s'est produite. Réessayez.");
      }
      setStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite. Réessayez.");
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
