import { M11_SECTIONS } from '../data/study'
import { Sparkle, Check } from './icons'

const STATUS = {
  approved: { label: 'Approved', cls: 'bg-risk-low-tint text-risk-low' },
  review: { label: 'In review', cls: 'bg-risk-med-tint text-risk-med' },
  draft: { label: 'Draft', cls: 'bg-ai-tint text-ai' },
  todo: { label: 'Not started', cls: 'bg-slate-100 text-slate-500' },
}

function Ring({ value }) {
  const r = 13
  const c = 2 * Math.PI * r
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" className="-rotate-90">
      <circle cx="17" cy="17" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
      <circle cx="17" cy="17" r={r} fill="none" stroke="#3f8c84" strokeWidth="4" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - value)} />
    </svg>
  )
}

export default function SectionRail() {
  const completion = 0.62
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
        <div className="relative grid place-items-center">
          <Ring value={completion} />
          <span className="absolute text-[11px] font-bold text-slate-700 tnum">{Math.round(completion * 100)}%</span>
        </div>
        <div className="leading-tight">
          <div className="text-[12px] font-bold text-slate-800">ICH M11 Protocol</div>
          <div className="text-[11px] text-slate-500">CeSHarP structure</div>
        </div>
      </div>

      <div className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Document outline</div>
      <nav className="flex-1 overflow-y-auto px-2 pb-3">
        {M11_SECTIONS.map((s) => {
          const st = STATUS[s.status]
          return (
            <div key={s.id} className={`group mb-0.5 rounded-lg px-2.5 py-2 transition ${
              s.current ? 'bg-brand-tint ring-1 ring-brand/30' : 'hover:bg-slate-50'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-[11px] font-semibold ${s.current ? 'text-brand' : 'text-slate-400'}`}>{s.no}</span>
                <span className={`flex-1 truncate text-[12.5px] font-medium ${s.current ? 'text-slate-800' : 'text-slate-700'}`}>{s.label}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pl-6">
                <span className={`rounded px-1.5 py-0.5 text-[9.5px] font-semibold ${st.cls}`}>{st.label}</span>
                {s.ai > 0 && (
                  <span className="flex items-center gap-0.5 text-[9.5px] font-semibold text-ai" title="Share AI-drafted">
                    <Sparkle size={10} /> {Math.round(s.ai * 100)}%
                  </span>
                )}
                {s.usdm && (
                  <span className="flex items-center gap-0.5 rounded bg-library-tint px-1 py-0.5 text-[9px] font-semibold text-library" title="Mapped to a CDISC USDM activity">
                    <Check size={9} /> USDM
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </nav>

      <div className="border-t border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2">
          <Sparkle size={14} className="text-ai" />
          <div className="text-[10.5px] leading-tight text-slate-600">
            <span className="font-semibold text-slate-800">61 of 78</span> cells AI-drafted, human-reviewed
          </div>
        </div>
        <div className="mt-2 px-0.5 text-[10px] leading-tight text-slate-400">
          Aligned to <span className="font-semibold text-slate-500">ICH M11</span> (Nov 2025) · CDISC <span className="font-semibold text-slate-500">USDM</span>
        </div>
      </div>
    </aside>
  )
}
