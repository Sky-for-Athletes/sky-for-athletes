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

  const handleLoad = useCallback(() => {
    playSegment(0);
  }, [playSegment]);

  const onComplete = useCallback(() => {
    sportIndexRef.current = (sportIndexRef.current + 1) % segments.length;
    playSegment(sportIndexRef.current);
  }, [playSegment]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      const anim = lottieRef.current;
      if (anim) {
        const currentFrame = anim.currentFrame;
        const [start, end] = segments[sportIndexRef.current]!;
        const progress = Math.min(
          (currentFrame - start) / (end - start),
          1,
        );
        const x = -200 + (window.innerWidth + 400) * progress;
        container.style.transform = `translateX(${x}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="absolute bottom-16 left-0 right-0 h-36 overflow-hidden pointer-events-none">
      <div ref={containerRef} className="absolute bottom-0 flex flex-col items-center">
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={false}
          autoplay={false}
          onLoaded={handleLoad}
          onComplete={onComplete}
          className="w-32 h-32"
          style={{ filter: "brightness(0) invert(0.7)" }}
        />
      </div>
    </div>
  );
}
