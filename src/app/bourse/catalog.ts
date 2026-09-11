export type DocumentCategory =
  | "civil"
  | "income"
  | "property"
  | "bank"
  | "university"
  | "identity";

export interface DocumentCatalogEntry {
  code: string;
  name: string;
  country: "Tunisia" | "Italy" | "International";
  institution: string;
  category: DocumentCategory;
  requiresYear: boolean;
  requiredInfo?: string;
}

export const DOCUMENT_CATALOG: Record<string, DocumentCatalogEntry> = {
  TUN_LIFE_CERTIFICATE: {
    code: "TUN_LIFE_CERTIFICATE",
    name: "Certificat de vie collectif",
    country: "Tunisia",
    institution: "Municipalité (Tunisie)",
    category: "civil",
    requiresYear: false,
    requiredInfo:
      "Doit identifier l’étudiant et les membres du foyer vivant sous le même toit.",
  },
  TUN_BIRTH_EXTRACT: {
    code: "TUN_BIRTH_EXTRACT",
    name: "Extrait d’acte de naissance",
    country: "Tunisia",
    institution: "Municipalité / état civil (Tunisie)",
    category: "civil",
    requiresYear: false,
  },
  TUN_DEATH_EXTRACT: {
    code: "TUN_DEATH_EXTRACT",
    name: "Extrait d’acte de décès",
    country: "Tunisia",
    institution: "Municipalité / état civil (Tunisie)",
    category: "civil",
    requiresYear: false,
  },
  TUN_MARRIAGE_CERT: {
    code: "TUN_MARRIAGE_CERT",
    name: "Certificat de mariage",
    country: "Tunisia",
    institution: "Municipalité / état civil (Tunisie)",
    category: "civil",
    requiresYear: false,
  },
  TUN_DIVORCE_JUDGMENT: {
    code: "TUN_DIVORCE_JUDGMENT",
    name: "Jugement de divorce",
    country: "Tunisia",
    institution: "Tribunal de première instance (greffe)",
    category: "civil",
    requiresYear: false,
  },
  TUN_NON_APPEAL: {
    code: "TUN_NON_APPEAL",
    name: "Attestation de non-recours",
    country: "Tunisia",
    institution: "Tribunal de première instance (greffe)",
    category: "civil",
    requiresYear: false,
  },
  TUN_SEPARATION_JUDGMENT: {
    code: "TUN_SEPARATION_JUDGMENT",
    name: "Jugement de séparation",
    country: "Tunisia",
    institution: "Tribunal de première instance (greffe)",
    category: "civil",
    requiresYear: false,
  },
  TUN_DECLARED_INCOME: {
    code: "TUN_DECLARED_INCOME",
    name: "Attestation des revenus déclarés (patente)",
    country: "Tunisia",
    institution: "Recette des finances (Tunisie)",
    category: "income",
    requiresYear: true,
  },
  TUN_NON_IMPOSITION: {
    code: "TUN_NON_IMPOSITION",
    name: "Attestation de non-imposition",
    country: "Tunisia",
    institution: "Recette des finances (Tunisie)",
    category: "income",
    requiresYear: true,
  },
  TUN_SALARY_TAX_WITHHOLDING: {
    code: "TUN_SALARY_TAX_WITHHOLDING",
    name: "Certificat de retenue d’impôt sur le revenu au titre des traitements et salaires",
    country: "Tunisia",
    institution: "Recette des finances (Tunisie)",
    category: "income",
    requiresYear: true,
    requiredInfo:
      "Doit indiquer le nom du salarié, l’année concernée, le salaire annuel brut, les retenues fiscales, la signature et le cachet de l’employeur.",
  },
  TUN_PENSION_TAX_WITHHOLDING: {
    code: "TUN_PENSION_TAX_WITHHOLDING",
    name: "Certificat de retenue d’impôt sur le revenu au titre des pensions et rentes viagères",
    country: "Tunisia",
    institution: "CNRPS ou CNSS (Tunisie)",
    category: "income",
    requiresYear: true,
  },
  TUN_SALARY_CERTIFICATE: {
    code: "TUN_SALARY_CERTIFICATE",
    name: "Attestation de salaire annuelle indiquant le total brut annuel",
    country: "Tunisia",
    institution: "Employeur (Tunisie)",
    category: "income",
    requiresYear: true,
    requiredInfo:
      "Doit indiquer le nom du salarié, l’année concernée, le salaire annuel brut, les retenues fiscales, la signature et le cachet de l’employeur.",
  },
  TUN_PENSION_BENEFIT: {
    code: "TUN_PENSION_BENEFIT",
    name: "Attestation de bénéfice de pension",
    country: "Tunisia",
    institution: "CNRPS ou CNSS (Tunisie)",
    category: "income",
    requiresYear: true,
  },
  TUN_PENSION_STATEMENT: {
    code: "TUN_PENSION_STATEMENT",
    name: "Relevé annuel de pension",
    country: "Tunisia",
    institution: "CNRPS ou CNSS (Tunisie)",
    category: "income",
    requiresYear: true,
  },
  TUN_RNE_EXTRACT: {
    code: "TUN_RNE_EXTRACT",
    name: "Extrait du Registre National des Entreprises",
    country: "Tunisia",
    institution: "Registre National des Entreprises (RNE)",
    category: "income",
    requiresYear: false,
    requiredInfo: "Extrait RNE récent.",
  },
  TUN_SCHOLARSHIP_PROOF: {
    code: "TUN_SCHOLARSHIP_PROOF",
    name: "Justificatif de bourse",
    country: "Tunisia",
    institution: "Organisme attributaire de la bourse",
    category: "income",
    requiresYear: true,
  },
  TUN_PROPERTY_CERTIFICATE: {
    code: "TUN_PROPERTY_CERTIFICATE",
    name: "Certificat de propriété ou attestation de participation à la propriété",
    country: "Tunisia",
    institution: "Office National de la Propriété Foncière",
    category: "property",
    requiresYear: true,
    requiredInfo:
      "Doit indiquer si possible : identité du propriétaire, type du bien, localisation, superficie en m², pourcentage ou quote-part, numéro du titre foncier, date de situation (31 décembre de chaque année concernée).",
  },
  TUN_NON_PROPERTY_CERTIFICATE: {
    code: "TUN_NON_PROPERTY_CERTIFICATE",
    name: "Certificat de non-propriété",
    country: "Tunisia",
    institution: "Office National de la Propriété Foncière",
    category: "property",
    requiresYear: true,
  },
  TUN_UNREGISTERED_DEED: {
    code: "TUN_UNREGISTERED_DEED",
    name: "Acte de propriété d’un bien non immatriculé",
    country: "Tunisia",
    institution: "Notaire (Tunisie)",
    category: "property",
    requiresYear: false,
    requiredInfo: "Acte de propriété, contrat d’achat, acte notarié ou certificat administratif prouvant la propriété.",
  },
  TUN_BANK_STATEMENTS: {
    code: "TUN_BANK_STATEMENTS",
    name: "Relevés de compte de janvier à décembre",
    country: "Tunisia",
    institution: "Banque du titulaire (Tunisie)",
    category: "bank",
    requiresYear: true,
  },
  TUN_POSTAL_STATEMENTS: {
    code: "TUN_POSTAL_STATEMENTS",
    name: "Relevés de compte postal de janvier à décembre",
    country: "Tunisia",
    institution: "Poste Tunisienne",
    category: "bank",
    requiresYear: true,
  },
  TUN_BALANCE_DEC31: {
    code: "TUN_BALANCE_DEC31",
    name: "Attestation de solde au 31 décembre",
    country: "Tunisia",
    institution: "Banque du titulaire ou Poste Tunisienne",
    category: "bank",
    requiresYear: true,
    requiredInfo:
      "Doit mentionner le titulaire, le numéro ou référence du compte, la banque, la devise, le solde et la date exacte.",
  },
  TUN_SIBLING_STUDENT_PROOF: {
    code: "TUN_SIBLING_STUDENT_PROOF",
    name: "Attestation de scolarité (présence ou inscription)",
    country: "Tunisia",
    institution: "Établissement scolaire ou universitaire",
    category: "income",
    requiresYear: true,
  },
  DOC_PASSPORT: {
    code: "DOC_PASSPORT",
    name: "Passeport",
    country: "International",
    institution: "Ministère de l’Intérieur (Tunisie)",
    category: "identity",
    requiresYear: false,
  },
  DOC_CODICE_FISCALE: {
    code: "DOC_CODICE_FISCALE",
    name: "Codice fiscale",
    country: "Italy",
    institution: "Agenzia delle Entrate (Italie) ou Consulat italien en Tunisie",
    category: "identity",
    requiresYear: false,
  },
  DOC_ADMISSION_LETTER: {
    code: "DOC_ADMISSION_LETTER",
    name: "Lettre d’admission ou de préadmission",
    country: "Italy",
    institution: "Université italienne (portail étudiant)",
    category: "university",
    requiresYear: false,
  },
};
