import { useEffect, useRef, useState, type ReactNode } from 'react';

/* Chart colours. Categorical and ordinal sets were checked for colour-blind separation and contrast on white. */
export const C = {
  blue: '#2347C8',
  teal: '#0D9488',
  orange: '#EB6834',
  muted: '#CBD5E1',
  other: '#94A3B8',
  ramp: ['#8BAAF7', '#5A82EF', '#2347C8', '#1A2B63'],
};

const fmt = (n: number) => n.toLocaleString('en-US');
const focusRing = 'outline-none focus-visible:ring-2 focus-visible:ring-brand-300';

/* ---------- Card with a chart / table switch ---------- */

type Table = { caption?: string; head: string[]; rows: (string | number)[][] };

export function ChartCard({
  title,
  takeaway,
  children,
  table,
  footnote,
}: {
  title: string;
  takeaway: ReactNode;
  children: ReactNode;
  table: Table | Table[];
  footnote?: ReactNode;
}) {
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const tables = Array.isArray(table) ? table : [table];
  const tab = (id: 'chart' | 'table', label: string) => (
    <button
      type="button"
      onClick={() => setView(id)}
      aria-pressed={view === id}
      className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
        view === id ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-[0_18px_40px_-30px_rgba(14,24,56,0.45)]">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <h5 className="text-lg sm:text-xl font-bold text-ink leading-snug max-w-xl">{title}</h5>
        <div className="flex rounded-lg bg-slate-100 p-0.5" role="group" aria-label="Choose chart or table view">
          {tab('chart', 'Chart')}
          {tab('table', 'Table')}
        </div>
      </div>
      <p className="text-slate-600 leading-relaxed mb-6 max-w-2xl">{takeaway}</p>
      {view === 'chart' ? (
        children
      ) : (
        <div className="space-y-8">
          {tables.map((t, ti) => (
            <div key={ti} className="overflow-x-auto">
              {t.caption && <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{t.caption}</p>}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    {t.head.map((h) => (
                      <th key={h} className="py-2 pr-4 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      {r.map((c, j) => (
                        <td key={j} className={`py-2 pr-4 ${j === 0 ? 'text-ink font-medium' : 'text-slate-700 tabular'}`}>
                          {typeof c === 'number' ? fmt(c) : c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
      {footnote && <p className="mt-5 text-xs text-slate-500 leading-relaxed">{footnote}</p>}
    </div>
  );
}

/* ---------- Shared pieces ---------- */

/** Hover / keyboard-focus detail. Sits inside an element with the classes `group relative`. */
export function Tip({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    // keep the tooltip inside the viewport when its mark sits near an edge
    const place = () => {
      el.style.marginLeft = '0px';
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const vw = document.documentElement.clientWidth;
      let shift = 0;
      if (r.right > vw - 8) shift = vw - 8 - r.right;
      if (r.left + shift < 8) shift = 8 - r.left;
      el.style.marginLeft = `${shift}px`;
    };
    host.addEventListener('pointerenter', place);
    host.addEventListener('focus', place);
    return () => {
      host.removeEventListener('pointerenter', place);
      host.removeEventListener('focus', place);
    };
  }, []);
  return (
    <span
      ref={ref}
      role="tooltip"
      className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-20 hidden group-hover:block group-focus:block w-max max-w-[min(260px,calc(100vw-16px))] rounded-lg bg-ink px-3 py-1.5 text-xs text-white shadow-lg text-left"
    >
      {children}
    </span>
  );
}

export const TipLine = ({ value, label }: { value: string; label: string }) => (
  <span className="block">
    <span className="font-bold">{value}</span>
    <span className="text-slate-300"> · {label}</span>
  </span>
);

export function Legend({ items, marker = 'square' }: { items: { name: string; color: string; value?: string }[]; marker?: 'square' | 'dot' | 'line' }) {
  const shape = marker === 'dot' ? 'w-3 h-3 rounded-full' : marker === 'line' ? 'w-4 h-0.5 rounded-full' : 'w-3 h-3 rounded-sm';
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-700">
      {items.map((i) => (
        <li key={i.name} className="flex items-center gap-2">
          <span className={`inline-block ${shape}`} style={{ background: i.color }} aria-hidden="true" />
          {i.name}
          {i.value && <span className="font-semibold text-ink tabular">{i.value}</span>}
        </li>
      ))}
    </ul>
  );
}

const ChartLabel = ({ children }: { children: ReactNode }) => (
  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{children}</p>
);
export { ChartLabel };

/* ---------- 1. Column chart, one bar highlighted ---------- */

export function Columns({ rows, axisTitle }: { rows: { label: string; value: number; display: string; detail: string; highlight?: boolean }[]; axisTitle: string }) {
  const top = Math.max(...rows.map((r) => r.value));
  return (
    <div>
      <div className="flex items-end gap-1 sm:gap-3 h-56 border-b border-slate-300">
        {rows.map((r) => (
          <div key={r.label} tabIndex={0} className={`group relative flex-1 h-full flex flex-col justify-end items-center ${focusRing} rounded-sm`}>
            <span className={`mb-1 text-[10px] sm:text-xs tabular ${r.highlight ? 'font-bold text-ink' : 'text-slate-600'}`}>{r.display}</span>
            <div
              className="w-full max-w-6 rounded-t group-hover:brightness-110"
              style={{ height: `${Math.max(0.6, (r.value / top) * 86)}%`, background: r.highlight ? C.blue : C.muted }}
            />
            <Tip>
              <TipLine value={r.display} label={`${r.label} · ${r.detail}`} />
            </Tip>
          </div>
        ))}
      </div>
      <div className="flex gap-1 sm:gap-3 mt-1.5">
        {rows.map((r) => (
          <span key={r.label} className={`flex-1 text-center text-[10px] sm:text-xs leading-tight ${r.highlight ? 'font-bold text-ink' : 'text-slate-600'}`}>
            {r.label.replace(/ nights?/, '')}
          </span>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-slate-500">{axisTitle}</p>
    </div>
  );
}

/* ---------- 2. Line chart over ordered categories ---------- */

export function Lines({
  categories,
  series,
  detail,
}: {
  categories: string[];
  series: { name: string; color: string; values: number[] }[];
  detail?: string[];
}) {
  const x = (i: number) => ((i + 0.5) / categories.length) * 100;
  const y = (v: number) => 100 - v; // 0-100 % scale
  return (
    <div>
      <Legend marker="line" items={series.map((s) => ({ name: s.name, color: s.color }))} />
      <div className="relative mt-5 ml-8 h-60">
        {[0, 25, 50, 75, 100].map((t) => (
          <div key={t} className="absolute left-0 right-0 border-t border-slate-200" style={{ top: `${y(t)}%` }}>
            <span className="absolute -left-8 -top-2 w-6 text-right text-[11px] text-slate-500 tabular">{t}%</span>
          </div>
        ))}
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {series.map((s) => (
            <polyline
              key={s.name}
              points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {series.map((s) =>
          s.values.map((v, i) => {
            const above = v < 12 || v >= Math.max(...series.map((o) => o.values[i]));
            return (
              <span key={`${s.name}${i}`} className="absolute" style={{ left: `${x(i)}%`, top: `${y(v)}%` }}>
                <span className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ring-2 ring-white" style={{ background: s.color }} />
                <span
                  className={`absolute -translate-x-1/2 rounded bg-white/90 px-1 text-[11px] sm:text-xs font-semibold leading-4 text-slate-700 tabular whitespace-nowrap ${
                    above ? 'bottom-2.5' : 'top-2.5'
                  }`}
                >
                  {v}%
                </span>
              </span>
            );
          }),
        )}
        {/* one hover / focus column per category: lists every series */}
        {categories.map((c, i) => (
          <div
            key={c}
            tabIndex={0}
            className={`group absolute top-0 bottom-0 ${focusRing} rounded-sm hover:bg-brand-50/40`}
            style={{ left: `${(i / categories.length) * 100}%`, width: `${100 / categories.length}%` }}
          >
            <Tip>
              <span className="block font-bold mb-0.5">{c}</span>
              {series.map((s) => (
                <TipLine key={s.name} value={`${s.values[i]}%`} label={s.name} />
              ))}
              {detail && <span className="block text-slate-300">{detail[i]}</span>}
            </Tip>
          </div>
        ))}
      </div>
      <div className="flex ml-8 mt-2">
        {categories.map((c) => (
          <span key={c} className="flex-1 text-center text-[11px] sm:text-xs text-slate-600 leading-tight">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- 3. Waffle charts: 100 squares = 100 % ---------- */

export type Part = { name: string; pct: number; count: number; color: string };

function toCells(parts: Part[]) {
  // largest-remainder rounding so the squares always add up to 100
  const floor = parts.map((p) => Math.floor(p.pct));
  let left = 100 - floor.reduce((s, v) => s + v, 0);
  const order = parts.map((p, i) => [p.pct - Math.floor(p.pct), i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (left <= 0) break;
    floor[i] += 1;
    left -= 1;
  }
  return parts.flatMap((p, i) => Array.from({ length: floor[i] }, () => p));
}

export function Waffles({ items, legend }: { items: { label: string; note: string; caption: ReactNode; parts: Part[] }[]; legend: { name: string; color: string }[] }) {
  return (
    <div>
      <Legend items={legend} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-7 mt-6">
        {items.map((it) => {
          return (
            <div key={it.label}>
              <p className="text-sm font-semibold text-ink leading-tight">{it.label}</p>
              <p className="text-xs text-slate-500 mb-2 tabular">{it.note}</p>
              <div
                tabIndex={0}
                role="img"
                aria-label={`${it.label}: ${it.parts.map((p) => `${p.name} ${p.pct}%`).join(', ')}`}
                className={`group relative grid grid-cols-10 gap-[2px] max-w-[168px] ${focusRing} rounded-sm`}
              >
                {toCells(it.parts).map((p, i) => (
                  <span key={i} className="aspect-square rounded-[2px]" style={{ background: p.color }} />
                ))}
                <Tip>
                  {it.parts
                    .filter((p) => p.pct > 0)
                    .map((p) => (
                      <TipLine key={p.name} value={`${p.pct}%`} label={`${p.name}, ${fmt(p.count)} listings`} />
                    ))}
                </Tip>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-snug max-w-[168px]">{it.caption}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-500">Each square is 1% of the listings in that group.</p>
    </div>
  );
}

/* ---------- 4a. Dumbbell chart: two values per row ---------- */

export function Dumbbells({
  rows,
  series,
  max,
}: {
  rows: { label: string; a: number; b: number; detail: string }[];
  series: [{ name: string; color: string }, { name: string; color: string }];
  max: number;
}) {
  const pos = (v: number) => (v / max) * 100;
  const dot = (v: number, s: { name: string; color: string }, side: 'left' | 'right') => (
    <span tabIndex={0} className={`group absolute top-1/2 ${focusRing} rounded-full`} style={{ left: `${pos(v)}%` }}>
      <span className="absolute -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full ring-2 ring-white" style={{ background: s.color }} />
      <span className={`absolute -translate-y-1/2 text-xs font-semibold text-slate-700 tabular whitespace-nowrap ${side === 'left' ? 'right-3' : 'left-3'}`}>{v}%</span>
      <Tip>
        <TipLine value={`${v}%`} label={s.name} />
      </Tip>
    </span>
  );
  return (
    <div>
      <Legend marker="dot" items={[series[0], series[1]]} />
      <div className="mt-5 space-y-1">
        {rows.map((r) => {
          const lo = Math.min(r.a, r.b);
          const hi = Math.max(r.a, r.b);
          return (
            <div key={r.label} className="flex items-center gap-3">
              <span className="w-20 sm:w-28 shrink-0 text-sm text-slate-700 text-right leading-tight whitespace-nowrap">{r.label}</span>
              <div className="relative flex-1 h-10 mx-9 sm:mx-10">
                <span className="absolute top-1/2 left-0 right-0 border-t border-slate-200" />
                <span className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-slate-300" style={{ left: `${pos(lo)}%`, width: `${pos(hi) - pos(lo)}%` }} />
                {dot(r.a, series[0], r.a <= r.b ? 'left' : 'right')}
                {dot(r.b, series[1], r.b < r.a ? 'left' : 'right')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- 4b. Donut: parts of one whole, with a centre figure ---------- */

export function Donut({ parts, centre, centreLabel }: { parts: Part[]; centre: string; centreLabel: string }) {
  const r = 60;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-44 h-44 shrink-0">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90" role="img" aria-label={parts.map((p) => `${p.name} ${p.pct}%`).join(', ')}>
          {parts.map((p) => {
            const len = (p.pct / 100) * circ;
            const seg = (
              <circle key={p.name} cx="80" cy="80" r={r} fill="none" stroke={p.color} strokeWidth="22" strokeDasharray={`${Math.max(0, len - 2)} ${circ - Math.max(0, len - 2)}`} strokeDashoffset={-offset}>
                <title>{`${p.name}: ${p.pct}% (${fmt(p.count)} listings)`}</title>
              </circle>
            );
            offset += len;
            return seg;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-ink">{centre}</span>
          <span className="text-[11px] text-slate-500 leading-tight max-w-[84px]">{centreLabel}</span>
        </div>
      </div>
      <ul className="space-y-2 text-sm text-slate-700">
        {parts.map((p) => (
          <li key={p.name} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm shrink-0" style={{ background: p.color }} aria-hidden="true" />
            <span>{p.name}</span>
            <span className="font-semibold text-ink tabular">{p.pct}%</span>
            <span className="text-slate-500 tabular">({fmt(p.count)})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- 5. Bubble chart: two measures, size = volume ---------- */

export type Bubble = { name: string; x: number; y: number; size: number; label?: 'left' | 'right' | 'top' | 'bottom' | 'none'; minor?: boolean };

export function Bubbles({
  points,
  xDomain,
  yDomain,
  xTicks,
  yTicks,
  xTitle,
  yTitle,
  fx,
  fy,
  sizeLabel,
  yTipLabel = 'from hosts with 5+ listings',
}: {
  points: Bubble[];
  xDomain: [number, number];
  yDomain: [number, number];
  xTicks: number[];
  yTicks: number[];
  xTitle: string;
  yTitle: string;
  fx: (v: number) => string;
  fy: (v: number) => string;
  sizeLabel: string;
  yTipLabel?: string;
}) {
  const px = (v: number) => ((v - xDomain[0]) / (xDomain[1] - xDomain[0])) * 100;
  const py = (v: number) => ((v - yDomain[0]) / (yDomain[1] - yDomain[0])) * 100;
  const top = Math.max(...points.map((p) => p.size));
  const sorted = [...points].sort((a, b) => b.size - a.size); // big first, so small bubbles stay on top
  return (
    <div>
      <p className="text-xs text-slate-500 mb-2">{yTitle}</p>
      <div className="relative ml-9 h-80 md:h-96 border-l border-b border-slate-300">
        {yTicks.map((t) => (
          <div key={t} className="absolute left-0 right-0 border-t border-slate-200" style={{ bottom: `${py(t)}%` }}>
            <span className="absolute -left-9 -top-2 w-7 text-right text-[11px] text-slate-500 tabular">{fy(t)}</span>
          </div>
        ))}
        {xTicks.map((t) => (
          <span key={t} className="absolute -bottom-5 -translate-x-1/2 text-[11px] text-slate-500 tabular" style={{ left: `${px(t)}%` }}>
            {fx(t)}
          </span>
        ))}
        {sorted.map((p) => {
          const d = 2 * (5 + 19 * Math.sqrt(p.size / top));
          const side = p.label ?? 'right';
          return (
            <span key={p.name} tabIndex={0} className={`group absolute ${focusRing} rounded-full`} style={{ left: `${px(p.x)}%`, bottom: `${py(p.y)}%` }}>
              <span
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white group-hover:brightness-110"
                style={{ width: d, height: d, background: C.blue, opacity: 0.82 }}
              />
              {/* generous invisible hit area for the small bubbles */}
              <span className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: Math.max(d, 28), height: Math.max(d, 28) }} />
              {side !== 'none' && (
                <span
                  className={`absolute text-[11px] font-semibold text-slate-700 whitespace-nowrap ${p.minor ? 'hidden md:block' : ''} ${
                    side === 'top' || side === 'bottom' ? '-translate-x-1/2' : '-translate-y-1/2'
                  }`}
                  style={side === 'right' ? { left: d / 2 + 4 } : side === 'left' ? { right: d / 2 + 4 } : side === 'top' ? { bottom: d / 2 + 2 } : { top: d / 2 + 2 }}
                >
                  {p.name}
                </span>
              )}
              <Tip>
                <span className="block font-bold mb-0.5">{p.name}</span>
                <TipLine value={fx(p.x)} label={xTitle.toLowerCase()} />
                <TipLine value={fy(p.y)} label={yTipLabel} />
                <TipLine value={fmt(p.size)} label={sizeLabel} />
              </Tip>
            </span>
          );
        })}
      </div>
      <p className="mt-7 text-center text-xs text-slate-500">{xTitle}</p>
    </div>
  );
}

/* ---------- 6. Range plot: median with the middle half ---------- */

export function Ranges({ rows, max, f }: { rows: { label: string; lo: number; mid: number; hi: number; detail: string }[]; max: number; f: (v: number) => string }) {
  const pos = (v: number) => (v / max) * 100;
  return (
    <div className="space-y-5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className="w-24 sm:w-32 shrink-0 text-sm text-slate-700 text-right leading-tight">{r.label}</span>
          <div tabIndex={0} className={`group relative flex-1 h-12 ${focusRing} rounded-sm`}>
            <span className="absolute left-0 right-0 top-1/2 border-t border-slate-200" />
            <span className="absolute top-1/2 -translate-y-1/2 h-3 rounded-full" style={{ left: `${pos(r.lo)}%`, width: `${pos(r.hi) - pos(r.lo)}%`, background: '#B9CDFC' }} />
            <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full ring-2 ring-white" style={{ left: `${pos(r.mid)}%`, background: C.blue }} />
            <span className="absolute -translate-x-1/2 top-0 text-xs font-bold text-ink tabular whitespace-nowrap" style={{ left: `${pos(r.mid)}%` }}>
              {f(r.mid)}
            </span>
            <span className="absolute -translate-x-1/2 bottom-0 text-[11px] text-slate-500 tabular whitespace-nowrap" style={{ left: `${pos(r.lo)}%` }}>
              {f(r.lo)}
            </span>
            <span className="absolute -translate-x-1/2 bottom-0 text-[11px] text-slate-500 tabular whitespace-nowrap" style={{ left: `${pos(r.hi)}%` }}>
              {f(r.hi)}
            </span>
            <Tip>
              <TipLine value={f(r.mid)} label="median" />
              <TipLine value={`${f(r.lo)} – ${f(r.hi)}`} label="middle half" />
              <span className="block text-slate-300">{r.detail}</span>
            </Tip>
          </div>
        </div>
      ))}
      <Legend marker="dot" items={[{ name: 'Median', color: C.blue }, { name: 'Middle half of listings (25th to 75th percentile)', color: '#B9CDFC' }]} />
    </div>
  );
}

/* ---------- Stat tile ---------- */

export function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
      <p className="text-2xl sm:text-3xl font-bold text-ink">{value}</p>
      <p className="text-sm text-slate-700 mt-1 leading-snug">{label}</p>
      {sub && <p className="text-xs text-slate-500 mt-1 leading-snug">{sub}</p>}
    </div>
  );
}
