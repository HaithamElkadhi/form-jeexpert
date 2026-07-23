export interface FormListing {
  name: string;
  slug: string;
}

// Hardcoded for this iteration — add new forms here as they launch.
export const FORMS: FormListing[] = [
  { name: "Italy application", slug: "italy" },
  { name: "Visa requirement", slug: "visa" },
  { name: "Italy admission", slug: "admission-italy" },
  { name: "Bourse régionale Italie", slug: "bourse" },
];
