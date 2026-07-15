"use client";

import { useMemo, useState } from "react";
import { GuarantorData, initialVisaData, VisaFormData } from "./types";
import { buildSituationText, buildWarnings } from "./visaTemplate";
import ProgressBar from "./components/ProgressBar";
import FadeStep from "./components/FadeStep";
import WelcomeStep from "./components/WelcomeStep";
import SectionA from "./components/SectionA";
import SectionB from "./components/SectionB";
import SectionC from "./components/SectionC";
import SectionD from "./components/SectionD";
import SectionE from "./components/SectionE";
import SectionF from "./components/SectionF";
import SectionG from "./components/SectionG";
import SectionH from "./components/SectionH";
import ResultStep from "./components/ResultStep";

const STEP_ORDER = [
  "welcome",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "result",
] as const;

type Step = (typeof STEP_ORDER)[number];

function isStepVisible(step: Step, data: VisaFormData): boolean {
  if (step === "E") return data.gap === "Oui";
  if (step === "F") return data.source_financement === "Garant(s)" || data.source_financement === "Mixte";
  if (step === "G") return data.source_financement === "Bourse" || data.source_financement === "Mixte";
  return true;
}

function nextStep(current: Step, data: VisaFormData): Step {
  const idx = STEP_ORDER.indexOf(current);
  for (let i = idx + 1; i < STEP_ORDER.length; i++) {
    if (isStepVisible(STEP_ORDER[i], data)) return STEP_ORDER[i];
  }
  return current;
}

function prevStep(current: Step, data: VisaFormData): Step {
  const idx = STEP_ORDER.indexOf(current);
  for (let i = idx - 1; i >= 0; i--) {
    if (isStepVisible(STEP_ORDER[i], data)) return STEP_ORDER[i];
  }
  return current;
}

export default function VisaForm() {
  const [step, setStep] = useState<Step>("welcome");
  const [data, setData] = useState<VisaFormData>(initialVisaData);

  function update<K extends keyof VisaFormData>(key: K, value: VisaFormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function updateGuarantor(
    which: "garant1" | "garant2",
    key: keyof GuarantorData,
    value: string | string[]
  ) {
    setData((d) => ({ ...d, [which]: { ...d[which], [key]: value } }));
  }

  const situationText = useMemo(() => buildSituationText(data), [data]);
  const warnings = useMemo(() => buildWarnings(data), [data]);

  const visibleFieldSteps = useMemo(
    () => STEP_ORDER.filter((s) => s !== "welcome" && s !== "result" && isStepVisible(s, data)),
    [data]
  );
  const currentFieldIndex = visibleFieldSteps.indexOf(step as (typeof visibleFieldSteps)[number]);
  const progressPercent =
    step === "welcome"
      ? 0
      : step === "result"
        ? 100
        : ((currentFieldIndex + 1) / visibleFieldSteps.length) * 100;
  const showProgress = step !== "welcome" && step !== "result";

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
            {step === "welcome" && <WelcomeStep onNext={() => setStep(nextStep("welcome", data))} />}
            {step === "A" && (
              <SectionA data={data} update={update} onNext={() => setStep(nextStep("A", data))} />
            )}
            {step === "B" && (
              <SectionB
                data={data}
                update={update}
                onNext={() => setStep(nextStep("B", data))}
                onBack={() => setStep(prevStep("B", data))}
              />
            )}
            {step === "C" && (
              <SectionC
                data={data}
                update={update}
                onNext={() => setStep(nextStep("C", data))}
                onBack={() => setStep(prevStep("C", data))}
              />
            )}
            {step === "D" && (
              <SectionD
                data={data}
                update={update}
                onNext={() => setStep(nextStep("D", data))}
                onBack={() => setStep(prevStep("D", data))}
              />
            )}
            {step === "E" && (
              <SectionE
                data={data}
                update={update}
                onNext={() => setStep(nextStep("E", data))}
                onBack={() => setStep(prevStep("E", data))}
              />
            )}
            {step === "F" && (
              <SectionF
                data={data}
                update={update}
                updateGuarantor={updateGuarantor}
                onNext={() => setStep(nextStep("F", data))}
                onBack={() => setStep(prevStep("F", data))}
              />
            )}
            {step === "G" && (
              <SectionG
                data={data}
                update={update}
                onNext={() => setStep(nextStep("G", data))}
                onBack={() => setStep(prevStep("G", data))}
              />
            )}
            {step === "H" && (
              <SectionH
                data={data}
                update={update}
                onNext={() => setStep(nextStep("H", data))}
                onBack={() => setStep(prevStep("H", data))}
              />
            )}
            {step === "result" && (
              <ResultStep
                situationText={situationText}
                warnings={warnings}
                onBack={() => setStep(prevStep("result", data))}
              />
            )}
          </FadeStep>
        </div>
      </div>
    </main>
  );
}
