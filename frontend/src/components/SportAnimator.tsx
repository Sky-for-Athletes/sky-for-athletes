import { useEffect, useRef, useCallback } from "react";
// @ts-expect-error - lottie-react ESM entry exports Lottie as default
import Lottie from "lottie-react/build/index.es.js";
import animationData from "../assets/animation_sport.json";

const segments: [number, number][] = [
  [0, 39],
  [40, 91],
  [92, 178],
];

export default function SportAnimator() {
  const lottieRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const sportIndexRef = useRef(0);

  const playSegment = useCallback((index: number) => {
    const anim = lottieRef.current;
    if (!anim) return;
    const [start, end] = segments[index]!;
    anim.playSegments([start, end], true);
  }, []);

  const onComplete = useCallback(() => {
    playSegment(sportIndexRef.current);
  }, [playSegment]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    playSegment(0);

    let x = -200;
    const animate = () => {
      x += 2;
      if (x > window.innerWidth + 200) {
        x = -200;
        sportIndexRef.current =
          (sportIndexRef.current + 1) % segments.length;
        playSegment(sportIndexRef.current);
      }
      container.style.transform = `translateX(${x}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [playSegment]);

  return (
    <div className="absolute bottom-16 left-0 right-0 h-36 overflow-hidden pointer-events-none">
      <div ref={containerRef} className="absolute bottom-0 flex flex-col items-center">
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={false}
          autoplay={false}
          onComplete={onComplete}
          className="w-32 h-32"
          style={{ filter: "brightness(0) invert(0.7)" }}
        />
      </div>
    </div>
  );
}
