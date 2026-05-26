import { useEffect, useRef } from "react";
// @ts-expect-error - lottie-react ESM entry exports Lottie as default
import Lottie from "lottie-react/build/index.es.js";
import animationData from "../assets/animation_sport.json";

const segments = [
  [0, 39],
  [40, 91],
  [92, 178],
];

export default function SportAnimator() {
  const lottieRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const sportIndexRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const lottie = lottieRef.current;
    if (!container || !lottie) return;

    const playSegment = (index: number) => {
      const [start, end] = segments[index]!;
      lottie.playSegments([start, end], true);
    };

    const onComplete = () => {
      playSegment(sportIndexRef.current);
    };

    lottie.addEventListener("complete", onComplete);
    playSegment(0);

    let x = -200;
    const animate = () => {
      x += 2;
      if (x > window.innerWidth + 200) {
        x = -200;
        sportIndexRef.current = (sportIndexRef.current + 1) % segments.length;
        playSegment(sportIndexRef.current);
      }
      container.style.transform = `translateX(${x}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lottie.removeEventListener("complete", onComplete);
    };
  }, []);

  return (
    <div className="absolute bottom-16 left-0 right-0 h-36 overflow-hidden pointer-events-none">
      <div ref={containerRef} className="absolute bottom-0 flex flex-col items-center">
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={false}
          autoplay={false}
          className="w-32 h-32"
          style={{ filter: "brightness(0) invert(0.7)" }}
        />
      </div>
    </div>
  );
}
