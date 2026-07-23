"use client";

import { useMemo, useState } from "react";
import { generateDocuments } from "./engine/generateDocuments";
import type { BourseFormData, GeneratedDocument } from "./types";
import { initialBourseData } from "./types";
import ProgressBar from "./components/ProgressBar";
import FadeStep from "./components/FadeStep";
import WelcomeStep from "./components/WelcomeStep";
import StepStudent from "./components/StepStudent";
import StepHousehold from "./components/StepHousehold";
import StepParentsStatus from "./components/StepParentsStatus";
import StepFatherJob from "./components/StepFatherJob";
import StepMotherJob from "./components/StepMotherJob";
import StepStudentIncome from "./components/StepStudentIncome";
import StepProperty from "./components/StepProperty";
import StepBank from "./components/StepBank";
import ResultStep from "./components/ResultStep";

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
  "result",
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

export default function BourseForm() {
  const [step, setStep] = useState<Step>("welcome");
  const [data, setData] = useState<BourseFormData>(initialBourseData);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);

  function update<K extends keyof BourseFormData>(key: K, value: BourseFormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function goToResult() {
    const generated = generateDocuments(data);
    setDocuments(generated);
    setStep("result");
  }

  function restart() {
    setData(initialBourseData);
    setDocuments([]);
    setStep("welcome");
  }

  const visibleFieldSteps = useMemo(
    () =>
      STEP_ORDER.filter((s) => s !== "welcome" && s !== "result" && isStepVisible(s, data)),
    [data]
  );
  const currentFieldIndex = visibleFieldSteps.indexOf(
    step as (typeof visibleFieldSteps)[number]
  );
  const progressPercent =
    step === "welcome"
      ? 0
      : step === "result"
        ? 100
        : ((currentFieldIndex + 1) / visibleFieldSteps.length) * 100;
  const showProgress = step !== "welcome" && step !== "result";

  return (
    <main className="flex flex-1 items-start justify-center px-4 py-12">
      <div
        className={`w-full overflow-hidden rounded-xl border border-gray-200 bg-white ${
          step === "result" ? "max-w-2xl" : "max-w-lg"
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
                onNext={goToResult}
                onBack={() => setStep(prevStep("bank", data))}
              />
            )}
            {step === "result" && (
              <ResultStep
                data={data}
                documents={documents}
                onDocumentsChange={setDocuments}
                onBack={() => setStep(prevStep("result", data))}
                onRestart={restart}
              />
            )}
          </FadeStep>
        </div>
      </div>
    </main>
  );
}
