/**
 * Generates public/camden-blackburn-resume.pdf and a copy at public/Resume.pdf (hero CTA).
 * Run: npm run resume:pdf
 */
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outPath = path.join(root, "public", "camden-blackburn-resume.pdf");
const outPathShort = path.join(root, "public", "Resume.pdf");

const doc = new PDFDocument({
  size: "LETTER",
  margin: 48,
});
const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

const left = 48;
const right = doc.page.width - 48;
const W = right - left;

doc.font("Helvetica-Bold").fontSize(17).fillColor("#1a1814").text("Camden J. Blackburn", { width: W });
doc.moveDown(0.3);
doc
  .font("Helvetica")
  .fontSize(9)
  .fillColor("#444444")
  .text("Designer & founder  ·  Scottsdale, AZ", { width: W });
doc.text("Blackburncamden@gmail.com  ·  (206) 321-6087  ·  blackburncreativestudio.com", { width: W });

function rule() {
  const y = doc.y + 2;
  doc.moveTo(left, y).lineTo(right, y).strokeColor("#d8d4cf").lineWidth(0.5).stroke();
  doc.moveDown(0.35);
}

function section(title) {
  doc.moveDown(0.45);
  doc.font("Helvetica-Bold").fontSize(7.8).fillColor("#b84848").text(title.toUpperCase(), { characterSpacing: 1 });
  rule();
  doc.font("Helvetica").fontSize(9).fillColor("#1a1814");
}

function paragraph(text) {
  doc.text(text, { width: W, lineGap: 1.5 });
}

function job(titleLine, sub, bullets) {
  doc.moveDown(0.22);
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#1a1814").text(titleLine, { width: W });
  doc.font("Helvetica").fontSize(8).fillColor("#555555").text(sub, { width: W });
  doc.fillColor("#1a1814");
  for (const b of bullets) {
    doc.font("Helvetica").fontSize(9).text(`• ${b}`, { width: W - 6, indent: 6, lineGap: 0.5 });
  }
}

section("Summary");
paragraph(
  "ASU GIT (design + dev). RealCopy: Glide prototype → Expo + APIs (TestFlight). DealerDeck: voice logging + inventory context from BMW floor work; piloting with leadership buy-in. " +
    "Polytechnic TPS for TEM—hex grid, Mother Shape, solo career-board presentation. BirdsEye maps. Branding: AZHype via Cre8tive Influence; freelance for family businesses. Seeking full-time product or brand-systems work after graduation."
);

section("Experience");
job("RealCopy — Founder", "PropTech · Beta (TestFlight)", [
  "Agent tool from realtor interviews + BirdsEye/real-estate photo context; Glide first, rebuilt for API and UI control.",
]);
job("DealerDeck LLC — Founder", "Automotive · Pilot", [
  "Voice capture, live transcript edits, inventory feeds + BMW reference tables; GM/manager-approved pilots; CRM hooks next.",
]);
job("BirdsEye — Technical Lead", "Geospatial / construction", [
  "Ortho + 3D to stakeholder maps; field-first review.",
]);
job("ASU Polytechnic TPS — PM & lead designer", "Completed", [
  "TEM-rooted system; MIT-inspired structure; grid + guidelines; signage/digital/print; sole presenter to career advisory board.",
]);
job("ASU GIT Agency — Designer", "Application-only cohort · Completed", [
  "TEDx Faurot Park 2026 — FigJam collaboration; repeatable pattern from logo branch (AI explore, hand finish).",
  "Southwest Label & Print — rebrand + clearer web/quote path after shop interviews.",
]);
job("Cre8tive Influence / freelance — Designer", "AZHype + additional clients", [
  "AZHype volleyball club: sole designer, live client iteration, guidelines + collateral still in market.",
  "Freelance logos and brand packages (e.g., Alara Aquatics, Accuracy Solutions).",
]);

section("Education");
paragraph("Arizona State University — B.S. Graphic Information Technology (UX Focus) · August 2026");

section("Skills");
paragraph(
  "UX and brand, Figma, design tokens and rollout docs, React Native / Expo, Supabase, Railway, REST APIs, " +
    "Cursor / Claude for build help, photogrammetry and GIS basics, photography."
);

doc.end();

await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});
fs.copyFileSync(outPath, outPathShort);
console.log("Wrote", outPath, "and", outPathShort);
