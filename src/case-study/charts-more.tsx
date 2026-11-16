import { C, Legend, Tip, TipLine } from './charts';

/* More chart types for the case studies. Same colours, tooltips and table switch as charts.tsx. */

const focusRing = 'outline-none focus-visible:ring-2 focus-visible:ring-brand-300';

/* ---------- Line / curve on two numeric axes ---------- */

export type XYPoint = {
  x: number;
  y: number;
  /** direct label next to the point */
  label?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** lines for the hover / focus tooltip; a point without `tip` is drawn but not focusable */
  tip?: { value: string; label: string }[];
  tipTitle?: string;
  hollow?: boolean;
};

export function LineXY({
  series,
  xDomain,
  yDomain,
  xTicks,
  yTicks,
  fx,
  fy,
  xTitle,
  yTitle,
  height = 'h-64',
  thinX = false,
}: {
  series: { name: string; color: string; points: XYPoint[]; area?: boolean; dashed?: boolean; dots?: boolean }[];
  xDomain: [number, number];
  yDomain: [number, number];
  xTicks: number[];
  yTicks: number[];
  fx: (v: number) => string;
  fy: (v: number) => string;
  xTitle?: string;
  yTitle?: string;
  height?: string;
  /** on small screens, label every second x tick */
  thinX?: boolean;
}) {
  const px = (v: number) => ((v - xDomain[0]) / (xDomain[1] - xDomain[0])) * 100;
  const py = (v: number) => ((v - yDomain[0]) / (yDomain[1] - yDomain[0])) * 100;
  const sidePos: Record<string, string> = {
    top: 'bottom-2.5 -translate-x-1/2',
    bottom: 'top-2.5 -translate-x-1/2',
    left: 'right-2.5 -translate-y-1/2',
    right: 'left-2.5 -translate-y-1/2',
  };
  return (
    <div>
      {series.length > 1 && <Legend marker="line" items={series.map((s) => ({ name: s.name, color: s.color }))} />}
      {yTitle && <p className={`text-xs text-slate-500 mb-2 ${series.length > 1 ? 'mt-4' : ''}`}>{yTitle}</p>}
      <div className={`relative ml-10 mr-3 ${height} border-l border-b border-slate-300 ${series.length > 1 && !yTitle ? 'mt-6' : ''}`}>
        {yTicks.map((t) => (
          <div key={t} className="absolute left-0 right-0 border-t border-slate-200" style={{ bottom: `${py(t)}%` }}>
            <span className="absolute -left-10 -top-2 w-8 text-right text-[11px] text-slate-500 tabular">{fy(t)}</span>
          </div>
        ))}
        {xTicks.map((t, i) => (
          <span
            key={t}
            className={`absolute -bottom-5 -translate-x-1/2 text-[10px] sm:text-[11px] text-slate-500 tabular whitespace-nowrap ${thinX && i % 2 ? 'hidden sm:block' : ''}`}
            style={{ left: `${px(t)}%` }}
          >
            {fx(t)}
          </span>
        ))}
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {series.map((s) => {
            const pts = s.points.map((p) => `${px(p.x)},${100 - py(p.y)}`).join(' ');
            const first = s.points[0];
            const last = s.points[s.points.length - 1];
            return (
              <g key={s.name}>
                {s.area && <polygon points={`${px(first.x)},100 ${pts} ${px(last.x)},100`} fill={s.color} opacity="0.12" />}
                <polyline
                  points={pts}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeDasharray={s.dashed ? '5 5' : undefined}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            );
          })}
        </svg>
        {series.map((s) =>
          s.dots === false
            ? null
            : s.points.map((p, i) => (
                <span
                  key={`${s.name}${i}`}
                  tabIndex={p.tip ? 0 : undefined}
                  className={`group absolute ${p.tip ? focusRing : ''} rounded-full`}
                  style={{ left: `${px(p.x)}%`, bottom: `${py(p.y)}%` }}
                >
                  <span
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ring-2 ring-white"
                    style={p.hollow ? { background: '#fff', boxShadow: `inset 0 0 0 2px ${s.color}` } : { background: s.color }}
                  />
                  {p.tip && <span className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full" />}
                  {p.label && (
                    <span className={`absolute rounded bg-white/90 px-1 text-[11px] sm:text-xs font-semibold leading-4 text-slate-700 tabular whitespace-nowrap ${sidePos[p.side ?? 'top']}`}>
                      {p.label}
                    </span>
                  )}
                  {p.tip && (
                    <Tip>
                      {p.tipTitle && <span className="block font-bold mb-0.5">{p.tipTitle}</span>}
                      {p.tip.map((t) => (
                        <TipLine key={t.label} value={t.value} label={t.label} />
                      ))}
                    </Tip>
                  )}
                </span>
              )),
        )}
      </div>
      {xTitle && <p className="mt-7 text-center text-xs text-slate-500">{xTitle}</p>}
    </div>
  );
}

/* ---------- Mirrored bars: two shares per row, back to back ---------- */

export function MirrorBars({
  rows,
  left,
  right,
  max,
}: {
  rows: { label: string; sub?: string; left: number; right: number; leftTip: string; rightTip: string }[];
  left: { name: string; color: string };
  right: { name: string; color: string };
  max: number;
}) {
  const w = (v: number) => `${Math.max(0.8, (v / max) * 100)}%`;
  return (
    <div>
      <Legend items={[left, right]} />
      <div className="mt-5 space-y-4">
        {rows.map((r) => (
          <div key={r.label}>
            <p className="text-center text-sm font-semibold text-ink leading-tight">
              {r.label}
              {r.sub && <span className="font-normal text-slate-500"> · {r.sub}</span>}
            </p>
            <div className="mt-1.5 flex items-center">
              <div tabIndex={0} className={`group relative flex-1 flex items-center justify-end gap-2 ${focusRing} rounded-sm`}>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 tabular">{r.left}%</span>
                <span className="h-6 rounded-l group-hover:brightness-110" style={{ width: w(r.left), maxWidth: 'calc(100% - 3.5rem)', background: left.color }} />
                <Tip>
                  <TipLine value={`${r.left}%`} label={r.leftTip} />
                </Tip>
              </div>
              <span className="w-0.5 h-9 bg-white" aria-hidden="true" />
              <div tabIndex={0} className={`group relative flex-1 flex items-center gap-2 ${focusRing} rounded-sm`}>
                <span className="h-6 rounded-r group-hover:brightness-110" style={{ width: w(r.right), maxWidth: 'calc(100% - 3.5rem)', background: right.color }} />
                <span className="text-xs sm:text-sm font-semibold text-slate-700 tabular">{r.right}%</span>
                <Tip>
                  <TipLine value={`${r.right}%`} label={r.rightTip} />
                </Tip>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Stacked columns ---------- */

export function StackedColumns({
  categories,
  series,
  max,
  yTicks,
  f,
  totalLabel = 'total',
}: {
  categories: { label: string; tipTitle: string }[];
  series: { name: string; color: string; values: number[] }[]; // first series sits at the bottom
  max: number;
  yTicks: number[];
  f: (v: number) => string;
  totalLabel?: string;
}) {
  return (
    <div>
      <Legend items={series.map((s) => ({ name: s.name, color: s.color }))} />
      <div className="relative mt-5 ml-10 h-60 border-b border-slate-300">
        {yTicks.map((t) => (
          <div key={t} className="absolute left-0 right-0 border-t border-slate-200" style={{ bottom: `${(t / max) * 100}%` }}>
            <span className="absolute -left-10 -top-2 w-8 text-right text-[11px] text-slate-500 tabular">{f(t)}</span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-end gap-1 sm:gap-2.5">
          {categories.map((c, i) => {
            const total = series.reduce((s, x) => s + x.values[i], 0);
            return (
              <div key={c.label} tabIndex={0} className={`group relative flex-1 h-full flex flex-col-reverse items-center gap-[2px] ${focusRing} rounded-sm`}>
                {series.map((s, si) => (
                  <div
                    key={s.name}
                    className={`w-full max-w-9 group-hover:brightness-110 ${si === series.length - 1 ? 'rounded-t' : ''}`}
                    style={{ height: `${(s.values[i] / max) * 100}%`, background: s.color }}
                  />
                ))}
                <Tip>
                  <span className="block font-bold mb-0.5">{c.tipTitle}</span>
                  {series.map((s) => (
                    <TipLine key={s.name} value={f(s.values[i])} label={s.name} />
                  ))}
                  <TipLine value={f(total)} label={totalLabel} />
                </Tip>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-1 sm:gap-2.5 ml-10 mt-1.5">
        {categories.map((c) => (
          <span key={c.label} className="flex-1 text-center text-[10px] sm:text-xs text-slate-600 leading-tight">
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Heatmap: one hue, light to dark ---------- */

const RAMP = ['#EEF3FE', '#C6D5FB', '#8BAAF7', '#5A82EF', '#2347C8', '#1A2B63'].map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));

function shade(t: number) {
  const x = Math.min(1, Math.max(0, t)) * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(x));
  const rgb = RAMP[i].map((c, k) => Math.round(c + (RAMP[i + 1][k] - c) * (x - i)));
  const lum = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  return { bg: `rgb(${rgb.join(',')})`, fg: lum < 0.55 ? '#fff' : '#0E1838' };
}

export type HeatCell = { v: number; text: string; tip: { value: string; label: string }[] } | null;

export function Heatmap({
  cols,
  rows,
  max,
  corner,
  colsTitle,
  legend,
  dense = false,
}: {
  cols: string[];
  rows: { label: string; sub?: string; cells: HeatCell[] }[];
  max: number;
  corner?: string;
  colsTitle?: string;
  legend: [string, string];
  dense?: boolean;
}) {
  const first = dense ? 'minmax(58px, 0.9fr)' : 'minmax(96px, 1.5fr)';
  return (
    <div>
      {colsTitle && <p className="text-xs text-slate-500 mb-2 text-right">{colsTitle}</p>}
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: `${first} repeat(${cols.length}, minmax(0, 1fr))` }}>
        <span className="text-[10px] sm:text-xs text-slate-500 self-end pb-1">{corner}</span>
        {cols.map((c) => (
          <span key={c} className={`text-center text-slate-600 self-end pb-1 leading-tight ${dense ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm font-semibold'}`}>
            {c}
          </span>
        ))}
        {rows.map((r) => (
          <div key={r.label} className="contents">
            <span className={`pr-2 self-center leading-tight text-slate-700 ${dense ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'}`}>
              {r.label}
              {r.sub && <span className="block text-[10px] text-slate-500 tabular">{r.sub}</span>}
            </span>
            {cols.map((c, ci) => {
              const cell = r.cells[ci];
              if (!cell) return <span key={c} className={`rounded-sm bg-slate-50 ${dense ? 'h-7 sm:h-9' : 'h-14 sm:h-16'}`} />;
              const s = shade(cell.v / max);
              return (
                <span
                  key={c}
                  tabIndex={0}
                  className={`group relative flex items-center justify-center rounded-sm tabular hover:brightness-110 ${focusRing} ${
                    dense ? 'h-7 sm:h-9 text-[10px] sm:text-xs' : 'h-14 sm:h-16 text-sm sm:text-base font-bold'
                  }`}
                  style={{ background: s.bg, color: s.fg }}
                >
                  {cell.text}
                  <Tip>
                    <span className="block font-bold mb-0.5">
                      {r.label} · {c}
                    </span>
                    {cell.tip.map((t) => (
                      <TipLine key={t.label} value={t.value} label={t.label} />
                    ))}
                  </Tip>
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <span>{legend[0]}</span>
        <span className="h-2.5 w-28 rounded-full" style={{ background: `linear-gradient(to right, ${[0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => shade(t).bg).join(',')})` }} aria-hidden="true" />
        <span>{legend[1]}</span>
      </div>
    </div>
  );
}

/* ---------- Lollipop: ranked values on one scale ---------- */

export function Lollipop({ rows, max }: { rows: { label: string; value: number; display: string; tip: { value: string; label: string }[]; highlight?: boolean }[]; max: number }) {
  return (
    <div className="space-y-0.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className={`w-28 sm:w-36 shrink-0 text-sm text-right leading-tight ${r.highlight ? 'font-bold text-ink' : 'text-slate-700'}`}>{r.label}</span>
          <div tabIndex={0} className={`group relative flex-1 h-8 mr-12 ${focusRing} rounded-sm`}>
            <span className="absolute left-0 right-0 top-1/2 border-t border-slate-100" />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 rounded-full" style={{ width: `${(r.value / max) * 100}%`, background: r.highlight ? C.blue : C.other }} />
            <span className="absolute top-1/2" style={{ left: `${(r.value / max) * 100}%` }}>
              <span className="absolute -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full ring-2 ring-white" style={{ background: r.highlight ? C.blue : C.other }} />
              <span className={`absolute left-3 -translate-y-1/2 text-xs tabular whitespace-nowrap ${r.highlight ? 'font-bold text-ink' : 'font-semibold text-slate-700'}`}>{r.display}</span>
            </span>
            <Tip>
              <span className="block font-bold mb-0.5">{r.label}</span>
              {r.tip.map((t) => (
                <TipLine key={t.label} value={t.value} label={t.label} />
              ))}
            </Tip>
          </div>
        </div>
      ))}
    </div>
  );
}
