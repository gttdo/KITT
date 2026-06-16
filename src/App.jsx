import { useMemo, useState } from 'react'
import TopBar from './components/TopBar'
import DesktopNote from './components/DesktopNote'
import Guide from './components/Guide'
import SectionRail from './components/SectionRail'
import SoAMatrix from './components/SoAMatrix'
import RightPanel from './components/RightPanel'
import { Check } from './components/icons'
import {
  STUDY, VISITS, CATEGORIES, ITEM_BY_ID, cellKey,
  INITIAL_CELLS, INITIAL_FLAGS, SEED_AUDIT, M11_SECTIONS,
} from './data/study'
import { computeRisk } from './lib/risk'

const BASELINE_EXPOSURE = INITIAL_FLAGS.reduce((s, f) => s + f.exposure, 0)
const BASELINE_FLAGS = INITIAL_FLAGS.length
const INITIAL_SUGGESTIONS = Object.values(INITIAL_CELLS).filter((c) => c.status === 'suggested').length
const SIGNABLE = M11_SECTIONS.filter((s) => s.status !== 'approved')
const VISIT_LABEL = Object.fromEntries(VISITS.map((v) => [v.id, v.label]))
const label = (key) => {
  const [i, v] = key.split('@')
  return `${ITEM_BY_ID[i].label} @ ${VISIT_LABEL[v]}`
}

export default function App() {
  const [view, setView] = useState('researcher')
  const [cells, setCells] = useState(() => structuredClone(INITIAL_CELLS))
  const [flags, setFlags] = useState(() => structuredClone(INITIAL_FLAGS))
  const [selectedKey, setSelectedKey] = useState(null)
  const [approvals, setApprovals] = useState(() => new Set())
  const [acked, setAcked] = useState(() => new Set()) // reviewer-approved AI acts
  const [audit, setAudit] = useState(() => SEED_AUDIT.map((e) => ({ ...e })))
  const [handoff, setHandoff] = useState('draft') // draft | submitted | returned | signed
  const [exported, setExported] = useState(false)
  const [guideOpen, setGuideOpen] = useState(true)
  const [toast, setToast] = useState(null)

  const log = (actor, action, target, kind) =>
    setAudit((a) => [{ actor, action, target, kind, t: 'just now' }, ...a])
  const flash = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2600)
  }

  const flaggedKeys = useMemo(() => {
    const s = new Set()
    for (const f of flags) if (f.status === 'open') for (const k of f.targets) if (cells[k]) s.add(k)
    return s
  }, [flags, cells])

  const risk = useMemo(() => computeRisk(cells, flags), [cells, flags])

  // Reviewer's outstanding work: open autonomous classifications + pending
  // suggestions that the reviewer hasn't yet approved.
  const pendingItems = useMemo(() => {
    const auto = flags.filter((f) => f.status === 'open' && f.kind === 'autonomous' && !acked.has(f.id)).map((f) => f.id)
    const sugg = Object.keys(cells).filter((k) => cells[k].status === 'suggested' && !acked.has(k))
    return { auto, sugg, count: auto.length + sugg.length }
  }, [cells, flags, acked])

  // ── Researcher handlers ───────────────────────────────────────────────────
  const onSelect = (key) => setSelectedKey(key)

  const onAccept = (key) => {
    setCells((c) => ({ ...c, [key]: { ...c[key], status: 'accepted', act: 'extraction' } }))
    log('M. Okafor', 'accepted AI suggestion', label(key), 'human')
  }
  const onReject = (key) => {
    setCells((c) => { const n = { ...c }; delete n[key]; return n })
    log('M. Okafor', 'rejected AI suggestion', label(key), 'human')
    setSelectedKey((s) => (s === key ? null : s))
  }
  const onAdd = (key) => {
    setCells((c) => ({ ...c, [key]: { source: 'human', status: 'accepted', act: null, confidence: null, rationale: null, evidence: 'Manually added by designer', siteNote: null } }))
    log('M. Okafor', 'added assessment', label(key), 'human')
    setSelectedKey(key)
  }
  const onOverride = (key) => {
    setCells((c) => ({ ...c, [key]: { ...c[key], source: 'human', status: 'edited', act: null } }))
    log('M. Okafor', 'overrode AI draft', label(key), 'human')
  }
  const onRemove = (key) => {
    setCells((c) => { const n = { ...c }; delete n[key]; return n })
    log('M. Okafor', 'removed assessment', label(key), 'human')
    setSelectedKey((s) => (s === key ? null : s))
  }
  const onResolve = (id) => {
    const flag = flags.find((f) => f.id === id)
    if (!flag || flag.status !== 'open') return
    setCells((c) => { const n = { ...c }; for (const k of flag.targets) delete n[k]; return n })
    setFlags((fs) => fs.map((f) => (f.id === id ? { ...f, status: 'resolved' } : f)))
    log('KITT + M. Okafor', 'resolved risk driver', `${flag.title} (−${(flag.exposure / 1000) | 0}K exposure)`, 'ai')
    setSelectedKey((s) => (flag.targets.includes(s) ? null : s))
    flash(`Fix applied — ${flag.title} removed`)
  }

  // ── Reviewer handlers ─────────────────────────────────────────────────────
  const onAck = (id) => {
    setAcked((a) => new Set(a).add(id))
    const what = id.includes('@') ? label(id) : (flags.find((f) => f.id === id)?.title ?? id)
    log('Dr. Reyes (Reviewer)', 'approved AI act', what, 'human')
  }
  const onApprove = (id) => {
    const next = new Set(approvals).add(id)
    setApprovals(next)
    log('Dr. Reyes (Reviewer)', 'signed off section', id.toUpperCase(), 'human')
    if (SIGNABLE.every((s) => next.has(s.id))) {
      setHandoff('signed')
      flash('All sections signed off — ready to export')
    }
  }

  // ── Handoff ───────────────────────────────────────────────────────────────
  const onSubmit = () => {
    setHandoff('submitted'); setSelectedKey(null); setView('reviewer')
    log('M. Okafor', 'submitted for review', `${pendingItems.count} AI act(s) pending sign-off`, 'human')
    flash('Submitted for review — handed to Dr. Reyes')
  }
  const onReturn = () => {
    setHandoff('returned'); setSelectedKey(null); setView('researcher')
    log('Dr. Reyes (Reviewer)', 'returned for revision', 'protocol sent back to designer', 'human')
    flash('Returned for revision — back to Maya')
  }

  const onReset = () => {
    setView('researcher')
    setCells(structuredClone(INITIAL_CELLS))
    setFlags(structuredClone(INITIAL_FLAGS))
    setApprovals(new Set()); setAcked(new Set())
    setAudit(SEED_AUDIT.map((e) => ({ ...e })))
    setHandoff('draft'); setExported(false); setSelectedKey(null)
    flash('Demo reset — start from the top')
  }

  const onExport = () => {
    const usdm = {
      studyDefinition: {
        studyId: STUDY.id, studyTitle: STUDY.title, studyPhase: STUDY.phase, studyVersion: STUDY.version,
        standard: 'CDISC USDM 4.0 / ICH M11 CeSHarP',
        scheduleOfActivities: {
          encounters: VISITS.map((v) => ({ id: v.id, name: v.label, window: v.window })),
          activities: CATEGORIES.flatMap((cat) =>
            cat.items.map((it) => ({
              id: it.id, name: it.label, category: cat.label, m11Section: cat.m11,
              timepoints: VISITS.filter((v) => cells[cellKey(it.id, v.id)] && cells[cellKey(it.id, v.id)].status !== 'suggested').map((v) => v.id),
            })),
          ),
        },
        provenance: Object.entries(cells).map(([k, c]) => ({
          cell: k, source: c.source, act: c.act, status: c.status, confidence: c.confidence,
          siteFeedback: c.siteNote ? true : undefined,
        })),
        auditTrail: audit,
      },
    }
    const blob = new Blob([JSON.stringify(usdm, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${STUDY.short}-USDM.json`; a.click()
    URL.revokeObjectURL(url)
    setExported(true)
    flash(handoff === 'signed' ? 'USDM exported — protocol released to build' : 'USDM exported — ready to configure EDC')
  }

  // ── Guided-flow state ─────────────────────────────────────────────────────
  const pendingCount = pendingItems.count
  const guide = useMemo(() => {
    const openFlags = flags.filter((f) => f.status === 'open').length
    const remainingSugg = Object.values(cells).filter((c) => c.status === 'suggested').length
    const signedCount = SIGNABLE.filter((s) => approvals.has(s.id)).length
    const submitted = handoff === 'submitted' || handoff === 'signed'

    const defs = [
      { label: 'Resolve drivers', view: 'researcher', done: openFlags === 0,
        title: 'Resolve the risk drivers', detail: `${BASELINE_FLAGS - openFlags}/${BASELINE_FLAGS} resolved — click “Apply fix” in the right panel.` },
      { label: 'Decide suggestions', view: 'researcher', done: remainingSugg === 0,
        title: 'Decide the AI suggestions', detail: `${INITIAL_SUGGESTIONS - remainingSugg}/${INITIAL_SUGGESTIONS} done — accept or reject each pulsing cell.` },
      { label: 'Submit', view: 'researcher', done: submitted,
        title: 'Submit for review', detail: 'hand the protocol to the reviewer (top-right).' },
      { label: 'Clear queue', view: 'reviewer', done: submitted && pendingItems.count === 0,
        title: 'Clear the sign-off queue', detail: `${pendingItems.count} AI act(s) left — open each and Approve.` },
      { label: 'Sign off', view: 'reviewer', done: signedCount === SIGNABLE.length,
        title: 'Sign off the M11 sections', detail: `${signedCount}/${SIGNABLE.length} signed in the right panel.` },
      { label: 'Export', view: 'reviewer', done: exported,
        title: 'Export the USDM', detail: 'release the born-digital protocol to build (top-right).' },
    ]
    const activeIndex = defs.findIndex((d) => !d.done)
    const steps = defs.map((d, i) => ({ label: d.label, status: d.done ? 'done' : i === activeIndex ? 'current' : 'todo' }))
    const active = activeIndex >= 0 ? defs[activeIndex] : null
    return {
      steps, activeIndex,
      instruction: active ? { title: active.title, detail: active.detail } : { title: '', detail: '' },
      switchTo: active && active.view !== view ? active.view : null,
    }
  }, [cells, flags, approvals, handoff, exported, pendingItems.count, view])

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DesktopNote />
      <TopBar view={view} setView={setView} onExport={onExport} onSubmit={onSubmit} handoff={handoff} risk={risk} pendingCount={pendingCount} exportReady={handoff === 'signed'} />
      <Guide
        open={guideOpen} onShow={() => setGuideOpen(true)} onDismiss={() => setGuideOpen(false)}
        steps={guide.steps} activeIndex={guide.activeIndex} instruction={guide.instruction} switchTo={guide.switchTo}
        view={view} onReset={onReset}
      />
      <div className="flex min-h-0 flex-1">
        <SectionRail />
        <main className="min-w-0 flex-1">
          <SoAMatrix cells={cells} view={view} selectedKey={selectedKey} flaggedKeys={flaggedKeys}
            onSelect={onSelect} onAccept={onAccept} onReject={onReject} onAdd={onAdd} />
        </main>
        <RightPanel
          view={view} selectedKey={selectedKey} cells={cells} flags={flags} risk={risk}
          baselineExposure={BASELINE_EXPOSURE} baselineFlags={BASELINE_FLAGS}
          approvals={approvals} acked={acked} audit={audit}
          onSelect={onSelect} onAccept={onAccept} onReject={onReject} onOverride={onOverride}
          onRemove={onRemove} onResolve={onResolve} onApprove={onApprove} onReturn={onReturn} onAck={onAck}
        />
      </div>

      {toast && (
        <div className="rise fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-[13px] font-semibold text-white shadow-xl">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-brand"><Check size={13} /></span>
          {toast}
        </div>
      )}
    </div>
  )
}
