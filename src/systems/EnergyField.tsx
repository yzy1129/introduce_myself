import { useEffect, useRef, useState } from "react";
import { useAppState } from "@/app/AppState";

export function EnergyField() {
  const { isMobile, updatePointer, reducedMotion, selectedSkillId } =
    useAppState();
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 });
  const positionRef = useRef({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 });
  const lastFrameRef = useRef(0);
  const activeRef = useRef(false);
  const [active, setActive] = useState(false);
  const overlayActive = Boolean(selectedSkillId);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") {
        return;
      }

      targetRef.current = { x: event.clientX, y: event.clientY };
      updatePointer({ x: event.clientX, y: event.clientY, active: true });

      if (!activeRef.current) {
        activeRef.current = true;
        setActive(true);
      }
    };

    const deactivateField = () => {
      updatePointer({ active: false });
      activeRef.current = false;
      setActive(false);
    };

    const handleLeave = (event?: PointerEvent) => {
      if (event?.pointerType && event.pointerType !== "mouse") {
        return;
      }

      deactivateField();
    };

    const handleBlur = () => {
      deactivateField();
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("blur", handleBlur);
    };
  }, [updatePointer]);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const update = (time: number) => {
      const element = fieldRef.current;
      if (element) {
        const deltaSeconds = lastFrameRef.current === 0 ? 1 / 60 : Math.min((time - lastFrameRef.current) / 1000, 0.05);
        lastFrameRef.current = time;
        const smoothing = 1 - Math.exp(-(reducedMotion ? 24 : 30) * deltaSeconds);
        positionRef.current.x += (targetRef.current.x - positionRef.current.x) * smoothing;
        positionRef.current.y += (targetRef.current.y - positionRef.current.y) * smoothing;
        const lagX = targetRef.current.x - positionRef.current.x;
        const lagY = targetRef.current.y - positionRef.current.y;
        const lagDistance = Math.hypot(lagX, lagY);
        const ringScale = reducedMotion ? 1 : Math.min(1.1, 1 + lagDistance / 620);
        const coreScale = reducedMotion ? 1 : Math.min(1.04, 1 + lagDistance / 1400);
        const trailScale = reducedMotion ? 1 : Math.min(1.18, 1 + lagDistance / 520);
        const trailOffsetX = Math.max(-12, Math.min(12, -lagX * 0.12));
        const trailOffsetY = Math.max(-12, Math.min(12, -lagY * 0.12));
        const glowOpacity = Math.min(
          overlayActive ? 0.9 : 0.68,
          (overlayActive ? 0.56 : 0.32) + lagDistance / 320,
        );
        element.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`;
        element.style.setProperty("--energy-ring-scale", ringScale.toFixed(3));
        element.style.setProperty("--energy-core-scale", coreScale.toFixed(3));
        element.style.setProperty("--energy-trail-opacity", glowOpacity.toFixed(3));
        element.style.setProperty("--energy-trail-scale", trailScale.toFixed(3));
        element.style.setProperty("--energy-trail-offset-x", `${trailOffsetX.toFixed(2)}px`);
        element.style.setProperty("--energy-trail-offset-y", `${trailOffsetY.toFixed(2)}px`);
      }

      rafRef.current = window.requestAnimationFrame(update);
    };

    rafRef.current = window.requestAnimationFrame(update);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      lastFrameRef.current = 0;
    };
  }, [isMobile, overlayActive, reducedMotion]);

  if (isMobile) {
    return null;
  }

  return (
    <div
      className={`energy-field ${active ? "is-active" : ""} ${overlayActive ? "is-overlay-active" : ""}`.trim()}
      ref={fieldRef}
      aria-hidden="true"
    >
      <div className="energy-core" />
      <div className="energy-ring" />
      <div className="energy-trail" />
    </div>
  );
}
