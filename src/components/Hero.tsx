import { ArrowRight, Calendar, TrendingUp } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mini bar chart heights for the floating KPI card
  const bars = [92, 78, 61, 44, 30];

  return (
    <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      {/* Background: white with a faint analytics grid + soft colour washes */}
      <div className="pointer-events-none absolute inset-0 bg-dot-grid mask-fade-b" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 right-0 w-[560px] h-[420px] rounded-full bg-brand-100/60 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute top-16 -left-48 w-[380px] h-[320px] rounded-full bg-teal-100/40 blur-3xl" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* TEXT SECTION: Order 2 on mobile (bottom), Order 1 on Desktop (left) */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-ink leading-tight tracking-tight">
                Stop Guessing.<br />
                <span className="text-gradient-brand">
                  Start Growing
                </span>{' '}
                with Data-Backed Evidence.
              </h1>
              <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Quantitative Researcher & Digital Marketing Analyst helping businesses and researchers find clarity in the noise.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => scrollToSection('consult')}
                className="group px-8 py-4 bg-brand-700 text-white rounded-lg font-semibold shadow-lg shadow-brand-900/20 hover:bg-brand-800 hover:shadow-xl hover:shadow-brand-900/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Calendar size={20} />
                Book a Consultation
                <ArrowRight size={20} className="text-teal-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* IMAGE SECTION: Order 1 on mobile (top), Order 2 on Desktop (right) */}
          <div className="flex items-center justify-center order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="relative w-full max-w-md lg:max-w-full h-[300px] sm:h-[450px] group flex items-center justify-center">
              {/* Frame */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-100 via-white to-teal-50 border border-slate-200/80" />
              <div className="absolute inset-0 rounded-3xl bg-line-grid opacity-70" aria-hidden="true" />

              <div className="absolute inset-3 sm:inset-4 rounded-2xl overflow-hidden group-hover:-translate-y-1 transition-all duration-500">
                <img
                  src="https://raw.githubusercontent.com/scaleupwithsabbir/Media-files-/18ab29c2811e57e5dea4fa06485d54c2a4d90e46/Image%203.jpeg"
                  alt="Sabbir Rifat"
                  className="relative z-10 w-full h-full object-contain rounded-xl drop-shadow-[0_20px_30px_rgba(14,24,56,0.18)]"
                />
              </div>

              {/* Floating KPI card — reporting time */}
              <div className="hidden sm:block absolute z-20 left-0 lg:-left-6 top-10 animate-float">
                <div className="bg-white/95 backdrop-blur rounded-xl border border-slate-200 shadow-xl shadow-brand-900/10 px-4 py-3 w-44">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Reporting time</p>
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-2xl font-bold text-ink tabular">−70%</span>
                    <div className="flex items-end gap-1 h-8" aria-hidden="true">
                      {bars.map((h, i) => (
                        <span
                          key={i}
                          className="w-1.5 rounded-sm bg-gradient-to-t from-brand-700 to-brand-400 origin-bottom animate-growBar"
                          style={{ height: `${h}%`, animationDelay: `${300 + i * 120}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Automated KPI dashboards</p>
                </div>
              </div>

              {/* Floating KPI card — retail reach */}
              <div className="hidden sm:block absolute z-20 right-0 lg:-right-4 bottom-10 animate-float-slow" style={{ animationDelay: '1.2s' }}>
                <div className="bg-white/95 backdrop-blur rounded-xl border border-slate-200 shadow-xl shadow-brand-900/10 px-4 py-3 w-48">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center">
                      <TrendingUp size={14} />
                    </span>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Retail outlets</p>
                  </div>
                  <p className="text-2xl font-bold text-ink mt-1 tabular">3,192</p>
                  <svg viewBox="0 0 100 24" className="w-full h-6 mt-1" aria-hidden="true">
                    <polyline
                      points="0,20 15,17 30,18 45,12 60,13 75,7 90,8 100,3"
                      fill="none"
                      stroke="#0D9488"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
