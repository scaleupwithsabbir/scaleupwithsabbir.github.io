import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Returns a ref and whether the element has entered the viewport (fires once). */
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/** Fades + lifts children in when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Section divider drawn as a tiny ascending bar chart — a data-analyst signature. */
export function ChartDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-end justify-center gap-1 h-5 ${className}`} aria-hidden="true">
      <span className="w-1.5 h-2 rounded-sm bg-brand-300" />
      <span className="w-1.5 h-3 rounded-sm bg-brand-500" />
      <span className="w-1.5 h-4 rounded-sm bg-brand-700" />
      <span className="w-1.5 h-5 rounded-sm bg-teal-500" />
      <span className="ml-1 mb-[3px] w-12 h-[3px] rounded-full bg-gradient-to-r from-teal-500 to-teal-500/0" />
    </div>
  );
}

/** Small label shown above section titles. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 mb-3">
      {children}
    </p>
  );
}

/** Animated count-up number. */
export function CountUp({
  to,
  duration = 1600,
  start,
  format = (n: number) => n.toLocaleString('en-US'),
}: {
  to: number;
  duration?: number;
  start: boolean;
  format?: (n: number) => string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setValue(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, duration]);

  return <span className="tabular">{format(value)}</span>;
}
