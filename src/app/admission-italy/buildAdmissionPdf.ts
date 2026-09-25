import jsPDF from "jspdf";
import { buildDocList } from "./buildDocList";
import { DIPLOMA_LEVEL_OPTIONS } from "./options";
import type { AdmissionFormData, DiplomaLevel } from "./types";

function diplomaLabel(level: DiplomaLevel): string {
  return DIPLOMA_LEVEL_OPTIONS.find((o) => o.value === level)?.label || level || "—";
}

function orDash(v: string) { return v?.trim() || "—"; }

function checkboxRows(docs: { name: string }[]): string {
  const rows: string[] = [];
  for (let i = 0; i < docs.length; i += 2) {
    const a = docs[i];
    const b = docs[i + 1];
    rows.push(`
      <div class="check-row">
        <label class="check-item">
          <span class="checkbox"></span>
          <span>${a.name}</span>
        </label>
        ${b ? `<label class="check-item"><span class="checkbox"></span><span>${b.name}</span></label>` : "<div></div>"}
      </div>`);
  }
  return rows.join("");
}

// CSS for the hidden render container (no @page / page-break rules needed)
const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body, div {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 9.5pt;
  color: #1e293b;
  background: #fff;
  line-height: 1.55;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 10pt;
  border-bottom: 2px solid #0f172a;
  margin-bottom: 14pt;
}
.brand-name { font-size: 15pt; font-weight: 700; color: #0f172a; letter-spacing: -0.3px; }
.brand-name span { color: #d97706; }
.brand-slogan { font-size: 7.5pt; color: #64748b; margin-top: 2pt; font-weight: 500; }
.doc-title { text-align: right; }
.doc-title h2 { font-size: 11pt; font-weight: 700; color: #0f172a; }
.doc-title .date { font-size: 7.5pt; color: #64748b; margin-top: 2pt; }

.section-title {
  font-size: 8pt; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.8px; color: #64748b; margin-bottom: 7pt;
  display: flex; align-items: center; gap: 6pt;
}
.section-title::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }

.profile-card {
  background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 8px; padding: 12pt 14pt; margin-bottom: 14pt;
}
.profile-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8pt 12pt; }
.profile-field label {
  font-size: 7pt; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.5px; color: #94a3b8; display: block; margin-bottom: 1.5pt;
}
.profile-field .value { font-size: 9pt; font-weight: 600; color: #0f172a; }

.checklist { margin-bottom: 14pt; }
.check-row { display: grid; grid-template-columns: 1fr 1fr; gap: 4pt 10pt; margin-bottom: 4pt; }
.check-item {
  display: flex; align-items: flex-start; gap: 6pt;
  font-size: 9pt; color: #1e293b; line-height: 1.4;
  padding: 4.5pt 6pt; border-radius: 5px;
  background: #fff; border: 1px solid #e2e8f0;
}
.checkbox {
  flex-shrink: 0; width: 11pt; height: 11pt;
  border: 1.5px solid #94a3b8; border-radius: 3px;
  margin-top: 0.5pt; background: #fff;
}

.cat-label {
  font-size: 7pt; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.6px; padding: 2pt 7pt; border-radius: 20px;
  display: inline-block; margin-bottom: 6pt; margin-top: 10pt;
}
.cat-general    { background: #eff6ff; color: #1d4ed8; }
.cat-academic   { background: #f0fdf4; color: #15803d; }
.cat-experience { background: #fdf4ff; color: #7e22ce; }

.notes-banner {
  background: #fffbeb; border: 1px solid #fde68a;
  border-left: 4px solid #d97706; border-radius: 6px;
  padding: 10pt 12pt; margin-top: 12pt;
}
.notes-banner .note-title {
  font-size: 8pt; font-weight: 700; color: #92400e;
  margin-bottom: 6pt; text-transform: uppercase; letter-spacing: 0.5px;
}
.notes-banner ul { padding-left: 12pt; list-style: disc; }
.notes-banner li { font-size: 8.5pt; color: #78350f; margin-bottom: 3pt; line-height: 1.5; }
.notes-banner li strong { font-weight: 700; }

.footer {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 14pt; padding-top: 8pt; border-top: 1px solid #e2e8f0;
  font-size: 7pt; color: #94a3b8;
}
.footer .brand { font-weight: 600; color: #64748b; }
.footer .brand span { color: #d97706; }

.steps-header { text-align: center; margin-bottom: 18pt; }
.steps-header h1 { font-size: 14pt; font-weight: 700; color: #0f172a; margin-bottom: 4pt; }
.steps-header p { font-size: 9pt; color: #64748b; }

.timeline { position: relative; }
.step { display: flex; gap: 12pt; margin-bottom: 14pt; position: relative; }
.step::before {
  content: ''; position: absolute;
  left: 14.5pt; top: 30pt; bottom: -14pt;
  width: 1.5px; background: #e2e8f0;
}
.step:last-child::before { display: none; }

.step-badge {
  flex-shrink: 0; width: 30pt; height: 30pt; border-radius: 50%;
  background: #0f172a; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 11pt; font-weight: 700; margin-top: 1pt;
}
.step-badge.accent { background: #2563eb; }
.step-body { flex: 1; }
.step-title { font-size: 10.5pt; font-weight: 700; color: #0f172a; margin-bottom: 5pt; }
.step-body p, .step-body li { font-size: 9pt; color: #334155; line-height: 1.55; }
.step-body ul { padding-left: 12pt; list-style: disc; margin-top: 3pt; }
.step-body li { margin-bottom: 2pt; }

.auth-table { width: 100%; border-collapse: collapse; margin-top: 6pt; font-size: 8.5pt; }
.auth-table tr:nth-child(odd) td { background: #f8fafc; }
.auth-table td { padding: 4pt 7pt; border: 1px solid #e2e8f0; color: #1e293b; line-height: 1.4; }
.auth-table td:first-child { font-weight: 600; color: #1e293b; white-space: nowrap; width: 38%; }
.auth-table td:last-child { color: #334155; }

.step-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10pt 12pt; }

.tip-box {
  background: #eff6ff; border: 1px solid #bfdbfe;
  border-left: 4px solid #2563eb; border-radius: 5px;
  padding: 6pt 10pt; margin-top: 6pt; font-size: 8.5pt; color: #1e3a8a; line-height: 1.5;
}
`;

function buildPage1Html(data: AdmissionFormData): string {
  const { profile, academic } = data;
  const hasGap = academic.hasGap && academic.gapYears > 0;
  const docList = buildDocList(
    academic.diplomaLevel, hasGap,
    academic.gapDocTypes, academic.gapOtherDocLabel,
    academic.studyLanguage
  );
  const generalDocs    = docList.filter((d) => d.category === "general");
  const academicDocs   = docList.filter((d) => d.category === "academic");
  const experienceDocs = docList.filter((d) => d.category === "experience");
  const dateStr = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const gapYrLabel = academic.gapYears === 1 ? "an" : "ans";

  return `
  <div class="header">
    <div>
      <div class="brand-name">Jee<span>expert</span></div>
      <div class="brand-slogan">Votre avenir, notre expertise</div>
    </div>
    <div class="doc-title">
      <h2>Dossier d'admission — Italie</h2>
      <div class="date">Généré le ${dateStr}</div>
    </div>
  </div>

  <div class="section-title">Profil candidat</div>
  <div class="profile-card">
    <div class="profile-grid">
      <div class="profile-field"><label>Prénom</label><div class="value">${orDash(profile.firstName)}</div></div>
      <div class="profile-field"><label>Nom</label><div class="value">${orDash(profile.lastName)}</div></div>
      <div class="profile-field"><label>E-mail</label><div class="value">${orDash(profile.email)}</div></div>
      <div class="profile-field"><label>Téléphone</label><div class="value">${orDash(profile.phone)}</div></div>
      ${profile.programType ? `<div class="profile-field"><label>Programme visé</label><div class="value">${profile.programType}</div></div>` : ""}
      <div class="profile-field"><label>Dernier diplôme</label><div class="value">${diplomaLabel(academic.diplomaLevel)}</div></div>
      ${academic.fieldOfStudy ? `<div class="profile-field"><label>Nom du diplôme</label><div class="value">${academic.fieldOfStudy}</div></div>` : ""}
      ${academic.scoreValue ? `<div class="profile-field"><label>Moyenne / 20</label><div class="value">${academic.scoreValue}</div></div>` : ""}
      ${academic.yearObtained ? `<div class="profile-field"><label>Année d'obtention</label><div class="value">${academic.yearObtained}</div></div>` : ""}
      ${academic.studyLanguage ? `<div class="profile-field"><label>Langue d'enseignement</label><div class="value">${academic.studyLanguage}</div></div>` : ""}
      ${hasGap ? `<div class="profile-field"><label>Années de gap</label><div class="value">${academic.gapYears} ${gapYrLabel}</div></div>` : ""}
    </div>
  </div>

  <div class="section-title">Documents requis</div>

  ${generalDocs.length > 0 ? `<div><span class="cat-label cat-general">Général</span></div><div class="checklist">${checkboxRows(generalDocs)}</div>` : ""}
  ${academicDocs.length > 0 ? `<div><span class="cat-label cat-academic">Académique</span></div><div class="checklist">${checkboxRows(academicDocs)}</div>` : ""}
  ${experienceDocs.length > 0 ? `<div><span class="cat-label cat-experience">Expérience / Gap</span></div><div class="checklist">${checkboxRows(experienceDocs)}</div>` : ""}

  <div class="notes-banner">
    <div class="note-title">⚠ Points importants</div>
    <ul>
      <li><strong>Documents académiques (sauf Plan d'études) :</strong> Authentification + Apostille + Traduction assermentée en italien requises.</li>
      <li><strong>Plan d'études :</strong> Traduction libre suffisante — ni apostille ni légalisation nécessaire.</li>
    </ul>
  </div>

  <div class="footer">
    <div class="brand">Jee<span>expert</span> • Dossier d'admission Italie</div>
    <div>Page 1 / 2</div>
  </div>`;
}

function buildPage2Html(): string {
  return `
  <div class="header">
    <div>
      <div class="brand-name">Jee<span>expert</span></div>
      <div class="brand-slogan">Votre avenir, notre expertise</div>
    </div>
    <div class="doc-title">
      <h2>Guide de Légalisation</h2>
      <div class="date">Procédure administrative — Documents académiques</div>
    </div>
  </div>

  <div class="steps-header">
    <p>Suivez ces 5 étapes dans l'ordre chronologique pour préparer vos documents académiques.</p>
  </div>

  <div class="timeline">
    <div class="step">
      <div class="step-badge">1</div>
      <div class="step-body">
        <div class="step-title">Authentifier le diplôme</div>
        <div class="step-card">
          <table class="auth-table">
            <tr><td>Baccalauréat</td><td>Ministère de l'Éducation</td></tr>
            <tr><td>Licence, Master, Doctorat</td><td>Ministère de l'Enseignement Supérieur (Rectorat)</td></tr>
            <tr><td>BTP, BTS</td><td>Ministère de l'Emploi et de la Formation Professionnelle</td></tr>
            <tr><td>Diplômes de santé</td><td>Ministère de la Santé</td></tr>
            <tr><td>Université privée</td><td>Décision d'équivalence — Ministère de l'Enseignement Supérieur</td></tr>
          </table>
        </div>
      </div>
    </div>

    <div class="step">
      <div class="step-badge accent">2</div>
      <div class="step-body">
        <div class="step-title">Copies conformes (Moussad9a)</div>
        <div class="step-card">
          <ul>
            <li>Photocopier chaque document original recto et verso.</li>
            <li>Faire certifier conforme chaque copie auprès de la municipalité locale.</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="step">
      <div class="step-badge">3</div>
      <div class="step-body">
        <div class="step-title">Apostille</div>
        <div class="step-card">
          <ul>
            <li>Déposer le dossier certifié conforme chez le <strong>notaire</strong>.</li>
            <li>Le notaire appose l'Apostille sur les documents originaux et copies conformes.</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="step">
      <div class="step-badge accent">4</div>
      <div class="step-body">
        <div class="step-title">Traduction officielle en italien</div>
        <div class="step-card">
          <ul>
            <li>Confier les documents à un <strong>traducteur assermenté agréé</strong> par l'Ambassade d'Italie.</li>
            <li>Vérifier scrupuleusement l'orthographe exacte du nom et prénom — conformité stricte avec le passeport.</li>
          </ul>
        </div>
        <div class="tip-box">
          La liste des traducteurs agréés est disponible auprès de l'Ambassade d'Italie de votre pays.
        </div>
      </div>
    </div>

    <div class="step">
      <div class="step-badge">5</div>
      <div class="step-body">
        <div class="step-title">Apostille de la traduction</div>
        <div class="step-card">
          <ul>
            <li>Retourner chez le <strong>notaire</strong> avec la traduction signée.</li>
            <li>Le notaire appose l'Apostille sur la signature du traducteur assermenté.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="brand">Jee<span>expert</span> • Dossier d'admission Italie</div>
    <div>Page 2 / 2</div>
  </div>`;
}

function makePageEl(innerHtml: string): HTMLDivElement {
  const div = document.createElement("div");
  // A4 at 96 dpi = 794 × 1123 px; 15mm margin ≈ 57px
  div.style.cssText =
    "width:794px;height:1123px;overflow:hidden;background:#fff;" +
    "padding:57px;box-sizing:border-box;";
  div.innerHTML = `<style>${CSS}</style>${innerHtml}`;
  return div;
}

export async function downloadAdmissionPdf(data: AdmissionFormData): Promise<void> {
  // Dynamic import — html2canvas is a large library, load only when needed
  const { default: html2canvas } = await import("html2canvas");

  const wrap = document.createElement("div");
  wrap.setAttribute("aria-hidden", "true");
  wrap.style.cssText =
    "position:fixed;top:0;left:-9999px;z-index:-1;pointer-events:none;";

  const p1El = makePageEl(buildPage1Html(data));
  const p2El = makePageEl(buildPage2Html());
  wrap.appendChild(p1El);
  wrap.appendChild(p2El);
  document.body.appendChild(wrap);

  try {
    // Wait for fonts + layout
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );

    const canvasOpts = { scale: 2, useCORS: false, logging: false, backgroundColor: "#ffffff" };
    const [c1, c2] = await Promise.all([
      html2canvas(p1El, canvasOpts),
      html2canvas(p2El, canvasOpts),
    ]);

    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    pdf.addImage(c1.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297);
    pdf.addPage();
    pdf.addImage(c2.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297);
    pdf.save("dossier-admission-italie.pdf");
  } finally {
    document.body.removeChild(wrap);
  }
}
