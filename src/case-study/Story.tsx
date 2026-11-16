import { useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Check, Database, ExternalLink, Github, Scale } from 'lucide-react';
import { ChartDivider, Eyebrow, Reveal } from '../components/ui';
import { Stat } from './charts';

/* Shared page frame for the case studies: problem, investigation, what was tried, options, recommendation, method.
   Each project supplies its own text, numbers and charts. */

export type StoryConfig = {
  intro: ReactNode;
  chips: [string, string, string]; // source, period, note
  problem: { title: string; lead: ReactNode; stats: { value: string; label: string }[] };
  views: { key: string; chart: string; node: ReactNode }[];
  tried: {
    title: string;
    lead: ReactNode;
    stats: { value: string; label: string; sub?: string }[];
    why: ReactNode[];
    limits: ReactNode[];
  };
  options: {
    title: string;
    lead: ReactNode;
    criteria: [string, string, string];
    pick: number; // index of the recommended option
    items: { title: string; points: string[]; scores: [number, number, number] }[];
  };
  recommendation: { title: string; scoreNote: string; why: string[]; closing: ReactNode };
  built: { lead: string; repoUrl: string; repoText: string; method: ReactNode[] };
  footer: string;
};

function Section({ tone = 'white', children }: { tone?: 'white' | 'soft'; children: ReactNode }) {
  return (
    <section className={`py-10 sm:py-14 px-4 sm:px-8 ${tone === 'soft' ? 'bg-slate-50' : 'bg-white'}`}>
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  );
}

function SectionHead({ step, eyebrow, title, lead }: { step: string; eyebrow: string; title: string; lead?: ReactNode }) {
  return (
    <Reveal className="mb-10">
      <Eyebrow>
        <span className="tabular">{step}</span> · {eyebrow}
      </Eyebrow>
      <h4 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-4 max-w-3xl">{title}</h4>
      <ChartDivider className="!justify-start mb-5" />
      {lead && <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">{lead}</p>}
    </Reveal>
  );
}

export const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 underline decoration-brand-200 underline-offset-2 hover:decoration-brand-600">
    {children}
  </a>
);

const letters = ['A', 'B', 'C'];
const countWord = ['', 'One question', 'Two questions', 'Three questions', 'Four questions', 'Five questions', 'Six questions', 'Seven questions'];

export default function Story({ c }: { c: StoryConfig }) {
  const [view, setView] = useState(0);
  const { views, options } = c;
  const chipIcons = [Database, Calendar, Scale];

  return (
    <div className="bg-white">
      <div className="px-4 sm:px-8 pt-6 pb-8">
        <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">{c.intro}</p>
        <ul className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          {c.chips.map((text, i) => {
            const Icon = chipIcons[i];
            return (
              <li key={text} className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5">
                <Icon size={14} className="text-teal-600" /> {text}
              </li>
            );
          })}
        </ul>
      </div>

      <Section tone="soft">
        <SectionHead step="01" eyebrow="The problem" title={c.problem.title} lead={c.problem.lead} />
        <Reveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {c.problem.stats.map((s, i) => (
              <div key={s.label} className="rounded-2xl bg-white border border-slate-200 p-6">
                <p className={i === 0 ? 'text-5xl sm:text-6xl font-black text-ink' : 'text-3xl sm:text-4xl font-bold text-ink'}>{s.value}</p>
                <p className="mt-2 text-slate-700 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section>
        <SectionHead
          step="02"
          eyebrow="The investigation"
          title={`${countWord[views.length]}, one after the other`}
          lead="Each view answers one question with the chart that fits it, and sets up the next. Hover or tab onto any mark for detail, or switch a view to its table."
        />
        <div role="tablist" aria-label="Investigation views" className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-1 px-1">
          {views.map((v, i) => (
            <button
              key={v.key}
              role="tab"
              aria-selected={view === i}
              onClick={() => setView(i)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                view === i ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-800'
              }`}
            >
              <span className="tabular opacity-70 mr-1.5">{i + 1}</span>
              {v.key}
            </button>
          ))}
        </div>
        <div role="tabpanel">{views[view].node}</div>
        <div className="mt-5 flex items-center justify-between text-sm font-semibold">
          <button type="button" onClick={() => setView((v) => Math.max(0, v - 1))} disabled={view === 0} className="flex items-center gap-1.5 text-slate-600 hover:text-brand-800 disabled:opacity-30">
            <ArrowLeft size={16} /> Previous
          </button>
          <span className="text-slate-400 tabular">
            {view + 1} / {views.length} · {views[view].chart}
          </span>
          <button
            type="button"
            onClick={() => setView((v) => Math.min(views.length - 1, v + 1))}
            disabled={view === views.length - 1}
            className="flex items-center gap-1.5 text-brand-700 hover:text-brand-900 disabled:opacity-30"
          >
            Next question <ArrowRight size={16} />
          </button>
        </div>
      </Section>

      <Section tone="soft">
        <SectionHead step="03" eyebrow="What was tried" title={c.tried.title} lead={c.tried.lead} />
        <Reveal>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {c.tried.stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} sub={s.sub} />
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { head: 'Why it did not work', items: c.tried.why },
              { head: 'What the data cannot say', items: c.tried.limits },
            ].map((b) => (
              <div key={b.head} className="rounded-2xl bg-white border border-slate-200 p-6">
                <h5 className="font-bold text-ink mb-3">{b.head}</h5>
                <ul className="space-y-2.5 text-slate-700 leading-relaxed">
                  {b.items.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section>
        <SectionHead step="04" eyebrow="Three ways forward" title={options.title} lead={options.lead} />
        <div className="grid md:grid-cols-3 gap-5">
          {options.items.map((o, i) => (
            <Reveal key={o.title} delay={i * 100}>
              <div className={`h-full rounded-2xl border p-6 ${i === options.pick ? 'border-brand-300 bg-brand-50/50' : 'border-slate-200 bg-white'}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 mb-2">Option {letters[i]}</p>
                <h5 className="text-lg font-bold text-ink leading-snug mb-4">{o.title}</h5>
                <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                  {o.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="soft">
        <SectionHead step="05" eyebrow="The recommendation" title={c.recommendation.title} />
        <Reveal>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 rounded-2xl bg-white border border-slate-200 p-6 overflow-x-auto">
              <h5 className="font-bold text-ink mb-4">How the options score</h5>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-3 font-semibold">Criterion (1 = weak, 3 = strong)</th>
                    {letters.map((l) => (
                      <th key={l} className="py-2 px-2 font-semibold text-center">
                        {l}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {options.criteria.map((cr, ci) => (
                    <tr key={cr} className="border-b border-slate-100">
                      <td className="py-2.5 pr-3 text-slate-700">{cr}</td>
                      {options.items.map((o) => (
                        <td key={o.title} className="py-2.5 px-2 text-center tabular text-slate-700">
                          {o.scores[ci]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-2.5 pr-3 font-bold text-ink">Total</td>
                    {options.items.map((o, i) => (
                      <td key={o.title} className={`py-2.5 px-2 text-center tabular font-bold ${i === options.pick ? 'text-brand-700' : 'text-ink'}`}>
                        {o.scores.reduce((s, v) => s + v, 0)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <p className="mt-4 text-xs text-slate-500 leading-relaxed">{c.recommendation.scoreNote}</p>
            </div>
            <div className="md:col-span-2 rounded-2xl bg-ink text-white p-6">
              <h5 className="font-bold mb-4">Why Option {letters[options.pick]}</h5>
              <ul className="space-y-3 text-sm text-slate-200 leading-relaxed">
                {c.recommendation.why.map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <Check size={16} className="mt-0.5 text-teal-300 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
              <p className="mt-5 pt-4 border-t border-white/10 text-sm text-slate-300 leading-relaxed">{c.recommendation.closing}</p>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section>
        <SectionHead step="06" eyebrow="How it was built" title="Reproduce it, or run the same method on your own data" lead={c.built.lead} />
        <Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            <a href={c.built.repoUrl} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-slate-200 p-6 hover:border-brand-300 hover:shadow-lg transition-all">
              <Github className="text-ink mb-3" size={28} />
              <h5 className="font-bold text-ink mb-1 flex items-center gap-2">
                SQL, result tables and method on GitHub <ExternalLink size={14} className="text-slate-400 group-hover:text-brand-600" />
              </h5>
              <p className="text-sm text-slate-600 leading-relaxed">{c.built.repoText}</p>
            </a>
            <a href="#consult" className="group rounded-2xl bg-brand-700 text-white p-6 hover:bg-brand-800 transition-colors">
              <Calendar className="mb-3" size={28} />
              <h5 className="font-bold mb-1 flex items-center gap-2">
                Want this for your business? <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </h5>
              <p className="text-sm text-brand-100 leading-relaxed">Book a 20-minute call and I will walk you through the whole process and how it would work on your data.</p>
            </a>
          </div>
          <details className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700 leading-relaxed">
            <summary className="cursor-pointer font-bold text-ink">Method, limits and sources</summary>
            <ul className="mt-4 space-y-2 list-disc pl-5">
              {c.built.method.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </details>
        </Reveal>
      </Section>

      <p className="px-4 sm:px-8 py-5 text-xs text-slate-500 border-t border-slate-200">{c.footer}</p>
    </div>
  );
}
