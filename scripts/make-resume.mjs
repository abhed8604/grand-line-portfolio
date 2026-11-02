/**
 * Generates /public/resume.pdf from the placeholders in src/content.ts.
 * Replace the content with your real details before shipping; this file is a
 * print-ready stand-in, not a claimed credential.
 */
import { createServer } from "vite";
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "silent",
});

let content;
try {
  const mod = await server.ssrLoadModule("/src/content.ts");
  content = mod.content;
} finally {
  await server.close();
}

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const skills = content.skills.groups
  .map(
    (group) => `<div class="skill-group">
      <h3>${esc(group.label)}</h3>
      <p>${group.items.map(esc).join(" · ")}</p>
    </div>`,
  )
  .join("");

const projects = content.projects.entries
  .map(
    (project) => `<article class="entry">
      <div class="entry-head"><h3>${esc(project.title)}</h3><span>${project.tech.map(esc).join(" / ")}</span></div>
      <p>${esc(project.short)}</p>
      <p class="muted">${esc(project.description)}</p>
    </article>`,
  )
  .join("");

const experience = content.experience.entries
  .map(
    (entry) => `<article class="entry">
      <div class="entry-head"><h3>${esc(entry.role)} <span class="place">— ${esc(entry.place)}</span></h3><span>${esc(entry.period)}</span></div>
      <p class="muted">${esc(entry.detail)}</p>
    </article>`,
  )
  .join("");

const education = content.education.entries
  .map(
    (entry) => `<article class="entry">
      <div class="entry-head"><h3>${esc(entry.institution)}</h3><span>${esc(entry.period)}</span></div>
      <p class="muted">${esc(entry.qualification)} — ${esc(entry.detail)}</p>
    </article>`,
  )
  .join("");

const contact = content.contact.links
  .map((link) => `<span>${esc(link.label)} <b>${esc(link.value)}</b></span>`)
  .join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @page { size: A4; margin: 13mm 14mm 12mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #fff; color: #0b0f14; }
  body { font: 9.2pt/1.45 "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .topline { display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #0b0f14; padding-bottom: 7px; }
  .brand { display: flex; align-items: center; gap: 7px; font: 700 7pt/1 "Courier New", monospace; letter-spacing: .18em; text-transform: uppercase; }
  .mark { display: grid; grid-template-columns: repeat(3, 4px); gap: 2px; }
  .mark i { width: 4px; height: 4px; background: #0b0f14; }
  .mark i:nth-child(5), .mark i:nth-child(7), .mark i:nth-child(10), .mark i:nth-child(15), .mark i:nth-child(17) { background: #d5dde5; }
  .topline span { font: 500 7pt/1 "Courier New", monospace; letter-spacing: .12em; text-transform: uppercase; color: #56626e; }
  header { padding: 14px 0 12px; }
  h1 { margin: 0; font: 700 30pt/.92 "Helvetica Neue", Helvetica, Arial, sans-serif; letter-spacing: -.02em; text-transform: uppercase; }
  .role { margin-top: 7px; font: 500 9pt/1 "Courier New", monospace; letter-spacing: .12em; text-transform: uppercase; }
  .meta { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px 18px; color: #44505c; font: 500 7.6pt/1.4 "Courier New", monospace; letter-spacing: .04em; text-transform: uppercase; }
  .contact { display: flex; flex-wrap: wrap; gap: 4px 18px; margin-top: 6px; color: #44505c; font: 7.6pt/1.4 "Courier New", monospace; }
  .contact b { font-weight: 600; color: #0b0f14; }
  main { display: grid; grid-template-columns: 1.55fr .85fr; gap: 18px 24px; }
  section { break-inside: avoid; }
  h2 { margin: 13px 0 6px; padding-bottom: 3px; border-bottom: 1px solid #c9d2da; font: 700 7pt/1 "Courier New", monospace; letter-spacing: .16em; text-transform: uppercase; color: #34414d; }
  .lead { margin: 0 0 5px; font-size: 9.4pt; font-weight: 500; }
  p { margin: 0 0 5px; }
  .muted { color: #4c5966; }
  .skill-group h3 { margin: 0 0 1px; font: 700 7.4pt/1.2 "Courier New", monospace; letter-spacing: .08em; text-transform: uppercase; }
  .skill-group p { margin: 0 0 5px; color: #34414d; }
  .entry { margin-bottom: 7px; }
  .entry-head { display: flex; justify-content: space-between; gap: 10px; align-items: baseline; }
  .entry-head h3 { margin: 0; font-size: 9.2pt; line-height: 1.25; }
  .entry-head span { flex: 0 0 auto; color: #5b6773; font: 7pt/1.3 "Courier New", monospace; letter-spacing: .04em; text-transform: uppercase; }
  .place { font-weight: 400; color: #44505c; }
  .entry p { margin: 2px 0 0; }
  .side .entry { margin-bottom: 6px; }
  footer { margin-top: 10px; padding-top: 6px; border-top: 1px solid #c9d2da; display: flex; justify-content: space-between; gap: 18px; color: #6b7681; font: 6.8pt/1.4 "Courier New", monospace; letter-spacing: .03em; }
</style>
</head>
<body>
  <div class="topline">
    <span class="brand"><span class="mark">${Array.from({ length: 9 }, () => "<i></i>").join("")}</span>${esc(content.brand.name)}</span>
    <span>Résumé · Placeholder · ${esc(content.resume.updated)}</span>
  </div>
  <header>
    <h1>${esc(content.identity.name)}</h1>
    <p class="role">${esc(content.identity.role)}</p>
    <div class="meta">
      <span>${esc(content.identity.location)}</span>
      <span>${esc(content.identity.availability)}</span>
      <span>${esc(content.resume.downloadName)}</span>
    </div>
    <div class="contact">${contact}</div>
  </header>
  <main>
    <div>
      <section>
        <h2>Profile</h2>
        <p class="lead">${esc(content.identity.bioLead)}</p>
        <p class="muted">${esc(content.identity.bioBody)}</p>
      </section>
      <section>
        <h2>Selected projects</h2>
        ${projects}
      </section>
      <section>
        <h2>Experience</h2>
        ${experience}
      </section>
    </div>
    <aside class="side">
      <section>
        <h2>Skills</h2>
        ${skills}
      </section>
      <section>
        <h2>Education</h2>
        ${education}
      </section>
      <section>
        <h2>Links</h2>
        ${content.contact.links.map((link) => `<p class="muted">${esc(link.label)}: ${esc(link.value)}</p>`).join("")}
        <p class="muted">${esc(content.resume.url)}</p>
      </section>
    </aside>
  </main>
  <footer>
    <span>Placeholder PDF generated from src/content.ts. Replace with your real résumé before publishing.</span>
    <span>${esc(content.ui.footerCredit)}</span>
  </footer>
</body>
</html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load" });
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
  });
  await mkdir(resolve(root, "public"), { recursive: true });
  await writeFile(resolve(root, "public/resume.pdf"), pdf);
  console.log(`resume.pdf written (${(pdf.length / 1024).toFixed(1)} KB)`);
} finally {
  await browser.close();
}
