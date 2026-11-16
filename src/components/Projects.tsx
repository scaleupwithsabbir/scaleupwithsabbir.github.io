import { Component, lazy, Suspense, useCallback, useEffect, useState, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { ChartDivider, Eyebrow, Reveal } from './ui';
import { q02 } from '../case-study/data';

/** Small thumbnail for the Berlin project: the real minimum-stay distribution, with the 92-night bar highlighted. */
function BerlinThumb() {
  const bars = q02.filter((r) => r.minimum_stay !== 'Unknown');
  const max = Math.max(...bars.map((b) => b.listings));
  return (
    <svg viewBox="0 0 96 72" className="w-full h-full" role="img" aria-label="Bar chart thumbnail: listings by minimum stay, with a spike at 92 nights">
      <rect width="96" height="72" rx="10" fill="#EEF3FF" />
      {bars.map((b, i) => {
        const h = Math.max(2, (b.listings / max) * 44);
        return <rect key={b.minimum_stay} x={10 + i * 7.8} y={58 - h} width="5.4" height={h} rx="1.5" fill={b.minimum_stay === '92 nights' ? '#1C38A3' : '#8BAAF7'} />;
      })}
      <rect x="8" y="58" width="80" height="1" fill="#B9CDFC" />
    </svg>
  );
}

/** Thumbnail for the retail project: the revenue concentration curve (values from results/03_revenue_concentration.csv). */
function RetailThumb() {
  const pts: [number, number][] = [[0, 0], [1, 30.1], [5, 48.7], [10, 60.0], [20, 73.7], [50, 91.9], [100, 100]];
  const path = pts.map(([x, y]) => `${10 + x * 0.76},${60 - y * 0.48}`).join(' ');
  return (
    <svg viewBox="0 0 96 72" className="w-full h-full" role="img" aria-label="Curve thumbnail: a few customers bring most of the revenue">
      <rect width="96" height="72" rx="10" fill="#EEF3FF" />
      <polygon points={`10,60 ${path} 86,60`} fill="#8BAAF7" opacity="0.45" />
      <line x1="10" y1="60" x2="86" y2="12" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
      <polyline points={path} fill="none" stroke="#1C38A3" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <rect x="8" y="60" width="80" height="1" fill="#B9CDFC" />
    </svg>
  );
}

/** Thumbnail for the bank project: each year's share of calls (left) and of sales (right), from results/02_by_year.csv. */
function BankThumb() {
  const rows: [number, number][] = [[73.3, 28.9], [23.0, 48.0], [3.7, 23.1]];
  return (
    <svg viewBox="0 0 96 72" className="w-full h-full" role="img" aria-label="Mirrored bar thumbnail: most calls were made in the year with the fewest sales">
      <rect width="96" height="72" rx="10" fill="#EEF3FF" />
      {rows.map(([calls, sales], i) => (
        <g key={i}>
          <rect x={47 - calls * 0.48} y={15 + i * 16} width={calls * 0.48} height="10" rx="2" fill="#EB6834" />
          <rect x="49" y={15 + i * 16} width={sales * 0.48} height="10" rx="2" fill="#1C38A3" />
        </g>
      ))}
    </svg>
  );
}

/** Keeps a fault inside one project from taking the rest of the page down. */
class DrawerBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <p className="px-4 sm:px-8 py-8 text-slate-600">This project could not be loaded. Please reload the page.</p> : this.props.children;
  }
}

type Project = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  Thumb: ComponentType;
  Body: LazyExoticComponent<ComponentType>;
};

/* Add a project here and it appears in the list. The full write-up loads only when its drawer is opened. */
const projects: Project[] = [
  {
    id: 'berlin-short-stay',
    title: "Nearly a third of Berlin's Airbnb listings have gone quiet. What should a small host do?",
    summary: 'A data story on 12,376 public listings: the problem, six interactive views, what was tried, three sized options and a scored recommendation.',
    tags: ['Marketplace analytics', 'SQL', 'Tableau / Power BI', 'Berlin', 'Germany'],
    Thumb: BerlinThumb,
    Body: lazy(() => import('../case-study/BerlinCaseStudy')),
  },
  {
    id: 'retail-revenue-concentration',
    title: "Forty accounts bring in 29% of a UK gift retailer's revenue. Where should growth come from next?",
    summary: 'A business intelligence story on 541,909 invoice lines: the problem, six interactive views, what was tried, three sized options and a scored recommendation.',
    tags: ['Business intelligence', 'SQL', 'Tableau / Power BI', 'Retail', 'United Kingdom'],
    Thumb: RetailThumb,
    Body: lazy(() => import('../case-study/RetailCaseStudy')),
  },
  {
    id: 'bank-campaign-calls',
    title: 'A bank made 23 calls for every deposit it sold. Where should the next campaign spend its calls?',
    summary: 'A performance marketing story on 41,188 campaign contacts: the problem, six interactive views, what was tried, three sized options and a scored recommendation.',
    tags: ['Performance marketing', 'Growth analytics', 'SQL', 'Tableau / Power BI', 'Banking'],
    Thumb: BankThumb,
    Body: lazy(() => import('../case-study/BankCaseStudy')),
  },
];

export default function Projects() {
  const [open, setOpen] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<string[]>([]);

  const show = useCallback((id: string | null) => {
    setOpen(id);
    if (id) setLoaded((l) => (l.includes(id) ? l : [...l, id]));
  }, []);

  // A link such as /#berlin-short-stay opens that project's drawer.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (projects.some((p) => p.id === id)) {
        show(id);
        document.getElementById(id)?.scrollIntoView();
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [show]);

  const toggle = (id: string) => {
    const next = open === id ? null : id;
    show(next);
    window.history.replaceState(null, '', next ? `#${next}` : '#projects');
  };

  return (
    <section id="projects" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12">
          <Eyebrow>Projects</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4 tracking-tight">Data stories, start to finish</h2>
          <ChartDivider className="mb-6" />
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Each project runs from a real problem to a recommendation. Open one to read it in full.</p>
        </Reveal>

        <div className="space-y-5">
          {projects.map((p) => {
            const isOpen = open === p.id;
            return (
                <article
                  key={p.id}
                  id={p.id}
                  className={`scroll-mt-20 bg-white rounded-2xl border overflow-hidden transition-shadow duration-300 ${
                    isOpen ? 'border-brand-300 shadow-[0_30px_60px_-30px_rgba(14,24,56,0.45)]' : 'border-slate-200 shadow-[0_18px_40px_-30px_rgba(14,24,56,0.45)] hover:shadow-[0_30px_60px_-30px_rgba(14,24,56,0.55)]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(p.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${p.id}-drawer`}
                    className="group w-full flex items-center gap-4 sm:gap-6 p-4 sm:p-6 text-left"
                  >
                    <span className="shrink-0 w-20 h-[60px] sm:w-28 sm:h-[84px] rounded-xl overflow-hidden ring-1 ring-brand-100">
                      <p.Thumb />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap gap-2 mb-2">
                        {p.tags.map((t) => (
                          <span key={t} className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-0.5">
                            {t}
                          </span>
                        ))}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-ink leading-snug group-hover:text-brand-800 transition-colors">{p.title}</h3>
                      <span className="hidden sm:block mt-1.5 text-sm text-slate-600 leading-relaxed">{p.summary}</span>
                    </span>
                    <span className="shrink-0 flex items-center gap-2 text-sm font-bold text-brand-700">
                      <span className="hidden sm:inline">{isOpen ? 'Close' : 'Open'}</span>
                      <ChevronDown size={20} className={`text-teal-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </button>

                  {/* Drawer: opens under the title */}
                  <div
                    id={`${p.id}-drawer`}
                    className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden min-h-0" ref={(el) => el?.toggleAttribute('inert', !isOpen)}>
                      <div className="border-t border-slate-200">
                        {loaded.includes(p.id) && (
                          <DrawerBoundary>
                            <Suspense fallback={<p className="p-8 text-slate-500">Loading the project…</p>}>
                              <p.Body />
                            </Suspense>
                          </DrawerBoundary>
                        )}
                        <div className="px-4 sm:px-8 pb-6 bg-white">
                          <button type="button" onClick={() => toggle(p.id)} className="text-sm font-bold text-brand-700 hover:text-brand-900">
                            Close this project
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
