# KITT — Designing AI you're allowed to trust

**A clinical-protocol design tool where the AI moves fast and the regulator can still audit every move.**

> **My role:** Product strategy, research, interaction & UI design, working prototype
> **Type:** Self-directed rebuild of an earlier concept · desktop · React/Vite/Tailwind
> **Timebox:** A focused design sprint — research → definition → flows/IA → built prototype

---

## The bet

A clinical protocol's biggest hidden cost isn't the time to write it — it's the **amendments** it triggers later: a median **$141K–$535K each, and ~45% of them avoidable**. Meanwhile AI can now draft a protocol in seconds, but regulators (FDA's 2025 AI guidance) won't accept output they can't trace.

So I made one bet that shaped everything: **the same signal that makes a protocol auditable is the signal that keeps it lean.** Show a designer the *cost* of complexity while they build — and make every AI contribution traceable by default — and you solve the regulator's problem and the sponsor's problem with one system, not two.

That bet is the whole product. The rest of this is how I got there and what I designed.

---

## Where I started — and what I refused to keep

The earlier version of KITT had a good instinct (*AI-assisted speed that stays audit-safe*) but two soft spots I decided to fix:

- **It optimized for the wrong number.** "60% faster" is a vanity metric in an industry where a single amendment costs six figures. I re-pointed the product at **avoidable amendment dollars.**
- **It conflated its users.** It called the primary user a "study coordinator" but described work only a clinical scientist does. I split that into three real roles — and gave each its proper place in the design.

Keeping a flattering story would have been easier. Re-pointing the product at a harder, truer problem is the more senior call, and it's the one I made.

---

## Research, compressed to the three things that changed the design

I'll spare the literature review. Three findings did the actual work:

1. **Complexity is the amendment engine.** Lean schedules average 2.0 amendments; heavy ones 3.2 ([Tufts CSDD](https://link.springer.com/article/10.1177/2168479016632271)). → The **Schedule of Assessments** had to be the hero object, and complexity had to carry a price tag.
2. **The protocol became a data object.** ICH M11 (finalized Nov 2025) + CDISC USDM make it machine-readable and EDC-ready ([FDA M11](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/m11-template-clinical-electronic-structured-harmonised-protocol-cesharp)). → Build on that backbone, not a generic doc editor.
3. **Regulators wrote the rules for AI.** They want to know whether each AI output is *"a recommendation, an extraction, or an autonomous classification"* ([FDA/EMA principles](https://www.appliedclinicaltrialsonline.com/view/fda-ema-align-ten-principles-artificial-intelligence-use-drug-development)). → I adopted that exact vocabulary as a UI primitive.

### Where the competition isn't

I mapped the field. Faro Health is the closest — it does data-driven SoA design and complexity scoring. Medidata and Veeva own authoring-to-build. But across the whole field, one thing is unowned as a *designed experience*: **per-decision, AI-vs-human provenance at design time.** Audit trails exist — buried in the EDC data layer, not where the decisions are made.

![Competitive positioning map](artifacts/01-competitor-positioning.svg)

| | Faro | Medidata | Veeva | Phesi | **KITT** |
|---|:--:|:--:|:--:|:--:|:--:|
| SoA-centric design | ● | ◐ | ○ | ◐ | ● |
| Amendment-risk as **$** | ◐ | ◐ | ○ | ◐ | ● |
| **Per-decision provenance UX** | ◐ | ○ | ◐ | ○ | ● |
| M11 / USDM native | ◐ | ◐ | ◐ | ○ | ● |

*No one else combines all three of the top rows. That intersection is the design's home.*

---

## Who I designed for

Protocols are built by a team and gated by another. I anchored the product on the two people who actually make decisions, and represented the third — the one who lives with the consequences.

![Three-persona stakeholder triad](artifacts/02-persona-triad.svg)

- **Maya — Clinical Study Designer** *(the Researcher view).* Owns the SoA. Wants speed and a protocol she can defend. Her win: watching the risk gauge fall as she designs cost out.
- **Dr. Reyes — Regulatory/Quality Reviewer** *(the Reviewer view).* The gate. Wants to prove what the AI did. Her win: per-cell lineage labeled *extraction / recommendation / autonomous*.
- **Sam — Site Coordinator (CRC)** *(represented, not a third screen).* The human cost of complexity. **A design decision:** rather than bolt on a third view, I made Sam the *4th provenance source* and the face of the burden metric. Scope stayed tight; her voice still shows up in the data.

---

## The solution in one screen

KITT is a single desktop workspace on the ICH M11 / USDM backbone, with the Schedule of Assessments as the hero. As Maya builds, KITT labels every AI act with provenance, prices avoidable complexity in dollars, and folds in Sam's feasibility signals. Maya de-risks and submits; Dr. Reyes audits and signs off or returns. **One provenance-bearing artifact travels the whole loop.**

**Principles I held the design to**
1. Suggest, never auto-apply. 2. Provenance is an object, not a color. 3. Show the cost while the decision is still reversible. 4. One protocol, two needs, one record. 5. Standards as substrate. 6. Ground the abstract in a human (Tufts gives the dollar a source; Sam gives the burden a face).

---

## Flows & journeys

The two personas meet at one seam — the handoff — where speed hands off to auditability with the provenance record as the baton.

![Journey map with handoff](artifacts/03-journey-map.svg)

The flow's two loops carry the weight: Maya's **apply-fix** loop (de-risk until the dollars stop falling) and Dr. Reyes's **return-for-revision** loop (back to *Reconcile*, not square one).

![User flows](artifacts/04-user-flows.svg)

---

## Information architecture — state, not pages

I kept the IA deliberately flat. There's no page tree; the primary navigation is *who you are* (Researcher ⇄ Reviewer), and the right panel responds to view and selection.

![Information architecture](artifacts/05-information-architecture.svg)

The model hangs on one atom — the **cell** — and its provenance record. The decisions that made it good: `source` gains a 4th value (**Site**) so Sam costs no new screen, and **`act` is a separate axis from `source`** — the move that lets a reviewer answer the regulator's question *per field*.

```
Cell (Assessment × Visit)
└─ Provenance {
     source : AI | Human | Library | Site
     act    : Extraction | Recommendation | Autonomous classification
     status, confidence, evidence, lineage[]
   }
Risk: Flag[{ kind: autonomous | site, $exposure, basis(Tufts), targets[] }] → Σ = live exposure
```

---

## UI decisions that mattered

**Color.** Regulated health software earns trust with calm. I rebuilt the palette to muted, desaturated cool tones — neutrals carry the UI, saturated fills are reserved for the single most important signal on screen. (An earlier pass was too loud; toning it down was a deliberate correction, not a default.)

![Design palette](artifacts/06-design-palette.svg)

**The choices behind the screen:**
- **The dollar figure is the loudest thing in the chrome** — but labeled *est.* with its Tufts basis inline. Confidence without false precision.
- **The AI-act badge** turns a regulatory sentence into a glance — and ties the highest-scrutiny act ("autonomous classification") directly to the amendment-risk flags. Same insight, one component.
- **A guided-flow bar** narrates the end-to-end path so the prototype is walkable by anyone, and auto-advances as you act.
- **Motion is meaning only:** a gauge that visibly falls when you fix something; a scanner sweep in the mark; a pulse on pending suggestions. Nothing decorative.
- **Type:** Inter, tabular numerals on every live figure so the numbers don't jitter as they animate.

---

## The prototype

A real, clickable build — not screens. The full loop works end-to-end: resolve risk drivers (**exposure $360K → $0, gauge 80 → 34**) → decide AI suggestions → submit → reviewer clears the queue → sign off → export the machine-readable USDM. A guided bar walks it; Reset replays it.

```bash
npm install && npm run dev    # http://localhost:5173
```

---

## What I cut, and what's next

**Cut on purpose:** a third coordinator view (represented Sam instead), a drafting animation, and a real EDC round-trip — all scope I could justify but that wouldn't have changed the story this prototype tells.

**Next:** collaborative multi-author editing, an interactive coordinator-feedback loop, eligibility-criteria scoring, and a true USDM hand-off into an EDC builder.

**The reflection I'd lead a critique with:** the strongest version of this product wasn't a better AI — it was a better *account* of the AI. Once every machine decision is legible and priced, people delegate more, not less. Provenance isn't compliance overhead; it's the feature that makes the protocol leaner.

---

*Portfolio prototype. Synthetic data; not a medical device.*
