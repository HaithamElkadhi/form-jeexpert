import type { Metadata } from "next";
import TicketForm from "./TicketForm";

export const metadata: Metadata = {
  title: "Ticket support — JEExpert Forms",
};

export default function TicketPage() {
  return <TicketForm />;
}
