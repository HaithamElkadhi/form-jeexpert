import type { Metadata } from "next";
import AdmissionForm from "./AdmissionForm";

export const metadata: Metadata = {
  title: "Dossier d'admission — Italie — JEExpert Forms",
};

export default function AdmissionItalyPage() {
  return <AdmissionForm />;
}
