import { jsPDF } from "jspdf";
import { buildDocList } from "./buildDocList";
import {
  DIPLOMA_LEVEL_OPTIONS,
  GAP_DOC_TYPE_OPTIONS,
  YEARS_EXPERIENCE_OPTIONS,
} from "./options";
import type { AdmissionFormData, DiplomaLevel, GapDocType } from "./types";

const GREEN: [number, number, number] = [59, 109, 17];
const INK: [number, number, number] = [17, 24, 39];
const MUTED: [number, number, number] = [107, 114, 128];

function orDash(value: string): string {
  const trimmed = value.trim();
  return trimmed || "—";
}

function diplomaLabel(level: DiplomaLevel): string {
  return DIPLOMA_LEVEL_OPTIONS.find((opt) => opt.value === level)?.label || orDash(level);
}

function experienceLabel(value: string): string {
  return YEARS_EXPERIENCE_OPTIONS.find((opt) => opt.value === value)?.label || orDash(value);
}

function gapDocLabel(type: GapDocType): string {
  return GAP_DOC_TYPE_OPTIONS.find((opt) => opt.value === type)?.label || type;
}

function filePart(value: string): string {
  const cleaned = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "etudiant";
}

export function downloadAdmissionPdf(data: AdmissionFormData): void {
  const { profile, academic } = data;
  const hasGap = academic.gapYears > 1;
  const docList = buildDocList(academic.diplomaLevel, hasGap, academic.gapDocTypes);

  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 18;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  function ensureSpace(height: number) {
    if (y + height > 282) {
      pdf.addPage();
      y = 20;
    }
  }

  function heading(text: string) {
    ensureSpace(14);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.setTextColor(...GREEN);
    pdf.text(text, margin, y);
    y += 8;
  }

  function field(label: string, value: string) {
    pdf.setFontSize(10);
    const lines = pdf.splitTextToSize(orDash(value), contentWidth - 58);
    ensureSpace(6 + lines.length * 5);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(55, 65, 81);
    pdf.text(label, margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...INK);
    pdf.text(lines, margin + 58, y);
    y += Math.max(6, lines.length * 5);
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(...GREEN);
  pdf.text("JEExpert", margin, y);
  y += 8;

  pdf.setFontSize(18);
  pdf.setTextColor(...INK);
  pdf.text("Dossier d'admission — Italie", margin, y);
  y += 7;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(...MUTED);
  pdf.text("Résumé étudiant et documents requis", margin, y);
  y += 10;

  heading("Résumé étudiant");
  field("Prénom", profile.firstName);
  field("Nom", profile.lastName);
  field("E-mail", profile.email);
  field("Téléphone", profile.phone);
  field("Programme visé", profile.programType);
  field("Dernier diplôme", diplomaLabel(academic.diplomaLevel));
  field("Nom du diplôme", academic.fieldOfStudy);
  field("Moyenne /20", academic.scoreValue);
  field("Année d'obtention", academic.yearObtained);
  field("Expérience", experienceLabel(academic.yearsExperience));

  if (hasGap) {
    const yearLabel = academic.gapYears === 1 ? "an" : "ans";
    field("Interruption", `${academic.gapYears} ${yearLabel}`);
    field("Pendant cette période", academic.gapDescription);
    const gapDocs =
      academic.gapDocTypes.length > 0
        ? academic.gapDocTypes.map(gapDocLabel).join(", ")
        : "—";
    field("Justificatifs", gapDocs);
  }

  y += 4;
  heading("Documents requis");

  if (docList.length === 0) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(...MUTED);
    pdf.text("Aucun document requis pour ce parcours.", margin, y);
  } else {
    docList.forEach((item, index) => {
      const title = `${index + 1}. ${item.name}`;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      const hintLines = item.hint ? pdf.splitTextToSize(item.hint, contentWidth - 6) : [];
      ensureSpace(8 + hintLines.length * 4);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(...INK);
      pdf.text(title, margin, y);
      y += 5;
      if (hintLines.length > 0) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...MUTED);
        pdf.text(hintLines, margin + 5, y);
        y += hintLines.length * 4 + 2;
      } else {
        y += 2;
      }
    });
  }

  pdf.save(
    `dossier-admission-${filePart(profile.lastName)}-${filePart(profile.firstName)}.pdf`
  );
}
