export interface FormListing {
  name: string;
  slug: string;
}

// Hardcoded for this iteration — add new forms here as they launch.
export const FORMS: FormListing[] = [
  { name: "Profil étudiant — Italie", slug: "italy" },
  { name: "Dossier d'admission — Italie", slug: "admission-italy" },
  { name: "Checklist bourse régionale — Italie", slug: "bourse" },
  { name: "Documents bourse", slug: "documents-bourse" },
  { name: "Ticket support", slug: "ticket" },
];
