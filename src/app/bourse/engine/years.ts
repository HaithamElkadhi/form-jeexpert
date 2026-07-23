import type { AcademicYear } from "../types";

export interface EconomicYears {
  yearOld: number;
  yearRecent: number;
  startYear: number;
}

/** année récente = début année universitaire - 1 ; année ancienne = début - 2 */
export function getEconomicYears(academicYear: AcademicYear): EconomicYears {
  const startYear = Number(academicYear.split("/")[0]);
  return {
    startYear,
    yearRecent: startYear - 1,
    yearOld: startYear - 2,
  };
}

export function yearsMention(academicYear: AcademicYear): string {
  const { yearOld, yearRecent } = getEconomicYears(academicYear);
  return `Pour l’année universitaire ${academicYear}, préparez les documents économiques, immobiliers et bancaires des années ${yearOld} et ${yearRecent} par sécurité. L’organisme régional italien pourra ensuite confirmer qu’une seule année est nécessaire.`;
}

export function formatYears(years: number[]): string {
  if (years.length === 0) return "—";
  if (years.length === 1) return String(years[0]);
  return years.join(" et ");
}
