/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LED GRAND LINE — ALL SITE CONTENT
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every visible word, link and data point lives in this file.
 *  The strings below are the current content for Abhed Srivastava. Keep them
 *  in sync with /public/resume.pdf and /public/og.png when details change.
 *  Nothing else in the codebase needs editing for content.
 */

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
  theme: string;
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
  description: string;
  problem: string;
  approach: string;
  result: string;
  metrics?: ProjectMetric[];
  tech: string[];
  links: LinkItem[];
  thumbnail?: string;
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
  detail: string;
}

export interface ExperienceEntry {
  type: ExperienceType;
  role: string;
  place: string;
  period: string;
  detail: string;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

export const content = {
  meta: {
    title: "Abhed Srivastava — LED Grand Line",
    description:
      "Portfolio of Abhed Srivastava — data engineering, analytics and applied AI. B.Tech Mechanical Engineering at BIT Mesra.",
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
    name: "ABHED SRIVASTAVA",
    mark: "AS",
    role: "Data Engineering · Analytics · Applied AI",
    tagline: "Data systems and AI tools for clearer decisions.",
    status: "B.Tech 2027 · Ranchi, India · Open to full-time roles",
    location: "Ranchi, Jharkhand, India",
    bioLead: "B.Tech Mechanical Engineering at BIT Mesra, 2023–2027.",
    bioBody:
      "I work across data engineering, analytics and applied AI. My projects turn messy questions into warehouses, statistical models and tools people can use.",
    bioNote: "Coursework: DSA, DBMS and OOP.",
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
    projectClose: "Close project",
    projectIndex: "Project index",
    problemLabel: "Problem",
    approachLabel: "Approach",
    resultLabel: "Result",
    resultMissing: "TODO(content): add a measured result for this project.",
    metricsLabel: "Result metrics",
    resumeDownload: "Download résumé",
    resumeFormat: "PDF · one page",
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
    experienceTypes: {
      internship: "Internship",
      project: "Project",
      leadership: "Leadership",
      achievement: "Achievement",
    },
    certificationsLabel: "Certifications and currently learning",
    slowToast: "Running slow? Switch to Quick view",
    contents: "Contents",
    quickViewNote: "The complete portfolio in plain LED type.",
    viewStatic: "Read the plain edition",
  },

  skills: {
    intro:
      "A practice built across data engineering, analytics and applied AI — from the warehouse and the model to the interface that explains them.",
    groups: [
      {
        label: "Languages",
        theme: "Build",
        items: ["Python", "SQL", "C / C++", "JavaScript / Bash"],
      },
      {
        label: "Tools and BI",
        theme: "Motion",
        items: ["Power BI", "Streamlit", "Matplotlib", "Pandas / NumPy"],
      },
      {
        label: "Data and Infrastructure",
        theme: "Systems",
        items: ["SQL Server / MySQL", "ETL / Data modeling", "Docker / Linux", "Git / GitHub"],
      },
      {
        label: "ML and AI",
        theme: "Craft",
        items: [
          "Scikit-learn / XGBoost",
          "LangChain / LangGraph",
          "RAG / FAISS",
          "LP / Monte Carlo",
          "SHAP",
        ],
      },
    ] satisfies SkillGroup[],
    orbitLabel: "Four points of the practice",
  },

  projects: {
    intro:
      "Selected work across data warehousing, statistical analysis, applied AI and optimisation.",
    entries: [
      {
        id: "enterprise-warehouse",
        title: "Enterprise Data Warehouse",
        short: "A Medallion-architecture warehouse unifying ERP and CRM data for analytics.",
        description:
          "Designed a three-tier Bronze–Silver–Gold warehouse with automated ETL across two source systems. Authored T-SQL transformations into an optimised star schema, improving analytical query performance by 40%, and built Power BI dashboards spanning 15+ customer, product and sales metrics.",
        problem:
          "A Medallion-architecture warehouse unifying ERP and CRM data for analytics.",
        approach:
          "Designed a three-tier Bronze–Silver–Gold warehouse with automated ETL across two source systems. Authored T-SQL transformations into an optimised star schema.",
        result:
          "Improved analytical query performance by 40% and built Power BI dashboards spanning 15+ customer, product and sales metrics.",
        metrics: [
          { value: "40%", label: "query performance" },
          { value: "15+", label: "dashboards" },
        ],
        tech: ["SQL Server", "T-SQL", "ETL", "Data Modeling", "Power BI"],
        links: [{ label: "GitHub", href: "https://github.com/abhed8604" }],
      },
      {
        id: "customer-churn",
        title: "Customer Churn Analytics",
        short: "Statistical drivers and predictive models for 7,000+ customer records.",
        description:
          "Analysed 7,000+ records across nine variables and tested churn differences with chi-square, Welch's t-test and ANOVA with Tukey HSD — finding 42.7% churn on month-to-month contracts versus 2.8% on two-year contracts. Benchmarked logistic regression, random forest and XGBoost to 0.837 ROC-AUC, with SHAP feature importance corroborating the statistical drivers.",
        problem:
          "Statistical drivers and predictive models for 7,000+ customer records.",
        approach:
          "Analysed 7,000+ records across nine variables and tested churn differences with chi-square, Welch's t-test and ANOVA with Tukey HSD.",
        result:
          "Found 42.7% churn on month-to-month contracts versus 2.8% on two-year contracts, and benchmarked logistic regression, random forest and XGBoost to 0.837 ROC-AUC, with SHAP feature importance corroborating the statistical drivers.",
        metrics: [
          { value: "0.837", label: "ROC-AUC" },
          { value: "7,000+", label: "records" },
        ],
        tech: ["Python", "Pandas", "SciPy", "Scikit-learn", "XGBoost", "SHAP", "Streamlit"],
        links: [{ label: "GitHub", href: "https://github.com/abhed8604" }],
      },
      {
        id: "business-ai-agent",
        title: "Business AI Agent",
        short: "A multi-agent system that routes questions to SQL, RAG or web search.",
        description:
          "Built a LangGraph system with an LLM supervisor that routes natural-language questions to specialised SQL, RAG or web-search agents through structured output. Added a SQL agent with automatic retries from error feedback, a hallucination-resistant FAISS RAG pipeline, persistent conversational memory and a Streamlit interface.",
        problem:
          "A multi-agent system that routes questions to SQL, RAG or web search.",
        approach:
          "Built a LangGraph system with an LLM supervisor that routes natural-language questions to specialised SQL, RAG or web-search agents through structured output. Added a SQL agent with automatic retries from error feedback, a hallucination-resistant FAISS RAG pipeline, persistent conversational memory and a Streamlit interface.",
        result: "",
        tech: ["Python", "LangChain", "LangGraph", "LLMs", "RAG", "FAISS", "SQLite", "Streamlit"],
        links: [{ label: "GitHub", href: "https://github.com/abhed8604" }],
      },
      {
        id: "inventory-optimization",
        title: "Inventory Optimization",
        short: "An LP and Monte Carlo model for ordering under demand uncertainty.",
        description:
          "Formulated a piecewise-linear programme to set order quantities across six SKUs under a $6,000 budget and 350 sq. ft. storage limit. Stress-tested the plan with 5,000 Monte Carlo simulations, improving average weekly profit by 9.9% and service level by 15.9 points over a mean-demand baseline.",
        problem:
          "An LP and Monte Carlo model for ordering under demand uncertainty.",
        approach:
          "Formulated a piecewise-linear programme to set order quantities across six SKUs under a $6,000 budget and 350 sq. ft. storage limit. Stress-tested the plan with 5,000 Monte Carlo simulations.",
        result:
          "Improved average weekly profit by 9.9% and service level by 15.9 points over a mean-demand baseline.",
        metrics: [
          { value: "9.9%", label: "weekly profit" },
          { value: "15.9 pts", label: "service level" },
        ],
        tech: ["Python", "Linear Programming", "NumPy", "Monte Carlo", "Matplotlib"],
        links: [{ label: "GitHub", href: "https://github.com/abhed8604" }],
      },
    ] satisfies Project[],
  },

  education: {
    intro:
      "Formal training in mechanical engineering, with coursework and projects that moved toward data and computing.",
    entries: [
      {
        institution: "Birla Institute of Technology, Mesra",
        qualification: "B.Tech, Mechanical Engineering · CGPA 8.0/10",
        period: "2023 — 2027",
        detail:
          "Coursework includes data structures and algorithms, DBMS and object-oriented programming.",
      },
      {
        institution: "Maharshi Patanjali Vidya Mandir, Prayagraj",
        qualification: "Class XII, CBSE (PCM)",
        period: "2022",
        detail: "Senior secondary schooling in Physics, Chemistry and Mathematics.",
      },
    ] satisfies EducationEntry[],
  },

  experience: {
    intro:
      "Competitions and leadership alongside the degree — small teams, real deadlines and work that had to land.",
    entries: [
      {
        type: "achievement",
        role: "Winner, B-Plan Competition",
        place: "BIT Mesra",
        period: "2024",
        detail:
          "Pitched an external GPU enclosure for laptops addressing weight, battery life and cost; won a cash prize of INR 10,000.",
      },
      {
        type: "leadership",
        role: "Core Team Member, Events Management",
        place: "Bitotsav 2025 · BIT Mesra",
        period: "2025",
        detail:
          "Helped organise and run 20+ events across multiple venues, coordinating a team of 10+ volunteers for the campus cultural fest.",
      },
    ] satisfies ExperienceEntry[],
    /**
     * TODO(content): add certifications or current courses here. The strip is
     * hidden automatically while this array is empty.
     * Example: { name: "...", issuer: "...", year: "2026", href: "..." }
     */
    certifications: [] as CertificationEntry[],
  },

  resume: {
    intro:
      "One page covering education, selected projects, technical skills, an award and leadership experience.",
    url: "./resume.pdf",
    downloadName: "Abhed_Srivastava_Resume.pdf",
    bounty: "฿ 40% · 0.837 · 9.9%",
    facts: [
      { label: "Focus", value: "Data engineering · Analytics · Applied AI" },
      { label: "Based", value: "Ranchi, India" },
      { label: "Format", value: "PDF · one page" },
    ],
  },

  contact: {
    intro: "The fastest ways to reach me for data, analytics and AI work.",
    links: [
      {
        label: "Email",
        value: "abhed8604@gmail.com",
        href: "mailto:abhed8604@gmail.com",
      },
      {
        label: "LinkedIn",
        value: "linkedin.com/in/abhed-srivastava",
        href: "https://www.linkedin.com/in/abhed-srivastava",
      },
      {
        label: "GitHub",
        value: "github.com/abhed8604",
        href: "https://github.com/abhed8604",
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
