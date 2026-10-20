import type { Metadata } from "next";
import CandidatureForm from "./CandidatureForm";

export const metadata: Metadata = {
  title: "Candidature — Jeexpert",
  description: "Rejoignez l’équipe Jeexpert. Envoyez votre candidature en quelques minutes.",
};

export default function CandidaturePage() {
  return <CandidatureForm />;
}
