export interface GuarantorData {
  garant_lien: string;
  garant_lien_detail: string;
  garant_statut: string;
  garant_revenus: string;
  garant_patrimoine: string;
  garant_docs: string[];
  garant_italie_sejour: string;
  garant_italie_hebergement: string;
}

export const emptyGuarantor: GuarantorData = {
  garant_lien: "",
  garant_lien_detail: "",
  garant_statut: "",
  garant_revenus: "",
  garant_patrimoine: "",
  garant_docs: [],
  garant_italie_sejour: "",
  garant_italie_hebergement: "",
};

export interface VisaFormData {
  // Section A — Profil et admission
  nom: string;
  age: string;
  nationalite: string;
  residence_legale: string;
  passeport_validite: string;
  cursus_type: string;
  universite: string;
  ville: string;
  programme: string;
  langue_cursus: string;
  universitaly_statut: string;
  almaviva: string;
  admission_statut: string;
  admission_conditions: string;
  cimea_dov: string;

  // Section B — Parcours académique
  dernier_diplome: string;
  etablissement: string;
  annee_diplome: string;
  diplome_final_en_main: string;
  releves_complets: string;
  gap: string;
  gap_duree: string;
  etudes_abandonnees: string;
  abandon_details: string;
  changement_domaine: string;
  lien_domaines: string;

  // Section C — Langue
  certificat_langue: string;
  certificat_details: string;
  exemption_universite: string;

  // Section D — Financement
  source_financement: string;
  blocage_compte: string;
  historique_6mois: string;
  gros_depots: string;
  depots_details: string;
  origine_epargne: string;

  // Section E — Gap year
  gap_activites: string[];
  gap_preuves: string[];
  gap_motivation: string;

  // Section F — Garant(s)
  garant1: GuarantorData;
  deuxieme_garant: string;
  garant2: GuarantorData;
  repartition: string;

  // Section G — Bourse
  bourse_statut: string;
  bourse_organisme: string;
  bourse_montant: string;
  bourse_couverture: string[];

  // Section H — Logement, assurance, transport
  logement_type: string;
  hebergeant_details: string;
  assurance: string;
  mineur: string;
  coherence_noms: string;
  notes_libres: string;
}

export const initialVisaData: VisaFormData = {
  nom: "",
  age: "",
  nationalite: "",
  residence_legale: "",
  passeport_validite: "",
  cursus_type: "",
  universite: "",
  ville: "",
  programme: "",
  langue_cursus: "",
  universitaly_statut: "",
  almaviva: "",
  admission_statut: "",
  admission_conditions: "",
  cimea_dov: "",

  dernier_diplome: "",
  etablissement: "",
  annee_diplome: "",
  diplome_final_en_main: "",
  releves_complets: "",
  gap: "",
  gap_duree: "",
  etudes_abandonnees: "",
  abandon_details: "",
  changement_domaine: "",
  lien_domaines: "",

  certificat_langue: "",
  certificat_details: "",
  exemption_universite: "",

  source_financement: "",
  blocage_compte: "",
  historique_6mois: "",
  gros_depots: "",
  depots_details: "",
  origine_epargne: "",

  gap_activites: [],
  gap_preuves: [],
  gap_motivation: "",

  garant1: { ...emptyGuarantor },
  deuxieme_garant: "",
  garant2: { ...emptyGuarantor },
  repartition: "",

  bourse_statut: "",
  bourse_organisme: "",
  bourse_montant: "",
  bourse_couverture: [],

  logement_type: "",
  hebergeant_details: "",
  assurance: "",
  mineur: "",
  coherence_noms: "",
  notes_libres: "",
};

export type UpdateField = <K extends keyof VisaFormData>(
  key: K,
  value: VisaFormData[K]
) => void;

export type UpdateGuarantor = (
  which: "garant1" | "garant2",
  key: keyof GuarantorData,
  value: string | string[]
) => void;
