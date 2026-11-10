import { content, type Project, type SectionId } from "../content";
import { icon, ledMark } from "./icons";

const escapeHTML = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export function safeHref(value: string): string {
  if (
    value.startsWith("./") ||
    value.startsWith("../") ||
    value.startsWith("/") ||
    value.startsWith("#") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    /^https?:\/\//i.test(value)
  ) {
    return escapeHTML(value);
  }
  return "#";
}

function isExternal(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function externalAttrs(href: string): string {
  return isExternal(href) ? ' target="_blank" rel="noreferrer noopener"' : "";
}

function sceneMeta(section: (typeof content.nav)[number]): string {
  return `<div class="scene-meta">
    <span class="scene-meta__rule" aria-hidden="true"></span>
    <span class="scene-meta__eyebrow">${escapeHTML(section.eyebrow)}</span>
  </div>`;
}

function statusLine(className = ""): string {
  return `<p class="status-line${className ? ` ${className}` : ""}"><i aria-hidden="true"></i>${escapeHTML(content.identity.status)}</p>`;
}

function metricChip(metric: { value: string; label: string }): string {
  const wide = metric.value.length > 8 ? " metric-chip--wide" : "";
  const positive = metric.value.startsWith("+");
  const value = positive
    ? `<span class="metric-sign" aria-hidden="true">+</span>${escapeHTML(metric.value.slice(1))}`
    : escapeHTML(metric.value);
  return `<span class="metric-chip${wide}"><strong>${value}</strong><span>${escapeHTML(metric.label)}</span></span>`;
}

function makeScene(
  section: (typeof content.nav)[number],
  body: string,
): string {
  return `<section class="scene scene--${section.id}" id="scene-${section.id}" data-scene="${section.id}" aria-labelledby="scene-title-${section.id}" aria-hidden="true" inert>
    ${sceneMeta(section)}
    ${body}
  </section>`;
}

function buildHome(section: (typeof content.nav)[number], index: number, total: number): string {
  return makeScene(
    section,
    `<div class="hero-copy" data-reveal>
      <p class="hero-copy__role">${escapeHTML(content.identity.role)}</p>
      <p class="hero-copy__tagline">${escapeHTML(content.identity.tagline)}</p>
      <div class="hero-copy__actions">
        <button class="led-button led-button--solid" type="button" data-goto="projects">
          <span class="led-button__label">${escapeHTML(content.ui.viewWork)}</span>
          ${icon("arrow-right", "led-button__icon")}
        </button>
        <button class="text-button" type="button" data-quick-view>
          <span>${escapeHTML(content.ui.quickView)}</span>
          ${icon("arrow-up-right")}
        </button>
      </div>
      ${statusLine("hero-copy__status")}
    </div>
    <h1 id="scene-title-home" class="sr-only">${escapeHTML(content.identity.name)} — ${escapeHTML(content.identity.role)}</h1>
    <button class="egg-hotspot egg-hotspot--hat" type="button" data-egg="hat" aria-label="${escapeHTML(content.easterEggs.hat)}">
      <span class="egg-hotspot__label">${escapeHTML(content.easterEggs.hat)}</span>
    </button>`,
  );
}

function buildAbout(section: (typeof content.nav)[number], index: number, total: number): string {
  return makeScene(
    section,
    `<div class="about-panel" data-reveal>
      <p class="lead">${escapeHTML(content.identity.bioLead)}</p>
      <p class="body-copy">${escapeHTML(content.identity.bioBody)}</p>
      <p class="aside-note">${escapeHTML(content.identity.bioNote)}</p>
      <dl class="fact-list">
        <div><dt>${escapeHTML(content.resume.facts[1].label)}</dt><dd>${escapeHTML(content.identity.location)}</dd></div>
        <div><dt>${escapeHTML(content.resume.facts[0].label)}</dt><dd>${escapeHTML(content.identity.role)}</dd></div>
      </dl>
      <h2 id="scene-title-about" class="sr-only">${escapeHTML(section.title)} — ${escapeHTML(section.eyebrow)}</h2>
    </div>`,
  );
}

function buildSkills(section: (typeof content.nav)[number], index: number, total: number): string {
  const clusters = content.skills.groups
    .map(
      (group, groupIndex) => `<article class="skill-cluster" data-reveal style="--cluster-index:${groupIndex}">
        <h3>${escapeHTML(group.label)}</h3>
        <ul class="dot-list">
          ${group.items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
        </ul>
      </article>`,
    )
    .join("");

  return makeScene(
    section,
    `<div class="skills-layout">
      <div class="skills-layout__art" aria-hidden="true"></div>
      <div class="skills-column">
        <aside class="skills-aside" data-reveal>
          <h2 id="scene-title-skills" class="sr-only">${escapeHTML(section.title)} — ${escapeHTML(section.eyebrow)}</h2>
          <p class="body-copy">${escapeHTML(content.skills.intro)}</p>
        </aside>
        <div class="skills-field">
          ${clusters}
        </div>
      </div>
    </div>`,
  );
}

function buildProjects(section: (typeof content.nav)[number], index: number, total: number): string {
  const markers = content.projects.entries
    .map((project, projectIndex) => {
      const positions = [
        ["17.1%", "72.6%"],
        ["40%", "51%"],
        ["31%", "80%"],
      ];
      const [x, y] = positions[projectIndex] ?? positions[0];
      return `<button type="button" class="island-marker" style="--x:${x};--y:${y}" data-project="${escapeHTML(project.id)}" data-event="project_open" aria-label="${escapeHTML(content.ui.selectProject)}: ${escapeHTML(project.title)}">
        <span class="island-marker__pulse" aria-hidden="true"></span>
        <span class="island-marker__number">${String(projectIndex + 1).padStart(2, "0")}</span>
        <span class="island-marker__label">${escapeHTML(project.title)}</span>
      </button>`;
    })
    .join("");

  const projectRows = content.projects.entries
    .map(
      (project, projectIndex) => `<button type="button" class="project-row" data-project="${escapeHTML(project.id)}" data-event="project_open">
        <span class="project-row__index">${String(projectIndex + 1).padStart(2, "0")}</span>
        <span class="project-row__main">
          <span class="project-row__title">${escapeHTML(project.title)}</span>
          <span class="project-row__short">${escapeHTML(project.short)}</span>
          <span class="project-row__date">${escapeHTML(project.date)}</span>
          ${
            project.metrics.length
              ? `<span class="metric-chips" aria-label="${escapeHTML(content.ui.metricsLabel)}">${project.metrics
                  .map(
                    (metric) =>
                      `${metricChip(metric)}`,
                  )
                  .join("")}</span>`
              : ""
          }
        </span>
        ${icon("arrow-up-right", "project-row__arrow")}
      </button>`,
    )
    .join("");

  const panels = content.projects.entries
    .map((project, projectIndex) => {
      const tags = project.tech.map((tech) => `<li>${escapeHTML(tech)}</li>`).join("");
      const links = project.links
        .map(
          (link) =>
            `<a href="${safeHref(link.href)}" ${externalAttrs(link.href)} data-event="project_link">${escapeHTML(link.label)}${icon(isExternal(link.href) ? "external" : "arrow-right")}</a>`,
        )
        .join("");
      const metrics = project.metrics.length
        ? `<div class="project-detail__metrics"><span class="micro-label">${escapeHTML(content.ui.metricsLabel)}</span><div class="metric-chips">${project.metrics
            .map(
              (metric) =>
                `${metricChip(metric)}`,
            )
            .join("")}</div></div>`
        : "";
      return `<article class="project-detail" data-project-panel="${escapeHTML(project.id)}" hidden>
        <button type="button" class="back-button" data-project-back>
          ${icon("arrow-left")}<span>${escapeHTML(content.ui.backToMap)}</span>
        </button>
        <p class="project-detail__date">${escapeHTML(project.date)}</p>
        <h3>${escapeHTML(project.title)}</h3>
        ${metrics}
        <div class="project-detail__block">
          <span class="micro-label">${escapeHTML(content.ui.problemLabel)}</span>
          <p class="project-detail__body">${escapeHTML(project.problem)}</p>
        </div>
        <div class="project-detail__block">
          <span class="micro-label">${escapeHTML(content.ui.approachLabel)}</span>
          <p class="project-detail__body">${escapeHTML(project.approach)}</p>
        </div>
        <div class="project-detail__block">
          <span class="micro-label">${escapeHTML(content.ui.resultLabel)}</span>
          ${
            project.result
              ? `<p class="project-detail__body">${escapeHTML(project.result)}</p>`
              : `<p class="project-detail__body todo-content">${escapeHTML(content.ui.resultMissing)}</p>`
          }
        </div>
        <div class="project-detail__stack">
          <span class="micro-label">${escapeHTML(content.ui.stackLabel)}</span>
          <ul class="tag-list">${tags}</ul>
        </div>
        <div class="project-detail__links">
          <span class="micro-label">${escapeHTML(content.ui.projectLinks)}</span>
          <div class="link-row">${links}</div>
        </div>
      </article>`;
    })
    .join("");

  return makeScene(
    section,
    `<div class="project-markers" aria-label="${escapeHTML(content.ui.projectIndex)}">
      ${markers}
      <button class="egg-hotspot egg-hotspot--ship" type="button" data-egg="ship" aria-label="${escapeHTML(content.easterEggs.ship)}">
        <span class="egg-hotspot__label">${escapeHTML(content.easterEggs.ship)}</span>
      </button>
    </div>
    <div class="project-dock" data-lenis-prevent>
      <h2 id="scene-title-projects" class="sr-only">${escapeHTML(section.title)} — ${escapeHTML(section.eyebrow)}</h2>
      <div class="project-index" data-project-index data-reveal>
        <div class="panel-head">
          <span class="micro-label">${escapeHTML(content.ui.projectIndex)}</span>
          <span class="panel-head__rule" aria-hidden="true"></span>
        </div>
        <p class="project-index__intro">${escapeHTML(content.projects.intro)}</p>
        <div class="project-list" role="list">
          ${projectRows}
        </div>
      </div>
      <div class="project-details" data-project-details>
        ${panels}
      </div>
    </div>`,
  );
}

function buildEducation(section: (typeof content.nav)[number], index: number, total: number): string {
  const entries = content.education.entries
    .map(
      (entry) => `<article class="education-card">
        <div class="education-card__top">
          <h3>${escapeHTML(entry.institution)}</h3>
          <span>${escapeHTML(entry.period)}</span>
        </div>
        <p class="education-card__qual">${escapeHTML(entry.qualification)} <span>CGPA ${escapeHTML(entry.cgpa)}</span></p>
        <div class="education-card__coursework">
          <span class="micro-label">${escapeHTML(content.ui.courseworkLabel)}</span>
          <ul class="tag-list">${entry.coursework.map((course) => `<li>${escapeHTML(course)}</li>`).join("")}</ul>
        </div>
      </article>`,
    )
    .join("");

  return makeScene(
    section,
    `<div class="education-panel" data-reveal>
      <h2 id="scene-title-education" class="sr-only">${escapeHTML(section.title)} — ${escapeHTML(section.eyebrow)}</h2>
      <p class="body-copy education-panel__intro">${escapeHTML(content.education.intro)}</p>
      ${entries}
    </div>`,
  );
}

function buildExperience(section: (typeof content.nav)[number], index: number, total: number): string {
  const entries = content.experience.entries
    .map((entry) => {
      const metrics = entry.metrics?.length
        ? `<div class="metric-chips" aria-label="${escapeHTML(content.ui.metricsLabel)}">${entry.metrics
            .map(
              (metric) =>
                `${metricChip(metric)}`,
            )
            .join("")}</div>`
        : "";
      const projectAction = entry.projectId
        ? `<button type="button" class="led-button led-button--outline experience-entry__project" data-experience-project="${escapeHTML(entry.projectId)}" data-event="project_open">
            <span class="led-button__label">${escapeHTML(content.ui.viewProject)}</span>
            ${icon("arrow-right", "led-button__icon")}
          </button>`
        : "";
      const summary = entry.type === "internship"
        ? ""
        : `<p class="body-copy">${escapeHTML(entry.detail)}</p>`;
      return `<li class="experience-entry experience-entry--${entry.type}">
        <div class="experience-entry__top">
          <span class="type-badge type-badge--${entry.type}">${escapeHTML(content.ui.experienceTypes[entry.type])}</span>
          <span class="experience-entry__period">${escapeHTML(entry.period)}</span>
        </div>
        <h3>${escapeHTML(entry.role)}</h3>
        <p class="experience-entry__place">${escapeHTML(entry.place)}</p>
        ${summary}
        ${metrics}
        ${projectAction}
      </li>`;
    })
    .join("");

  const certifications = content.experience.certifications.length
    ? `<section class="cert-strip" aria-label="${escapeHTML(content.ui.certificationsLabel)}">
        <span class="micro-label">${escapeHTML(content.ui.certificationsLabel)}</span>
        <ul>${content.experience.certifications
          .map(
            (entry) => `<li>
              <span>${escapeHTML(entry.name)}</span>
              <span class="cert-strip__meta">${escapeHTML(entry.issuer)} · ${escapeHTML(entry.year)}</span>
              ${
                entry.href
                  ? `<a href="${safeHref(entry.href)}" ${externalAttrs(entry.href)}>${escapeHTML(content.ui.openLink)}${icon(isExternal(entry.href) ? "external" : "arrow-right")}</a>`
                  : ""
              }
            </li>`,
          )
          .join("")}</ul>
      </section>`
    : "";

  const detail = content.experience.warehouse;
  const detailTags = detail.tech.map((tech) => `<li>${escapeHTML(tech)}</li>`).join("");
  const detailLinks = detail.links
    .map(
      (link) =>
        `<a class="led-button led-button--outline" href="${safeHref(link.href)}" ${externalAttrs(link.href)} data-event="project_link">${escapeHTML(link.label)}${icon(isExternal(link.href) ? "external" : "arrow-right", "led-button__icon")}</a>`,
    )
    .join("");

  return makeScene(
    section,
    `<div class="experience-panel" data-lenis-prevent data-reveal>
      <div data-experience-index>
        <h2 id="scene-title-experience" class="sr-only">${escapeHTML(section.title)} — ${escapeHTML(section.eyebrow)}</h2>
        <p class="body-copy experience-panel__intro">${escapeHTML(content.experience.intro)}</p>
        <ol class="experience-list">${entries}</ol>
        ${certifications}
        <p class="experience-scroll-cue" aria-hidden="true"><span>${escapeHTML(content.ui.scrollExperience)}</span><span>↓</span></p>
      </div>
      <article class="project-detail experience-detail" data-experience-detail hidden>
        <button type="button" class="back-button" data-experience-back>
          ${icon("arrow-left")}<span>${escapeHTML(content.ui.backToMap)}</span>
        </button>
        <p class="project-detail__date">${escapeHTML(detail.date)}</p>
        <h3>${escapeHTML(detail.title)}</h3>
        <div class="project-detail__metrics">
          <span class="micro-label">${escapeHTML(content.ui.metricsLabel)}</span>
          <div class="metric-chips">${detail.metrics
            .map(
              (metric) =>
                `${metricChip(metric)}`,
            )
            .join("")}</div>
        </div>
        <div class="project-detail__block">
          <span class="micro-label">${escapeHTML(content.ui.problemLabel)}</span>
          <p class="project-detail__body">${escapeHTML(detail.problem)}</p>
        </div>
        <div class="project-detail__block">
          <span class="micro-label">${escapeHTML(content.ui.approachLabel)}</span>
          <p class="project-detail__body">${escapeHTML(detail.approach)}</p>
        </div>
        <div class="project-detail__block">
          <span class="micro-label">${escapeHTML(content.ui.resultLabel)}</span>
          <p class="project-detail__body">${escapeHTML(detail.result)}</p>
        </div>
        <div class="project-detail__stack">
          <span class="micro-label">${escapeHTML(content.ui.stackLabel)}</span>
          <ul class="tag-list">${detailTags}</ul>
        </div>
        <div class="project-detail__links">
          <span class="micro-label">${escapeHTML(content.ui.projectLinks)}</span>
          <div class="link-row">${detailLinks}</div>
        </div>
      </article>
    </div>`,
  );
}

function buildResume(section: (typeof content.nav)[number], index: number, total: number): string {
  const facts = content.resume.facts
    .map((fact) => `<div><dt>${escapeHTML(fact.label)}</dt><dd>${escapeHTML(fact.value)}</dd></div>`)
    .join("");
  return makeScene(
    section,
    `<aside class="resume-side" data-reveal>
      <h2 id="scene-title-resume" class="sr-only">${escapeHTML(section.title)} — ${escapeHTML(section.eyebrow)}</h2>
      <p class="lead">${escapeHTML(content.resume.intro)}</p>
      <dl class="fact-list fact-list--resume">${facts}</dl>
      <a class="led-button led-button--solid resume-download" href="${safeHref(content.resume.url)}" download="${escapeHTML(content.resume.downloadName)}" data-event="resume_download">
        <span class="led-button__label">${escapeHTML(content.ui.resumeDownload)}</span>
        ${icon("download", "led-button__icon")}
      </a>
      <button type="button" class="text-button" data-quick-view>${escapeHTML(content.ui.quickView)} ${icon("arrow-up-right")}</button>
    </aside>`,
  );
}

function buildContact(section: (typeof content.nav)[number], index: number, total: number): string {
  const links = content.contact.links
    .map(
      (link) => `<li>
        <a class="contact-link" href="${safeHref(link.href)}" ${externalAttrs(link.href)} data-event="contact_click">
          <span class="contact-link__label">${escapeHTML(link.label)}</span>
          <span class="contact-link__value">${escapeHTML(link.value)}</span>
          ${icon(isExternal(link.href) ? "external" : "arrow-up-right", "contact-link__icon")}
        </a>
      </li>`,
    )
    .join("");
  const email = content.contact.links.find((link) => link.href.startsWith("mailto:"));
  const emailAction = email
    ? `<a class="led-button led-button--solid contact-email" href="${safeHref(email.href)}" data-event="contact_click">
        <span class="led-button__label">${escapeHTML(content.ui.emailMe)}</span>
        ${icon("arrow-up-right", "led-button__icon")}
      </a>`
    : "";
  return makeScene(
    section,
    `<div class="contact-panel" data-reveal>
      <h2 id="scene-title-contact" class="sr-only">${escapeHTML(section.title)} — ${escapeHTML(section.eyebrow)}</h2>
      <p class="lead">${escapeHTML(content.contact.intro)}</p>
      <ul class="contact-list">${links}</ul>
      <div class="contact-panel__actions">
        ${emailAction}
        <button type="button" class="copy-button" data-copy-email data-event="contact_click">
          ${icon("copy")}
          <span>${escapeHTML(content.ui.copyEmail)}</span>
        </button>
      </div>
      <p class="aside-note contact-note">${escapeHTML(content.contact.finalNote)}</p>
    </div>
    <button class="egg-hotspot egg-hotspot--mark" type="button" data-egg="mark" aria-label="${escapeHTML(content.easterEggs.mark)}">
      <span class="egg-hotspot__label">${escapeHTML(content.easterEggs.mark)}</span>
    </button>`,
  );
}

const sceneBuilders: Record<SectionId, (section: (typeof content.nav)[number], index: number, total: number) => string> = {
  home: buildHome,
  about: buildAbout,
  skills: buildSkills,
  projects: buildProjects,
  education: buildEducation,
  experience: buildExperience,
  resume: buildResume,
  contact: buildContact,
};

export interface SceneView {
  id: SectionId;
  element: HTMLElement;
  navItem: (typeof content.nav)[number];
}

export interface BuiltUI {
  header: HTMLElement;
  scenes: SceneView[];
  scrollTrack: HTMLElement;
  mobileFlow: HTMLElement;
  navRail: HTMLElement;
  telemetry: HTMLElement;
  footer: HTMLElement;
  loader: HTMLElement;
  quickView: HTMLDialogElement;
  toast: HTMLElement;
  accessibleContent: HTMLElement;
  fallbackNote: HTMLElement;
  loaderPercent: HTMLElement;
  loaderStatus: HTMLElement;
  loaderMeter: HTMLElement;
  loaderCells: HTMLElement[];
  loaderQuickView: HTMLElement | null;
  navButtons: HTMLButtonElement[];
  telemetryQuality: HTMLElement | null;
  telemetryPoints: HTMLElement | null;
  telemetryFps: HTMLElement | null;
  headerQuickButton: HTMLElement | null;
}

function buildHeader(): string {
  return `<a class="brand" href="#home" data-goto="home" aria-label="${escapeHTML(content.identity.name)} — ${escapeHTML(content.ui.backToTop)}">
      ${ledMark()}
      <span class="brand__copy">
        <span class="brand__name">${escapeHTML(content.brand.name)}</span>
      </span>
    </a>
    <div class="header-actions">
      <a class="header-resume" href="${safeHref(content.resume.url)}" download="${escapeHTML(content.resume.downloadName)}" data-event="resume_download" aria-label="${escapeHTML(content.ui.resumeDownload)} (${escapeHTML(content.ui.resumeFormat)})">
        <span class="header-resume__label">${escapeHTML(content.ui.resumeLabel)}</span>
        ${icon("download", "header-resume__icon")}
      </a>
      <button type="button" class="quick-button" data-quick-view data-event="quick_view_open" aria-haspopup="dialog" aria-controls="quickview" aria-label="${escapeHTML(content.ui.quickView)}">
        <span>${escapeHTML(content.ui.quickView)}</span>
        <span class="quick-button__icon">${icon("arrow-up-right")}</span>
      </button>
    </div>`;
}

function buildNav(): string {
  const buttons = content.nav
    .map(
      (section) => `<button type="button" class="nav-dot" data-goto-nav="${section.id}" aria-label="${escapeHTML(content.ui.goTo)} ${escapeHTML(section.eyebrow)} — ${escapeHTML(section.title)}" aria-current="false">
        <span class="nav-dot__mark" aria-hidden="true"></span>
        <span class="nav-dot__label" aria-hidden="true">${escapeHTML(section.nav)}</span>
      </button>`,
    )
    .join("");
  return `<div class="nav-dots" role="navigation" aria-label="${escapeHTML(content.ui.navLabel)}">${buttons}</div>`;
}

function buildTelemetry(): string {
  return `<span class="telemetry__dot" aria-hidden="true"></span>
    <span class="telemetry__label">${escapeHTML(content.ui.qualityLabel)}</span>
    <span class="telemetry__item" data-engine-quality>${escapeHTML(content.ui.statusReady)}</span>
    <span class="telemetry__sep" aria-hidden="true">/</span>
    <span class="telemetry__item" data-engine-points>—</span>
    <span class="telemetry__sep" aria-hidden="true">/</span>
    <span class="telemetry__item" data-engine-fps>— FPS</span>`;
}

function buildFooter(): string {
  return `<div class="footer-left">
      <span class="footer-credit">${escapeHTML(content.ui.footerCredit)}</span>
    </div>
    <div class="scroll-cue" data-scroll-cue>
      <span class="scroll-cue__line" aria-hidden="true"></span>
      <span>${escapeHTML(content.ui.scroll)}</span>
    </div>
    <div class="footer-right">
      <button type="button" class="footer-link" data-quick-view>${escapeHTML(content.ui.quickViewShort)}</button>
      <span class="footer-sep" aria-hidden="true">/</span>
      <button type="button" class="footer-link" data-goto="home">${escapeHTML(content.ui.backToTop)} ${icon("arrow-down")}</button>
    </div>`;
}

function buildLoader(): string {
  const cells = Array.from({ length: 28 }, () => "<i></i>").join("");
  return `<div class="loader__top">
      <span class="loader__brand">${ledMark()}<span>${escapeHTML(content.brand.name)}</span></span>
    </div>
    <div class="loader__edge loader__edge--left" aria-hidden="true">${escapeHTML(content.sceneLabels.loaderEdgeLeft)}</div>
    <div class="loader__bottom">
      <div class="loader__statusline">
        <span class="loader__status" data-loader-status>${escapeHTML(content.loader.statuses[0])}</span>
        <span class="loader__percent"><span data-loader-percent>00</span><span>%</span></span>
      </div>
      <div class="loader__meter" role="progressbar" aria-label="${escapeHTML(content.ui.loading)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-loader-meter>
        <div class="loader__cells" aria-hidden="true">${cells}</div>
      </div>
      <div class="loader__foot">
        <span class="micro-label">${escapeHTML(content.ui.loadingShort)}</span>
        <div class="loader__foot-actions">
          <button type="button" class="loader__skip" data-skip-intro>${escapeHTML(content.ui.skipIntro)}</button>
          <button type="button" class="loader__quick" data-quick-view data-event="quick_view_open">${escapeHTML(content.ui.quickView)} ${icon("arrow-up-right")}</button>
        </div>
      </div>
    </div>`;
}

function renderStaticSections(prefix: string): string {
  const vignette = (id: SectionId): string =>
    prefix === "flow"
      ? `<canvas class="flow-vignette" data-vignette="${id}" width="96" height="96" aria-hidden="true"></canvas>`
      : "";
  const skills = content.skills.groups
    .map(
      (group) => `<div class="static-skill-group">
        <h3>${escapeHTML(group.label)}</h3>
        <ul class="inline-dot-list">${group.items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
      </div>`,
    )
    .join("");
  const projects = content.projects.entries
    .map((project) => {
      const tech = project.tech.map((item) => `<li>${escapeHTML(item)}</li>`).join("");
      const links = project.links
        .map(
          (link) =>
            `<a class="static-link" href="${safeHref(link.href)}" ${externalAttrs(link.href)} data-event="project_link">${escapeHTML(link.label)}${icon(isExternal(link.href) ? "external" : "arrow-right")}</a>`,
        )
        .join("");
      const metrics = project.metrics.length
        ? `<div class="metric-chips">${project.metrics
            .map(
              (metric) =>
                `${metricChip(metric)}`,
            )
            .join("")}</div>`
        : "";
      return `<article class="static-project">
        <div class="static-project__body">
          <p class="static-project__date">${escapeHTML(project.date)}</p>
          <h3>${escapeHTML(project.title)}</h3>
          <p class="static-project__short">${escapeHTML(project.short)}</p>
          <p>${escapeHTML(project.description)}</p>
          ${metrics}
          <ul class="tag-list">${tech}</ul>
          <div class="static-project__links">${links}</div>
        </div>
      </article>`;
    })
    .join("");
  const education = content.education.entries
    .map(
      (entry) => `<li class="static-entry">
        <div class="static-entry__heading"><h3>${escapeHTML(entry.institution)}</h3><span>${escapeHTML(entry.period)}</span></div>
        <p class="static-entry__role">${escapeHTML(entry.qualification)} · CGPA ${escapeHTML(entry.cgpa)}</p>
        <ul class="tag-list">${entry.coursework.map((course) => `<li>${escapeHTML(course)}</li>`).join("")}</ul>
      </li>`,
    )
    .join("");
  const experience = content.experience.entries
    .map((entry) => {
      const summary = entry.type === "internship" ? "" : `<p>${escapeHTML(entry.detail)}</p>`;
      const bullets = entry.type !== "internship" && entry.bullets?.length
        ? `<ul class="static-entry__bullets">${entry.bullets.map((bullet) => `<li>${escapeHTML(bullet)}</li>`).join("")}</ul>`
        : "";
      const metrics = entry.metrics?.length
        ? `<div class="metric-chips">${entry.metrics
            .map(
              (metric) =>
                `${metricChip(metric)}`,
            )
            .join("")}</div>`
        : "";
      const projectLink =
        entry.projectId && content.experience.warehouse.links[0]
          ? `<a class="static-link" href="${safeHref(content.experience.warehouse.links[0].href)}" ${externalAttrs(content.experience.warehouse.links[0].href)} data-event="project_link">${escapeHTML(content.experience.warehouse.links[0].label)}${icon(isExternal(content.experience.warehouse.links[0].href) ? "external" : "arrow-right")}</a>`
          : "";
      return `<li class="static-entry">
        <div class="static-entry__heading"><h3>${escapeHTML(entry.role)}</h3><span>${escapeHTML(entry.period)}</span></div>
        <p class="static-entry__role"><span class="type-badge type-badge--${entry.type}">${escapeHTML(content.ui.experienceTypes[entry.type])}</span> <span>${escapeHTML(entry.place)}</span></p>
        ${summary}
        ${bullets}
        ${metrics}
        ${projectLink}
      </li>`;
    })
    .join("");
  const contact = content.contact.links
    .map(
      (link) => `<li><a class="static-link static-link--large" href="${safeHref(link.href)}" ${externalAttrs(link.href)} data-event="contact_click"><span>${escapeHTML(link.label)}</span><span>${escapeHTML(link.value)}</span></a></li>`,
    )
    .join("");
  const email = content.contact.links.find((link) => link.href.startsWith("mailto:"));
  const emailAction = email
    ? `<a class="led-button led-button--solid" href="${safeHref(email.href)}" data-event="contact_click"><span class="led-button__label">${escapeHTML(content.ui.emailMe)}</span>${icon("arrow-up-right", "led-button__icon")}</a>`
    : "";

  return `<section class="static-section" id="${prefix}-about">
      <header class="static-section__head">
        ${vignette("about")}
        <div><p class="eyebrow">${escapeHTML(content.nav[1].eyebrow)}</p><h2>${escapeHTML(content.nav[1].title)}</h2></div>
      </header>
      <div class="static-section__content">
        <p class="lead">${escapeHTML(content.identity.bioLead)}</p>
        <p>${escapeHTML(content.identity.bioBody)}</p>
        <p class="aside-note">${escapeHTML(content.identity.bioNote)}</p>
        <dl class="fact-list">
          <div><dt>${escapeHTML(content.resume.facts[1].label)}</dt><dd>${escapeHTML(content.identity.location)}</dd></div>
          <div><dt>${escapeHTML(content.resume.facts[0].label)}</dt><dd>${escapeHTML(content.identity.role)}</dd></div>
        </dl>
      </div>
    </section>
    <section class="static-section" id="${prefix}-skills">
      <header class="static-section__head">
        ${vignette("skills")}
        <div><p class="eyebrow">${escapeHTML(content.nav[2].eyebrow)}</p><h2>${escapeHTML(content.nav[2].title)}</h2></div>
      </header>
      <div class="static-section__content">
        <p class="lead">${escapeHTML(content.skills.intro)}</p>
        <div class="static-skill-grid">${skills}</div>
      </div>
    </section>
    <section class="static-section" id="${prefix}-projects">
      <header class="static-section__head">
        ${vignette("projects")}
        <div><p class="eyebrow">${escapeHTML(content.nav[3].eyebrow)}</p><h2>${escapeHTML(content.nav[3].title)}</h2></div>
      </header>
      <div class="static-section__content">
        <p class="lead">${escapeHTML(content.projects.intro)}</p>
        <div class="static-projects">${projects}</div>
      </div>
    </section>
    <section class="static-section" id="${prefix}-education">
      <header class="static-section__head">
        ${vignette("education")}
        <div><p class="eyebrow">${escapeHTML(content.nav[4].eyebrow)}</p><h2>${escapeHTML(content.nav[4].title)}</h2></div>
      </header>
      <div class="static-section__content">
        <p class="lead">${escapeHTML(content.education.intro)}</p>
        <ol class="static-entry-list">${education}</ol>
      </div>
    </section>
    <section class="static-section" id="${prefix}-experience">
      <header class="static-section__head">
        ${vignette("experience")}
        <div><p class="eyebrow">${escapeHTML(content.nav[5].eyebrow)}</p><h2>${escapeHTML(content.nav[5].title)}</h2></div>
      </header>
      <div class="static-section__content">
        <p class="lead">${escapeHTML(content.experience.intro)}</p>
        <ol class="static-entry-list">${experience}</ol>
        ${
          content.experience.certifications.length
            ? `<section class="cert-strip" aria-label="${escapeHTML(content.ui.certificationsLabel)}">
                <span class="micro-label">${escapeHTML(content.ui.certificationsLabel)}</span>
                <ul>${content.experience.certifications
                  .map(
                    (entry) =>
                      `<li><span>${escapeHTML(entry.name)}</span><span class="cert-strip__meta">${escapeHTML(entry.issuer)} · ${escapeHTML(entry.year)}</span></li>`,
                  )
                  .join("")}</ul>
              </section>`
            : ""
        }
      </div>
    </section>
    <section class="static-section" id="${prefix}-resume">
      <header class="static-section__head">
        ${vignette("resume")}
        <div><p class="eyebrow">${escapeHTML(content.nav[6].eyebrow)}</p><h2>${escapeHTML(content.nav[6].title)}</h2></div>
      </header>
      <div class="static-section__content static-resume">
        <p class="lead">${escapeHTML(content.resume.intro)}</p>
        <dl class="fact-list">${content.resume.facts.map((fact) => `<div><dt>${escapeHTML(fact.label)}</dt><dd>${escapeHTML(fact.value)}</dd></div>`).join("")}</dl>
        <a class="led-button led-button--solid" href="${safeHref(content.resume.url)}" download="${escapeHTML(content.resume.downloadName)}" data-event="resume_download">
          <span class="led-button__label">${escapeHTML(content.ui.resumeDownload)}</span>${icon("download", "led-button__icon")}
        </a>
      </div>
    </section>
    <section class="static-section" id="${prefix}-contact">
      <header class="static-section__head">
        ${vignette("contact")}
        <div><p class="eyebrow">${escapeHTML(content.nav[7].eyebrow)}</p><h2>${escapeHTML(content.nav[7].title)}</h2></div>
      </header>
      <div class="static-section__content">
        <p class="lead">${escapeHTML(content.contact.intro)}</p>
        <ul class="static-contact-list">${contact}</ul>
        <div class="static-contact__actions">
          ${emailAction}
          <button type="button" class="copy-button" data-copy-email data-event="contact_click">
            ${icon("copy")}
            <span>${escapeHTML(content.ui.copyEmail)}</span>
          </button>
        </div>
        <p class="aside-note">${escapeHTML(content.contact.finalNote)}</p>
      </div>
    </section>`;
}

function buildQuickView(): string {
  const toc = content.nav
    .slice(1)
    .map(
      (section) =>
        `<a href="#qv-${section.id}">${escapeHTML(section.nav)}</a>`,
    )
    .join("");
  return `<div class="quickview__shell">
    <header class="quickview__header">
      <span class="quickview__brand">${ledMark()}<span>${escapeHTML(content.brand.name)} / ${escapeHTML(content.ui.quickViewTitle)}</span></span>
      <div class="quickview__header-actions">
        <a class="quickview__download" href="${safeHref(content.resume.url)}" download="${escapeHTML(content.resume.downloadName)}" data-event="resume_download">
          ${icon("download")}<span>${escapeHTML(content.ui.resumeDownload)}</span>
        </a>
        <button type="button" class="quickview__close" data-close-quick aria-label="${escapeHTML(content.ui.close)}">${icon("close")}<span>${escapeHTML(content.ui.close)}</span></button>
      </div>
    </header>
    <div class="quickview__scroll" data-lenis-prevent>
      <div class="quickview__hero">
        <p class="eyebrow">${escapeHTML(content.nav[0].eyebrow)}</p>
        <h2 id="quickview-title">${escapeHTML(content.identity.name)}</h2>
        <p class="quickview__role">${escapeHTML(content.identity.role)}</p>
        <p class="quickview__tagline">${escapeHTML(content.identity.tagline)}</p>
        <p class="quickview__intro">${escapeHTML(content.ui.quickViewIntro)}</p>
        <div class="quickview__actions">
          <a class="led-button led-button--solid" href="${safeHref(content.resume.url)}" download="${escapeHTML(content.resume.downloadName)}" data-event="resume_download">
            <span class="led-button__label">${escapeHTML(content.ui.resumeDownload)}</span>${icon("download", "led-button__icon")}
          </a>
          <button type="button" class="text-button" data-close-quick>${escapeHTML(content.ui.quickViewExit)}${icon("arrow-left")}</button>
        </div>
        ${statusLine("quickview__status")}
      </div>
      <nav class="quickview__toc" aria-label="${escapeHTML(content.ui.contents)}">
        <span class="micro-label">${escapeHTML(content.ui.contents)}</span>
        <div>${toc}</div>
      </nav>
      <div class="quickview__sections">${renderStaticSections("qv")}</div>
      <footer class="quickview__footer">
        <span>${escapeHTML(content.ui.footerCredit)}</span>
        <span>${escapeHTML(content.ui.footerNote)}</span>
      </footer>
    </div>
  </div>`;
}

function buildMobileFlow(): string {
  const fallbackLinks = content.nav
    .map((section) => `<li><a href="#${section.id === "home" ? "flow-home" : `flow-${section.id}`}">${escapeHTML(section.nav)}</a></li>`)
    .join("");
  return `<section class="flow-hero" id="flow-home">
      <div class="flow-hero__copy">
        <p class="eyebrow">${escapeHTML(content.nav[0].eyebrow)}</p>
        <h1>${escapeHTML(content.identity.name)}</h1>
        <p class="flow-hero__role">${escapeHTML(content.identity.role)}</p>
        <p class="flow-hero__tagline">${escapeHTML(content.identity.tagline)}</p>
        ${statusLine("flow-hero__status")}
        <div class="flow-hero__actions">
          <button type="button" class="led-button led-button--solid" data-goto="projects"><span class="led-button__label">${escapeHTML(content.ui.viewWork)}</span>${icon("arrow-right", "led-button__icon")}</button>
          <button type="button" class="text-button" data-quick-view data-event="quick_view_open">${escapeHTML(content.ui.quickView)}${icon("arrow-up-right")}</button>
        </div>
      </div>
    </section>
    <nav class="fallback-nav" aria-label="Portfolio sections"><h2>Read the portfolio</h2><ul>${fallbackLinks}</ul></nav>
    <div class="flow-document">
      ${renderStaticSections("flow")}
    </div>
    <footer class="flow-footer">
      <p>${escapeHTML(content.ui.footerCredit)}</p>
      <p>${escapeHTML(content.ui.footerNote)}</p>
      <div><button type="button" class="footer-link" data-quick-view>${escapeHTML(content.ui.quickView)}</button><button type="button" class="footer-link" data-goto="home">${escapeHTML(content.ui.backToTop)} ${icon("arrow-down")}</button></div>
    </footer>`;
}

function buildAccessibleContent(): string {
  const skills = content.skills.groups
    .map(
      (group) =>
        `<li><strong>${escapeHTML(group.label)}:</strong> ${group.items.map(escapeHTML).join(", ")}</li>`,
    )
    .join("");
  const projects = content.projects.entries
    .map(
      (project) =>
        `<article><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.short)}</p><p>${escapeHTML(project.description)}</p><p>${escapeHTML(content.ui.techLabel)}: ${project.tech.map(escapeHTML).join(", ")}</p><ul>${project.links.map((link) => `<li>${escapeHTML(link.label)}: ${escapeHTML(link.href)}</li>`).join("")}</ul></article>`,
    )
    .join("");
  const education = content.education.entries
    .map(
      (entry) =>
        `<li><strong>${escapeHTML(entry.institution)}</strong>, ${escapeHTML(entry.qualification)} (${escapeHTML(entry.period)}).</li>`,
    )
    .join("");
  const experience = content.experience.entries
    .map(
      (entry) =>
        `<li><strong>${escapeHTML(content.ui.experienceTypes[entry.type])}: ${escapeHTML(entry.role)}</strong> at ${escapeHTML(entry.place)} (${escapeHTML(entry.period)}).${entry.type === "internship" ? "" : ` ${escapeHTML(entry.detail)}`}</li>`,
    )
    .join("");
  const contact = content.contact.links
    .map((link) => `<li>${escapeHTML(link.label)}: ${escapeHTML(link.value)} (${escapeHTML(link.href)})</li>`)
    .join("");
  return `<article>
    <h2>${escapeHTML(content.identity.name)} — ${escapeHTML(content.identity.role)}</h2>
    <p>${escapeHTML(content.identity.tagline)}</p>
    <p>${escapeHTML(content.ui.statusLabel)}: ${escapeHTML(content.identity.status)}.</p>
    <h2>${escapeHTML(content.nav[1].title)} — ${escapeHTML(content.nav[1].eyebrow)}</h2>
    <p>${escapeHTML(content.identity.bioLead)}</p>
    <p>${escapeHTML(content.identity.bioBody)}</p>
    <p>${escapeHTML(content.identity.bioNote)}</p>
    <h2>${escapeHTML(content.nav[2].title)} — ${escapeHTML(content.nav[2].eyebrow)}</h2>
    <p>${escapeHTML(content.skills.intro)}</p>
    <ul>${skills}</ul>
    <h2>${escapeHTML(content.nav[3].title)} — ${escapeHTML(content.nav[3].eyebrow)}</h2>
    <p>${escapeHTML(content.projects.intro)}</p>
    ${projects}
    <h2>${escapeHTML(content.nav[4].title)} — ${escapeHTML(content.nav[4].eyebrow)}</h2>
    <p>${escapeHTML(content.education.intro)}</p>
    <ul>${education}</ul>
    <h2>${escapeHTML(content.nav[5].title)} — ${escapeHTML(content.nav[5].eyebrow)}</h2>
    <p>${escapeHTML(content.experience.intro)}</p>
    <ul>${experience}</ul>
    <h2>${escapeHTML(content.nav[6].title)} — ${escapeHTML(content.nav[6].eyebrow)}</h2>
    <p>${escapeHTML(content.resume.intro)}</p>
    <p>${escapeHTML(content.ui.resumeLabel)}: ${escapeHTML(content.resume.downloadName)}</p>
    <h2>${escapeHTML(content.nav[7].title)} — ${escapeHTML(content.nav[7].eyebrow)}</h2>
    <p>${escapeHTML(content.contact.intro)}</p>
    <ul>${contact}</ul>
    <p>${escapeHTML(content.contact.finalNote)}</p>
    <p>${escapeHTML(content.ui.footerCredit)}</p>
  </article>`;
}

function setMeta(): void {
  document.title = content.meta.title;
  document.documentElement.style.colorScheme = "dark";
  const metas: Array<[string, string]> = [
    ['meta[name="description"]', content.meta.description],
    ['meta[property="og:title"]', content.meta.title],
    ['meta[property="og:description"]', content.meta.description],
    ['meta[property="og:image"]', content.meta.ogImage],
    ['meta[name="twitter:title"]', content.meta.title],
    ['meta[name="twitter:description"]', content.meta.description],
    ['meta[name="twitter:image"]', content.meta.ogImage],
    ['meta[name="theme-color"]', content.meta.themeColor],
  ];
  for (const [selector, value] of metas) {
    document.querySelector(selector)?.setAttribute("content", value);
  }
}

export function buildUI(): BuiltUI {
  setMeta();
  const header = document.querySelector<HTMLElement>("#site-header");
  const stageRoot = document.querySelector<HTMLElement>("#stage-root");
  const scrollTrack = document.querySelector<HTMLElement>("#scroll-track");
  const mobileFlow = document.querySelector<HTMLElement>("#mobile-flow");
  const navRail = document.querySelector<HTMLElement>("#nav-rail");
  const telemetry = document.querySelector<HTMLElement>("#telemetry");
  const footer = document.querySelector<HTMLElement>("#site-footer");
  const loader = document.querySelector<HTMLElement>("#loader");
  const quickView = document.querySelector<HTMLDialogElement>("#quickview");
  const toast = document.querySelector<HTMLElement>("#toast");
  const accessibleContent = document.querySelector<HTMLElement>("#accessible-content");
  const fallbackNote = document.querySelector<HTMLElement>("#fallback-note");

  if (
    !header ||
    !stageRoot ||
    !scrollTrack ||
    !mobileFlow ||
    !navRail ||
    !telemetry ||
    !footer ||
    !loader ||
    !quickView ||
    !toast ||
    !accessibleContent ||
    !fallbackNote
  ) {
    throw new Error("The interface mount points are missing.");
  }

  stageRoot.setAttribute("aria-label", content.brand.storyLabel);
  telemetry.setAttribute("aria-label", content.brand.engineLabel);
  telemetry.hidden = new URLSearchParams(window.location.search).get("debug") !== "1";
  accessibleContent.setAttribute("aria-label", content.ui.accessibleContent);
  header.innerHTML = buildHeader();
  stageRoot.innerHTML = content.nav
    .map((section, index) => sceneBuilders[section.id](section, index, content.nav.length))
    .join("");
  navRail.innerHTML = buildNav();
  telemetry.innerHTML = buildTelemetry();
  footer.innerHTML = buildFooter();
  loader.innerHTML = buildLoader();
  quickView.innerHTML = buildQuickView();
  mobileFlow.innerHTML = buildMobileFlow();
  accessibleContent.innerHTML = buildAccessibleContent();

  const scenes: SceneView[] = content.nav.map((navItem) => {
    const element = stageRoot.querySelector<HTMLElement>(`[data-scene="${navItem.id}"]`);
    if (!element) throw new Error(`Missing scene: ${navItem.id}`);
    return { id: navItem.id, element, navItem };
  });

  const navButtons = Array.from(navRail.querySelectorAll<HTMLButtonElement>(".nav-dot"));
  const loaderCells = Array.from(loader.querySelectorAll<HTMLElement>(".loader__cells i"));
  const loaderPercent = loader.querySelector<HTMLElement>("[data-loader-percent]");
  const loaderStatus = loader.querySelector<HTMLElement>("[data-loader-status]");
  const loaderMeter = loader.querySelector<HTMLElement>("[data-loader-meter]");
  if (!loaderPercent || !loaderStatus || !loaderMeter) {
    throw new Error("Loader controls are missing.");
  }

  return {
    header,
    scenes,
    scrollTrack,
    mobileFlow,
    navRail,
    telemetry,
    footer,
    loader,
    quickView,
    toast,
    accessibleContent,
    fallbackNote,
    loaderPercent,
    loaderStatus,
    loaderMeter,
    loaderCells,
    loaderQuickView: loader.querySelector("[data-quick-view]"),
    navButtons,
    telemetryQuality: telemetry.querySelector("[data-engine-quality]"),
    telemetryPoints: telemetry.querySelector("[data-engine-points]"),
    telemetryFps: telemetry.querySelector("[data-engine-fps]"),
    headerQuickButton: header.querySelector("[data-quick-view]"),
  };
}

export function setLoaderProgress(ui: BuiltUI, value: number, status?: string): void {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  ui.loaderPercent.textContent = String(clamped).padStart(2, "0");
  ui.loaderMeter.setAttribute("aria-valuenow", String(clamped));
  const lit = Math.round((clamped / 100) * ui.loaderCells.length);
  ui.loaderCells.forEach((cell, index) => {
    cell.classList.toggle("is-lit", index < lit);
  });
  if (status) {
    ui.loaderStatus.textContent = status;
    ui.loaderMeter.setAttribute("aria-label", status);
  }
}

export function setEngineReadout(
  ui: BuiltUI,
  stats: { quality: string; points: number; fps: number },
): void {
  if (ui.telemetryQuality) ui.telemetryQuality.textContent = stats.quality;
  if (ui.telemetryPoints) ui.telemetryPoints.textContent = `${Math.round(stats.points / 1000)}K`;
  if (ui.telemetryFps) {
    ui.telemetryFps.textContent = stats.fps > 0 ? `${stats.fps} FPS` : "— FPS";
  }
}

let toastTimer = 0;
export function showToast(ui: BuiltUI, message: string, duration = 3200): void {
  window.clearTimeout(toastTimer);
  ui.toast.textContent = message;
  ui.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => ui.toast.classList.remove("is-visible"), duration);
}

export function setProjectPanel(
  scene: HTMLElement,
  projectId: string | null,
  projects: readonly Project[],
): void {
  const indexView = scene.querySelector<HTMLElement>("[data-project-index]");
  const detailsWrap = scene.querySelector<HTMLElement>("[data-project-details]");
  const panels = Array.from(scene.querySelectorAll<HTMLElement>("[data-project-panel]"));
  if (!indexView || !detailsWrap) return;
  const target = projectId ? projects.find((project) => project.id === projectId) : null;
  indexView.hidden = Boolean(target);
  detailsWrap.hidden = !target;
  for (const panel of panels) {
    panel.hidden = panel.dataset.projectPanel !== projectId;
  }
  scene.classList.toggle("has-project-open", Boolean(target));
  if (target) {
    detailsWrap.scrollTop = 0;
    detailsWrap.closest<HTMLElement>(".project-dock")?.scrollTo({ top: 0 });
    const dock = scene.querySelector<HTMLElement>(".project-dock");
    if (dock) dock.scrollTop = 0;
    const active = scene.querySelector<HTMLElement>(`[data-project-panel="${CSS.escape(projectId ?? "")}"]`);
    if (active) {
      const heading = active.querySelector<HTMLElement>("h3");
      active.classList.remove("is-entering");
      void active.offsetWidth;
      active.classList.add("is-entering");
      if (heading) heading.setAttribute("tabindex", "-1");
    }
  }
}

export function setExperiencePanel(scene: HTMLElement, open: boolean): void {
  const indexView = scene.querySelector<HTMLElement>("[data-experience-index]");
  const detail = scene.querySelector<HTMLElement>("[data-experience-detail]");
  if (!indexView || !detail) return;
  indexView.hidden = open;
  detail.hidden = !open;
  scene.classList.toggle("has-experience-open", open);
  if (open) {
    detail.scrollTop = 0;
    const panel = scene.querySelector<HTMLElement>(".experience-panel");
    if (panel) panel.scrollTop = 0;
    const heading = detail.querySelector<HTMLElement>("h3");
    detail.classList.remove("is-entering");
    void detail.offsetWidth;
    detail.classList.add("is-entering");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }
}
