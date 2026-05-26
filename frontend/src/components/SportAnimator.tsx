import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import animationData from "../assets/animation_sport.json";

const segments = [
  [0, 39],
  [40, 91],
  [92, 178],
];

const sportLabels = ["Corrida", "Ciclismo", "Asa Delta"];

export default function SportAnimator() {
  const lottieRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    const lottie = lottieRef.current;
    if (!container || !lottie) return;

    let currentSport = 0;

    const playSegment = (index: number) => {
      const [start, end] = segments[index]!;
      lottie.playSegments([start, end], true);
    };

    playSegment(0);

    let x = -200;
    const animate = () => {
      x += 2;
      if (x > window.innerWidth + 200) {
        x = -200;
        currentSport = (currentSport + 1) % segments.length;
        const el = container.querySelector<HTMLElement>("[data-sport-label]");
        if (el) el.textContent = sportLabels[currentSport]!;
        playSegment(currentSport);
      }
      container.style.transform = `translateX(${x}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="absolute bottom-16 left-0 right-0 h-36 overflow-hidden pointer-events-none">
      <div ref={containerRef} className="absolute bottom-0 flex flex-col items-center gap-1">
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={false}
          autoplay={false}
          className="w-32 h-32"
          style={{ filter: "brightness(0) invert(0.7)" }}
        />
        <span
          data-sport-label
          className="text-xs text-white/50 font-medium tracking-wide"
        >
          Corrida
        </span>
      </div>
    </div>
  );
}
