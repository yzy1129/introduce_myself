import { useEffect } from "react";
import type { PropsWithChildren, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSectionRegistration } from "@/hooks/useSectionRegistration";

type SectionFrameProps = PropsWithChildren<{
  id: string;
  index: string;
  heading: string;
  description?: string;
  className?: string;
  aside?: ReactNode;
}>;

export function SectionFrame({
  id,
  index,
  heading,
  description,
  className = "",
  children,
  aside,
}: SectionFrameProps) {
  const ref = useSectionRegistration(id);
  const headingId = `${id}-heading`;

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        element.querySelectorAll(".section-intro, .section-body > *, .section-aside"),
        {
          y: 36,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: element,
            start: "top 78%",
          },
        },
      );
    }, element);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [ref]);

  return (
    <section
      id={id}
      ref={ref}
      data-section-id={id}
      aria-labelledby={headingId}
      className={`story-section ${className}`.trim()}
    >
      <div className="section-shell">
        <div className="section-intro">
          <span className="section-index">{index}</span>
          <div>
            <h2 id={headingId}>{heading}</h2>
            {description ? <p>{description}</p> : null}
          </div>
        </div>
        <div className="section-body">{children}</div>
        {aside ? <div className="section-aside">{aside}</div> : null}
      </div>
    </section>
  );
}
