import { useState } from 'react'

// Shown only below the `lg` breakpoint (Tailwind `lg:hidden`), so it never
// appears on desktop. Dismissible — guides reviewers without blocking them.
export default function DesktopNote() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 px-6 lg:hidden">
      <div className="rise max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex items-center justify-center gap-2.5">
          <div className="scanner grid h-9 w-9 place-items-center rounded-lg bg-ink-soft">
            <div className="h-[3px] w-4 rounded-full bg-[var(--color-risk-high)]" />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-slate-900">
            KITT<span className="ml-1 align-top text-[10px] font-semibold text-brand">v2</span>
          </span>
        </div>

        <h1 className="mt-4 text-[18px] font-bold text-slate-900">Best viewed on desktop</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">
          KITT is a desktop prototype. Its three-pane workspace — the Schedule-of-Assessments matrix, the
          amendment-risk panel, and the guided end-to-end flow — is designed for screens around
          <span className="font-semibold text-slate-800"> 1280px and up</span>.
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">
          Open it on a laptop or desktop (or widen your window) for the full experience.
        </p>

        <button
          onClick={() => setDismissed(true)}
          className="mt-5 w-full rounded-lg bg-brand px-4 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-90"
        >
          Explore anyway
        </button>
        <p className="mt-2.5 text-[11.5px] text-slate-400">You can scroll horizontally to see the full layout.</p>
      </div>
    </div>
  )
}
