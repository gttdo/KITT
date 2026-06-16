import RiskMeter from './RiskMeter'
import { ITEM_BY_ID, VISITS, SOURCE, ACT, M11_SECTIONS } from '../data/study'
import { fmtUSD } from '../lib/risk'
import { Check, X, Sparkle, Alert, Shield, Eye, Pencil, Clock, Doc } from './icons'

const VISIT_LABEL = Object.fromEntries(VISITS.map((v) => [v.id, v.label]))
const SEV = {
  high: { cls: 'bg-risk-high-tint text-risk-high ring-risk-high', dot: 'bg-risk-high' },
  medium: { cls: 'bg-risk-med-tint text-risk-med ring-risk-med', dot: 'bg-risk-med' },
  low: { cls: 'bg-slate-50 text-slate-600 ring-slate-200', dot: 'bg-slate-400' },
}
const ACT_TONE = {
  extraction: { chip: 'bg-library-tint text-library', icon: Doc },
  recommendation: { chip: 'bg-ai-tint text-ai', icon: Sparkle },
  autonomous: { chip: 'bg-risk-high-tint text-risk-high', icon: Alert },
}
const KIND_TAG = {
  autonomous: { label: 'Autonomous classification', cls: 'bg-ai-tint text-ai' },
  site: { label: 'Site feasibility', cls: 'bg-site-tint text-site' },
}

function parseKey(key) {
  const [itemId, visitId] = key.split('@')
  return { item: ITEM_BY_ID[itemId], visit: VISIT_LABEL[visitId], itemId, visitId }
}

// ── Risk drivers (researcher default) ────────────────────────────────────────
function FlagList({ flags, onResolve, onSelect }) {
  const open = flags.filter((f) => f.status === 'open')
  const done = flags.filter((f) => f.status !== 'open')
  return (
    <div className="px-5 py-4">
      <h3 className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-500">
        <Sparkle size={13} className="text-ai" /> Risk drivers
      </h3>
      <p className="mt-0.5 text-[11.5px] text-slate-500">KITT detected avoidable complexity. Resolving applies the fix to the SoA.</p>

      <div className="mt-3 space-y-2.5">
        {open.map((f) => {
          const sev = SEV[f.severity]
          const tag = KIND_TAG[f.kind]
          return (
            <div key={f.id} className="rise rounded-xl border border-slate-200 p-3 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`mt-0.5 h-2 w-2 rounded-full ${sev.dot}`} />
                  <span className="text-[13px] font-semibold text-slate-800">{f.title}</span>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${sev.cls}`}>{f.severity}</span>
              </div>
              {tag && (
                <span className={`mt-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${tag.cls}`}>{tag.label}</span>
              )}
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-600">{f.detail}</p>
              <div className="mt-2 flex items-center gap-2 font-mono text-[10px] text-slate-400">
                <Doc size={11} /> {f.evidence}
              </div>
              <div className="mt-2 leading-tight">
                <div className="text-[11px] font-semibold text-risk-high tnum">{fmtUSD(f.exposure)} est. exposure</div>
                <div className="text-[9.5px] text-slate-400">{f.basis}</div>
              </div>
              <div className="mt-2 flex items-center justify-end gap-1.5">
                <button onClick={() => onSelect(f.targets[0])} className="rounded-lg px-3 py-1.5 text-[11.5px] font-semibold text-slate-500 hover:bg-slate-100">Locate</button>
                <button onClick={() => onResolve(f.id)} className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-[11.5px] font-semibold text-white hover:bg-slate-700">
                  <Check size={13} /> Apply fix
                </button>
              </div>
            </div>
          )
        })}

        {open.length === 0 && (
          <div className="rounded-xl bg-risk-low-tint p-4 text-center ring-1 ring-risk-low/40">
            <Shield size={22} className="mx-auto text-risk-low" />
            <div className="mt-1.5 text-[13px] font-bold text-slate-800">No open risk drivers</div>
            <div className="text-[11.5px] text-slate-600">All avoidable burden has been designed out.</div>
          </div>
        )}

        {done.map((f) => (
          <div key={f.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-slate-400">
            <Check size={14} className="text-risk-low" />
            <span className="line-through">{f.title}</span>
            <span className="ml-auto font-mono text-[10px]">{fmtUSD(f.exposure)} saved</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Provenance card (cell selected) ──────────────────────────────────────────
function ProvenanceCard({ cell, sel, flag, view, acked, onAck, onAccept, onReject, onOverride, onRemove, onResolve, onClose }) {
  const src = SOURCE[cell.source]
  const isReviewer = view === 'reviewer'
  const isSuggested = cell.status === 'suggested'
  const act = cell.act ? ACT[cell.act] : null
  const actTone = cell.act ? ACT_TONE[cell.act] : null
  const ActIcon = actTone?.icon

  const lineage = [
    { actor: 'KITT', text: 'Drafted from indication library', kind: 'ai', show: cell.source === 'ai' && cell.act === 'extraction' },
    { actor: 'KITT', text: 'Suggested — pending human decision', kind: 'ai', show: isSuggested },
    { actor: 'M. Okafor', text: 'Reviewed & accepted', kind: 'human', show: cell.source === 'ai' && cell.status === 'accepted' },
    { actor: 'M. Okafor', text: 'Authored manually', kind: 'human', show: cell.source === 'human' && cell.status !== 'edited' },
    { actor: 'M. Okafor', text: 'Overrode AI draft', kind: 'human', show: cell.status === 'edited' },
    { actor: 'Library', text: 'Imported verbatim from validated template', kind: 'lib', show: cell.source === 'library' },
    { actor: 'Sam Rivera', text: 'Site feasibility comment attached', kind: 'site', show: !!cell.siteNote },
  ].filter((l) => l.show)

  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Provenance</div>
          <div className="mt-0.5 text-[15px] font-bold text-slate-900">{sel.item.label}</div>
          <div className="text-[12px] text-slate-500">at {sel.visit}</div>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X size={16} /></button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${src.soft} ${src.text}`}>
          <span className={`h-2 w-2 rounded-full ${src.dot}`} /> {src.label}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11.5px] font-medium capitalize text-slate-600">{cell.status}</span>
      </div>

      {/* AI-act taxonomy — the regulator's classification */}
      {act && (
        <div className="mt-3 rounded-lg border border-slate-200 p-2.5">
          <div className="flex items-center gap-1.5">
            <span className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-bold ${actTone.chip}`}>
              {ActIcon && <ActIcon size={12} />} {act.label}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{act.scrutiny}</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600">{act.note}</p>
        </div>
      )}

      {cell.confidence != null && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>AI confidence</span><span className="tnum text-slate-700">{Math.round(cell.confidence * 100)}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${cell.confidence >= 0.75 ? 'bg-ai' : 'bg-risk-med'}`} style={{ width: `${cell.confidence * 100}%` }} />
          </div>
          {cell.confidence < 0.6 && <div className="mt-1 text-[10.5px] font-medium text-risk-med">Low confidence — recommend human judgment.</div>}
        </div>
      )}

      {cell.rationale && (
        <div className="mt-3 rounded-lg bg-slate-50 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Rationale</div>
          <p className="mt-1 text-[12px] leading-relaxed text-slate-700">{cell.rationale}</p>
        </div>
      )}
      {cell.evidence && (
        <div className="mt-2 flex items-start gap-1.5 font-mono text-[10.5px] text-slate-400"><Doc size={12} className="mt-px shrink-0" /> {cell.evidence}</div>
      )}

      {/* Site feedback (Sam) */}
      {cell.siteNote && (
        <div className="mt-3 rounded-lg bg-site-tint p-3 ring-1 ring-site/30">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-site"><span className="h-2 w-2 rounded-full bg-site" /> Site feedback</div>
          <p className="mt-1 text-[11.5px] leading-relaxed text-slate-600">{cell.siteNote}</p>
        </div>
      )}

      {flag && (
        <div className="mt-3 rounded-lg bg-risk-high-tint p-3 ring-1 ring-risk-high/30">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-risk-high"><Alert size={14} /> {flag.title}</div>
          {KIND_TAG[flag.kind] && <span className={`mt-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${KIND_TAG[flag.kind].cls}`}>{KIND_TAG[flag.kind].label}</span>}
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-600">{flag.detail}</p>
          {!isReviewer && (
            <button onClick={() => onResolve(flag.id)} className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-risk-high py-1.5 text-[12px] font-semibold text-white hover:opacity-90">
              <Check size={13} /> Apply fix · save {fmtUSD(flag.exposure)}
            </button>
          )}
        </div>
      )}

      <div className="mt-4">
        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Audit lineage</div>
        <ol className="mt-2 space-y-2">
          {lineage.map((l, i) => (
            <li key={i} className="flex items-center gap-2 text-[12px]">
              <span className={`grid h-5 w-5 place-items-center rounded-full text-white ${l.kind === 'ai' ? 'bg-ai' : l.kind === 'lib' ? 'bg-library' : l.kind === 'site' ? 'bg-site' : 'bg-human'}`}>
                {l.kind === 'ai' ? <Sparkle size={11} /> : <Check size={11} />}
              </span>
              <span className="font-semibold text-slate-700">{l.actor}</span>
              <span className="text-slate-500">{l.text}</span>
            </li>
          ))}
        </ol>
      </div>

      {!isReviewer && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          {isSuggested ? (
            <>
              <button onClick={() => onAccept(sel.key)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ai px-3 py-2 text-[12px] font-semibold text-white hover:opacity-90">
                <Check size={14} /> Accept suggestion
              </button>
              <button onClick={() => onReject(sel.key)} className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-slate-500 ring-1 ring-slate-300 hover:bg-slate-50">
                <X size={14} /> Reject
              </button>
            </>
          ) : (
            <>
              {cell.source !== 'human' && (
                <button onClick={() => onOverride(sel.key)} className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50">
                  <Pencil size={13} /> Override as human
                </button>
              )}
              <button onClick={() => onRemove(sel.key)} className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-risk-high ring-1 ring-risk-high/40 hover:bg-risk-high-tint">
                <X size={13} /> Remove
              </button>
            </>
          )}
        </div>
      )}
      {isReviewer && (() => {
        const canFlag = flag && flag.kind === 'autonomous' && !acked.has(flag.id)
        const canSugg = isSuggested && !acked.has(sel.key)
        if (canFlag || canSugg) {
          return (
            <div className="mt-4 border-t border-slate-100 pt-3">
              <button onClick={() => onAck(canFlag ? flag.id : sel.key)} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-[12px] font-semibold text-white hover:opacity-90">
                <Check size={14} /> Approve {canFlag ? 'classification' : 'recommendation'}
              </button>
              <p className="mt-1.5 text-center text-[10.5px] text-slate-400">Records reviewer approval of this AI act in the audit trail.</p>
            </div>
          )
        }
        return (
          <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-[11.5px] text-slate-500"><Eye size={14} /> Reviewed — no action required.</div>
        )
      })()}
    </div>
  )
}

// ── Reviewer audit summary + sign-off ────────────────────────────────────────
function ReviewerSummary({ cells, flags, approvals, acked, onApprove, onAck, onReturn, audit, onSelect }) {
  const present = Object.values(cells)
  const total = present.length
  const ai = present.filter((c) => c.source === 'ai' && c.status !== 'suggested').length
  const human = present.filter((c) => c.source === 'human').length
  const lib = present.filter((c) => c.source === 'library').length
  const siteTouched = present.filter((c) => c.siteNote).length

  const pendingSuggestions = Object.keys(cells).filter((k) => cells[k].status === 'suggested' && !acked.has(k))
  const openAutonomous = flags.filter((f) => f.status === 'open' && f.kind === 'autonomous' && !acked.has(f.id))
  const queueCount = pendingSuggestions.length + openAutonomous.length
  const aiPct = total ? Math.round((ai / total) * 100) : 0

  return (
    <div className="px-5 py-4">
      <h3 className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-500"><Shield size={13} className="text-brand" /> Audit summary</h3>

      <div className="mt-3 rounded-xl border border-slate-200 p-3">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[26px] font-bold leading-none text-slate-900 tnum">{aiPct}%</div>
            <div className="text-[11px] font-medium text-slate-500">AI-assisted, 100% human-approved</div>
          </div>
          <Sparkle size={20} className="text-ai" />
        </div>
        <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="bg-ai" style={{ width: `${(ai / total) * 100}%` }} />
          <div className="bg-human" style={{ width: `${(human / total) * 100}%` }} />
          <div className="bg-library" style={{ width: `${(lib / total) * 100}%` }} />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[11px]">
          <div><div className="font-bold text-ai tnum">{ai}</div><div className="text-slate-400">AI</div></div>
          <div><div className="font-bold text-human tnum">{human}</div><div className="text-slate-400">Human</div></div>
          <div><div className="font-bold text-library tnum">{lib}</div><div className="text-slate-400">Library</div></div>
        </div>
        {siteTouched > 0 && (
          <div className="mt-2 rounded-lg bg-site-tint px-2.5 py-1.5 text-[11px] font-medium text-site">{siteTouched} cells carry site (CRC) feedback.</div>
        )}
      </div>

      {/* Pending sign-off queue */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Pending your sign-off</div>
        <span className="rounded-full bg-risk-high-tint px-2 py-0.5 text-[10px] font-bold text-risk-high">{queueCount}</span>
      </div>
      <div className="mt-2 space-y-1.5">
        {openAutonomous.map((f) => (
          <div key={f.id} className="flex items-center gap-1.5 rounded-lg border border-slate-100 px-2.5 py-1.5">
            <button onClick={() => onSelect(f.targets[0])} className="flex flex-1 items-center gap-2 overflow-hidden text-left">
              <Alert size={13} className="shrink-0 text-risk-high" />
              <span className="flex-1 truncate text-[12px] font-medium text-slate-700">{f.title}</span>
              <span className="rounded bg-ai-tint px-1.5 py-0.5 text-[9px] font-semibold text-ai">autonomous</span>
            </button>
            <button onClick={() => onAck(f.id)} className="shrink-0 rounded-md bg-brand px-2 py-1 text-[10.5px] font-semibold text-white hover:opacity-90">Approve</button>
          </div>
        ))}
        {pendingSuggestions.slice(0, 6).map((k) => {
          const s = parseKey(k)
          return (
            <div key={k} className="flex items-center gap-1.5 rounded-lg border border-slate-100 px-2.5 py-1.5">
              <button onClick={() => onSelect(k)} className="flex flex-1 items-center gap-2 overflow-hidden text-left">
                <Sparkle size={13} className="shrink-0 text-ai" />
                <span className="flex-1 truncate text-[12px] font-medium text-slate-700">{s.item.label} · {s.visit}</span>
                <span className="rounded bg-ai-tint px-1.5 py-0.5 text-[9px] font-semibold text-ai">recommend.</span>
              </button>
              <button onClick={() => onAck(k)} className="shrink-0 rounded-md bg-brand px-2 py-1 text-[10.5px] font-semibold text-white hover:opacity-90">Approve</button>
            </div>
          )
        })}
        {queueCount === 0 && (
          <div className="flex items-center gap-1.5 rounded-lg bg-risk-low-tint px-3 py-2 text-[11.5px] font-medium text-slate-600">
            <Check size={14} className="text-risk-low" /> Queue clear — every AI act approved.
          </div>
        )}
      </div>
      <button onClick={onReturn} className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-risk-med ring-1 ring-risk-med/40 hover:bg-risk-med-tint">
        <X size={13} /> Return for revision
      </button>

      {/* Section sign-off */}
      <div className="mt-4 text-[10px] font-bold uppercase tracking-wide text-slate-400">Section sign-off</div>
      <div className="mt-2 space-y-1.5">
        {M11_SECTIONS.map((s) => {
          const approved = approvals.has(s.id) || s.status === 'approved'
          return (
            <div key={s.id} className="flex items-center gap-2 rounded-lg border border-slate-100 px-2.5 py-2">
              <span className="font-mono text-[11px] font-semibold text-slate-400">{s.no}</span>
              <span className="flex-1 truncate text-[12px] font-medium text-slate-700">{s.label}</span>
              {approved ? (
                <span className="flex items-center gap-1 rounded-md bg-risk-low-tint px-2 py-1 text-[11px] font-semibold text-risk-low"><Check size={12} /> Approved</span>
              ) : (
                <button onClick={() => onApprove(s.id)} className="rounded-md bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-700">Sign off</button>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-[10px] font-bold uppercase tracking-wide text-slate-400">Audit trail</div>
      <ol className="mt-2 space-y-2.5 border-l border-slate-200 pl-3">
        {audit.map((e, i) => (
          <li key={i} className="relative">
            <span className={`absolute -left-[18px] top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full ring-2 ring-white ${e.kind === 'ai' ? 'bg-ai' : e.kind === 'site' ? 'bg-site' : 'bg-human'}`} />
            <div className="text-[12px] leading-tight">
              <span className="font-semibold text-slate-700">{e.actor}</span> <span className="text-slate-500">{e.action}</span> <span className="text-slate-600">{e.target}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400"><Clock size={10} /> {e.t}</div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function RightPanel(props) {
  const { view, selectedKey, cells, flags, risk, baselineExposure, baselineFlags } = props
  const sel = selectedKey && cells[selectedKey] ? { key: selectedKey, ...parseKey(selectedKey) } : null
  const selFlag = sel ? flags.find((f) => f.status === 'open' && f.targets.includes(selectedKey)) : null

  return (
    <aside className="flex w-[360px] shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-white">
      <RiskMeter risk={risk} baselineExposure={baselineExposure} baselineFlags={baselineFlags} />
      {sel ? (
        <ProvenanceCard cell={cells[selectedKey]} sel={sel} flag={selFlag} view={view} acked={props.acked} onAck={props.onAck}
          onAccept={props.onAccept} onReject={props.onReject} onOverride={props.onOverride} onRemove={props.onRemove} onResolve={props.onResolve} onClose={() => props.onSelect(null)} />
      ) : view === 'reviewer' ? (
        <ReviewerSummary cells={cells} flags={flags} approvals={props.approvals} acked={props.acked} onApprove={props.onApprove} onAck={props.onAck} onReturn={props.onReturn} audit={props.audit} onSelect={props.onSelect} />
      ) : (
        <FlagList flags={flags} onResolve={props.onResolve} onSelect={props.onSelect} />
      )}
    </aside>
  )
}
