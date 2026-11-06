/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LED GRAND LINE — RESUME SOURCE OF TRUTH
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every resume fact lives here once. `content.ts` turns this data into the
 *  eight chapters, the mobile document and Quick View. The check:resume script
 *  verifies the rendered Quick View against RESUME_SOURCE.
 *
 *  public/resume.pdf is generated from the block below via
 *  `npm run resume:pdf`; regenerate it whenever these facts change.
 *  TODO(content): replace the GitHub profile links on project cards with the
 *  individual repository URLs once they are available. Do not invent them.
 */

export const RESUME_UPDATED = "November 2026";

export const GITHUB_URL = "https://github.com/abhed8604";
export const LINKEDIN_URL = "https://www.linkedin.com/in/abhed-srivastava";

export const RESUME_SOURCE = `
Abhed Srivastava
Delhi, India
abhed8604@gmail.com
github.com/abhed8604
linkedin.com/in/abhed-srivastava

Summary
Final-year Mechanical Engineering student at BIT Mesra (2027) with hands-on projects in inventory optimization, Monte Carlo simulation, and SQL/Power BI analytics. Built an inventory plan that raised simulated weekly profit by 9.9% under demand uncertainty. Seeking operations and supply chain analytics roles.

Education
Birla Institute of Technology (BIT), Mesra, 2023 - 2027 (Expected)
B.Tech Mechanical Engineering, CGPA 8.0/10
Relevant coursework: Data Structures & Algorithms, Database Management Systems, Object-Oriented Programming.

Experience
Data Analyst Intern, Madhav Constech Private Limited, May 2026 - Jul 2026
Intern Training Project: Enterprise Data Warehouse and Analytics Pipeline [GitHub]
Designed a SQL Server data warehouse using 2 external ERP and CRM sample datasets, loaded through automated ETL pipelines organized in Bronze, Silver and Gold layers.
Wrote T-SQL scripts to clean, normalize and load the data into a star schema, improving analytical query performance by 40% compared with querying the raw source tables.
Developed Power BI dashboards on top of SQL aggregations, covering customer behavior, product performance and sales trends across 15+ metrics.

Projects
Inventory Optimization Under Demand Uncertainty [GitHub], Jun 2026
Python, Linear Programming, NumPy, Monte Carlo Simulation, Matplotlib
Developed a piecewise-linear program to maximize expected profit across 6 SKUs under uncertain demand, within a USD 6,000 budget and 350 sq. ft. of storage.
Evaluated the plan against a mean-demand baseline in 5,000 Monte Carlo simulations: average weekly profit rose 9.9% and service level improved by 15.9 points.

Business AI Agent: Multi-Agent Reasoning & Analysis [GitHub], Mar 2026
Python, LangChain, LangGraph, LLMs, RAG, FAISS, SQLite, Streamlit
Designed a multi-agent system where an LLM supervisor routes natural-language questions to three agents: SQL, document retrieval (RAG) and web search.
Implemented SQL-agent retries using query error messages, FAISS-based retrieval and LangGraph checkpointing for multi-turn memory; added a Streamlit interface and unit tests.

Customer Churn Analytics & Predictive Modeling [GitHub], Nov 2025
Python, Pandas, NumPy, SciPy, scikit-learn, XGBoost, SHAP
Analyzed the public Telco churn dataset (7,043 customers) using chi-square tests, Welch's t-test and ANOVA with Tukey HSD.
Month-to-month contracts churned at 42.7% versus 2.8% for two-year contracts, with non-overlapping 95% confidence intervals.
Compared logistic regression, random forest and XGBoost, reaching 0.837 ROC-AUC, and used SHAP to check that the model's top features matched the statistical findings.
Recommended prioritizing retention efforts on month-to-month customers, the highest-churn segment.

Skills
Languages: Python, SQL, T-SQL, C++, Bash.
Data & Analytics: Excel, Power BI, Pandas, NumPy, SciPy, Matplotlib, ETL, Data Modeling, Linear Programming.
Databases: PostgreSQL, MySQL, SQLite.
Machine Learning: scikit-learn, XGBoost, SHAP.
LLMs & GenAI: LangChain, LangGraph, RAG, FAISS.
Developer Tools: Git, GitHub, Docker, Linux, FastAPI, Streamlit.

Achievements & Leadership
Winner, B-Plan Competition, BIT Mesra, 2024: won INR 10,000 for pitching an external laptop GPU enclosure that addresses weight, battery life and cost.
Core Team Member, Events Management, Bitotsav, 2025: coordinated 10+ volunteers to deliver 20+ events across multiple venues.
`;

export interface ResumeMetric {
  value: string;
  label: string;
}

export interface ResumeProject {
  id: string;
  title: string;
  short: string;
  date: string;
  description: string;
  problem: string;
  approach: string;
  result: string;
  metrics: ResumeMetric[];
  tech: string[];
  links: { label: string; href: string }[];
}

export interface ResumeExperience {
  type: "internship" | "achievement" | "leadership";
  role: string;
  place: string;
  period: string;
  detail: string;
  bullets?: string[];
  metrics?: ResumeMetric[];
  projectId?: string;
  links?: { label: string; href: string }[];
}

export const resume = {
  name: "Abhed Srivastava",
  displayName: "ABHED SRIVASTAVA",
  location: "Delhi, India",
  email: "abhed8604@gmail.com",
  githubUrl: GITHUB_URL,
  linkedinUrl: LINKEDIN_URL,
  role: "Data engineering · Operations analytics · Applied AI",
  status: "B.Tech 2027 · Delhi, India · Seeking operations and supply chain analytics roles",
  tagline: "Data systems and AI tools for clearer decisions.",
  summary:
    "Final-year Mechanical Engineering student at BIT Mesra (2027) with hands-on projects in inventory optimization, Monte Carlo simulation, and SQL/Power BI analytics. Built an inventory plan that raised simulated weekly profit by 9.9% under demand uncertainty. Seeking operations and supply chain analytics roles.",
  education: {
    institution: "Birla Institute of Technology (BIT), Mesra",
    qualification: "B.Tech Mechanical Engineering",
    period: "2023 – 2027 (Expected)",
    cgpa: "8.0/10",
    coursework: [
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Object-Oriented Programming",
    ],
  },
  internship: {
    type: "internship",
    role: "Data Analyst Intern",
    place: "Madhav Constech Private Limited",
    period: "May 2026 – Jul 2026",
    detail:
      "Built the enterprise data warehouse and analytics pipeline that turned two sample ERP and CRM datasets into a Bronze–Silver–Gold star schema and Power BI dashboards.",
    bullets: [
      "Designed a SQL Server data warehouse using 2 external ERP and CRM sample datasets, loaded through automated ETL pipelines organized in Bronze, Silver and Gold layers.",
      "Wrote T-SQL scripts to clean, normalize and load the data into a star schema, improving analytical query performance by 40% compared with querying the raw source tables.",
      "Developed Power BI dashboards on top of SQL aggregations, covering customer behavior, product performance and sales trends across 15+ metrics.",
    ],
    metrics: [
      { value: "40%", label: "faster queries" },
      { value: "15+", label: "metrics" },
      { value: "Bronze / Silver / Gold", label: "ETL layers" },
    ],
    projectId: "enterprise-warehouse",
  } satisfies ResumeExperience,
  achievements: [
    {
      type: "achievement",
      role: "Winner, B-Plan Competition",
      place: "BIT Mesra",
      period: "2024",
      detail:
        "Won INR 10,000 for pitching an external laptop GPU enclosure that addresses weight, battery life and cost.",
    },
    {
      type: "leadership",
      role: "Core Team Member, Events Management",
      place: "Bitotsav 2025 · BIT Mesra",
      period: "2025",
      detail: "Coordinated 10+ volunteers to deliver 20+ events across multiple venues.",
    },
  ] satisfies ResumeExperience[],
  warehouse: {
    id: "enterprise-warehouse",
    title: "Enterprise Data Warehouse and Analytics Pipeline",
    short: "A SQL Server warehouse and Power BI layer for ERP and CRM analytics.",
    date: "May 2026 – Jul 2026",
    description:
      "Designed a SQL Server data warehouse using 2 external ERP and CRM sample datasets, loaded through automated ETL pipelines organized in Bronze, Silver and Gold layers. Wrote T-SQL scripts to clean, normalize and load the data into a star schema, improving analytical query performance by 40%, and developed Power BI dashboards covering customer behavior, product performance and sales trends across 15+ metrics.",
    problem:
      "ERP and CRM sample data had to become a reliable analytical layer without querying raw source tables directly.",
    approach:
      "Designed a SQL Server data warehouse using 2 external ERP and CRM sample datasets, with automated ETL pipelines organized in Bronze, Silver and Gold layers, and T-SQL transformations into a star schema.",
    result:
      "Improved analytical query performance by 40% compared with querying the raw source tables, and developed Power BI dashboards spanning 15+ customer, product and sales metrics.",
    metrics: [
      { value: "40%", label: "faster queries" },
      { value: "15+", label: "metrics" },
      { value: "Bronze / Silver / Gold", label: "ETL layers" },
    ],
    tech: ["SQL Server", "T-SQL", "ETL", "Data Modeling", "Power BI"],
    links: [{ label: "GitHub", href: GITHUB_URL }],
  } satisfies ResumeProject,
  projects: [
    {
      id: "inventory-optimization",
      title: "Inventory Optimization Under Demand Uncertainty",
      short: "A piecewise-linear program and Monte Carlo model for ordering under uncertainty.",
      date: "Jun 2026",
      description:
        "Developed a piecewise-linear program to maximize expected profit across 6 SKUs under uncertain demand, within a USD 6,000 budget and 350 sq. ft. of storage. Evaluated the plan against a mean-demand baseline in 5,000 Monte Carlo simulations: average weekly profit rose 9.9% and service level improved by 15.9 points.",
      problem:
        "Ordering across 6 SKUs had to maximize expected profit under uncertain demand, within a USD 6,000 budget and 350 sq. ft. of storage.",
      approach:
        "Developed a piecewise-linear program and evaluated it against a mean-demand baseline in 5,000 Monte Carlo simulations.",
      result:
        "Average weekly profit rose 9.9% and service level improved by 15.9 points over the mean-demand baseline.",
      metrics: [
        { value: "+9.9%", label: "weekly profit" },
        { value: "+15.9 pt", label: "service level" },
        { value: "5,000", label: "simulations" },
      ],
      tech: ["Python", "Linear Programming", "NumPy", "Monte Carlo Simulation", "Matplotlib"],
      links: [{ label: "GitHub", href: GITHUB_URL }],
    },
    {
      id: "business-ai-agent",
      title: "Business AI Agent: Multi-Agent Reasoning & Analysis",
      short: "A supervisor that routes questions to SQL, RAG or web search.",
      date: "Mar 2026",
      description:
        "Designed a multi-agent system where an LLM supervisor routes natural-language questions to three agents: SQL, document retrieval (RAG) and web search. Implemented SQL-agent retries using query error messages, FAISS-based retrieval and LangGraph checkpointing for multi-turn memory; added a Streamlit interface and unit tests.",
      problem:
        "Natural-language business questions needed routing across structured data, documents and the web.",
      approach:
        "Designed a multi-agent system where an LLM supervisor routes natural-language questions to three agents: SQL, document retrieval (RAG) and web search. Implemented SQL-agent retries using query error messages, FAISS-based retrieval and LangGraph checkpointing for multi-turn memory.",
      result:
        "Added a Streamlit interface and unit tests to the working multi-agent system.",
      metrics: [
        { value: "3", label: "agents: SQL · RAG · web" },
        { value: "LangGraph", label: "memory" },
      ],
      tech: ["Python", "LangChain", "LangGraph", "LLMs", "RAG", "FAISS", "SQLite", "Streamlit"],
      links: [{ label: "GitHub", href: GITHUB_URL }],
    },
    {
      id: "customer-churn",
      title: "Customer Churn Analytics & Predictive Modeling",
      short: "Statistical drivers and predictive models for 7,043 customers.",
      date: "Nov 2025",
      description:
        "Analyzed the public Telco churn dataset (7,043 customers) using chi-square tests, Welch's t-test and ANOVA with Tukey HSD. Month-to-month contracts churned at 42.7% versus 2.8% for two-year contracts, with non-overlapping 95% confidence intervals. Compared logistic regression, random forest and XGBoost, reaching 0.837 ROC-AUC, and used SHAP to check that the model's top features matched the statistical findings.",
      problem:
        "Identify the statistical drivers of customer churn and build a predictive model for the public Telco churn dataset.",
      approach:
        "Analyzed 7,043 customers using chi-square tests, Welch's t-test and ANOVA with Tukey HSD; compared logistic regression, random forest and XGBoost; used SHAP to check that the model's top features matched the statistical findings.",
      result:
        "Month-to-month contracts churned at 42.7% versus 2.8% for two-year contracts, with non-overlapping 95% confidence intervals. The models reached 0.837 ROC-AUC, and SHAP corroborated the statistical drivers.",
      metrics: [
        { value: "42.7% vs 2.8%", label: "churn" },
        { value: "0.837", label: "ROC-AUC" },
        { value: "7,043", label: "customers" },
      ],
      tech: ["Python", "Pandas", "NumPy", "SciPy", "scikit-learn", "XGBoost", "SHAP"],
      links: [{ label: "GitHub", href: GITHUB_URL }],
    },
  ] satisfies ResumeProject[],
  skills: [
    { label: "Languages", items: ["Python", "SQL", "T-SQL", "C++", "Bash"] },
    {
      label: "Data & Analytics",
      items: [
        "Excel",
        "Power BI",
        "Pandas",
        "NumPy",
        "SciPy",
        "Matplotlib",
        "ETL",
        "Data Modeling",
        "Linear Programming",
      ],
    },
    { label: "Databases", items: ["PostgreSQL", "MySQL", "SQLite"] },
    { label: "Machine Learning", items: ["scikit-learn", "XGBoost", "SHAP"] },
    { label: "LLMs & GenAI", items: ["LangChain", "LangGraph", "RAG", "FAISS"] },
    {
      label: "Developer Tools",
      items: ["Git", "GitHub", "Docker", "Linux", "FastAPI", "Streamlit"],
    },
  ],
} as const;
