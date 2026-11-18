import { Component, lazy, Suspense, useCallback, useEffect, useState, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { ChartDivider, Eyebrow, Reveal } from './ui';

/** Thumbnail for QuantCompass: a compass needle over a small rising bar chart. */
function QuantCompassThumb() {
  return (
    <svg viewBox="0 0 96 72" className="w-full h-full" role="img" aria-label="Thumbnail: a compass over a small bar chart">
      <defs>
        <linearGradient id="qc-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1A2B63" />
          <stop offset="1" stopColor="#2347C8" />
        </linearGradient>
      </defs>
      <rect width="96" height="72" rx="10" fill="url(#qc-g)" />
      <rect x="14" y="46" width="8" height="12" rx="1.5" fill="#5A82EF" />
      <rect x="26" y="40" width="8" height="18" rx="1.5" fill="#8BAAF7" />
      <rect x="38" y="33" width="8" height="25" rx="1.5" fill="#B9CDFC" />
      <circle cx="68" cy="30" r="17" fill="none" stroke="#2DD4BF" strokeWidth="2.5" />
      <polygon points="68,16 73,31 68,29 63,31" fill="#FFFFFF" />
      <polygon points="68,44 63,29 68,31 73,29" fill="#EB6834" />
      <circle cx="68" cy="30" r="2" fill="#0E1838" />
      <rect x="12" y="58" width="72" height="1.5" fill="#5A82EF" opacity="0.6" />
    </svg>
  );
}

/** Keeps a fault inside one item from taking the rest of the page down. */
class DrawerBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <p className="px-4 sm:px-8 py-8 text-slate-600">This item could not be loaded. Please reload the page.</p> : this.props.children;
  }
}

type Tool = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  Thumb: ComponentType;
  Body: LazyExoticComponent<ComponentType>;
};

/* Add a tool here and it appears in the list. Its full write-up loads only when its drawer is opened. */
const tools: Tool[] = [
  {
    id: 'quantcompass-statistics-software',
    title: 'Students lose weeks on survey statistics. QuantCompass guides them through it, and shows its work.',
    summary: 'Open-source software: upload survey data and hypotheses, get assumption-checked tests, a Word + HTML report and the exact R script. Free, and your data stays on your computer.',
    tags: ['Open-source software', 'R', 'Quantitative research', 'Statistics', 'Free'],
    Thumb: QuantCompassThumb,
    Body: lazy(() => import('../case-study/QuantCompassProject')),
  },
];

export default function Software() {
  const [open, setOpen] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<string[]>([]);

  const show = useCallback((id: string | null) => {
    setOpen(id);
    if (id) setLoaded((l) => (l.includes(id) ? l : [...l, id]));
  }, []);

  // A link such as /#quantcompass-statistics-software opens that tool's drawer.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (tools.some((t) => t.id === id)) {
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
    window.history.replaceState(null, '', next ? `#${next}` : '#software');
  };

  return (
    <section id="software" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12">
          <Eyebrow>Software</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4 tracking-tight">Automated software and programs</h2>
          <ChartDivider className="mb-6" />
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Tools I built to take the heavy lifting out of analysis. Open one to see what it does.</p>
        </Reveal>

        <div className="space-y-5">
          {tools.map((t) => {
            const isOpen = open === t.id;
            return (
              <article
                key={t.id}
                id={t.id}
                className={`scroll-mt-20 bg-white rounded-2xl border overflow-hidden transition-shadow duration-300 ${
                  isOpen ? 'border-brand-300 shadow-[0_30px_60px_-30px_rgba(14,24,56,0.45)]' : 'border-slate-200 shadow-[0_18px_40px_-30px_rgba(14,24,56,0.45)] hover:shadow-[0_30px_60px_-30px_rgba(14,24,56,0.55)]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(t.id)}
                  aria-expanded={isOpen}
                  aria-controls={`${t.id}-drawer`}
                  className="group w-full flex items-center gap-4 sm:gap-6 p-4 sm:p-6 text-left"
                >
                  <span className="shrink-0 w-20 h-[60px] sm:w-28 sm:h-[84px] rounded-xl overflow-hidden ring-1 ring-brand-100">
                    <t.Thumb />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap gap-2 mb-2">
                      {t.tags.map((tag) => (
                        <span key={tag} className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-ink leading-snug group-hover:text-brand-800 transition-colors">{t.title}</h3>
                    <span className="hidden sm:block mt-1.5 text-sm text-slate-600 leading-relaxed">{t.summary}</span>
                  </span>
                  <span className="shrink-0 flex items-center gap-2 text-sm font-bold text-brand-700">
                    <span className="hidden sm:inline">{isOpen ? 'Close' : 'Open'}</span>
                    <ChevronDown size={20} className={`text-teal-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>

                {/* Drawer: opens under the title */}
                <div id={`${t.id}-drawer`} className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden min-h-0" ref={(el) => el?.toggleAttribute('inert', !isOpen)}>
                    <div className="border-t border-slate-200">
                      {loaded.includes(t.id) && (
                        <DrawerBoundary>
                          <Suspense fallback={<p className="p-8 text-slate-500">Loading…</p>}>
                            <t.Body />
                          </Suspense>
                        </DrawerBoundary>
                      )}
                      <div className="px-4 sm:px-8 pb-6 bg-white">
                        <button type="button" onClick={() => toggle(t.id)} className="text-sm font-bold text-brand-700 hover:text-brand-900">
                          Close this software
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
