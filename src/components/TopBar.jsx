import { STUDY } from '../data/study'
import { fmtUSD } from '../lib/risk'
import { Shield, Pencil, Download, Check } from './icons'

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="scanner grid h-8 w-8 place-items-center rounded-lg bg-ink-soft shadow-sm">
        <div className="h-[3px] w-4 rounded-full bg-[var(--color-risk-high)]" />
      </div>
      <div className="leading-none">
        <div className="text-[15px] font-bold tracking-tight text-white">
          KITT<span className="ml-1 align-top text-[9px] font-semibold text-[var(--color-library)]">v2</span>
        </div>
        <div className="mt-0.5 text-[10px] font-medium text-slate-300/80">Audit-safe protocol design</div>
      </div>
    </div>
  )
}

const STATUS = {
  draft: { label: 'Draft', cls: 'bg-white/10 text-slate-200' },
  submitted: { label: 'Submitted for review', cls: 'bg-[var(--color-brand)]/30 text-white' },
  returned: { label: 'Returned for revision', cls: 'bg-[var(--color-risk-med)]/30 text-white' },
  signed: { label: 'Signed off', cls: 'bg-[var(--color-risk-low)]/30 text-white' },
}

export default function TopBar({ view, setView, onExport, onSubmit, handoff, risk, pendingCount, exportReady }) {
  const st = STATUS[handoff] ?? STATUS.draft
  return (
    <header className="flex items-center justify-between gap-4 bg-ink px-4 py-2.5 text-white">
      <div className="flex items-center gap-4">
        <Logo />
        <div className="hidden h-8 w-px bg-white/10 lg:block" />
        <div className="hidden leading-tight lg:block">
          <div className="flex items-center gap-2 text-[13px] font-semibold">
            <span className="font-mono text-[var(--color-library)]">{STUDY.short}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-100">Schedule of Activities</span>
          </div>
          <div className="text-[11px] text-slate-400">{STUDY.phase} · {STUDY.indication} · {STUDY.version}</div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Signature metric — avoidable amendment exposure */}
        <div
          className="hidden items-center gap-2 rounded-lg bg-white/8 px-3 py-1.5 md:flex"
          title="Estimated avoidable-amendment exposure from open risk drivers. Basis: Tufts CSDD amendment medians ($141K Ph II / $535K Ph III)."
        >
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Avoidable exposure</span>
          <span className="text-[15px] font-bold text-white tnum">{fmtUSD(risk.exposure)}</span>
          <span className="text-[10px] font-medium text-slate-400">est.</span>
        </div>

        <span className={`hidden rounded-full px-2.5 py-1 text-[11px] font-semibold lg:inline ${st.cls}`}>{st.label}</span>

        {/* Researcher ⇄ Reviewer toggle */}
        <div className="flex items-center rounded-lg bg-white/10 p-0.5 text-[12px] font-semibold">
          <button
            onClick={() => setView('researcher')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
              view === 'researcher' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Pencil size={14} /> Researcher
          </button>
          <button
            onClick={() => setView('reviewer')}
            className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
              view === 'reviewer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Shield size={14} /> Reviewer
            {pendingCount > 0 && (
              <span className="ml-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--color-risk-high)] px-1 text-[10px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {view === 'researcher' ? (
          <button
            onClick={onSubmit}
            className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-[12px] font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Check size={14} /> Submit for review
          </button>
        ) : (
          <button
            onClick={onExport}
            className={`flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-[12px] font-semibold text-white shadow-sm transition hover:opacity-90 ${exportReady ? 'ring-2 ring-white/50' : ''}`}
          >
            <Download size={14} /> Export USDM
          </button>
        )}
      </div>
    </header>
  )
}
