import { VISITS, CATEGORIES, SOURCE, cellKey } from '../data/study'
import { Check, Sparkle, Plus, X, Alert } from './icons'

const VISIT_KIND = {
  screen: 'text-slate-500', baseline: 'text-brand', primary: 'text-risk-high',
  eot: 'text-slate-500', followup: 'text-slate-500', treatment: 'text-slate-600',
}

function LegendChip({ dot, label, dashed }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
      <span className={`h-3 w-3 rounded ${dashed ? 'border-2 border-dashed border-ai bg-ai-tint' : dot}`} />
      {label}
    </span>
  )
}

function Cell({ cell, k, view, selected, flagged, onSelect, onAccept, onReject, onAdd }) {
  const isReviewer = view === 'reviewer'

  if (!cell) {
    return (
      <td className="border border-slate-100 p-0">
        {!isReviewer ? (
          <button onClick={() => onAdd(k)} className="group/add grid h-9 w-full place-items-center" title="Add assessment (human-authored)">
            <Plus size={13} className="text-slate-300 opacity-0 transition group-hover/add:opacity-100" />
          </button>
        ) : (
          <div className="h-9" />
        )}
      </td>
    )
  }

  const src = SOURCE[cell.source]

  if (cell.status === 'suggested') {
    return (
      <td className="border border-slate-100 p-0">
        <div className="group/sg relative grid h-9 place-items-center">
          <button onClick={() => onSelect(k)}
            className={`ai-pending grid h-[22px] w-[22px] place-items-center rounded-md border-2 border-dashed border-ai bg-ai-tint ${selected ? 'ring-2 ring-ai ring-offset-1' : ''}`}
            title="AI suggestion — pending review">
            <Sparkle size={12} className="text-ai" />
          </button>
          {!isReviewer && (
            <div className="absolute inset-0 hidden items-center justify-center gap-1 bg-white/85 group-hover/sg:flex">
              <button onClick={() => onAccept(k)} className="grid h-[22px] w-[22px] place-items-center rounded-md bg-ai text-white shadow-sm hover:opacity-90" title="Accept suggestion">
                <Check size={13} />
              </button>
              <button onClick={() => onReject(k)} className="grid h-[22px] w-[22px] place-items-center rounded-md bg-white text-slate-400 ring-1 ring-slate-300 hover:text-risk-high hover:ring-risk-high" title="Reject suggestion">
                <X size={13} />
              </button>
            </div>
          )}
        </div>
      </td>
    )
  }

  return (
    <td className="border border-slate-100 p-0">
      <div className="relative grid h-9 place-items-center">
        <button onClick={() => onSelect(k)}
          className={`grid h-[22px] w-[22px] place-items-center rounded-md text-white shadow-sm transition ${src.dot} ${selected ? 'ring-2 ring-offset-1 ' + src.ring : ''} ${flagged ? 'ring-2 ring-risk-high ring-offset-1' : ''}`}
          title={`${src.label}${flagged ? ' · flagged: avoidable complexity' : ''}${cell.siteNote ? ' · site feedback attached' : ''}`}>
          {cell.source === 'ai' ? <Sparkle size={12} /> : <Check size={13} />}
        </button>
        {flagged && (
          <span className="absolute -right-0.5 -top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-risk-high text-white ring-2 ring-white">
            <Alert size={9} />
          </span>
        )}
        {cell.siteNote && (
          <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full bg-site ring-2 ring-white" title="Site feedback attached" />
        )}
      </div>
    </td>
  )
}

export default function SoAMatrix({ cells, view, selectedKey, flaggedKeys, onSelect, onAccept, onReject, onAdd }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3">
        <div>
          <h1 className="text-[15px] font-bold tracking-tight text-slate-900">Schedule of Assessments</h1>
          <p className="text-[11.5px] text-slate-500">
            {VISITS.length} visits · ICH M11 §8 · {view === 'reviewer' ? 'Read-only audit view' : 'Click a cell for provenance'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <LegendChip dot={SOURCE.ai.dot} label="AI-drafted" />
          <LegendChip dot={SOURCE.human.dot} label="Human" />
          <LegendChip dot={SOURCE.library.dot} label="Library" />
          <LegendChip dot={SOURCE.site.dot} label="Site" />
          <LegendChip dashed label="Suggested" />
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
            <span className="grid h-3 w-3 place-items-center rounded-full bg-risk-high"><Alert size={8} className="text-white" /></span>
            Flagged
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        <table className="border-separate border-spacing-0">
          <thead className="sticky top-0 z-20">
            <tr>
              <th className="sticky left-0 z-30 w-[208px] min-w-[208px] border-b border-slate-200 bg-slate-50 px-4 py-2 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assessment</span>
              </th>
              {VISITS.map((v) => (
                <th key={v.id} className={`w-[68px] min-w-[68px] border-b border-l border-slate-200 px-1 py-2 text-center ${v.kind === 'primary' ? 'bg-risk-high-tint' : 'bg-slate-50'}`}>
                  <div className={`text-[11.5px] font-bold ${VISIT_KIND[v.kind]}`}>{v.label}</div>
                  <div className="text-[9px] font-medium text-slate-400">{v.window}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat) => (
              <CategoryRows key={cat.id} cat={cat} cells={cells} view={view} selectedKey={selectedKey} flaggedKeys={flaggedKeys}
                onSelect={onSelect} onAccept={onAccept} onReject={onReject} onAdd={onAdd} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CategoryRows({ cat, cells, view, selectedKey, flaggedKeys, onSelect, onAccept, onReject, onAdd }) {
  return (
    <>
      <tr>
        <td colSpan={VISITS.length + 1} className="sticky left-0 z-10 border-b border-slate-200 bg-slate-100/80 px-4 py-1.5 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{cat.label}</span>
            <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-slate-400">{cat.m11}</span>
          </div>
        </td>
      </tr>
      {cat.items.map((item) => (
        <tr key={item.id} className="hover:bg-slate-50/60">
          <td className="sticky left-0 z-10 border-b border-slate-100 bg-white px-4 py-0 hover:bg-slate-50">
            <span className="text-[12.5px] font-medium text-slate-700">{item.label}</span>
          </td>
          {VISITS.map((v) => {
            const k = cellKey(item.id, v.id)
            return (
              <Cell key={k} k={k} cell={cells[k]} view={view} selected={selectedKey === k} flagged={flaggedKeys.has(k)}
                onSelect={onSelect} onAccept={onAccept} onReject={onReject} onAdd={onAdd} />
            )
          })}
        </tr>
      ))}
    </>
  )
}
