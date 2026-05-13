# Site content master document

Edit this file, then share it (or the changed sections) so the codebase can be updated to match.

**Conventions**

- Paragraphs that span multiple lines in the site use a single block here; use blank lines only between distinct fields.
- **Do not** change section headers like `### Home — Hero` unless you are reorganizing; they map to implementation areas.
- Image paths and URLs are listed for reference; change the caption/alt text in the matching fields.
- Case study **process** steps must stay five rows (phase + detail) unless you explicitly ask to add/remove steps.

---

## Global SEO & structured data (`src/seoConstants.js`)

### Home (`/`)

- **Meta title:** Camden J Blackburn | Product Manager & AI Builder
- **Meta description:** Senior GIT student at ASU and founder of RealCopy and DealerDeck. Focused on bridging the gap between human-centered UX and full-stack execution through AI-powered tools and automotive design.

### Work gallery (`/work`)

- **Meta title:** Selected Work & Case Studies | Camden J Blackburn
- **Meta description:** Case studies for apps, campus branding, TEDx and print clients, with Behance embeds where the full decks live.

### Lightpainting (`/lightpainting`)

- **Meta title:** Automotive Lightpainting Gallery | Camden J Blackburn
- **Meta description:** Long-exposure car meet photography—tripod, light bar, editing—gallery of lightpainting studies.

### JSON-LD (home page `HOME_JSON_LD_GRAPH` — high-level strings)

- **Person — jobTitle:** Product Manager & AI Builder
- **Person — description:** Founder of RealCopy and DealerDeck LLC; Senior at ASU Polytechnic focusing on Graphic Information Technology and UX. FAA Certified Drone Pilot and automotive enthusiast.
- **Person — knowsAbout (list):** Product Strategy; UX Design; React Native; AI Prompt Engineering; Drone Orthomosaic Mapping; Brand Identity
- **RealCopy (SoftwareApplication) — description:** iPhone app for realtors: mobile-first flow with Rentcast, Google Places, and Gemini—core tasks in under three taps (TestFlight beta).
- **DealerDeck (SoftwareApplication) — description:** Voice-led showroom tool from BMW North Scottsdale: BMW trim/zone tables so AI summaries match dealership language; CRM sync in seconds (DealerDeck LLC).
- **BirdsEye (ProfessionalService) — description:** Drone orthomosaics and 3D for job sites, packaged as maps stakeholders can actually use in meetings.
- **CreativeWork — ASU Polytechnic Design System — description:** Polytechnic TPS system rooted in TEM’s need for non-generic ASU branding: hex isometric grid, Mother Shape family, templates, solo career advisory board presentation.
- **CreativeWork — ASU Polytechnic — url:** https://www.behance.net/gallery/249030461/TPS-Design-System-Proposal-Design-Agency
- **CreativeWork — ASU Polytechnic — image URL:** https://blackburncreativestudio.com/MeSpeaking.jpg
- **CreativeWork — ASU design agency class — description:** Cohort photo from ASU’s application-only GIT agency studio, including TEDx Faurot Park and Southwest Label client work.
- **CreativeWork — agency class — image URL:** https://blackburncreativestudio.com/TPSgrouppic.jpg

---

## Navigation (`src/Nav.jsx`)

- **Logo alt:** CB
- **Links:** Home | Work | Contact
- **Mobile menu:** Open menu | Close menu

---

## App shell (`src/main.jsx`)

- **Route loading fallback text:** Loading…

### Static HTML fallback (`index.html`)

- **Default `<title>` (before JS):** Camden J Blackburn | Product Manager & AI Builder
- **Default meta description:** Same as SEO home meta description (kept in sync manually).

---

# Page: Home (`/` — `src/App.jsx`)

Data lives mainly in `SITE_DATA` at the top of `App.jsx`. Labels below show **section → field → current text**.

## Hero (`#about` — section id on page is `#bio` for the About block; hero has no id)

- **Eyebrow (composed):** `{location}` / `{school before em dash}`  
  - location: Scottsdale, AZ  
  - school line (full in Identity): Arizona State University — B.S. Graphic Information Technology  
- **Name (H1):** Camden Blackburn
- **Tagline:** Vision-driven Product Manager and AI Builder bridging the gap between human-centered UX and technical execution.
- **Hero mono line:** PRODUCT · DESIGN · AI SYSTEMS · AUTOMOTIVE
- **Primary CTA:** Get in touch (mailto)
- **Secondary CTA:** Case studies → (scroll to `#experience`)
- **Tertiary CTA:** Gallery (`/work`)
- **Quaternary CTA:** Resume ↓ (`/Resume.pdf`)
- **Portrait image path:** /headshot.png
- **Portrait alt:** Camden Blackburn

## About section (`#bio`)

- **Section label:** The Approach (`SITE_DATA.aboutSectionLabel`)
- **Body:** Five paragraphs from `SITE_DATA.intro` (split on blank lines), then `SITE_DATA.aboutGraduationLine`. *(No separate resume-summary paragraph under About.)*
- **Intro — paragraph 1:** My work lives at the intersection of what I see in the field and what I can build at a keyboard. I don’t believe in building software in a vacuum. RealCopy started by talking to real estate agents about their fragmented workflows while I was already on-site doing drone mapping and photography. When I hit the limits of no-code tools, I moved to a full Expo and Supabase stack using AI to accelerate the build without sacrificing the "human" feel of the UX.
- **Intro — paragraph 2:** DealerDeck came directly from my time on the floor at BMW North Scottsdale. I watched sales reps struggle to balance customer face-time with the administrative weight of CRM logging. I’m building a voice-first solution that turns a quick walk-around into structured data, ensuring the CRM stays updated without the rep ever having to leave the showroom floor.
- **Intro — paragraph 3:** At ASU Polytechnic, I’ve moved from being a student to a project manager. Leading the TPS design system for the TEM program taught me how to manage stakeholders and steer a cross-functional team toward a cohesive vision. It wasn't just about a logo; it was about creating a system that future cohorts could actually use and scale.
- **Intro — paragraph 4:** When I'm not shipping code, I'm usually behind a lens or under a hood. Whether it's lightpainting a ZL1 at a midnight meet or experimenting with high-performance modifications on an E36 M3, I apply the same "relentless iteration" mindset to automotive photography and engineering as I do to my apps.
- **Intro — paragraph 5:** AI is my most effective collaborator. I use it to handle the boilerplate and bridge technical gaps, but the direction—the "why" behind the product—is always human-driven. If a tool doesn't solve a tangible problem for a user standing right in front of me, it isn't finished.
- **Graduation line:** Arizona State University — B.S. Graphic Information Technology (UX Focus) · Graduating August 2026

### Not on the home page (removed from earlier builds)

- There is **no** separate **Practice / pillars** section, **featured DealerDeck** strip, or **Design Work** card grid in current `App.jsx`. DealerDeck and other products appear under **Professional Work**. Still imagery lives on **`/work`** and **`/lightpainting`**.

## Professional Work (`#experience`)

- **Section label:** Professional Work
- **Heading:** Projects and Case Studies
- **Subheading (below heading):** Grouped by how the work happened—things I’m building myself, client studio semesters at ASU, and big branding rollouts.
- **Grouping:** `workCategoryGroups` render in this order: **Design Agency** → **Entrepreneurial** → **Branding**. Each group has a title, short description, then filtered `professionalWork` rows.
- **Design Agency — description:** Work from ASU’s GIT agency studio—you apply, they take a small cohort, and you’re on real client teams with deadlines and faculty critiques, not hypothetical briefs.
- **Entrepreneurial — description:** Products I started and still run: talking to users, wiring the stack, fixing what breaks, and re-cutting copy when testers tell me I’m wrong.
- **Branding — description:** Systems for my own apps plus client launches: AZHype (volleyball club through Cre8tive Influence—guidelines, social templates, collateral they still run today), and freelance marks for shops like Alara Aquatics.
- **Accordion aria pattern:** Expand case study: {client} / Collapse case study: {client}
- **Inline case study badge:** Case Study
- **Close button (expanded panel):** Close

### Work list row — RealCopy *(category: entrepreneurial)*

- client: RealCopy  
- role: Founder & Lead Product Builder  
- context: iPhone app · TestFlight  
- description: Spearheaded the 0-to-1 lifecycle of an AI marketing platform for realtors. Managed everything from initial user research to a TestFlight Beta launch, integrating 7+ APIs to turn a single address into a full market intelligence suite.  
- tags: React Native, Supabase, Beta  
- status: Beta  
- caseStudyId: realcopy  

### Work list row — DealerDeck LLC *(entrepreneurial)*

- client: DealerDeck LLC  
- role: Founder & Technical Lead  
- context: Dealership sales tools  
- description: A voice-led showroom intelligence tool born from BMW floor experience. It captures live transcripts and vehicle context, allowing reps to sync notes to the CRM in seconds instead of hours.  
- tags: Automotive, CRM, MVP  
- status: In Progress  
- caseStudyId: dealerdeck  

### Work list row — BirdsEye *(entrepreneurial)*

- client: BirdsEye  
- role: Technical Lead  
- context: Construction & sites  
- description: Fly the site, stitch an orthomosaic, and hand supers or owners a link they can open on a phone in the dirt—not a zip of random JPEGs.  
- tags: Drone, Pix4D, Web map  
- status: Case study  
- caseStudyId: birdseye  

### Work list row — ASU Polytechnic Design System *(branding)*

- client: ASU Polytechnic Design System  
- role: Project Manager & Brand Designer  
- context: ASU Polytechnic campus  
- description: Directed a cross-functional team to build a comprehensive brand system for the TEM program. Managed timelines and stakeholder reviews, ultimately presenting the 3D-inspired isometric grid system solo to the career advisory board.  
- tags: Campus signage, Figma library, Training  
- status: Completed  
- caseStudyId: polytechnic  

### Work list row — TEDx Faurot Park 2026 *(branding)*

- client: TEDx Faurot Park 2026  
- role: Lead Designer  
- context: Event branding · ASU GIT agency  
- description: Agency-studio cadence in FigJam and critiques; repeatable event pattern from the logo’s branch (AI exploration, then hand-finished art), plus programs, slides, and social templates.  
- tags: Pattern system, Print, Event  
- status: Completed  
- caseStudyId: tedx  

### Work list row — AZHype *(branding)*

- client: AZHype  
- role: Lead Designer  
- context: Cre8tive Influence · Volleyball club  
- description: Full identity for a funded volleyball club and training company—sole designer through Cre8tive Influence, live iteration with the owner, guidelines and launch collateral still in use.  
- tags: Identity, Guidelines, Launch  
- status: Completed  

### Work list row — Alara Aquatics *(branding)*

- client: Alara Aquatics  
- role: Freelance Designer  
- context: Family business · Branding  
- description: Logo and brand collateral for my dad’s company—tight scope, fast turnaround, files ready for web and print vendors.  
- tags: Logo, Freelance  
- status: Completed  

### Work list row — Southwest Label & Print *(agency)*

- client: Southwest Label & Print  
- role: Lead Designer  
- context: ASU GIT agency cohort  
- description: Rebrand and B2B web direction after shop-floor interviews—new mark, type, and clearer paths for quote requests.  
- tags: Print, Web, B2B  
- status: Completed  
- caseStudyId: southwest  

## AI & capabilities (`#process`)

- **Section label (left column):** How I Use AI  
- **Philosophy paragraph 1:** I view AI as a force multiplier. It allows me to act as a PM, designer, and developer simultaneously, accelerating the path from a "floor-side" observation to a functional prototype.
- *(Single paragraph in `SITE_DATA.aiPhilosophy.paragraphs` — no paragraph 2–3 in current build.)*

### AI chat bubble demo (`src/AIChatBubble.jsx` — rotating prompts)

Each row: **User prompt** | **Gemini response** *(abbreviated here; see source for full strings)*

1. Supabase session / magic-link race on cold start | …initialize before rendering…  
2. List re-render on scroll — memo + stable callbacks | …memo, useCallback, ref for scroll…  
3. Wire comps API — PropertyContext, 429 empty state | …adapter, backoff, retry CTA…  
4. Dealer note sync — voice capture vs CRM `customerId` | …queue save until roster resolves…  
5. TestFlight 0.4 release notes — agent-facing, no fluff | …bullet-style notes…  

- **Chat UI labels:** You | Gemini

### Capabilities marquees

- **Section label:** Capabilities
- **Marquee 1 label:** Strategy & AI  
  **Items:** **Product** + **AI & dev assist** from `SITE_DATA.skills`:
  - Product: Product Roadmap Planning; Prompt Engineering; Gemini/Vertex AI; User Research; Agile Development  
  - AI & dev assist: *(empty — all Strategy & AI items live under Product for this layout)*  
- **Marquee 2 label:** Build & Design  
  **Items:** Development: React Native; Expo; Supabase — Design: Figma; Adobe Creative Suite; FAA Drone Mapping  

## Contact (`#contact`)

- **Section label:** Get in touch
- **Heading (words):** Let's build something.
- **Body:** I am currently finishing my B.S. in Graphic Information Technology at ASU (graduating August 2026). If you're looking for a Product Manager who isn't afraid to get into the technical weeds or a builder who starts with the user, let’s talk. (`SITE_DATA.contactBody`)
- **Row labels:** Email | Phone | Location | Education
- **Education row value:** Arizona State University — B.S. Graphic Information Technology (UX Focus) · August 2026
- **Resume link text:** Download Resume (PDF)
- **Resume files:** Canonical PDF also at `/camden-blackburn-resume.pdf`; hero CTA uses `/Resume.pdf` (duplicate maintained by `npm run resume:pdf`).

## Footer

- **Left:** © 2026 Camden Blackburn
- **Right:** Built with AI, designed with intent.

## Identity block (SITE_DATA — used in multiple places)

- **fullName (legal / schema):** Camden J Blackburn
- **name (display):** Camden Blackburn
- **email:** Blackburncamden@gmail.com
- **phone:** (206) 321-6087
- **location:** Scottsdale, AZ
- **school:** Arizona State University — B.S. Graphic Information Technology (UX Focus)
- **graduation:** August 2026

---

## Case study layout chrome (`src/CaseStudyLayout.jsx`)

These apply to every case study panel unless overridden by props:

- **Tech stack heading:** Tech Stack
- **Process section heading:** Development Process

**Props from App:**

- Featured DealerDeck **badgeLabel:** Featured Project
- Accordion panels **badgeLabel:** Case Study

---

# Case studies (`SITE_DATA.caseStudyById`)

For each study: **name**, **status**, **description**, **stack** (comma-separated list), optional **figures** and **links**, then **process** (5× phase + detail), then **processDetails** (5× title + detail).  
*(Implementation may include `omitMetric: true` on details — you can omit that when editing this doc.)*

## realcopy

- **name:** RealCopy
- **status:** Beta — TestFlight
- **description:** An iPhone app built for the "in-between" moments of a realtor's day. I architected a mobile-first experience that optimizes complex data retrieval—pulling from Rentcast, Google Places, and Gemini—to ensure core tasks are completed in under three taps.
- **stack:** Expo / React Native, Supabase, Railway, Gemini API, Vertex AI, Google Places API, Rentcast API, Cursor AI
- **links:** App preview → https://realcopylanding.vercel.app/

**Process**

1. Problem — Realtors were losing hours to "context switching" between MLS data and AI writing tools. I saw the friction firsthand while shooting property videos.
2. Prototype — First pass in Glide to test flows; hit limits on layout, data modeling, and the API hooks I needed, so I stopped fighting the no-code shell.
3. Rebuild — Rebuilt in Expo with Cursor and Claude: own the UI, wire my own API bridges, and iterate prompts without a template ceiling.
4. Design — One property at a time, big type, obvious copy actions, room to edit before anything ships to a listing.
5. Ship — TestFlight builds; agents send screenshots when a line reads wrong or a comp looks off.

**Process detail panels (title — detail)**

1. Problem — Realtors were losing hours to context switching between MLS data and AI writing tools—I saw it while shooting property videos and in interviews.
2. Field use — Built for thumbs after open houses—dark mode, fast recall of the last property, no buried settings.
3. Accuracy — When Rentcast or Places hiccups, the UI says so. No blank state that looks like the model “forgot.”
4. Voice — Copy should sound like the agent, not a brochure generator; testers mark lines that could get them in trouble and I tighten prompts.
5. Ship — Widening beta only after repeated fixes on guardrails and source citations for numbers.

## dealerdeck

- **name:** DealerDeck LLC
- **status:** In Progress — pilot
- **description:** Developed at BMW North Scottsdale to solve the "I'll do the CRM later" problem. It uses domain-specific tables for BMW trims and zones to ensure the AI-generated summaries match the specific language of the dealership lot.
- **stack:** React Native, Supabase, Inventory APIs, Custom BMW reference tables, Cursor, Gemini, Live pilot feedback
- **links:** App preview → https://www.dealerdeckapp.com

**Process**

1. Problem — Note-taking and CRM updates slip when the next up is already walking over—voice memos and half-filled fields don’t help finance or follow-up.
2. Research — Worked the lot, watched how inventory is tracked, and asked which CRM fields actually get read vs which are checkbox theater.
3. Design — Voice capture with instant transcript, obvious edit/stop controls, and on-screen proof of what will sync so reps trust it over sticky notes.
4. Build — React Native client, Supabase where it helps, inventory API ingestion, domain tables for model/trim language, AI assist only for formatting—not for auto-texting customers.
5. Pilot — Rolling with real ups: GM and sales manager signed off, reps give weekly friction notes while I harden CRM export rules per store policy.

**Process detail panels**

1. Floor context — Started while parking cars and hearing “I’ll fix CRM later.” If it fails at the curb in front of a customer, the feature doesn’t ship.
2. Inventory truth — Tie answers to the same feeds the website uses, plus dealer-specific location naming, so “where’s that X3?” matches the lot map employees expect.
3. Voice pipeline — Record, watch text appear, trim mistakes, then generate summaries and tables reps can review—nothing silently posts to a client.
4. CRM boundary — The dealership CRM stays the system of record; the app prepares structured payloads and respects what compliance allows on-device vs server-side.
5. Status — Pilot users are active; leadership buy-in is there; next milestone is dependable CRM integrations instead of one-off exports.

## birdseye

- **name:** BirdsEye
- **status:** Case study
- **description:** Drone orthomosaic and 3D reconstruction for construction and site operations: flight planning, control-point discipline where used, and browser-based maps for field and office stakeholders.
- **stack:** Photogrammetry, Pix4D / ODM, GIS, Three.js / web GL, Python tooling

**Process**

1. Problem — Site documentation often lives in disconnected photos and static exports instead of a single map surface.
2. Research — Capture frequency, accuracy needs, and how teams review maps on site.
3. Design — Layered orthomosaics, measurement and comparison views, contrast suited to outdoor screens.
4. Build — Pipeline from capture to tiles and meshes; exports for CAD/GIS where required.
5. Deliver — Repeatable flight and QA notes per project, with client-facing packages as agreed.

**Process detail panels**

1. Accuracy — Where quantities or disputes matter, control points and camera checks back the orthomosaic before anyone bets a pay app on eyeballing tiles alone. The workflow leaves an explainable trail: what was flown, how it was referenced, and what assumptions still belong in a surveyor’s lane.
2. Cadence — Flight rhythm follows the job, not a calendar template: earthwork, vertical work, and closeout all need different evidence. Scheduling captures against phase milestones keeps the map aligned with what supers and owners are actually arguing about that week.
3. Stakeholders — Owners, GCs, subs, and safety leads ask different questions from the same ortho base. Layers, filters, and exports are tuned so each group gets legible answers without maintaining four unrelated photo dumps that drift out of sync.
4. 3D outputs — Meshes, contours, and derived linework support coordination and as-built documentation when the engagement calls for them—not as vanity reels, but as artifacts that plug into how the team already reviews work in CAD or GIS.
5. Field use — Review happens on phones and tablets in glare and dust, often with uneven connectivity. Interaction targets, contrast, and offline-tolerant viewing patterns are part of the product, not an afterthought mocked up only on a desktop monitor.

## polytechnic (TPS)

- **name:** ASU Polytechnic Design System (TPS)
- **status:** Completed
- **description:** Began when ASU’s Technology, Entrepreneurship, and Management (TEM) program wanted branding that didn’t read as generic ASU. Our professor pushed us past a one-off logo into a real design system so future cohorts couldn’t each invent a new look—we studied MIT-style systematic lab branding, iterated as a team, and landed on a hex-based isometric grid with a 3D-reading cuboid language. That framework scales to the whole Polytechnic while each program keeps a distinct mark inside the family. As project manager I built the grid, shaped the visual language and guidelines, ran timelines and critiques, and was the sole student presenter when we showed the system to employers and ASU faculty on the career advisory board.

**Figure**

- **src:** /MeSpeaking.jpg  
- **alt:** Camden Blackburn presenting the new ASU Polytechnic campus design system to ASU faculty and career board members  
- **caption:** Presenting the system to faculty and the career board—explaining how student work and official comms share the same grid.

**Link**

- **label:** TPS Design System on Behance  
- **href:** https://www.behance.net/gallery/249030461/TPS-Design-System-Proposal-Design-Agency

- **stack:** 6×6 isometric grid, Figma components, Signage specs, Printed templates, Faculty training decks

**Process**

1. Problem — TEM needed its own voice; without rules, every future class risked another mismatched flyer stack across Polytechnic.
2. Research — Audited what communications and facilities already published, compared MIT-style identity systems, and pressure-tested what a grid could enforce.
3. Design — Defined the hex isometric grid, Mother Shape relationships, color for Arizona outdoor media, and allowable remixes for student makers.
4. Build — Packaged Figma libraries, signage specs, InDesign/Canva templates, and training decks for partners.
5. Ship — Presented outcomes to the career advisory board, then handed off versioned zips and office hours so the system survives real use.

**Process detail panels**

1. Grid logic — The 6×6 iso grid is the pass/fail test: snap-to-grid means on-brand; anything floating gets sent back with a reference file.
2. Mother Shape — One modular silhouette language so each program feels related, not random—documented so Instagram posts match the yard signs.
3. PM load — Kept critiques, deadlines, and design direction aligned across teammates while still contributing hands-on art direction.
4. Stakeholders — Career board presentation meant translating the system for employers and faculty in one sitting—no hiding behind group slides.
5. Rollout — Boring filenames and version numbers so facilities, web, and clubs aren’t circulating mystery “final_FINAL” folders.

## tedx

- **name:** TEDx Faurot Park
- **status:** Completed
- **description:** 2026 TEDx Faurot Park while I was in ASU’s GIT agency cohort. I joined client meetings, worked in shared FigJam boards, and iterated through faculty critiques like any studio engagement. My sharpest contribution is the event pattern system: starting from the branch detail in the approved logo, I used AI to explore vine-like structures, picked the strongest directions, then redrew everything into a repeatable asset volunteers can scale without breaking alignment—alongside programs, slides, and social templates.

**Figure**

- **src:** /TPSgrouppic.jpg  
- **alt:** ASU design agency class group photo with Camden Blackburn and project team peers  
- **caption:** Agency class team photo—the same cohort that shipped TEDx and other client projects that semester.

- **stack:** Logo & lockups, Print programs, Slide master, Social templates

**Process**

1. Problem — Organizers needed one visual language for print, stage, and feed—with volunteers editing files days before showtime.
2. Collaboration — Standing meetings, FigJam brainstorms, and class critiques kept client feedback visible to the whole team.
3. Pattern — Translated the logo branch into a scalable vine motif via AI exploration, manual refinement, and repeat tests at small and large scales.
4. Design — Balanced two-color print defaults, legible social crops, and slide masters that non-designers could trust.
5. Deliver — Packaged bleed-ready PDFs, labeled template layers, and a short handoff so swaps (speakers, sponsors) didn’t break safe zones.

**Process detail panels**

1. Pattern rigor — AI drafts were references only—the shipping art is hand-tuned so tessellation and contrast hold on fabric and screens.
2. Tooling — FigJam for async ideas; Figma/Adobe for finals; everything named so organizers aren’t guessing which file is current.
3. Templates — Safe zones and locked type styles so a volunteer can’t accidentally shove sponsor marks into the trim.
4. Deliverables — Bundles grouped by milestone—promo sprint, week-of print, day-of social—so nobody opens the wrong archive at midnight.
5. Outcome — One coherent look on stage, in handouts, and online; next year’s team inherits the same structure with refreshed dates.

## southwest

- **name:** Southwest Label & Print
- **status:** Completed
- **description:** Full brand redesign for a legacy print shop: new mark, typography system, UX research on quote and reorder flows, and a website that reflects craft while converting B2B leads.
- **stack:** Brand, UX research, Web design, Print production

**Process**

1. Problem — Outdated identity and confusing web journey hid technical capabilities; enterprise buyers bounced before understanding services.
2. Research — Customer interviews, shop floor observation, and analytics on quote form abandonment.
3. Design — Logo system, color/type, component library for web; print swatch and proofing language aligned to production reality.
4. Build — Responsive site build in collaboration with dev; content model for capabilities and case snippets.
5. Ship — Rollout checklist: fleet graphics, stationery, and sales one-pagers — phased to production downtime.

**Process detail panels**

1. Research — Research mixed interviews and shop-floor observation with analytics on quote and reorder flows. The aim was to see where enterprise buyers lost confidence—usually not at the hero image, but at ambiguous capabilities, opaque timelines, or forms that demanded information they did not yet have.
2. Web — The site restructure foregrounds service taxonomy and a straighter path to “talk to us about this job,” with language that matches how customers describe work in email. Secondary pages carry proof: equipment, materials, and process cues that justify premium positioning without sounding generic.
3. Brand system — Logo, palette, typography, and voice live in a single reference for internal teams and outside vendors. That reduces one-off interpretations when fleet graphics, trade-show panels, or subcontractor sheets need to stay on brand under deadline pressure.
4. Print — Print specifications respect die lines, ink limits, and finishing steps the shop actually runs—so sales promises in the PDF match what production will sign off. Jargon on the floor is translated for customers without dumbing down the craft.
5. Rollout — Launch phases respect press downtime, fleet installation windows, and sales’ need for consistent story during the switch. Staggering stationery, digital, and vehicle updates avoids the half-old identity that undermines trust right when leads are peaking.

---

# Page: Work gallery (`/work` — `src/WorkGallery.jsx`)

## Header

- **Eyebrow:** Selected Work
- **H1:** Design & Photography
- **Subhead:** Photography from ASU and travel (including an IPA-shortlisted frame), brand systems like AZHype and my app identities, print pieces, and Behance case studies from the GIT agency studio.
- **Count suffix:** {N} pieces (N = number of WORK_ITEMS)

## Filter tabs (CATEGORIES)

- **Note:** There is no “All” tab—the gallery opens on **Photography** and each tab shows only that category. The header count reflects the active category (e.g. “6 in Photography”).
- Photography  
- Brand Identity  
- Print Design  
- Case Studies  

## Gallery / lightbox UI strings

- **Case study tile label:** Case Study Preview
- **Case study tile CTA:** Click to open →
- **Placeholder tile — line 1:** Add image
- **Placeholder tile — line 2:** {item title}
- **Featured badge (grid):** Featured
- **Featured badge (lightbox panel):** Featured Work
- **Polaroid back — date:** Dec. 2023
- **Polaroid back — stamp:** PRINT NO. 001
- **Polaroid back — hint:** click to flip back

## WORK_ITEMS (id — category — title — description)

1. photography — Italy — Flickering Faith — Castel Nuovo above Naples during an ASU Italy trip—one frame from that series was shortlisted in the IPA awards. *(featured)*
2. photography — Architectural Study — Exploring geometry and light in Italian architectural spaces. - Rome, Italy
3. photography — Subject Negatives — Applying negative space concepts to subjective candid photography.
4. photography — Automotive Detail — Natural-light car study; most of my automotive work lives in the lightpainting gallery—long exposure, tripod, and a light bar at meets with other shooters.
5. photography — Architectural Composition — Candid captures — finding composition in everyday motion.
6. photography — Golden Hour — Natural light study — the last 20 minutes before sunset. Candid capture of a quiet evening in Tempe AZ.
7. brand — RealCopy — Brand System — Full brand identity for RealCopy including logo, color system, typography, and app icon design. *(featured)*
8. brand — Desert Writes — Logo — Original branding for the marketing tool that became RealCopy. Wordmark + icon system.
9. brand — CB Monogram — Personal brand mark. Continuous line form representing creativity as a connected process.
10. brand — AZHype — Volleyball Club — Full identity for a funded volleyball club and training company—sole designer under Cre8tive Influence, live iteration with the owner, guidelines and launch collateral they still use.
11. brand — Alara Aquatics — Freelance logo and brand collateral for my dad’s company—web- and print-ready exports. *(image path:* `/work/alara-aquatics-brand.jpg` *— add file or rely on placeholder on error)*
12. brand — SLP_MOCKUP — Mockup for Southwest Label and Print from the GIT agency semester; image `/work/Branding/SLP_MOCKUP.png`.
13. print — Food Magazine Cover — Content driven design for a food magazine cover. Won second place in the 2024 Canon maglog competition. *(featured)*
14. print — Marketing Collateral — Wine label design and mockup for local winery in northern Arizona.
15. print — Editorial Layout — Magazine-style layout exploring long-form content design and typographic systems.
16. print — Packaging Concept — Product packaging exploration — balancing shelf presence with brand identity.
15. caseStudies — TEDx Faurot Park 2026 — GIT agency cohort work: meetings and FigJam sessions, plus a repeatable event pattern I built from the logo branch (AI exploration, then hand-finished art). *(featured, case study)*  
    - **embedUrl:** https://www.behance.net/embed/project/245479745?ilo0=1
16. caseStudies — Coffee and Protein Branding Project — Placeholder description — add final case study summary here. *(case study, no image)*  
    - **embedUrl:** https://www.behance.net/embed/project/223615507?ilo0=1

---

# Page: Lightpainting (`/lightpainting` — `src/LightpaintGallery.jsx`)

## Hero

- **Hero image path:** /work/lightpaint/header.jpg
- **Hero image alt:** Lightpainting gear
- **Eyebrow:** LIGHTPAINTING
- **H1:** Automotive Light Studies

## Intro (below hero, above grid)

- **Body:** I shoot car meets with other enthusiasts: tripod, long exposure, a light bar, and post work so the streaks read clean on body lines—not a filter stack, just deliberate technique.

## Grid items (LIGHTPAINT_PHOTOS — title — description)

1. Blue Trace — Long exposure lightpainting on automotive subjects—one continuous handheld exposure.
2. Red Line — Controlled red glow that threads through the silhouette for a clean, cinematic tail-light feel.
3. Warm Orange Sweep — Handheld orange strokes that bloom into reflections across body panels.
4. Cyan Engine Notes — Cool cyan trails shaped around curves to emphasize form over noise.
5. Violet Motion — Violet light ribbons that feel like motion captured in a single breath.
6. Green Pulse — A subtle green pulse that brightens the dark space without overpowering the car.
7. Electric Blue Fade — A deeper blue glow with softer falloff, tuned for ambient bloom in the shadows.

## Lightbox

- **Close control aria-label:** Close lightbox

---

## Files to update after you edit this document

| Area | Primary file(s) |
|------|------------------|
| Authoritative copy reference (sync with code after edits) | `SITE_CONTENT_MASTER.md` |
| Home copy, case studies, work list, skills | `src/App.jsx` (`SITE_DATA`) |
| SEO meta + JSON-LD | `src/seoConstants.js` |
| Nav labels | `src/Nav.jsx` |
| Work gallery items & page header | `src/WorkGallery.jsx` |
| Lightpaint photos & hero | `src/LightpaintGallery.jsx` |
| AI demo prompts | `src/AIChatBubble.jsx` |
| Case study chrome (Tech Stack, etc.) | `src/CaseStudyLayout.jsx` |

When you return edits, specify whether **URLs, image paths, and embed links** should change or stay as-is.
