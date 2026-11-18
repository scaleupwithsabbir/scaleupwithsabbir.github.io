import { ArrowRight, Check, Download, ExternalLink, FileText, Github, Lock, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Reveal } from '../components/ui';
import { A } from './Story';

/* A software project, not a data story: short and scannable. Every claim below comes from the public README of the repository. */

const REPO_URL = 'https://github.com/AEMSabbirRifat/QuantCompass-Local';
const ZIP_URL = 'https://github.com/AEMSabbirRifat/QuantCompass-Local/archive/refs/heads/main.zip';

const steps = ['Data & codebook', 'Hypotheses & variables', 'Prepare data', 'Describe & reliability', 'Assumption checks', 'Results & report'];

const failed = [
  { who: 'SPSS, Stata and similar packages', what: 'Paid licences and a steep menu maze. Click a button, get a table, and no script to show how it was made.' },
  { who: 'Copied R or Python code', what: 'It runs, but the assumptions are skipped, and the student cannot explain a line of it to a supervisor.' },
  { who: 'Excel and quick online calculators', what: 'No assumption checks, no rule for choosing the test, and no thesis-ready write-up.' },
];

const strengths = [
  'Assumptions are screened before any test is chosen, and the choice follows fixed, published rules.',
  'Every number is computed in R. The exact script is handed over, so any result can be re-run and checked.',
  'Each hypothesis returns a Word + HTML report with an APA-style paragraph, charts and a plain-language explanation.',
  'Runs on your own computer, so your data never leaves it. Free, and open source under GPL-3.0.',
];

export default function QuantCompassProject() {
  return (
    <div className="bg-white">
      {/* Hero band */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 px-4 sm:px-8 py-10 sm:py-12 text-white">
        <div className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 w-72 h-72 rounded-full bg-brand-300/20 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-300 mb-4">
            <Sparkles size={14} /> Open-source software · R · v0.6 pilot
          </p>
          <p className="text-2xl sm:text-3xl font-bold leading-snug tracking-tight">
            Upload your survey data. Paste your hypotheses. Get thesis-ready results, a methods section and the exact R script.
          </p>
          <p className="mt-3 text-lg text-brand-100">No coding. No licence fee. Every decision explained.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50 transition-colors"
            >
              <Github size={18} /> View on GitHub <ExternalLink size={14} className="opacity-60" />
            </a>
            <a
              href={ZIP_URL}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              <Download size={18} /> Download free
            </a>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-10 sm:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Problem + purpose */}
          <div className="grid md:grid-cols-2 gap-5">
            <Reveal>
              <div className="h-full rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 mb-2">The problem</p>
                <h4 className="text-xl font-bold text-ink leading-snug mb-3">Weeks lost on steps that quietly change your results</h4>
                <p className="text-slate-700 leading-relaxed">
                  Students and early researchers repeat the same chain in every study: clean the survey export, build scales, pick a test, check its assumptions, write it up. One missed
                  missing-value code, one unreversed item or one invalid test, and the findings shift without anyone noticing.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="h-full rounded-2xl border border-brand-200 bg-brand-50/60 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 mb-2">The purpose</p>
                <h4 className="text-xl font-bold text-ink leading-snug mb-3">Make sound statistics possible for a complete beginner</h4>
                <p className="text-slate-700 leading-relaxed">
                  One guided, transparent workflow, free for students. It works with <strong>any</strong> survey dataset and codebook, and it teaches as it goes: plain-language
                  explanations and key terms sit next to every result.
                </p>
              </div>
            </Reveal>
          </div>

          {/* What did not work */}
          <Reveal className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 mb-2">What was tried before</p>
            <h4 className="text-xl sm:text-2xl font-bold text-ink tracking-tight mb-5">The usual routes, and where they fall short</h4>
            <div className="grid md:grid-cols-3 gap-4">
              {failed.map((f) => (
                <div key={f.who} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600" aria-hidden="true">
                    <X size={16} />
                  </span>
                  <h5 className="font-bold text-ink mb-1.5 leading-snug">{f.who}</h5>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.what}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Why it stands apart */}
          <Reveal className="mt-10">
            <div className="grid md:grid-cols-5 gap-5">
              <div className="md:col-span-3 rounded-2xl bg-ink text-white p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300 mb-2">Why it stands apart</p>
                <h4 className="text-xl font-bold leading-snug mb-4">Transparent, checkable and free</h4>
                <ul className="space-y-3 text-sm sm:text-base text-slate-200 leading-relaxed">
                  {strengths.map((s) => (
                    <li key={s} className="flex gap-2.5">
                      <Check size={18} className="mt-0.5 text-teal-300 shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2 grid gap-4 content-start">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 flex gap-3">
                  <Lock className="text-brand-600 shrink-0 mt-0.5" size={22} />
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <strong className="text-ink">Private by design.</strong> The optional AI assistant uses your own key, never computes a number, and can be limited to summaries only.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 flex gap-3">
                  <ShieldCheck className="text-brand-600 shrink-0 mt-0.5" size={22} />
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <strong className="text-ink">Validated.</strong> A test suite checks every analysis against reference results and re-runs on GitHub after every change.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 flex gap-3">
                  <FileText className="text-brand-600 shrink-0 mt-0.5" size={22} />
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <strong className="text-ink">Supervisor-friendly.</strong> Reports state every decision, so a reviewer can follow and reproduce each result.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Six steps */}
          <Reveal className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 mb-3">Six clicks-only steps</p>
            <ol className="flex flex-wrap gap-2">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white tabular">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </Reveal>

          {/* Links */}
          <Reveal className="mt-10">
            <div className="grid sm:grid-cols-2 gap-5">
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-slate-200 p-6 hover:border-brand-300 hover:shadow-lg transition-all">
                <Github className="text-ink mb-3" size={28} />
                <h5 className="font-bold text-ink mb-1 flex items-center gap-2">
                  Code, docs and decision rules on GitHub <ExternalLink size={14} className="text-slate-400 group-hover:text-brand-600" />
                </h5>
                <p className="text-sm text-slate-600 leading-relaxed">Runs with free R and RStudio. A browser version with no installation is in development.</p>
              </a>
              <a href="#consult" className="group rounded-2xl bg-brand-700 text-white p-6 hover:bg-brand-800 transition-colors">
                <ArrowRight className="mb-3 group-hover:translate-x-1 transition-transform" size={28} />
                <h5 className="font-bold mb-1">Teaching a methods course, or need analysis for your own data?</h5>
                <p className="text-sm text-brand-100 leading-relaxed">Book a 20-minute call and I will show you how it works.</p>
              </a>
            </div>
            <p className="mt-6 text-xs text-slate-500 leading-relaxed">
              QuantCompass computes results; it cannot judge whether a study design fits its research question. Licensed under GPL-3.0. Source and full documentation:{' '}
              <A href={REPO_URL}>github.com/AEMSabbirRifat/QuantCompass-Local</A>.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
