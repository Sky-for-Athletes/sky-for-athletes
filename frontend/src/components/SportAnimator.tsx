import { useEffect, useRef } from "react";
// @ts-expect-error - lottie-react ESM entry exports Lottie as default
import Lottie from "lottie-react/build/index.es.js";
import animationData from "../assets/animation_sport.json";

export default function SportAnimator() {
  const lottieRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      const wrapper = lottieRef.current;
      if (wrapper?.animationItem) {
        const frame = wrapper.animationItem.currentFrame;
        const progress = frame / 179;
        const x = -200 + (window.innerWidth + 400) * progress;
        container.style.transform = `translateX(${x}px)`;
      }
      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute bottom-16 left-0 right-0 h-36 overflow-hidden pointer-events-none">
      <div ref={containerRef} className="absolute bottom-0 flex flex-col items-center">
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={true}
          autoplay={true}
          className="w-32 h-32"
          style={{ filter: "brightness(0) invert(0.7)" }}
        />
      </div>
    </div>
  );
}
