# KITT v2 — Audit-safe clinical protocol design

> A desktop prototype that reframes KITT from *"design protocols faster"* to *"design protocols you won't have to amend — and prove what the AI did."*

This is an enhanced rebuild of the [original KITT case study](https://www.davinces.design/work/kitt). The original established a strong thesis — **AI-assisted speed that stays audit-safe**. This version sharpens the *value* (amendment prevention) and makes the *governance* (per-field provenance) tangible and interactive.

---

## The research that drove the redesign

| Finding | Source | Implication |
|---|---|---|
| A substantial protocol amendment costs a median **$141K (Ph II) / $535K (Ph III)**; 57% of protocols get one and **~45% are avoidable**. | [Tufts CSDD / Getz, 2016](https://link.springer.com/article/10.1177/2168479016632271) | The money problem is *amendments*, not design time. Optimize for that. |
| Heavier schedules of assessments correlate with **3.2 amendments** vs 2.0 for lean ones. | Tufts CSDD | The **Schedule of Assessments** is the lever — make it the hero object. |
| **ICH M11 (CeSHarP)** finalized **19 Nov 2025** — a harmonized, machine-readable protocol accepted across FDA/EMA/PMDA. | [FDA M11](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/m11-template-clinical-electronic-structured-harmonised-protocol-cesharp) | Anchor the structure to M11; output **CDISC USDM** so the protocol can auto-configure downstream EDC. |
| FDA's Jan-2025 AI draft guidance + FDA/EMA's ten principles center on **credibility, risk-based context-of-use, and human oversight**. | [FDA AI guidance](https://intuitionlabs.ai/articles/fda-ai-drug-development-guidance) | Auditability is now a regulatory expectation. Provenance must be a first-class artifact, not a color. |
| The market (Veeva Falcon, Medidata) is racing toward **agentic authoring**. | [Veeva Falcon](https://www.clinicaltrialvanguard.com/conference-coverage/veeva-unveils-falcon-ai-platform-and-agentic-authoring-at-2026-summit/) | The frontier is no longer "can AI draft it" — it's *governance*. That's where KITT wins. |

## Problem (re-defined)

The original framed the problem as **"design is slow and manual."** Our research points to a higher-value framing:

> Clinical protocols are designed without visibility into the complexity that later forces **six-figure, mostly-avoidable amendments** — and now that AI can draft them in seconds, regulators require every AI contribution be **auditable to a documented standard.**

The job-to-be-done isn't *"draft faster."* It's *"help me ship a lean, M11-compliant protocol I won't have to amend — and prove to a reviewer exactly what the AI did."*

## The thesis

**The auditability that satisfies the regulator is the same signal that prevents the amendment.** Provenance and complexity-scoring aren't two features — they're one system. KITT flags avoidable complexity *with evidence*, and that evidence trail is the audit artifact.

## How v2 improves on the original

| | Original KITT | **KITT v2 (this build)** |
|---|---|---|
| **Optimizes for** | Design *speed* (days → hours) | **Amendment risk** — speed is a side effect |
| **AI governance** | Color-codes AI vs human | **Per-field provenance**: source, rationale, evidence citation, confidence, audit lineage + actions |
| **Backbone** | Generic structured doc + wizard | **ICH M11 sections + USDM** machine-readable export → EDC-ready |
| **Hero object** | SoA draft reviewed line-by-line | **Interactive SoA matrix** with a live **amendment-risk gauge** + dollar exposure |
| **Two users** | Stated (researcher + reviewer) | **Switchable views** — Researcher *builds*, Reviewer *audits & signs off* |

---

## What's in the prototype

A desktop, single-screen workspace:

- **Top bar** — a persistent **avoidable-exposure** signature metric (est., Tufts-based), the handoff status, the **Researcher ⇄ Reviewer** toggle (with a pending-sign-off badge), and Submit / Export.
- **Left rail** — the ICH M11 document outline with completion ring, per-section status, **% AI-drafted**, and **USDM-mapped** badges.
- **Center (hero)** — the **Schedule of Assessments** matrix (assessments × visits). Each cell carries a provenance source — **AI / Human / Library / Site** — and AI cells carry an **act** (extraction / recommendation / autonomous classification). AI *suggestions* pulse and can be accepted or rejected inline; flagged and site-touched cells are marked.
- **Right panel** — a live **Amendment-Risk gauge** ($ exposure + patient & site burden) over three context-aware modes:
  - **Risk drivers** (Researcher default) — each driver labeled *autonomous classification* or *site feasibility*, with evidence, Tufts basis, and a one-click *Apply fix*.
  - **Provenance card** (any cell selected) — source, **AI-act badge + scrutiny**, confidence, rationale, evidence, **site feedback**, full audit lineage, and accept/reject/override/remove.
  - **Reviewer audit** — AI-assisted %, source distribution, a **pending sign-off queue**, **Return for revision**, section sign-off, and the audit trail.
- **Submit → audit → sign-off / return** — the designer submits; the reviewer clears the queue and signs off or returns the protocol to the designer.
- **Export USDM** — generates a CDISC USDM / ICH M11–shaped JSON (encounters, activities, per-cell provenance + act, audit trail) — the "born-digital, EDC-ready" payoff.

### Try these flows
1. **Researcher** → *Apply fix* on "Redundant PK sampling" → watch risk drop **80 → 66** and exposure **$360K → $225K**.
2. Click any AI cell → read its **act badge** (extraction / recommendation / autonomous) and audit lineage; click a Week-2 cell with a blue dot to see **site feedback**.
3. **Submit for review** → the view hands off to the **Reviewer**, who works the **pending sign-off queue**, then signs off or **returns for revision**.
4. **Export USDM** → inspect the machine-readable protocol payload.

> **Palette:** muted, desaturated cool neutrals with sparingly-used accents — the convention for clinical/regulated software (calm, trustworthy, low visual noise).

---

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to /dist
```

**Stack:** React 19 · Vite 6 · Tailwind CSS v4. All data is synthetic (`src/data/study.js`) — a Phase II early-Alzheimer's protocol used for demonstration.

```
src/
  data/study.js      # study, visits, assessments, provenance, amendment-risk flags
  lib/risk.js        # transparent amendment-risk + burden model
  components/        # TopBar · SectionRail · SoAMatrix · RiskMeter · RightPanel
  App.jsx            # state, handlers, USDM export
```

*Prototype for portfolio demonstration. Not a medical device; not for use in real clinical study design.*
