/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LED GRAND LINE — ALL SITE CONTENT
 * ─────────────────────────────────────────────────────────────────────────────
 *  Presentation copy lives here. Every resume fact comes from `resume.ts`, so
 *  the desktop chapters, mobile document and Quick View cannot drift apart.
 */

import { resume } from "./resume";

export type SectionId =
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "education"
  | "experience"
  | "resume"
  | "contact";

export type ExperienceType = "internship" | "project" | "leadership" | "achievement";

export interface NavItem {
  id: SectionId;
  eyebrow: string;
  title: string;
  nav: string;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  short: string;
  date: string;
  description: string;
  problem: string;
  approach: string;
  result: string;
  metrics: ProjectMetric[];
  tech: string[];
  links: LinkItem[];
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  year: string;
  href?: string;
}

export interface EducationEntry {
  institution: string;
  qualification: string;
  period: string;
  cgpa: string;
  coursework: string[];
  detail: string;
}

export interface ExperienceBase {
  type: ExperienceType;
  role: string;
  place: string;
  period: string;
  detail: string;
}

export type ExperienceEntry = ExperienceBase &
  (
    | {
        type: "internship" | "project";
        bullets: string[];
        metrics: ProjectMetric[];
        projectId?: string;
        links?: LinkItem[];
      }
    | {
        type: "leadership" | "achievement";
        bullets?: undefined;
        metrics?: undefined;
        projectId?: undefined;
        links?: undefined;
      }
  );

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

const projectEntries: Project[] = resume.projects.map((project) => ({
  ...project,
  metrics: [...project.metrics],
  tech: [...project.tech],
  links: [...project.links],
}));

const warehouse: Project = {
  ...resume.warehouse,
  metrics: [...resume.warehouse.metrics],
  tech: [...resume.warehouse.tech],
  links: [...resume.warehouse.links],
};

export const content = {
  meta: {
    title: "Abhed Srivastava — LED Grand Line",
    description:
      "Portfolio of Abhed Srivastava — final-year Mechanical Engineering student at BIT Mesra (2027) working across data engineering, analytics and applied AI.",
    ogImage: "./og.png",
    themeColor: "#000000",
  },

  /**
   * Privacy-friendly analytics, OFF unless an id is present.
   * TODO(content): set provider + id + scriptUrl to enable.
   */
  analytics: {
    provider: "" as "" | "plausible" | "umami",
    id: "",
    scriptUrl: "",
  },

  brand: {
    name: "LED GRAND LINE",
    storyLabel: "Portfolio story",
    engineLabel: "Particle engine status",
  },

  identity: {
    name: resume.displayName,
    mark: "AS",
    role: resume.role,
    tagline: resume.tagline,
    status: resume.status,
    location: resume.location,
    email: resume.email,
    bioLead:
      "Final-year Mechanical Engineering student at BIT Mesra (2027) with hands-on projects in inventory optimization, Monte Carlo simulation, and SQL/Power BI analytics.",
    bioBody:
      "Built an inventory plan that raised simulated weekly profit by 9.9% under demand uncertainty.",
    bioNote:
      "Coursework: Data Structures & Algorithms, Database Management Systems, Object-Oriented Programming.",
  },

  nav: [
    { id: "home", eyebrow: "Home", title: "Set Sail", nav: "Home" },
    { id: "about", eyebrow: "About", title: "East Blue", nav: "About" },
    { id: "skills", eyebrow: "Skills", title: "Log Pose", nav: "Skills" },
    { id: "projects", eyebrow: "Projects", title: "Grand Line", nav: "Projects" },
    { id: "education", eyebrow: "Education", title: "Training Arc", nav: "Education" },
    { id: "experience", eyebrow: "Experience", title: "New World", nav: "Experience" },
    { id: "resume", eyebrow: "Resume", title: "Wanted", nav: "Resume" },
    { id: "contact", eyebrow: "Contact", title: "Laugh Tale", nav: "Contact" },
  ] satisfies NavItem[],

  /**
   * Microtype drawn directly in the LED particle field. The large stage titles
   * are taken from `nav[].title`, so editing the chapter name updates both the
   * DOM and the light. Decorative captions stay deliberately sparse.
   */
  sceneLabels: {
    loaderBoot: "COLD BOOT / ASSEMBLING",
    loaderEdgeLeft: "COLD LIGHT / NANO SWARM",
    projectLog: "PROJECT LOG",
    onePieceTitle: "THE ONE PIECE",
    onePieceLine: "IS REAL",
  },

  ui: {
    skip: "Skip to content",
    quickView: "Quick view",
    quickViewShort: "Static view",
    close: "Close",
    menu: "Sections",
    loading: "Assembling the Grand Line",
    loadingShort: "Cold boot",
    skipIntro: "Skip intro",
    enter: "Enter the Grand Line",
    statusReady: "Ready",
    goTo: "Go to",
    stackLabel: "Stack",
    techLabel: "Tech",
    resumeLabel: "Résumé",
    scroll: "Scroll to navigate",
    scrollAria: "Scroll through the portfolio",
    scrollExperience: "Scroll for all entries",
    viewWork: "View projects",
    readAbout: "Read the log",
    backToMap: "Back to the map",
    allProjects: "All projects",
    selectProject: "Open project",
    viewProject: "View project",
    projectClose: "Close project",
    projectIndex: "Project index",
    problemLabel: "Problem",
    approachLabel: "Approach",
    resultLabel: "Result",
    resultMissing: "TODO(content): add a measured result for this project.",
    metricsLabel: "Result metrics",
    resumeDownload: "Download résumé",
    resumeFormat: "PDF · one page · Updated November 2026",
    contactPrompt: "Have a voyage in mind?",
    emailMe: "Email me",
    copyEmail: "Copy email",
    copied: "Copied",
    backToTop: "Back to top",
    navLabel: "Portfolio sections",
    stageLabel: "Current section",
    quickViewTitle: "The log, plainly",
    quickViewIntro:
      "Everything on the journey, in one readable place. No particles required.",
    fallbackTitle: "The light is out in this browser.",
    fallbackBody:
      "WebGL is unavailable, so the particle edition is resting. The full portfolio is still here, in plain LED type.",
    reducedHint: "Motion reduced. The log is calmer for it.",
    statusLabel: "Status",
    qualityLabel: "LED array",
    online: "Signal live",
    handrail: "Drag the horizon. Read the signs.",
    footerCredit: "Fan tribute. One Piece © Eiichiro Oda / Shueisha.",
    footerNote: "Abhed Srivastava · Data & AI portfolio",
    projectLinks: "Project links",
    errorTitle: "The LEDs could not start.",
    errorBody:
      "Your browser or device could not create the WebGL canvas. The static portfolio is available below.",
    accessibleContent: "Full portfolio content, text edition",
    sectionProgress: "Section progress",
    educationLabel: "Education",
    experienceLabel: "Experience",
    skillsLabel: "Skills",
    scrollHint: "Scroll",
    selected: "Selected",
    openLink: "Open link",
    printResume: "Print / save PDF",
    quickViewExit: "Return to the voyage",
    currentChapter: "Current chapter",
    loadingError: "The particle system could not start. Showing the readable edition.",
    viewExperience: "View internship project",
    experienceTypes: {
      internship: "Internship",
      project: "Project",
      leadership: "Leadership",
      achievement: "Achievement",
    },
    certificationsLabel: "Certifications and currently learning",
    slowToast: "Running slow? Switch to Quick view",
    slowToastAction: "Switch to Quick View",
    contents: "Contents",
    quickViewNote: "The complete portfolio in plain LED type.",
    viewStatic: "Read the plain edition",
    courseworkLabel: "Relevant coursework",
  },

  skills: {
    intro:
      "A practice built across data engineering, analytics and applied AI — from the warehouse and the model to the interface that explains them.",
    groups: resume.skills.map((group) => ({ label: group.label, items: [...group.items] })),
  },

  projects: {
    intro:
      "Selected work in inventory optimization, multi-agent reasoning and customer churn analytics.",
    entries: projectEntries,
  },

  education: {
    intro:
      "Mechanical engineering at BIT Mesra, with coursework and projects that moved toward data and computing.",
    entries: [
      {
        institution: resume.education.institution,
        qualification: resume.education.qualification,
        period: resume.education.period,
        cgpa: resume.education.cgpa,
        coursework: [...resume.education.coursework],
        detail:
          "Relevant coursework: Data Structures & Algorithms, Database Management Systems, Object-Oriented Programming.",
      },
    ] satisfies EducationEntry[],
  },

  experience: {
    intro:
      "Internship, competition and campus leadership — data work delivered with real deadlines.",
    entries: [
      {
        ...resume.internship,
        bullets: [...resume.internship.bullets],
        metrics: [...resume.internship.metrics],
      },
      ...resume.achievements.map((entry) => ({ ...entry })),
    ] as ExperienceEntry[],
    warehouse,
    /**
     * TODO(content): add certifications or current courses here. The strip is
     * hidden automatically while this array is empty.
     * Example: { name: "...", issuer: "...", year: "2026", href: "..." }
     */
    certifications: [] as CertificationEntry[],
  },

  resume: {
    intro:
      "One page covering education, internship, selected projects, technical skills, an award and leadership experience.",
    url: "./resume.pdf",
    downloadName: "Abhed_Srivastava_Resume.pdf",
    bounty: "฿ 40% · 0.837 · 9.9%",
    updated: "November 2026",
    facts: [
      { label: "Focus", value: "Data engineering · Operations analytics · Applied AI" },
      { label: "Based", value: resume.location },
      { label: "Format", value: "PDF · one page · Updated November 2026" },
    ],
  },

  contact: {
    intro: "The fastest ways to reach me for data, analytics and AI work.",
    links: [
      {
        label: "Email",
        value: resume.email,
        href: `mailto:${resume.email}`,
      },
      {
        label: "LinkedIn",
        value: "linkedin.com/in/abhed-srivastava",
        href: resume.linkedinUrl,
      },
      {
        label: "GitHub",
        value: "github.com/abhed8604",
        href: resume.githubUrl,
      },
    ] satisfies ContactLink[],
    finalNote: "Thanks for reading. The log continues from here.",
  },

  loader: {
    statuses: [
      "Waking the current",
      "Scribing the charts",
      "Sending light to the hull",
      "Reading the log pose",
    ],
  },

  easterEggs: {
    hat: "Shake the straw hat loose",
    ship: "Give the Sunny a following wind",
    mark: "Read the final poneglyph",
    finalWord: "THE ONE PIECE IS REAL",
    hatToast: "Straw hat scattered. The LEDs are finding it again.",
    shipToast: "A following wind. The Sunny surges along the chart.",
    markToast: "The final poneglyph answers.",
  },
} as const;

export type SiteContent = typeof content;
