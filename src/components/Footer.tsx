import { Linkedin, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-ink text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <span className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-700 via-brand-500 to-teal-500" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Sabbir Rifat</h3>
            <p className="text-slate-400 leading-relaxed">
              Quantitative Researcher & Digital Marketing Analyst helping businesses and researchers find clarity in the noise.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-slate-400 hover:text-teal-300 transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-slate-400 hover:text-teal-300 transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-slate-400 hover:text-teal-300 transition-colors"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-slate-400 hover:text-teal-300 transition-colors"
                >
                  Consult
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Connect</h4>
            <div className="space-y-4">
              <a
                href="mailto:scaleupwithsabbir@gmail.com"
                className="flex items-center gap-3 text-slate-400 hover:text-teal-300 transition-colors group"
              >
                <div className="w-10 h-10 bg-white/5 ring-1 ring-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Mail size={20} />
                </div>
                <span className="text-sm">scaleupwithsabbir@gmail.com</span>
              </a>

              <a
                href="https://linkedin.com/in/aemsabbirrifat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-400 hover:text-teal-300 transition-colors group"
              >
                <div className="w-10 h-10 bg-white/5 ring-1 ring-white/10 rounded-lg flex items-center justify-center group-hover:bg-brand-600 transition-colors">
                  <Linkedin size={20} />
                </div>
                <span className="text-sm">LinkedIn Profile</span>
              </a>

              <a
                href="https://github.com/AEMSabbirRifat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-400 hover:text-teal-300 transition-colors group"
              >
                <div className="w-10 h-10 bg-white/5 ring-1 ring-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Github size={20} />
                </div>
                <span className="text-sm">GitHub Profile</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-slate-400">
            &copy; 2026 A E M Sabbir Rifat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
