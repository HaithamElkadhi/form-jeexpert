import type { Metadata } from "next";
import DocumentsBourseForm from "./DocumentsBourseForm";

export const metadata: Metadata = {
  title: "Documents bourse — JEExpert Forms",
};

export default function DocumentsBoursePage() {
  return <DocumentsBourseForm />;
}
