import { band, fmtUSD } from '../lib/risk'

const TONE = {
  emerald: { stroke: '#6cae8c', text: 'text-risk-low', bg: 'bg-risk-low-tint', ring: 'ring-risk-low' },
  amber: { stroke: '#cf9c46', text: 'text-risk-med', bg: 'bg-risk-med-tint', ring: 'ring-risk-med' },
  rose: { stroke: '#cf6f74', text: 'text-risk-high', bg: 'bg-risk-high-tint', ring: 'ring-risk-high' },
}

export default function RiskMeter({ risk, baselineExposure, baselineFlags }) {
  const b = band(risk.score)
  const tone = TONE[b.tone]
  const r = 72
  const len = Math.PI * r
  const offset = len * (1 - risk.score / 100)
  const removed = baselineExposure - risk.exposure
  const resolved = baselineFlags - risk.openFlags

  return (
    <div className="border-b border-slate-200 px-5 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-500">Amendment risk</h2>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${tone.bg} ${tone.text} ring-1 ${tone.ring}`}>{b.label}</span>
      </div>

      <div className="relative mx-auto mt-1 w-[180px]">
        <svg viewBox="0 0 180 104" className="w-full">
          <path d="M 18 90 A 72 72 0 0 1 162 90" fill="none" stroke="#e6ebf0" strokeWidth="12" strokeLinecap="round" />
          <path d="M 18 90 A 72 72 0 0 1 162 90" fill="none" stroke={tone.stroke} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={len} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.22,1,.36,1), stroke 0.4s' }} />
        </svg>
        <div className="absolute inset-x-0 bottom-1 text-center">
          <div className={`text-[34px] font-bold leading-none tnum ${tone.text}`}>{risk.score}</div>
          <div className="text-[10px] font-medium text-slate-400">risk index / 100</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-slate-50 px-3 py-2" title="Estimated from Tufts CSDD amendment medians: $141K Ph II / $535K Ph III per substantial amendment.">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Avoidable exposure</div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="text-[18px] font-bold text-slate-800 tnum">{fmtUSD(risk.exposure)}</span>
            <span className="text-[10px] font-medium text-slate-400">est.</span>
          </div>
          <div className="text-[10px] text-risk-low tnum">
            {removed > 0 ? `${fmtUSD(removed)} removed` : `of ${fmtUSD(baselineExposure)} identified`}
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2" title="Patient & site burden — the coordinator's (Sam's) workload. Proxy for procedures per patient.">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Patient &amp; site burden</div>
          <div className="mt-0.5 text-[18px] font-bold text-slate-800 tnum">{risk.procedures}</div>
          <div className="text-[10px] text-slate-500">procedures · {risk.burdenIndex}/100 idx</div>
        </div>
      </div>
      <div className="mt-1.5 text-center text-[9.5px] text-slate-400">Basis: Tufts CSDD amendment medians</div>
      {resolved > 0 && (
        <div className="mt-1 text-center text-[10.5px] font-medium text-risk-low">{resolved} of {baselineFlags} risk drivers resolved</div>
      )}
    </div>
  )
}
