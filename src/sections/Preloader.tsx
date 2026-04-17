import { useEffect, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { siteContent } from "@/content/siteContent";

type PreloaderProps = {
  onComplete: () => void;
};

const preloaderParticles = Array.from({ length: 22 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 22;
  const radius = 8 + (index % 5) * 3.4;

  return {
    id: `particle-${index}`,
    x: `${Math.cos(angle) * radius}rem`,
    y: `${Math.sin(angle) * radius}rem`,
    delay: `${(index % 6) * 0.12}s`,
  };
});

export function Preloader({ onComplete }: PreloaderProps) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const lineTimer = window.setInterval(() => {
      setVisibleLines((current) => {
        if (current >= siteContent.preloader.lines.length) {
          window.clearInterval(lineTimer);
          return current;
        }

        return current + 1;
      });
    }, 420);

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete,
    });

    timeline
      .fromTo(".preloader-overlay", { opacity: 1 }, { opacity: 1, duration: 0.4 })
      .fromTo(".preloader-initials", { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2 }, 0.2)
      .to(".preloader-burst", { scale: 1.15, opacity: 1, duration: 0.8 }, 1.9)
      .to(".preloader-overlay", { opacity: 0, duration: 0.7, pointerEvents: "none" }, 2.6);

    return () => {
      window.clearInterval(lineTimer);
      timeline.kill();
    };
  }, [onComplete]);

  return (
    <div className="preloader-overlay">
      <div className="preloader-content">
        <div className="preloader-status">
          {siteContent.preloader.lines.map((line, index) => (
            <p key={line} className={index < visibleLines ? "is-visible" : ""}>
              {line}
            </p>
          ))}
        </div>
        <div className="preloader-center">
          <div className="preloader-particle-field" aria-hidden="true">
            {preloaderParticles.map((particle) => (
              <span
                key={particle.id}
                className="preloader-particle"
                style={
                  {
                    "--particle-x": particle.x,
                    "--particle-y": particle.y,
                    "--particle-delay": particle.delay,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <span className="preloader-initials">{siteContent.preloader.initials}</span>
          <span className="preloader-burst" />
        </div>
      </div>
    </div>
  );
}
