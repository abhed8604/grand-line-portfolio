import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const sourceFile = await readFile(new URL("../src/resume.ts", import.meta.url), "utf8");
const match = sourceFile.match(/RESUME_SOURCE\s*=\s*`([\s\S]*?)`;/);
if (!match) throw new Error("Could not read RESUME_SOURCE from src/resume.ts");
const text = match[1].trim();
const lines = text.split("\n");
const head = lines.slice(0, 5).map((line) => line.trim());
const sections = {};
let current = null;
for (const raw of lines.slice(5)) {
  const line = raw.trim();
  if (!line) continue;
  if (["Summary", "Education", "Experience", "Projects", "Skills", "Achievements & Leadership"].includes(line)) {
    current = line;
    sections[current] = [];
  } else if (current) {
    sections[current].push(line);
  }
}

const escape = (value) => value.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
const linkify = (value) => {
  let out = escape(value);
  out = out.replace(/https:\/\/github\.com\/abhed8604/g, '<a href="https://github.com/abhed8604">github.com/abhed8604</a>');
  out = out.replace(/\bgithub\.com\/abhed8604\b/g, '<a href="https://github.com/abhed8604">github.com/abhed8604</a>');
  out = out.replace(/\blinkedin\.com\/in\/abhed-srivastava\b/g, '<a href="https://www.linkedin.com/in/abhed-srivastava">linkedin.com/in/abhed-srivastava</a>');
  out = out.replace(/\babhed8604@gmail\.com\b/g, '<a href="mailto:abhed8604@gmail.com">abhed8604@gmail.com</a>');
  out = out.replace(/\[GitHub\]/g, '<a href="https://github.com/abhed8604">GitHub</a>');
  return out;
};

const sectionHTML = (title, body, className = "") => `
  <section class="${className}">
    <h2>${escape(title)}</h2>
    ${body}
  </section>`;

const summary = `<p>${linkify(sections.Summary.join(" "))}</p>`;
const education = `<p><strong>${linkify(sections.Education[0])}</strong><br>${linkify(sections.Education[1])}<br>${linkify(sections.Education[2])}</p>`;
const experienceLines = sections.Experience;
const experience = `
  <div class="entry">
    <div class="entry-head"><strong>${linkify(experienceLines[0])}</strong></div>
    <p class="entry-project">${linkify(experienceLines[1])}</p>
    <ul>${experienceLines.slice(2).map((line) => `<li>${linkify(line)}</li>`).join("")}</ul>
  </div>`;

const projectBlocks = [];
for (let i = 0; i < sections.Projects.length; i += 1) {
  const line = sections.Projects[i];
  if (!line.startsWith("Python,") && !line.includes("[GitHub],")) continue;
  const title = line;
  const tech = sections.Projects[i + 1] ?? "";
  const body = sections.Projects.slice(i + 2).filter((next) => !next.includes("[GitHub],"));
  const bullets = [];
  for (const next of body) {
    if (next.startsWith("Python,")) break;
    bullets.push(next);
  }
  projectBlocks.push(`<div class="entry"><p class="entry-title">${linkify(title)}</p><p class="tech">${linkify(tech)}</p><ul>${bullets.map((b) => `<li>${linkify(b)}</li>`).join("")}</ul></div>`);
  i += 1 + bullets.length;
}

const skillRows = sections.Skills.map((line) => {
  const [label, ...rest] = line.split(":");
  return `<div><strong>${escape(label)}</strong><p>${escape(rest.join(":").trim())}</p></div>`;
}).join("");
const achievements = `<ul>${sections["Achievements & Leadership"].map((line) => `<li>${linkify(line)}</li>`).join("")}</ul>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><title>Abhed Srivastava — Resume — November 2026</title>
<style>
  @page { size: A4; margin: 10mm 13mm; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #111; background: #fff; font-family: "Helvetica Neue", Arial, sans-serif; font-size: 8.55pt; line-height: 1.28; }
  a { color: #111; text-decoration: none; border-bottom: .4pt solid #777; }
  header { border-bottom: 1.6pt solid #111; padding-bottom: 3mm; margin-bottom: 3mm; }
  h1 { margin: 0; font-size: 21pt; letter-spacing: -.02em; line-height: 1; }
  .role { margin: 2mm 0 1.4mm; font-size: 9.4pt; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
  .contact { display: flex; gap: 4mm; flex-wrap: wrap; font-size: 8.4pt; color: #333; }
  section { margin-top: 2.5mm; }
  h2 { margin: 0 0 1.2mm; padding-bottom: .5mm; border-bottom: .5pt solid #999; font-size: 8.2pt; letter-spacing: .14em; text-transform: uppercase; }
  p { margin: 0; }
  ul { margin: .8mm 0 0 4mm; padding: 0; }
  li { margin: 0 0 .35mm; padding-left: .4mm; }
  .entry { margin-bottom: 1.5mm; }
  .entry:last-child { margin-bottom: 0; }
  .entry-head { display: flex; justify-content: space-between; gap: 4mm; }
  .entry-title { margin-top: 1.4mm; font-weight: 700; }
  .tech { margin-top: .4mm; color: #444; font-size: 8.2pt; }
  .entry-project { margin-top: .7mm; font-style: italic; }
  .skills { display: grid; grid-template-columns: 1fr 1fr; gap: .8mm 6mm; }
  .skills strong { display: block; font-size: 8.2pt; }
  .skills p { color: #333; font-size: 8.4pt; }
  .summary { font-size: 8.7pt; }
  .foot { margin-top: 3mm; color: #666; font-size: 7.5pt; }
</style></head><body>
<header>
  <h1>${escape(head[0])}</h1>
  <p class="role">Data engineering · Operations analytics · Applied AI</p>
  <div class="contact"><span>${linkify(head[1])}</span><span>${linkify(head[2])}</span><span>${linkify(head[3])}</span><span>${linkify(head[4])}</span></div>
</header>
${sectionHTML("Summary", summary, "summary")}
${sectionHTML("Education", education)}
${sectionHTML("Experience", experience)}
${sectionHTML("Projects", projectBlocks.join(""))}
${sectionHTML("Skills", `<div class="skills">${skillRows}</div>`)}
${sectionHTML("Achievements & Leadership", achievements)}
<p class="foot">Updated ${escape(match ? "November 2026" : "")}</p>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.emulateMedia({ media: "print" });
await page.pdf({ path: "public/resume.pdf", format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
await writeFile("/tmp/opencode/resume-print.html", html);
console.log("Wrote public/resume.pdf from RESUME_SOURCE");
