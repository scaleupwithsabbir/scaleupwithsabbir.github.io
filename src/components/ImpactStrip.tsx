import { CountUp, useInView } from './ui';

type Metric = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  detail: string;
  spark: number[];
  color: string;
};

const metrics: Metric[] = [
  {
    value: 4,
    label: 'Countries',
    detail: 'Bangladesh · Spain · UK · Germany',
    spark: [20, 45, 70, 100],
    color: 'bg-brand-600',
  },
  {
    value: 3192,
    label: 'Retail outlets managed',
    detail: 'B2B distribution at Unilever',
    spark: [35, 50, 58, 72, 88, 100],
    color: 'bg-brand-500',
  },
  {
    value: 70,
    suffix: '%',
    label: 'Less reporting time',
    detail: 'Automated Looker Studio dashboards',
    spark: [100, 78, 55, 30],
    color: 'bg-teal-500',
  },
  {
    value: 5,
    suffix: '+',
    label: 'European markets',
    detail: 'Market-entry research & GTM',
    spark: [40, 60, 55, 80, 100],
    color: 'bg-amber-500',
  },
];

export default function ImpactStrip() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <section aria-label="Impact at a glance" className="relative px-4 sm:px-6 lg:px-8 -mt-2 sm:-mt-6 pb-4 bg-white">
      <div
        ref={ref}
        className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_-24px_rgba(14,24,56,0.35)] divide-x divide-y lg:divide-y-0 divide-slate-100 overflow-hidden"
      >
        {metrics.map((m, i) => (
          <div key={m.label} className="group relative p-5 sm:p-6 hover:bg-slate-50/70 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">
                {m.prefix}
                <CountUp to={m.value} start={inView} duration={1400 + i * 200} />
                {m.suffix}
              </p>
              {/* Micro bar chart */}
              <div className="flex items-end gap-[3px] h-8 pt-1" aria-hidden="true">
                {m.spark.map((h, j) => (
                  <span
                    key={j}
                    className={`w-1.5 rounded-sm ${m.color} ${j === m.spark.length - 1 ? 'opacity-100' : 'opacity-30'} origin-bottom transition-transform duration-700`}
                    style={{
                      height: `${h}%`,
                      transform: inView ? 'scaleY(1)' : 'scaleY(0.1)',
                      transitionDelay: `${j * 80 + i * 120}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-800">{m.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{m.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
