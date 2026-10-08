import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";

const doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: "a4"
});

// Page dimensions: 210 x 297 mm
const margin = 18;
const pageWidth = 210;
const contentWidth = pageWidth - margin * 2;
let y = margin;

// Colors
const primaryColor = [15, 23, 42]; // slate-900
const accentColor = [79, 70, 229]; // indigo-600
const mutedColor = [100, 116, 139]; // slate-500
const darkText = [30, 41, 59]; // slate-800

// Helper: section title
function addSectionHeader(title) {
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...accentColor);
  doc.text(title.toUpperCase(), margin, y);
  
  y += 2;
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;
}

// Header
doc.setFont("helvetica", "bold");
doc.setFontSize(22);
doc.setTextColor(...primaryColor);
doc.text("SIMONE ARMANNI", margin, y);
y += 6;

doc.setFont("helvetica", "normal");
doc.setFontSize(11);
doc.setTextColor(...accentColor);
doc.text("Specialista in Comunicazione & Media Production", margin, y);
y += 6;

// Contact info line
doc.setFontSize(9);
doc.setTextColor(...mutedColor);
const contacts = [
  "Melzo (MI), Italia",
  "simoarmanni@gmail.com",
  "+39 327 7004869",
  "linkedin.com/in/simone-armanni",
  "flickr.com/people/simoarmanni"
];
doc.text(contacts.join("   •   "), margin, y);
y += 4;

doc.setDrawColor(203, 213, 225);
doc.setLineWidth(0.8);
doc.line(margin, y, pageWidth - margin, y);
y += 3;

// Profilo / Bio
addSectionHeader("Profilo Professionale");
doc.setFont("helvetica", "normal");
doc.setFontSize(9.5);
doc.setTextColor(...darkText);

const bioText = "Professionista della comunicazione con Laurea Magistrale conseguita con 110 e lode in Comunicazione d'Impresa e Relazioni Pubbliche e formazione manageriale Confindustria D20 Leader. Solida esperienza in produzione media, comunicazione interna multinazionale, strategie cross-mediali, copywriting e fotografia per aziende, eventi culturali e organizzazioni non profit.";
const splitBio = doc.splitTextToSize(bioText, contentWidth);
doc.text(splitBio, margin, y);
y += splitBio.length * 4.5 + 2;

// Esperienza Lavorativa
addSectionHeader("Esperienza Lavorativa");

const jobs = [
  {
    role: "Media Production and Assistance",
    company: "Plantar Uma Arvore",
    location: "Internazionale / Sul campo",
    period: "2026 — Presente",
    bullets: [
      "Produzione e montaggio video sul campo per iniziative ambientali e di riforestazione.",
      "Creazione di contenuti multimediali cross-canale e copertura fotografica per progetti di sensibilizzazione ecologica."
    ]
  },
  {
    role: "Internal Communication Specialist",
    company: "STMicroelectronics",
    location: "Agrate Brianza (MB), Italia",
    period: "2022 — 2024",
    bullets: [
      "Pianificazione e redazione di newsletter aziendali, comunicazioni executive e articoli per la intranet globale.",
      "Supporto organizzativo e copertura mediatica per eventi interni, town hall e presentazioni della leadership.",
      "Sviluppo di contenuti grafici e multimediali a supporto dei team ingegneristici e delle risorse umane."
    ]
  },
  {
    role: "Press Office Assistant & Content Support",
    company: "BookCity Milano",
    location: "Milano, Italia",
    period: "2021 — 2022",
    bullets: [
      "Redazione di comunicati stampa, cartelle stampa e schede di presentazione autori per il palinsesto del festival.",
      "Coordinamento delle relazioni con giornalisti, testate locali e nazionali e monitoraggio della rassegna stampa."
    ]
  }
];

jobs.forEach(job => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text(job.role, margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  const periodStr = `${job.period} | ${job.location}`;
  const periodWidth = doc.getTextWidth(periodStr);
  doc.text(periodStr, pageWidth - margin - periodWidth, y);
  y += 4.5;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text(job.company, margin, y);
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...darkText);

  job.bullets.forEach(b => {
    const bulletLines = doc.splitTextToSize(`•  ${b}`, contentWidth - 4);
    doc.text(bulletLines, margin + 2, y);
    y += bulletLines.length * 4.2;
  });
  y += 2;
});

// Formazione
addSectionHeader("Formazione & Corsi di Alta Formazione");

const education = [
  {
    title: "Laurea Magistrale in Comunicazione d'Impresa e Relazioni Pubbliche",
    inst: "Università IULM",
    period: "110 e lode / 110",
    detail: "Tesi e specializzazione in comunicazione strategica, reputazione d'impresa e media storytelling."
  },
  {
    title: "Programma Manageriale D20 Leader",
    inst: "Confindustria & Fondazione Ansaldo",
    period: "Percorso Selettivo",
    detail: "Leadership, gestione dell'innovazione industriale e sostenibilità organizzativa per giovani talenti."
  }
];

education.forEach(edu => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...primaryColor);
  doc.text(edu.title, margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...accentColor);
  const periodWidth = doc.getTextWidth(edu.period);
  doc.text(edu.period, pageWidth - margin - periodWidth, y);
  y += 4.2;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mutedColor);
  doc.text(edu.inst, margin, y);
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...darkText);
  const det = doc.splitTextToSize(edu.detail, contentWidth);
  doc.text(det, margin, y);
  y += det.length * 4 + 2;
});

// Competenze e Lingue (2 colonne)
addSectionHeader("Competenze & Lingue");

const colWidth = (contentWidth - 6) / 2;

// Col 1: Competenze
doc.setFont("helvetica", "bold");
doc.setFontSize(9.5);
doc.setTextColor(...primaryColor);
doc.text("Competenze Tecniche & Creative:", margin, y);
y += 4.5;

doc.setFont("helvetica", "normal");
doc.setFontSize(8.5);
doc.setTextColor(...darkText);
const skillsList = [
  "• Adobe Creative Suite (Premiere, Photoshop, InDesign)",
  "• Video Editing & Montaggio Audiovisivo",
  "• Fotografia & Visual Storytelling",
  "• Grafica & Visual Layouts",
  "• Comunicazione Interna & Ufficio Stampa",
  "• Copywriting & Campagne Cross-mediali"
];
skillsList.forEach(s => {
  doc.text(s, margin, y);
  y += 4;
});

// Col 2: Lingue
let yLang = y - (skillsList.length * 4) - 4.5;
const col2X = margin + colWidth + 6;

doc.setFont("helvetica", "bold");
doc.setFontSize(9.5);
doc.setTextColor(...primaryColor);
doc.text("Lingue:", col2X, yLang);
yLang += 4.5;

doc.setFont("helvetica", "normal");
doc.setFontSize(8.5);
doc.setTextColor(...darkText);
const languagesList = [
  "• Italiano: Madrelingua (C2)",
  "• Inglese: Avanzato Professionale (C1)",
  "• Spagnolo: Elementare / Base (A1)"
];
languagesList.forEach(l => {
  doc.text(l, col2X, yLang);
  yLang += 4;
});

y = Math.max(y, yLang) + 4;

// Save PDF
const pdfData = doc.output("arraybuffer");
fs.writeFileSync(path.join(process.cwd(), "public", "Curriculum_Vitae_Simone_Armanni.pdf"), Buffer.from(pdfData));
console.log("PDF generated successfully at public/Curriculum_Vitae_Simone_Armanni.pdf");
