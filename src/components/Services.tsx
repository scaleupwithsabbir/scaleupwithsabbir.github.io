import { BarChart3, Brain } from 'lucide-react';
import { ChartDivider, Eyebrow, Reveal } from './ui';

export default function Services() {
  const services = [
    {
      icon: BarChart3,
      title: 'Data-Driven Decision Making & Visual Storytelling',
      target: 'SMEs, Startups, Marketing Managers',
      description: "Transform your messy spreadsheets and tracking tags into clear, interactive dashboards. I don't just dump data; I tell visual stories that help you optimize campaigns, fix conversion funnels, and prove ROI.",
      iconWrap: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
      accent: 'bg-brand-700',
      target_c: 'text-brand-700',
      chart: '#1C38A3',
    },
    {
      icon: Brain,
      title: 'Advanced Statistical Analysis Solutions',
      target: 'PhD Students, Professors, Research Firms',
      description: 'Struggling with complex datasets or hypothesis testing? I provide academic-grade statistical modeling. From survey design to final analysis in R or SPSS, I ensure your methodology is rigorous and publication-ready.',
      iconWrap: 'bg-teal-50 text-teal-700 ring-1 ring-teal-100',
      accent: 'bg-teal-500',
      target_c: 'text-teal-700',
      chart: '#0D9488',
    }
  ];

  return (
    <section id="services" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-line-grid opacity-70 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <Eyebrow>What I do</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4 tracking-tight">Services</h2>
          <ChartDivider className="mb-6" />
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Transforming data complexity into actionable insights
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Reveal key={index} delay={index * 120}>
                <div className="group relative h-full bg-white rounded-2xl border border-slate-200 shadow-[0_18px_40px_-30px_rgba(14,24,56,0.45)] p-8 hover:shadow-[0_28px_60px_-30px_rgba(14,24,56,0.55)] hover:-translate-y-3 transition-all duration-300 overflow-hidden">
                  <span className={`absolute left-0 top-0 h-1 w-0 group-hover:w-full ${service.accent} transition-all duration-500`} aria-hidden="true" />

                  {/* Decorative chart watermark */}
                  <svg
                    className="absolute -right-4 -top-2 w-40 h-24 opacity-[0.08] group-hover:opacity-[0.16] transition-opacity duration-500"
                    viewBox="0 0 160 96"
                    aria-hidden="true"
                  >
                    {index === 0 ? (
                      [18, 34, 26, 52, 44, 70, 84].map((h, i) => (
                        <rect key={i} x={i * 22 + 6} y={96 - h} width="14" height={h} rx="2" fill={service.chart} />
                      ))
                    ) : (
                      <>
                        {[[20, 70], [36, 58], [50, 64], [64, 46], [80, 50], [94, 34], [110, 38], [126, 22], [140, 18]].map(([x, y], i) => (
                          <circle key={i} cx={x} cy={y} r="4" fill={service.chart} />
                        ))}
                        <line x1="10" y1="78" x2="150" y2="12" stroke={service.chart} strokeWidth="3" />
                      </>
                    )}
                  </svg>

                  <div className={`relative w-16 h-16 ${service.iconWrap} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={32} />
                  </div>

                  <h3 className="relative text-xl font-bold text-ink mb-3 leading-tight">
                    {service.title}
                  </h3>

                  <p className={`relative text-sm font-semibold ${service.target_c} mb-4 uppercase tracking-wide`}>
                    {service.target}
                  </p>

                  <p className="relative text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
