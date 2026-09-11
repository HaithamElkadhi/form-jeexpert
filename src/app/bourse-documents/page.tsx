import type { Metadata } from "next";
import BourseDocumentsForm from "./BourseDocumentsForm";

export const metadata: Metadata = {
  title: "Documents à fournir — Bourse régionale — JEExpert Forms",
};

export default function BourseDocumentsPage() {
  return <BourseDocumentsForm />;
}
