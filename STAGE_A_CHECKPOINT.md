# Stage A checkpoint — 6 November 2026

Stage A covers content, layout, typography, behaviour and correctness. Artwork work is blocked until the owner approves this checkpoint.

## Verification

- `npm run check` — passes.
- `npm run build` — passes; only the existing Three.js chunk-size warning.
- `npm run check:resume` — passes.
- `npm run test` — passes.
- `npm run qa` — 40 screenshots; only expected no-WebGL fallback console messages.
- `npm run quick-check` — passes; Experience fits at 1366×768 and 1440×900.
- `npm run interaction-check` — passes, including the Experience detail panel and Education footer clearance.
- Screenshot settled signal: `body[data-led-state="settled"]`, with an 8-second loud failure in the capture scripts.
- Desktop and mobile audits: no visible text below 12px/13px, no horizontal overflow.

## Screenshots

- Current 40-shot matrix: `/tmp/opencode/stagea-final4`.
- Hidden states: `/tmp/opencode/stagea-hidden`.
- Browsable contact sheets and individual PNGs: `/home/abhed/Pictures/LED Grand Line Stage A/`.

## Resume parity table

`src/resume.ts` is the canonical November 2026 source. Desktop chapters, mobile flow, Quick View and `public/resume.pdf` all derive from it.

| Resume fact | Where it appears | Status |
| --- | --- | --- |
| Abhed Srivastava | Header, hero, About, mobile hero, Quick View, PDF | OK |
| Delhi, India | Hero status, About facts, Contact, mobile, Quick View, PDF | OK |
| abhed8604@gmail.com | Contact link, Quick View contact, PDF | OK |
| github.com/abhed8604 | Contact, project links, warehouse link, Quick View, PDF | OK |
| linkedin.com/in/abhed-srivastava | Contact, Quick View, PDF | OK; owner to confirm URL resolves |
| B.Tech 2027 · Delhi, India · Seeking operations and supply chain analytics roles | Home, About, Contact, mobile flow, Quick View | OK |
| Final-year Mechanical Engineering student at BIT Mesra (2027) with hands-on projects in inventory optimization, Monte Carlo simulation, and SQL/Power BI analytics | About lead, mobile/Quick View About | OK |
| Built an inventory plan that raised simulated weekly profit by 9.9% under demand uncertainty | About body, mobile/Quick View About, Inventory project | OK |
| Seeking operations and supply chain analytics roles | Status line and PDF summary | OK |
| Birla Institute of Technology (BIT), Mesra | Education, mobile/Quick View Education, PDF | OK |
| 2023 – 2027 (Expected) | Education, mobile/Quick View Education, PDF | OK |
| B.Tech Mechanical Engineering | Education, mobile/Quick View Education, PDF | OK |
| CGPA 8.0/10 | Education, mobile/Quick View Education, PDF | OK |
| Data Structures & Algorithms | Education coursework chip, mobile/Quick View, PDF | OK |
| Database Management Systems | Education coursework chip, mobile/Quick View, PDF | OK |
| Object-Oriented Programming | Education coursework chip, mobile/Quick View, PDF | OK |
| Data Analyst Intern, Madhav Constech Private Limited | Experience, mobile/Quick View Experience, PDF | OK |
| May 2026 – Jul 2026 | Experience date, mobile/Quick View, PDF | OK |
| Enterprise Data Warehouse and Analytics Pipeline | Experience detail, mobile/Quick View, PDF | OK |
| 2 external ERP and CRM sample datasets | Experience detail and static Experience, PDF | OK |
| Automated ETL in Bronze, Silver and Gold layers | Experience detail and static Experience, PDF | OK |
| T-SQL cleaning/normalizing/loading into a star schema | Experience detail and static Experience, PDF | OK |
| 40% analytical query performance improvement | Experience metric, detail, mobile/Quick View, PDF | OK |
| Power BI dashboards across customer behavior, product performance and sales trends | Experience detail and static Experience, PDF | OK |
| 15+ metrics | Experience metric, detail, mobile/Quick View, PDF | OK |
| Inventory Optimization Under Demand Uncertainty | Projects index, detail, mobile/Quick View, PDF | OK |
| Jun 2026 | Projects date, mobile/Quick View, PDF | OK |
| Python, Linear Programming, NumPy, Monte Carlo Simulation, Matplotlib | Projects detail, mobile/Quick View, PDF | OK |
| 6 SKUs; USD 6,000 budget; 350 sq. ft. storage | Projects detail, mobile/Quick View, PDF | OK |
| 5,000 Monte Carlo simulations | Projects metric/detail, mobile/Quick View, PDF | OK |
| 9.9% higher average weekly profit | Projects metric/detail, mobile/Quick View, PDF | OK |
| 15.9 point service-level improvement | Projects metric/detail, mobile/Quick View, PDF | OK |
| Business AI Agent: Multi-Agent Reasoning & Analysis | Projects index, detail, mobile/Quick View, PDF | OK |
| Mar 2026 | Projects date, mobile/Quick View, PDF | OK |
| Python, LangChain, LangGraph, LLMs, RAG, FAISS, SQLite, Streamlit | Projects detail, mobile/Quick View, PDF | OK |
| LLM supervisor routing to three agents: SQL, RAG and web search | Projects detail, mobile/Quick View, PDF | OK |
| SQL-agent retries using query error messages; FAISS retrieval; LangGraph checkpointing | Projects detail, mobile/Quick View, PDF | OK |
| Streamlit interface and unit tests | Projects detail, mobile/Quick View, PDF | OK |
| Customer Churn Analytics & Predictive Modeling | Projects index, detail, mobile/Quick View, PDF | OK |
| Nov 2025 | Projects date, mobile/Quick View, PDF | OK |
| Python, Pandas, NumPy, SciPy, scikit-learn, XGBoost, SHAP | Projects detail, mobile/Quick View, PDF | OK |
| 7,043 Telco customers | Projects metric/detail, mobile/Quick View, PDF | OK |
| Chi-square, Welch's t-test, ANOVA with Tukey HSD | Projects detail, mobile/Quick View, PDF | OK |
| 42.7% vs 2.8% churn | Projects metric/detail, mobile/Quick View, PDF | OK |
| Non-overlapping 95% confidence intervals | Projects detail, mobile/Quick View, PDF | OK |
| 0.837 ROC-AUC | Projects metric/detail, mobile/Quick View, PDF | OK |
| SHAP feature corroboration | Projects detail, mobile/Quick View, PDF | OK |
| Prioritize month-to-month retention | Projects detail, mobile/Quick View, PDF | OK |
| Languages: Python, SQL, T-SQL, C++, Bash | Skills, mobile/Quick View Skills, PDF | OK |
| Data & Analytics: Excel, Power BI, Pandas, NumPy, SciPy, Matplotlib, ETL, Data Modeling, Linear Programming | Skills, mobile/Quick View Skills, PDF | OK |
| Databases: PostgreSQL, MySQL, SQLite | Skills, mobile/Quick View Skills, PDF | OK |
| Machine Learning: scikit-learn, XGBoost, SHAP | Skills, mobile/Quick View Skills, PDF | OK |
| LLMs & GenAI: LangChain, LangGraph, RAG, FAISS | Skills, mobile/Quick View Skills, PDF | OK |
| Developer Tools: Git, GitHub, Docker, Linux, FastAPI, Streamlit | Skills, mobile/Quick View Skills, PDF | OK |
| Winner, B-Plan Competition, BIT Mesra, 2024 | Experience, mobile/Quick View Experience, PDF | OK |
| INR 10,000; external laptop GPU enclosure; weight, battery life and cost | Experience, mobile/Quick View Experience, PDF | OK |
| Core Team Member, Events Management, Bitotsav, 2025 | Experience, mobile/Quick View Experience, PDF | OK |
| 10+ volunteers; 20+ events across multiple venues | Experience, mobile/Quick View Experience, PDF | OK |
| November 2026 resume update | Resume chapter meta, mobile/Quick View Resume, PDF footer | OK |
| No phone number | All site surfaces and PDF | OK — intentionally omitted |

## TODO(content)

1. **Individual project repository/demo URLs** — the resume only supplies `[GitHub]`; the site currently links all three projects and the warehouse to the real GitHub profile. Replace them when the owner provides exact URLs.
2. **LinkedIn URL confirmation** — `LINKEDIN_URL` currently points to `linkedin.com/in/abhed-srivastava`; the owner will confirm it resolves before launch.
3. **Owner copy of the November PDF** — no external November PDF file was supplied. `public/resume.pdf` is generated from `RESUME_SOURCE` by `npm run resume:pdf`; replace it with the owner's exact file if the original layout must be preserved.
4. **Optional certifications** — the source resume has no certifications section. The empty strip remains hidden and can be populated later.

## Stage B status

Blocked. Do not start artwork changes until the owner replies `approved` to this checkpoint.
