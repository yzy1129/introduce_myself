import { useRef, useState, type RefObject } from "react";
import { useAppState } from "@/app/AppState";
import type { RevealContent } from "@/types/content";

type RevealTextProps = {
  content: RevealContent;
  as?: "p" | "span" | "div" | "h1";
  className?: string;
};

export function RevealText({
  content,
  as = "p",
  className = "",
}: RevealTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { hoveredRevealId, setHoveredRevealId, isMobile } = useAppState();
  const [tapped, setTapped] = useState(false);

  const active = isMobile ? tapped : hoveredRevealId === content.id;

  const sharedProps = {
    className:
      `reveal-text reveal-${content.mode} ${active ? "is-active" : ""} ${className}`.trim(),
    tabIndex: 0,
    onClick: () => {
      if (isMobile) {
        setTapped((current) => !current);
      }
    },
    onMouseEnter: () => {
      if (!isMobile) {
        setHoveredRevealId(content.id);
      }
    },
    onMouseLeave: () => {
      if (!isMobile && hoveredRevealId === content.id) {
        setHoveredRevealId(null);
      }
    },
    onFocus: () => {
      if (!isMobile) {
        setHoveredRevealId(content.id);
      }
    },
    onBlur: () => {
      if (!isMobile && hoveredRevealId === content.id) {
        setHoveredRevealId(null);
      }
    },
    children: (
      <>
        <span className="reveal-base">{content.base}</span>
        <span className="reveal-enhanced">{content.enhanced}</span>
      </>
    ),
  };

  if (as === "span") {
    return <span ref={ref as RefObject<HTMLSpanElement>} {...sharedProps} />;
  }

  if (as === "div") {
    return <div ref={ref as RefObject<HTMLDivElement>} {...sharedProps} />;
  }

  if (as === "h1") {
    return <h1 ref={ref as RefObject<HTMLHeadingElement>} {...sharedProps} />;
  }

  return <p ref={ref as RefObject<HTMLParagraphElement>} {...sharedProps} />;
}
