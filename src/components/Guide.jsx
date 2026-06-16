import { Check, Sparkle, X } from './icons'

// Slim guided-flow bar under the top bar. Walks the end-to-end path and
// auto-advances as the user completes each step.
export default function Guide({ open, onShow, steps, activeIndex, instruction, switchTo, view, onReset, onDismiss }) {
  if (!open) {
    return (
      <button
        onClick={onShow}
        className="flex items-center gap-1.5 border-b border-slate-200 bg-white px-4 py-1.5 text-[11.5px] font-semibold text-brand hover:bg-slate-50"
      >
        <Sparkle size={13} /> Show guided flow
      </button>
    )
  }

  const complete = activeIndex < 0

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-slate-200 bg-white px-4 py-2">
      <span className="hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:inline">Guided flow</span>

      <div className="flex items-center gap-1">
        {steps.map((s, i) => {
          const cls =
            s.status === 'done'
              ? 'bg-brand text-white'
              : s.status === 'current'
                ? 'bg-brand-tint text-brand ring-1 ring-brand'
                : 'bg-slate-100 text-slate-400'
          return (
            <div key={s.label} className="flex items-center">
              <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${cls}`}>
                <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-white/25 text-[9px] tnum">
                  {s.status === 'done' ? <Check size={10} /> : i + 1}
                </span>
                <span className="hidden md:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && <span className="mx-0.5 h-px w-2 bg-slate-200" />}
            </div>
          )
        })}
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        {complete ? (
          <span className="text-[12px] font-semibold text-brand">✓ End-to-end flow complete — protocol released to build.</span>
        ) : (
          <span className="text-[12px] text-slate-600">
            {switchTo && (
              <span className="mr-1 rounded bg-risk-med-tint px-1.5 py-0.5 text-[11px] font-semibold text-risk-med">
                Switch to {switchTo === 'reviewer' ? 'Reviewer' : 'Researcher'}
              </span>
            )}
            <span className="font-semibold text-slate-800">{instruction.title}</span>
            <span className="text-slate-500"> — {instruction.detail}</span>
          </span>
        )}
        <button onClick={onReset} className="rounded-md px-2 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">
          Reset
        </button>
        <button onClick={onDismiss} className="rounded-md p-1 text-slate-400 hover:bg-slate-100" title="Hide guide">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
