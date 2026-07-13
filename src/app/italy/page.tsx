import type { Metadata } from "next";
import ItalyForm from "./ItalyForm";

export const metadata: Metadata = {
  title: "Italy application — JEExpert Forms",
};

export default function ItalyPage() {
  return <ItalyForm />;
}
