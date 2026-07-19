import type { DiplomaLevel, GapDocType, ProgramType, ScoreFormat } from "./types";

export const PROGRAM_TYPE_OPTIONS: ProgramType[] = [
  "Laurea Magistrale (Master's)",
  "Laurea Triennale (Bachelor's)",
  "Dottorato (PhD)",
];

export const DIPLOMA_LEVEL_OPTIONS: DiplomaLevel[] = [
  "Baccalauréat",
  "Licence (Bachelor's)",
  "Master",
  "Ingénieur",
  "Doctorat",
  "PhD",
];

export const SCORE_FORMAT_OPTIONS: ScoreFormat[] = [
  "Mention (Très Bien / Bien / Assez Bien / Passable)",
  "Score /20",
  "Score /100",
  "GPA /4",
  "Pass / Fail",
];

export const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => String(2015 + i));

export const YEARS_EXPERIENCE_OPTIONS = [
  { value: "0", label: "0 (none)" },
  { value: "1", label: "1 year" },
  { value: "2", label: "2 years" },
  { value: "3", label: "3 years" },
  { value: "4", label: "4+ years" },
];

export const GAP_DOC_TYPE_OPTIONS: GapDocType[] = [
  "Internship / Stage",
  "Work certificate",
  "Training / Formation",
  "Other document",
  "No document",
];

export const DOC_LANGUAGE_OPTIONS = ["EN", "FR", "AR", "Other"] as const;

export const CURRENT_YEAR = 2026;

export function computeGapYears(yearObtained: string, yearsExperience: string): number {
  const year = Number(yearObtained);
  const experience = Number(yearsExperience) || 0;
  if (!year) return 0;
  return CURRENT_YEAR - year - experience;
}
