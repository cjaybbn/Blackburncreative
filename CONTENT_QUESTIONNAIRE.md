# Portfolio content questionnaire

Fill in answers **exactly as they may appear on the site** (or note “remove” / “private”). The site should not state metrics, awards, dates, employer names, or collaborations that are not backed by your resume or other materials you provide.

Return this file (or the same sections in a message) when you want copy synced to source documents.

---

## Global identity (`SITE_DATA`)

| Field | Your answer |
| --- | --- |
| `fullName` (legal / schema) | |
| `name` (display) | |
| `tagline` | |
| `heroMono` (hero eyebrow line) | |
| `email` | |
| `phone` | |
| `location` | |
| `school` (full line, e.g. degree + institution) | |
| `graduation` (e.g. month/year or “expected …”) | |

---

## Home: intro & philosophy

| Field | Your answer |
| --- | --- |
| **Intro** (`intro`): 2–4 short paragraphs — role, active projects, how you use AI, education, what you’re looking for next | |
| **AI philosophy** — paragraph 1 | |
| **AI philosophy** — paragraph 2 | |
| **AI philosophy** — paragraph 3 | |

---

## Practice pillars (`practicePillars`)

For each pillar: **title** + **description** (2–4 sentences max).

1. Entrepreneurship  
2. Systems architecture  
3. Technical innovation  
4. Creative excellence  

---

## Design work grid (`designWork`)

For each row you want shown: **title** + **description** (or list rows to hide).

---

## Skills (`skills`)

For each category: list **items** (comma-separated or bullets). Categories today: Product, AI Tools, Development, Design — change names if needed.

---

## Professional work list (`professionalWork`)

Per project:

| Client / product | Role | Context line | Short description | Tags (list) | Status label | Case study on site? (y/n) |

Include any **employment** rows that should appear here or in a separate “Experience” section if you add one later.

---

## Case studies (`caseStudyById`)

For **each** study (`realcopy`, `dealerdeck`, `birdseye`, `polytechnic`, `tedx`, `southwest`):

- **Name** (display)
- **Status** line (e.g. Beta — TestFlight)
- **Short description** (hero blurb)
- **Stack** (ordered list, exact strings)
- **Process** — 5 rows: for each phase, the **phase label** + **detail** paragraph (factual only)
- **Process detail panel** — 5 rows: for each, **title** + **detail**. Optional: if you have a **verified** metric, give **stat** (text or number), **statLabel**, and say whether to use `statValue` (number) / `statPrefix` / `statSuffix` / `statEntranceScale`; otherwise omit metrics (`omitMetric: true` is the default on the site today).

**RealCopy / DealerDeck only:** list **integrations, APIs, and platforms** as actually used in production (no extras).

**BirdsEye:** projects you may name publicly; **accuracy claims** only with survey/GCP documentation.

**Polytechnic:** official names for grid/Mother Shape; **stakeholder counts** only if approved.

**TEDx / Southwest:** **deliverable counts**, review cycles, and **KPIs** only with evidence.

---

## On-page sections (home)

If you use scroll targets or CTAs, confirm section **ids** and any **button labels** that should change:

- Hero CTA copy (if any beyond existing)
- Featured case block (DealerDeck) — headline, subcopy, button text
- “Work” grid intro line
- Contact section headline + closing paragraph (roles you want, timeline)

---

## SEO & structured data (`src/seoConstants.js`)

| Page | Meta title | Meta description |
| --- | --- | --- |
| Home (`/`) | | |
| Work (`/work`) | | |
| Lightpainting (`/lightpainting`) | | |

**JSON-LD (`HOME_JSON_LD_GRAPH`):**

- **Person** `jobTitle`, `description`, `knowsAbout` (list)
- **RealCopy** `description`
- **DealerDeck** `description`
- **BirdsEye** `description`, `areaServed` (if still “US” or narrower)

---

## Assets & links

| Item | URL or file |
| --- | --- |
| Canonical resume (PDF) | |
| LinkedIn | |
| Behance / other portfolios | |
| RealCopy / DealerDeck public URLs (if any) | |

---

## Notes

- Prefer **past tense** for completed roles and **present** for ongoing work, matching your resume.
- If something is **under NDA**, write the safe public version here so the site never overshares.
