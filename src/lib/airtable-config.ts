/**
 * Single source of truth for Airtable base / tables / fields.
 * Add new tables or fields here when scaling forms.
 *
 * Prefer field IDs (`fld…`) over names — they survive column renames.
 */

export const AIRTABLE = {
  baseId: "appkqvTuc8F0AhWPp",

  tables: {
    prospects: {
      id: "tblQPh56AAmCe1bTj",
      fields: {
        // Shared
        email: "fldWBOtlmuPIXdsep",

        // Personal info
        name: "fldrjpZMHxXReuVBK",
        surname: "fldrlBOVl9Rd2wIff",
        phone: "fldx6RMeRYPWC9BV3",
        whatsapp: "fldHIXLt8b7LaLf9s",
        birthday: "fldUiSJwz4U9FDNJH",
        fullAddress: "fldP5aCtktb3nrpPI",
        nationality: "fldmG4KgxlZIWe5yC",
        howHeard: "fldLV49Le4NdHQ3zX",

        // Academic profile
        currentStatus: "fldvzq0VUdgCELdRf",
        academicLevel: "fldZT8Pius01jN6Rc",
        lastAcademicLevel: "fldGeykWH8oKFr03M",
        lastDiploma: "fldW153lo9sB8qUSH",
        obtainedDiplomas: "fld1P0dI80wYuEXe1",
        fieldOfPreviousStudies: "fldLL6037ymaLuT5m",
        yearOfGraduation: "fldsot30LGlll8oss",
        currentOccupation: "fldqTBJ1GLInyIHws",
        // Academic records description (long text, all diplomas combined)
        academicRecordDescription: "fldgGMhu1oFDV8YbF",

        // Language profile
        languages: "fld2HHy6pgpQJmUNv",
        // Language records description (long text, all languages combined)
        languageRecordDescription: "flduGDlcArGZHrWOA",

        // Study preferences
        entryLevel: "fldC85ZK7TfLJc6N2",
        targetDegreeLevel: "fldiIXhVLGlOYfNEX",
        intendedIntake: "fldWgAo9MCS0PQ0Qb",
        preferredField: "fldtEe8tIFgc9bS04",
        primaryFieldOfStudy: "fldIYBuTapsL6oHnz",
        alternativeField: "fldW1lu6RJLB6cUT1",
        programLanguages: "fldGVRtZ7aFnr5KM0",
        cityPreferenceType: "fldUitTkCZNanMcID",
        preferredCityUniversity: "fldFXkXX9HgLVI1bm",

        // Financial
        financingPlan: "fldLPAvvz286zcxz2",
        financialGuarantor: "fldKXmKZb2TVgDfNE",
        blockedAccount: "fldjhqSyAPCnznYAs",
        supportFromAbroad: "fldqst8OaoMhb9xTJ",
        abroadSupportDetails: "fld0i1plGROk8Dq1X",
        availableBudget: "fldLQp9TJZTDadP6L",

        // CV
        cv: "fldenMwZiItEpYz4L",
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
        ticketType: "fldSjR5EVnhvC0qer",
        taskObject: "fldsLCGHg6yeQHtzg",
        description: "fld6KhpKoJl0KqWCK",
        attachment: "fldQUFTfeAHWUsuLk",
        taskStatus: "fldD9zlILdlxUHFNh",
        linkedProspect: "fldjSWmfcfKoSdJzS",
        ticketRef: "fldREmahsaEC8gl87",
      },
    },

    bourseDocuments: {
      id: "tbl7qGYTAKarKrGNn",
      fields: {
        submissionDate: "fldRcaQssXLUDlmVe",
        prospect: "fldqnqmR3GsouwBux",
        householdMembers: "fld8gNl1RQ9QLBt0L",
        dossierStatus: "fldUz9ib1shIzw214",
        birthCertificates: "fldFEqqFT5aDClPVu",
        familyBooklet: "fldFMro4OqzaN2OK4",
        propertyDocs: "fldLDhgKHVdfGRHin",
        nonPropertyDocs: "fldiBfgBJJh6alXT3",
        balanceAttestation: "fld1F6Qoa4e5Y8Xsx",
        taxDeclarations: "fldQw9wQfvM9dYKFx",
        otherDocuments: "fldv0Ls0B3j3KwArG",
      },
    },
  },
} as const;

/** Recruitment form lives in its own Airtable base to keep candidate data separate. */
export const AIRTABLE_CANDIDATURES = {
  baseId: "appVHjUwJBU3wGrOW",
  tableId: "tblnud4TgpDXiuAQx",
  fields: {
    fullName: "fldeREj0cZbORnrlm",
    lastName: "fld7zmomLskfnP7Dp",
    firstName: "fldHC7iokvAWLTMKZ",
    birthDate: "fldVdjyJZFPW4zztJ",
    age: "fldsRr7FH96M8771n",
    whatsapp: "fldIcd2XaIeqCn9t1",
    governorate: "fldV7AQnWCcXZQzlT",
    cityAddress: "fldY8rDaZkDaCX6N4",
    contractTypes: "fldqHDKFbJP6Vjusl",
    workMode: "fldyTd8LEB6kTKvEb",
    availableFrom: "fldQj6v0wp98K63dj",
    expectedSalary: "fldtA54nODavPRrCo",
    lastDiploma: "fldC6evht9lnYjz7r",
    arabic: "fldUrI492SSfVFBNw",
    french: "fldLPu9NyTi9fvGNg",
    english: "fldU5dIAOMh09jRsp",
    italian: "fldhwTqU8eQlDhE1x",
    experience: "fldVpWjOlEsF99jB7",
    cv: "fldD6pebciD07t0BE",
    italyInterest: "fld2R4ENoHpCKVtDz",
    dataConsent: "fldbUqtj3POhHCTuD",
    status: "fld748Qqm9HxZP4wF",
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
