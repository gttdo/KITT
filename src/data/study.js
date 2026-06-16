// ─────────────────────────────────────────────────────────────────────────────
// KITT v2 — mock study definition
// Phase II early-Alzheimer's protocol on the ICH M11 backbone. Synthetic demo data.
// ─────────────────────────────────────────────────────────────────────────────

export const STUDY = {
  id: 'KTT-2026-AD201',
  short: 'AD-201',
  title: 'A Phase II, Randomized, Double-Blind Study of KTT-114 in Early Alzheimer’s Disease',
  phase: 'Phase II',
  indication: 'Early Alzheimer’s Disease',
  version: 'Protocol v2.0 — Draft',
  sponsor: 'Northlake Therapeutics',
}

export const VISITS = [
  { id: 'SCR', label: 'Screening', window: 'Day −28 to −1', kind: 'screen' },
  { id: 'D1', label: 'Day 1', window: 'Baseline / Rand.', kind: 'baseline' },
  { id: 'W2', label: 'Week 2', window: '±3 d', kind: 'treatment' },
  { id: 'W4', label: 'Week 4', window: '±3 d', kind: 'treatment' },
  { id: 'W8', label: 'Week 8', window: '±5 d', kind: 'treatment' },
  { id: 'W12', label: 'Week 12', window: '±5 d · Primary', kind: 'primary' },
  { id: 'W24', label: 'Week 24', window: '±7 d', kind: 'treatment' },
  { id: 'EOT', label: 'EoT', window: 'End of Tx', kind: 'eot' },
  { id: 'FU', label: 'Follow-up', window: 'Week 28', kind: 'followup' },
]

export const CATEGORIES = [
  {
    id: 'admin', label: 'Administrative', m11: '§5 / §7.1',
    items: [
      { id: 'consent', label: 'Informed Consent' },
      { id: 'demog', label: 'Demographics' },
      { id: 'medhx', label: 'Medical History' },
      { id: 'elig', label: 'Eligibility Review' },
      { id: 'random', label: 'Randomization' },
    ],
  },
  {
    id: 'safety', label: 'Safety', m11: '§8.3',
    items: [
      { id: 'vitals', label: 'Vital Signs' },
      { id: 'pe', label: 'Physical Examination' },
      { id: 'ecg', label: '12-Lead ECG' },
      { id: 'ae', label: 'Adverse Events' },
      { id: 'conmed', label: 'Concomitant Meds' },
    ],
  },
  {
    id: 'lab', label: 'Laboratory', m11: '§8.3.2',
    items: [
      { id: 'hem', label: 'Hematology' },
      { id: 'chem', label: 'Serum Chemistry' },
      { id: 'ua', label: 'Urinalysis' },
      { id: 'preg', label: 'Pregnancy Test' },
      { id: 'pk', label: 'PK Sampling' },
    ],
  },
  {
    id: 'efficacy', label: 'Efficacy & Biomarkers', m11: '§8.1 / §8.2',
    items: [
      { id: 'primary', label: 'ADAS-Cog (Primary)' },
      { id: 'pro', label: 'Quality-of-Life PRO' },
      { id: 'imaging', label: 'MRI Imaging' },
      { id: 'biomarker', label: 'Exploratory Biomarker' },
    ],
  },
]

export const ITEM_BY_ID = Object.fromEntries(
  CATEGORIES.flatMap((c) => c.items.map((i) => [i.id, { ...i, category: c.id }])),
)
export const cellKey = (itemId, visitId) => `${itemId}@${visitId}`

// ── Provenance sources (muted palette tokens) ────────────────────────────────
export const SOURCE = {
  ai: { id: 'ai', label: 'AI-drafted', dot: 'bg-ai', ring: 'ring-ai', text: 'text-ai', soft: 'bg-ai-tint' },
  human: { id: 'human', label: 'Human-authored', dot: 'bg-human', ring: 'ring-human', text: 'text-human', soft: 'bg-human-tint' },
  library: { id: 'library', label: 'Library', dot: 'bg-library', ring: 'ring-library', text: 'text-library', soft: 'bg-library-tint' },
  site: { id: 'site', label: 'Site feedback', dot: 'bg-site', ring: 'ring-site', text: 'text-site', soft: 'bg-site-tint' },
}

// ── AI-act taxonomy (the regulator's framing) ────────────────────────────────
// A separate axis from `source`: it describes the NATURE of the AI act, which is
// what a reviewer must classify (FDA / FDA-EMA principles).
export const ACT = {
  extraction: {
    label: 'Extraction',
    note: 'Pulled from a validated source — verify the source location.',
    scrutiny: 'Low scrutiny',
  },
  recommendation: {
    label: 'Recommendation',
    note: 'AI proposes; the human decides. Not yet in the protocol.',
    scrutiny: 'Medium scrutiny',
  },
  autonomous: {
    label: 'Autonomous classification',
    note: 'AI judged this on its own — must be human-confirmed before sign-off.',
    scrutiny: 'High scrutiny',
  },
}

const PRESENCE = {
  consent: ['SCR'], demog: ['SCR'], medhx: ['SCR'], elig: ['SCR', 'D1'], random: ['D1'],
  vitals: ['SCR', 'D1', 'W2', 'W4', 'W8', 'W12', 'W24', 'EOT', 'FU'],
  pe: ['SCR', 'D1', 'W12', 'W24', 'EOT'],
  ecg: ['SCR', 'D1', 'W12', 'EOT'],
  ae: ['D1', 'W2', 'W4', 'W8', 'W12', 'W24', 'EOT', 'FU'],
  conmed: ['SCR', 'D1', 'W2', 'W4', 'W8', 'W12', 'W24', 'EOT'],
  hem: ['SCR', 'D1', 'W4', 'W12', 'W24', 'EOT'],
  chem: ['SCR', 'D1', 'W4', 'W12', 'W24', 'EOT'],
  ua: ['SCR', 'D1', 'W12', 'EOT'],
  preg: ['SCR', 'D1', 'W12', 'W24', 'EOT'],
  pk: ['D1', 'W2', 'W4', 'W8', 'W12', 'W24'],
  primary: ['SCR', 'D1', 'W12', 'W24'],
  pro: ['SCR', 'D1', 'W12', 'W24', 'EOT'],
  imaging: ['SCR', 'W2', 'W12', 'W24'],
  biomarker: ['SCR', 'D1', 'W4', 'W8', 'W12', 'W24'],
}

const HUMAN_ITEMS = new Set(['consent', 'demog', 'medhx', 'elig', 'random', 'primary'])
const LIBRARY_ITEMS = new Set(['vitals', 'ae', 'conmed'])

const RATIONALE = {
  ecg: 'Cardiac safety monitoring aligned to KTT-114’s QT signal in the Phase I SAD/MAD.',
  hem: 'Routine hematology per standard early-AD safety battery.',
  chem: 'Hepatic/renal monitoring; KTT-114 is renally cleared.',
  ua: 'Standard safety urinalysis at key timepoints.',
  preg: 'Required for WOCBP per ICH M11 §5 eligibility safeguards.',
  pk: 'Population-PK sampling to support exposure-response modeling.',
  pe: 'Targeted physical exam at baseline and endpoint visits.',
  imaging: 'Volumetric MRI supporting the secondary atrophy endpoint.',
  biomarker: 'Exploratory plasma biomarker (p-tau217) — no pre-specified analysis.',
  pro: 'Patient-reported quality-of-life, a key secondary endpoint.',
}
const EVIDENCE = {
  ecg: 'KTT-114 IB v3.0 §6.2 · ICH M11 §8.3',
  pk: 'SAP v1.2 §9 (PopPK) · Indication Library: Early-AD Ph II',
  imaging: 'Endpoint Charter §4.1 · Indication Library: Early-AD Ph II',
  biomarker: 'Translational plan (draft) — endpoint not defined',
  pro: 'Endpoint Charter §3.2 · ICH M11 §8.2',
  preg: 'ICH M11 §5.2 · Sponsor safety SOP-014',
}

function buildCells() {
  const cells = {}
  for (const [itemId, visits] of Object.entries(PRESENCE)) {
    for (const v of visits) {
      const src = HUMAN_ITEMS.has(itemId) ? 'human' : LIBRARY_ITEMS.has(itemId) ? 'library' : 'ai'
      cells[cellKey(itemId, v)] = {
        source: src,
        status: 'accepted',
        // act: extraction for anything drawn from a validated source (AI draft / library)
        act: src === 'human' ? null : 'extraction',
        confidence: src === 'ai' ? 0.9 + ((itemId.charCodeAt(0) + v.charCodeAt(0)) % 9) / 100 : null,
        rationale: src === 'ai' ? RATIONALE[itemId] ?? 'Drafted from the validated indication SoA library.' : null,
        evidence: EVIDENCE[itemId] ?? null,
        siteNote: null,
      }
    }
  }

  // Pending AI suggestions — additions awaiting review → act = recommendation
  const pending = [
    ['pro', 'W4', 0.82, 'Adding QoL PRO at Week 4 closes a 10-week gap in the secondary-endpoint trajectory.'],
    ['pro', 'W8', 0.79, 'Week 8 PRO improves the longitudinal model fit for the QoL secondary endpoint.'],
    ['conmed', 'FU', 0.74, 'Capturing concomitant meds at Follow-up completes safety accountability post-treatment.'],
    ['ecg', 'W4', 0.54, 'Optional interim ECG at Week 4 — low confidence; QT signal is front-loaded.'],
  ]
  for (const [itemId, v, conf, why] of pending) {
    cells[cellKey(itemId, v)] = {
      source: 'ai', status: 'suggested', act: 'recommendation',
      confidence: conf, rationale: why,
      evidence: 'KITT reasoning · Indication Library: Early-AD Ph II', siteNote: null,
    }
  }

  // Site-feasibility annotations (Sam, the coordinator) overlay existing cells
  const note = 'Sam Rivera (Site): the Week-2 interim visit is hard for our elderly, caregiver-reliant patients — low value between Day 1 and Week 4.'
  if (cells['vitals@W2']) cells['vitals@W2'].siteNote = note
  if (cells['conmed@W2']) cells['conmed@W2'].siteNote = note

  return cells
}

export const INITIAL_CELLS = buildCells()

// ── Risk drivers ─────────────────────────────────────────────────────────────
// kind 'autonomous' = AI-classified avoidable complexity (high scrutiny).
// kind 'site'       = surfaced from the coordinator's feasibility feedback.
export const INITIAL_FLAGS = [
  {
    id: 'pk-oversample', kind: 'autonomous', severity: 'high',
    title: 'Redundant PK sampling',
    detail: 'Dense PK draws at Weeks 2 and 8 exceed what the population-PK model needs. Sparse sampling at Day 1, W4, W12 and W24 is sufficient. Over-sampling is a top-3 avoidable amendment cause.',
    evidence: 'SAP v1.2 §9', basis: 'Tufts CSDD — Ph II amendment median $141K',
    burden: 14, exposure: 135000, targets: ['pk@W2', 'pk@W8'], status: 'open',
  },
  {
    id: 'biomarker-over', kind: 'autonomous', severity: 'high',
    title: 'Exploratory biomarker over-collection',
    detail: 'The exploratory biomarker has no pre-specified analysis endpoint, yet it is drawn at 6 visits. Limiting to Screening, Day 1, W12 and W24 removes site burden that powers no objective.',
    evidence: 'Translational plan (draft)', basis: 'Tufts CSDD — avoidable-amendment driver',
    burden: 12, exposure: 90000, targets: ['biomarker@W4', 'biomarker@W8'], status: 'open',
  },
  {
    id: 'imaging-unanchored', kind: 'autonomous', severity: 'medium',
    title: 'Unanchored imaging visit',
    detail: 'MRI at Week 2 is not tied to any primary or secondary endpoint timepoint. Visits without an endpoint anchor are frequently removed in a post-enrollment amendment.',
    evidence: 'Endpoint Charter §4.1', basis: 'Tufts CSDD — avoidable-amendment driver',
    burden: 8, exposure: 70000, targets: ['imaging@W2'], status: 'open',
  },
  {
    id: 'ecg-redundant', kind: 'autonomous', severity: 'medium',
    title: 'Duplicate baseline ECG',
    detail: 'A 12-Lead ECG at both Screening and Day 1 within a 28-day window is redundant for eligibility. A single baseline ECG satisfies the protocol.',
    evidence: 'ICH M11 §8.3', basis: 'Tufts CSDD — avoidable-amendment driver',
    burden: 5, exposure: 25000, targets: ['ecg@D1'], status: 'open',
  },
  {
    id: 'site-w2-interim', kind: 'site', severity: 'medium',
    title: 'Low-value Week-2 interim (site)',
    detail: 'Sam (CRC): a ±3-day window two weeks after baseline forces an extra trip for elderly, caregiver-reliant patients. The interim adds site burden and deviation risk for little scientific gain.',
    evidence: 'Site feasibility — Sam Rivera, CRC', basis: 'Deviation-driven amendments & dropout',
    burden: 7, exposure: 40000, targets: ['vitals@W2', 'conmed@W2'], status: 'open',
  },
]

export const M11_SECTIONS = [
  { id: 's1', no: '1', label: 'Protocol Summary', status: 'approved', ai: 0.6, usdm: true },
  { id: 's3', no: '3', label: 'Objectives & Endpoints', status: 'approved', ai: 0.4, usdm: true },
  { id: 's4', no: '4', label: 'Trial Design', status: 'review', ai: 0.7, usdm: true },
  { id: 's5', no: '5', label: 'Trial Population', status: 'review', ai: 0.55, usdm: true },
  { id: 's6', no: '6', label: 'Trial Intervention', status: 'draft', ai: 0.5, usdm: true },
  { id: 's8', no: '8', label: 'Schedule of Activities', status: 'draft', ai: 0.78, usdm: true, current: true },
  { id: 's9', no: '9', label: 'Statistical Considerations', status: 'draft', ai: 0.45, usdm: false },
  { id: 's10', no: '10', label: 'General Considerations', status: 'todo', ai: 0, usdm: false },
]

export const SEED_AUDIT = [
  { actor: 'KITT', action: 'drafted', target: 'Schedule of Activities (78 cells) from Early-AD Ph II library', kind: 'ai', t: '−2 d' },
  { actor: 'KITT', action: 'flagged', target: '5 risk drivers · $360K est. exposure', kind: 'ai', t: '−2 d' },
  { actor: 'Sam Rivera (Site)', action: 'commented', target: 'Week-2 interim feasibility', kind: 'site', t: '−1 d' },
  { actor: 'M. Okafor', action: 'overrode', target: 'Primary endpoint (ADAS-Cog) set human-authored', kind: 'human', t: '−1 d' },
  { actor: 'M. Okafor', action: 'accepted', target: '61 AI-drafted assessment cells', kind: 'human', t: '−1 d' },
]
