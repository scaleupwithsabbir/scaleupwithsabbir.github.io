import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
      setScrolled(h.scrollTop > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const linkClass =
    'relative text-slate-600 hover:text-brand-800 transition-colors font-medium after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-teal-500 after:transition-all hover:after:w-full';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b transition-shadow duration-300 ${
        scrolled ? 'border-slate-200 shadow-[0_4px_20px_-12px_rgba(14,24,56,0.25)]' : 'border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gradient-brand">Sabbir Rifat</h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('about')} className={linkClass}>
              About
            </button>
            <button onClick={() => scrollToSection('services')} className={linkClass}>
              Services
            </button>
            <button onClick={() => scrollToSection('portfolio')} className={linkClass}>
              Portfolio
            </button>
            <button onClick={() => scrollToSection('consult')} className={linkClass}>
              Consult
            </button>
            <button
              onClick={() => scrollToSection('consult')}
              className="px-6 py-2 bg-brand-700 text-white font-semibold rounded-lg shadow-sm shadow-brand-900/20 hover:bg-brand-800 hover:shadow-lg hover:shadow-brand-900/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Book a Call
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-700 hover:text-brand-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Reading-progress bar */}
      <div className="absolute left-0 bottom-0 h-[2px] w-full bg-transparent" aria-hidden="true">
        <div
          className="h-full bg-gradient-to-r from-brand-700 via-brand-500 to-teal-500 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200">
          <div className="px-4 pt-2 pb-4 space-y-3">
            {[
              ['about', 'About'],
              ['services', 'Services'],
              ['portfolio', 'Portfolio'],
              ['consult', 'Consult'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="block w-full text-left px-3 py-2 text-slate-700 hover:bg-brand-50 hover:text-brand-800 rounded-lg transition-colors"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('consult')}
              className="w-full px-6 py-2 bg-brand-700 text-white font-semibold rounded-lg hover:bg-brand-800 transition-all duration-300"
            >
              Book a Call
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
