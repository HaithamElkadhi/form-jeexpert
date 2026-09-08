/**
 * Single source of truth for Airtable base / tables / fields.
 * Add new tables or fields here when scaling forms.
 *
 * Prefer field IDs (`fld…`) over names — they survive column renames.
 * Prospects Italy writes still use names where IDs are not recorded yet.
 */

export const AIRTABLE = {
  baseId: "appkqvTuc8F0AhWPp",

  tables: {
    prospects: {
      id: "tblQPh56AAmCe1bTj",
      fields: {
        // Lookup / shared (field IDs)
        email: "fldWBOtlmuPIXdsep",

        // Italy form writes (field names — replace with fld… when available)
        name: "Name",
        surname: "Surname",
        phone: "Phone",
        whatsapp: "WhatsApp Number",
        birthday: "Birthday",
        fullAddress: "Full Address",
        howHeard: "How did you hear about us",
        lastAcademicLevel: "Last Academic Level",
        lastDiploma: "Last Diploma Obtained",
        languages: "Languages",
        entryLevel: "Entry Level",
        preferredField: "Preferred Field of Study",
        cv: "CV",
      },
    },

    documents: {
      id: "tbl4qg0oCDDMm6nfc",
      fields: {
        name: "flduCzBz6r4mbeyR6",
        prospect: "flddLbOxT5ONdCPWX",
        email: "fldvXXUGFdfSKRAjl",
        submissionDate: "fld8DrbLEdxg0D4JE",
        diplomaLevel: "fldo1JjqlT5kcO9eZ",
        fieldOfStudy: "fldLz8dT90dTAEQed",
        scoreFormat: "fldhfzzwpyesvUG2p",
        scoreValue: "fldByb2VC7zf4PvLp",
        gapYears: "flduV0meKEUlon4xz",
        gapDescription: "fldp6UeYZT5Q9Tbe2",
        gapDocTypes: "fldPj1ZezVOODe5EY",
        passportExpiry: "fldZA6EiC0DH6h8G3",
        languageCertName: "fldM0K2xgtpbanO1z",
        documents: "fldlw19MuDmTwg7iy",
        documentsStatus: "fldif76Ukh0xKQDoH",
        dossierSubmitted: "fldHe22CIKSrHo9aK",
        totalExpected: "fldjiRsKUUxt7Ra78",
        submittedCount: "fldTT09a4RdZmRvOh",
      },
    },

    tasks: {
      id: "tblkmA6khmu06nmSb",
      fields: {
        prospectName: "flde1U5nx74Xcwyft",
        clientEmail: "fldOeDhTRKcby0jKO",
        clientPhone: "fldslsb7PRy8cSCHg",
        taskType: "fldjYnfISDfXSmv1c",
        description: "fld6KhpKoJl0KqWCK",
        taskStatus: "fldD9zlILdlxUHFNh",
        linkedProspect: "fldjSWmfcfKoSdJzS",
        /** Formula: TSK-YYYYMMDD-XXXXX — read-only */
        ticketRef: "fldREmahsaEC8gl87",
      },
    },
  },
} as const;

export type AirtableTableKey = keyof typeof AIRTABLE.tables;

export function getAirtableApiKey(): string {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) {
    throw new Error("AIRTABLE_API_KEY is not set");
  }
  return key;
}
