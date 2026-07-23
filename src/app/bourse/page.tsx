import type { Metadata } from "next";
import BourseForm from "./BourseForm";

export const metadata: Metadata = {
  title: "Checklist bourse régionale — JEExpert Forms",
};

export default function BoursePage() {
  return <BourseForm />;
}
