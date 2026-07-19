import type { Metadata } from "next";
import AdmissionForm from "./AdmissionForm";

export const metadata: Metadata = {
  title: "Italy admission — JEExpert Forms",
};

export default function AdmissionItalyPage() {
  return <AdmissionForm />;
}
