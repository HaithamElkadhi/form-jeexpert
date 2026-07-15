import { GuarantorData, VisaFormData } from "./types";

function join(list: string[]): string {
  return list.filter(Boolean).join(", ");
}

function guarantorSummary(g: GuarantorData): string {
  const lien = [g.garant_lien, g.garant_lien_detail].filter(Boolean).join(" ");
  const parts = [
    lien,
    g.garant_statut,
    g.garant_revenus ? `revenus ~${g.garant_revenus} TND` : "",
    g.garant_patrimoine ? `patrimoine: ${g.garant_patrimoine}` : "",
  ].filter(Boolean);
  let summary = parts.join(", ");
  if (g.garant_docs.length > 0) {
    summary += `. Docs disponibles: ${join(g.garant_docs)}`;
  }
  if (g.garant_italie_sejour) {
    summary += `. Titre de séjour + revenus déclarés (Italie): ${g.garant_italie_sejour}`;
  }
  if (g.garant_italie_hebergement) {
    summary += `. Hébergera l'étudiant: ${g.garant_italie_hebergement}`;
  }
  return summary;
}

export function buildSituationText(data: VisaFormData): string {
  const lines: string[] = [];

  if (data.nom) {
    lines.push(
      `Étudiant(e): ${data.nom}${data.age ? `, ${data.age} ans` : ""}${
        data.nationalite ? `, nationalité ${data.nationalite}` : ""
      }.`
    );
  }

  if (data.passeport_validite) {
    lines.push(`Passeport: validité >15 mois = ${data.passeport_validite}.`);
  }

  if (data.cursus_type || data.programme) {
    lines.push(
      `Cursus: ${data.cursus_type} — ${data.programme} en ${data.langue_cursus} à ${data.universite} (${data.ville}).`
    );
  }

  if (data.universitaly_statut || data.almaviva || data.admission_statut) {
    lines.push(
      `Universitaly: ${data.universitaly_statut}; ALMAVIVA: ${data.almaviva}. Admission: ${data.admission_statut}${
        data.admission_conditions ? ` ${data.admission_conditions}` : ""
      }.`
    );
  }

  if (data.cimea_dov) {
    lines.push(`Université demande: ${data.cimea_dov}.`);
  }

  if (data.dernier_diplome) {
    lines.push(
      `Dernier diplôme: ${data.dernier_diplome}, ${data.etablissement}, ${data.annee_diplome}. Diplôme final: ${data.diplome_final_en_main}. Relevés: ${data.releves_complets}.`
    );
  }

  if (data.gap) {
    if (data.gap === "Oui") {
      lines.push(
        `Gap: Oui (${data.gap_duree} ans) — activités: ${join(
          data.gap_activites
        )}; preuves: ${join(data.gap_preuves)}; motivation: ${data.gap_motivation}.`
      );
    } else {
      lines.push(`Gap: ${data.gap}.`);
    }
  }

  if (data.etudes_abandonnees) {
    lines.push(
      `Études abandonnées: ${data.etudes_abandonnees}${
        data.abandon_details ? ` ${data.abandon_details}` : ""
      }.`
    );
  }

  if (data.changement_domaine) {
    lines.push(
      `Changement de domaine: ${data.changement_domaine}${
        data.lien_domaines ? ` ${data.lien_domaines}` : ""
      }.`
    );
  }

  if (data.certificat_langue) {
    lines.push(
      `Langue: certificat ${data.certificat_langue}${
        data.certificat_details ? ` ${data.certificat_details}` : ""
      }; exemption/vérification par l'université: ${data.exemption_universite}.`
    );
  }

  if (data.source_financement) {
    lines.push(
      `Financement: ${data.source_financement}. Blocage bancaire sur le compte de: ${data.blocage_compte}. Historique 6 mois: ${data.historique_6mois}. Gros dépôts: ${data.gros_depots}${
        data.depots_details ? ` ${data.depots_details}` : ""
      }.${data.origine_epargne ? ` ${data.origine_epargne}` : ""}`
    );
  }

  const financeIncludesGarant =
    data.source_financement === "Garant(s)" || data.source_financement === "Mixte";

  if (financeIncludesGarant && data.garant1.garant_lien) {
    lines.push(`Garant 1: ${guarantorSummary(data.garant1)}.`);
  }

  if (financeIncludesGarant && data.deuxieme_garant === "Oui" && data.garant2.garant_lien) {
    lines.push(
      `Garant 2: ${guarantorSummary(data.garant2)}.${
        data.repartition ? ` Répartition: ${data.repartition}` : ""
      }`
    );
  }

  const financeIncludesBourse =
    data.source_financement === "Bourse" || data.source_financement === "Mixte";

  if (financeIncludesBourse && data.bourse_statut) {
    lines.push(
      `Bourse: ${data.bourse_statut}, ${data.bourse_organisme}, ${data.bourse_montant}, couvre ${join(
        data.bourse_couverture
      )}.`
    );
  }

  if (data.logement_type) {
    lines.push(
      `Logement: ${data.logement_type}.${
        data.hebergeant_details ? ` ${data.hebergeant_details}` : ""
      }`
    );
  }

  if (data.assurance || data.mineur || data.coherence_noms) {
    lines.push(
      `Assurance: ${data.assurance}. Mineur: ${data.mineur}. Cohérence noms/dates: ${data.coherence_noms}.`
    );
  }

  if (data.notes_libres) {
    lines.push(`Notes: ${data.notes_libres}`);
  }

  return lines.join("\n");
}

export function buildWarnings(data: VisaFormData): string[] {
  const warnings: string[] = [];

  if (data.passeport_validite === "Non") {
    warnings.push("Renouveler le passeport avant dépôt (bloquant).");
  }

  if (data.universitaly_statut && data.universitaly_statut !== "Validée par l'université") {
    warnings.push("La checklist finale suppose la validation Universitaly.");
  }

  if (data.certificat_langue === "EF SET" && data.exemption_universite !== "Oui") {
    warnings.push(
      "EF SET rarement reconnu — demander une attestation d'exemption à l'université."
    );
  }

  if (data.logement_type === "Liste d'attente" || data.logement_type === "Rien encore") {
    warnings.push("Liste d'attente ≠ réservation confirmée.");
  }

  if (
    data.source_financement === "Bourse" &&
    data.bourse_statut &&
    data.bourse_statut !== "Attribuée officiellement"
  ) {
    warnings.push(
      "La bourse ne remplace pas les preuves de ressources — compléter la section Garant(s)."
    );
  }

  if (data.garant1.garant_statut === "Retraité" && data.deuxieme_garant === "Non") {
    warnings.push("Envisager un 2e garant si la pension est modeste.");
  }

  if (data.gap === "Oui" && data.gap_preuves.includes("Aucune")) {
    warnings.push("Rassembler au minimum CNSS ou attestations pour le gap year.");
  }

  if (data.garant1.garant_lien === "Sans lien familial") {
    warnings.push(
      "Garant sans lien familial : solution déconseillée — prévoir des ressources personnelles ou familiales."
    );
  }

  return warnings;
}
