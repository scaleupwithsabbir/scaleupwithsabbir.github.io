import { Code2, PieChart, Megaphone } from 'lucide-react';
import { ChartDivider, Eyebrow, Reveal } from './ui';

export default function About() {
  const techStack = {
    tools: ['R', 'R Studio', 'SQL', 'Python', 'SPSS', 'VS Code'],
    viz: ['Power BI', 'Looker Studio', 'Tableau'],
    marketing: ['GA4', 'Google Tag Manager', 'Meta Ads Manager', 'Shopify Analytics']
  };

  const journey = [
    { year: '2019', code: 'BD', place: 'Bangladesh', org: 'M.M. Ispahani Ltd.', role: 'Business Development' },
    { year: '2020', code: 'BD', place: 'Bangladesh', org: 'Unilever', role: 'B2B Territory Sales' },
    { year: '2024', code: 'ES', place: 'Spain', org: 'Qi Europe Ltd.', role: 'European Market Research' },
    { year: '2024', code: 'DE', place: 'Germany', org: 'OVGU Magdeburg', role: 'Research Assistant, Quant. Methods' },
    { year: '2025', code: 'UK', place: 'United Kingdom', org: 'Brain Feed Ltd.', role: 'Digital Marketing Analytics' },
  ];

  const stackCards = [
    {
      title: 'Tools & Languages',
      items: techStack.tools,
      Icon: Code2,
      bar: 'bg-brand-700',
      icon: 'bg-brand-50 text-brand-700',
      chip: 'hover:border-brand-500 hover:text-brand-800',
    },
    {
      title: 'Visualization',
      items: techStack.viz,
      Icon: PieChart,
      bar: 'bg-teal-500',
      icon: 'bg-teal-50 text-teal-700',
      chip: 'hover:border-teal-500 hover:text-teal-800',
    },
    {
      title: 'Digital Marketing',
      items: techStack.marketing,
      Icon: Megaphone,
      bar: 'bg-amber-500',
      icon: 'bg-amber-50 text-amber-700',
      chip: 'hover:border-amber-500 hover:text-amber-800',
    },
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-12">
          <Eyebrow>About</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4 tracking-tight">The Expert</h2>
          <ChartDivider />
        </Reveal>

        <Reveal>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-[0_18px_40px_-28px_rgba(14,24,56,0.4)] p-8 sm:p-12 mb-12 hover:shadow-[0_24px_50px_-28px_rgba(14,24,56,0.5)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-700 to-teal-500" aria-hidden="true" />
            <p className="text-lg text-slate-700 leading-relaxed">
              I am a <span className="font-semibold text-ink">Quantitative Data Analyst and Researcher</span> based in Germany with experience across Asia, Europe, and the UK. I bridge the gap between messy raw data and actionable business strategy.
            </p>
          </div>
        </Reveal>

        {/* Career journey visualisation */}
        <Reveal className="mb-16">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-line-grid opacity-60 pointer-events-none" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-700">Career Journey</h3>
                <p className="text-xs text-slate-500">Asia → Europe → UK</p>
              </div>

              <ol className="relative grid gap-6 lg:grid-cols-5 lg:gap-4">
                {/* connector line (desktop) */}
                <span
                  className="hidden lg:block absolute top-[11px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-brand-700 via-brand-400 to-teal-500"
                  aria-hidden="true"
                />
                {/* connector line (mobile) */}
                <span
                  className="lg:hidden absolute top-2 bottom-2 left-[11px] w-[2px] bg-gradient-to-b from-brand-700 via-brand-400 to-teal-500"
                  aria-hidden="true"
                />
                {journey.map((j, i) => (
                  <li key={j.org} className="relative flex lg:flex-col lg:items-center gap-4 lg:gap-3 lg:text-center">
                    <span
                      className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full border-4 border-white shadow ${
                        i === journey.length - 1 ? 'bg-teal-500' : 'bg-brand-700'
                      }`}
                    />
                    <div>
                      <div className="flex lg:justify-center items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-brand-700 tabular">{j.year}</span>
                        <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                          {j.code}
                        </span>
                      </div>
                      <p className="font-semibold text-ink leading-snug">{j.org}</p>
                      <p className="text-sm text-slate-500 leading-snug">{j.role}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>

        <div className="space-y-6">
          <Reveal>
            <h3 className="text-2xl font-bold text-ink text-center mb-8 tracking-tight">Tech Stack</h3>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stackCards.map(({ title, items, Icon, bar, icon, chip }, i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="group relative h-full bg-white rounded-xl p-8 border border-slate-200 hover:shadow-[0_20px_40px_-24px_rgba(14,24,56,0.45)] hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                  <span className={`absolute top-0 left-0 right-0 h-1 ${bar}`} aria-hidden="true" />
                  <div className={`w-11 h-11 rounded-lg ${icon} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={22} />
                  </div>
                  <h4 className="font-bold text-ink mb-6 text-sm uppercase tracking-wider text-center">{title}</h4>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {items.map((tech) => (
                      <span
                        key={tech}
                        className={`px-4 py-2 bg-slate-50 text-slate-800 rounded-full text-sm font-semibold border border-slate-200 hover:bg-white hover:shadow-md transition-all duration-200 ${chip}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
