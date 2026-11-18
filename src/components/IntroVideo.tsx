import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { Reveal } from './ui';

// Second at which the video's end card appears; links are laid over its URL and button.
const END_CARD_AT = 71.6;

export default function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [endCard, setEndCard] = useState(false);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    v.play().catch(() => undefined);
  };

  return (
    <Reveal className="mb-12">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-ink shadow-[0_18px_40px_-28px_rgba(14,24,56,0.55)]">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          controls={started}
          preload="metadata"
          playsInline
          poster="/video/intro_poster.jpg"
          onPlay={() => setStarted(true)}
          onTimeUpdate={(e) => setEndCard(e.currentTarget.currentTime >= END_CARD_AT)}
          onEnded={() => setEndCard(true)}
        >
          <source src="/video/intro_web.mp4" type="video/mp4" />
          Your browser does not support HTML video.
        </video>

        {!started && (
          <button type="button" onClick={play} aria-label="Play the intro video" className="group absolute inset-0 focus:outline-none">
            <span className="absolute left-[5.7%] top-[75%] flex h-12 w-12 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-amber-500/95 text-ink shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-white/70">
              <Play className="h-5 w-5 sm:h-8 sm:w-8 translate-x-0.5" fill="currentColor" />
            </span>
          </button>
        )}

        {endCard && (
          <>
            <a
              href="https://scaleupwithsabbir.github.io/"
              aria-label="scaleupwithsabbir.github.io"
              className="absolute rounded-lg focus-visible:ring-4 focus-visible:ring-white/70"
              style={{ left: '32%', top: '50%', width: '36%', height: '6.5%' }}
            />
            <a
              href="#consult"
              aria-label="Book a free call"
              className="absolute rounded-2xl focus-visible:ring-4 focus-visible:ring-white/70"
              style={{ left: '37%', top: '58.5%', width: '26%', height: '10.5%' }}
            />
          </>
        )}
      </div>
    </Reveal>
  );
}
