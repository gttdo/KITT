// Amendment-risk & burden model.
// The score is intentionally transparent: open complexity flags drive amendment
// risk, while the raw procedure count drives patient/site burden. This mirrors
// the thesis — the provenance signal that satisfies the auditor is the same one
// that prevents the six-figure amendment.

export const RISK_BANDS = [
  { max: 39, label: 'Low', tone: 'emerald' },
  { max: 59, label: 'Moderate', tone: 'amber' },
  { max: 200, label: 'High', tone: 'rose' },
]

export function band(score) {
  return RISK_BANDS.find((b) => score <= b.max) ?? RISK_BANDS.at(-1)
}

// activeCells: object of present cells (status !== 'rejected')
// flags: array with .status and .burden / .exposure
export function computeRisk(activeCells, flags) {
  const openFlags = flags.filter((f) => f.status === 'open')
  const openBurden = openFlags.reduce((s, f) => s + f.burden, 0)
  const exposure = openFlags.reduce((s, f) => s + f.exposure, 0)

  // Count only "active" assessments (suggested additions count as half-weight,
  // since they're not yet committed to the protocol).
  let procedures = 0
  for (const c of Object.values(activeCells)) {
    procedures += c.status === 'suggested' ? 0.5 : 1
  }

  const overload = Math.max(0, procedures - 92) // burden penalty past a lean ceiling
  const score = Math.max(0, Math.min(100, Math.round(34 + openBurden + overload * 0.8)))

  // Burden index 0–100 scaled off the procedure count (≈70 cells = lean).
  const burdenIndex = Math.max(0, Math.min(100, Math.round((procedures / 110) * 100)))

  return { score, exposure, procedures: Math.round(procedures), burdenIndex, openFlags: openFlags.length }
}

export function fmtUSD(n) {
  if (n >= 1000) return `$${Math.round(n / 1000)}K`
  return `$${n}`
}
