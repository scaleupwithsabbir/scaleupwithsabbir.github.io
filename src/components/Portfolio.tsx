import { Database, TrendingUp, ArrowRight } from 'lucide-react';
import { ChartDivider, Eyebrow, Reveal } from './ui';

export default function Portfolio() {
  const projects = [
    {
      icon: Database,
      title: "Created 1%er insight for Brain Feed Ltd., UK",
      description: "Engineered a centralized data warehouse merging 5+ disparate sources (Shopify, Meta, AWS, Mailchimp). Automated reporting reduced manual data entry by 40% and uncovered 'Whale' customer segments that drove a 15% increase in retention via targeted campaigns.",
      iconWrap: 'bg-brand-700',
      accent: 'from-brand-700 to-brand-500',
      tag: 'Marketing Analytics · UK',
      kpis: [
        { value: '−40%', label: 'Manual data entry', pct: 40, color: 'bg-brand-600' },
        { value: '+15%', label: 'Customer retention', pct: 15, color: 'bg-teal-500' },
      ],
    },
    {
      icon: TrendingUp,
      title: "Analyzed Business for Qi Europe Ltd., Spain",
      description: "Conducted a comprehensive 5-year historical market feasibility study for European expansion. Identified 3 high-growth regions with a projected €2M revenue opportunity and mitigated entry risk by 30% through deep competitor benchmarking and financial modeling.",
      iconWrap: 'bg-teal-600',
      accent: 'from-teal-600 to-teal-400',
      tag: 'Market Entry Strategy · Spain',
      kpis: [
        { value: '€2M', label: 'Revenue opportunity', pct: 80, color: 'bg-teal-500' },
        { value: '−30%', label: 'Entry risk', pct: 30, color: 'bg-brand-600' },
      ],
    }
  ];

  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <Eyebrow>Case Studies</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4 tracking-tight">
            Selected Work
          </h2>
          <ChartDivider className="mb-6" />
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real-world projects driving measurable business growth.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <Reveal key={index} delay={index * 120}>
                <div className="group relative h-full bg-white rounded-2xl border border-slate-200 shadow-[0_18px_40px_-30px_rgba(14,24,56,0.45)] overflow-hidden hover:shadow-[0_30px_60px_-30px_rgba(14,24,56,0.55)] hover:-translate-y-3 transition-all duration-300">
                  <span className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${project.accent}`} aria-hidden="true" />
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 ${project.iconWrap} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-brand-900/20`}>
                        <Icon className="text-white" size={32} />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                        {project.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-ink mb-4 leading-tight">
                      {project.title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* KPI result tiles */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {project.kpis.map((k) => (
                        <div key={k.label} className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                          <p className="text-xl font-bold text-ink tabular">{k.value}</p>
                          <p className="text-xs text-slate-500 mb-2">{k.label}</p>
                          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${k.color}`}
                              style={{ width: `${k.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center text-sm font-bold text-brand-700 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:-translate-x-2 md:group-hover:translate-x-0">
                      View Project Insights <ArrowRight size={16} className="ml-2 text-teal-500" />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
