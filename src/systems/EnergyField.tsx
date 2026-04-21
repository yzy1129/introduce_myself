import { useEffect, useRef, useState } from "react";
import { useAppState } from "@/app/AppState";

const ENERGY_MOVE_DECAY = 8.5;
const ENERGY_PULSE_DECAY = 9.5;

export function EnergyField() {
  const {
    isMobile,
    updatePointer,
    reducedMotion,
    selectedSkillId,
    selectedProjectId,
  } = useAppState();
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
  });
  const positionRef = useRef({
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
  });
  const velocityRef = useRef({ x: 0, y: 0, speed: 0 });
  const pulseRef = useRef(0);
  const lastMoveRef = useRef({
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
    time: performance.now(),
  });
  const lastFrameRef = useRef(0);
  const activeRef = useRef(false);
  const [active, setActive] = useState(false);
  const overlayActive = Boolean(selectedSkillId || selectedProjectId);

  useEffect(() => {
    const triggerPulse = () => {
      pulseRef.current = 1;
    };

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") {
        return;
      }

      const deltaTime = Math.max(16, event.timeStamp - lastMoveRef.current.time);
      const deltaX = event.clientX - lastMoveRef.current.x;
      const deltaY = event.clientY - lastMoveRef.current.y;
      const velocityX = (deltaX / deltaTime) * 1000;
      const velocityY = (deltaY / deltaTime) * 1000;
      const speed = Math.min(2400, Math.hypot(velocityX, velocityY));

      lastMoveRef.current = {
        x: event.clientX,
        y: event.clientY,
        time: event.timeStamp,
      };
      targetRef.current = { x: event.clientX, y: event.clientY };
      velocityRef.current = { x: velocityX, y: velocityY, speed };
      updatePointer({
        x: event.clientX,
        y: event.clientY,
        active: true,
        velocityX,
        velocityY,
        speed,
      });

      if (!activeRef.current) {
        activeRef.current = true;
        setActive(true);
      }
    };

    const deactivateField = () => {
      velocityRef.current = { x: 0, y: 0, speed: 0 };
      updatePointer({
        active: false,
        velocityX: 0,
        velocityY: 0,
        speed: 0,
      });
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
    window.addEventListener("pointerdown", triggerPulse);
    window.addEventListener("pointerleave", handleLeave);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", triggerPulse);
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
        const deltaSeconds =
          lastFrameRef.current === 0
            ? 1 / 60
            : Math.min((time - lastFrameRef.current) / 1000, 0.05);
        lastFrameRef.current = time;

        velocityRef.current.x *= Math.exp(-deltaSeconds * ENERGY_MOVE_DECAY);
        velocityRef.current.y *= Math.exp(-deltaSeconds * ENERGY_MOVE_DECAY);
        velocityRef.current.speed *= Math.exp(-deltaSeconds * 7.2);
        pulseRef.current *= Math.exp(-deltaSeconds * ENERGY_PULSE_DECAY);

        const lagX = targetRef.current.x - positionRef.current.x;
        const lagY = targetRef.current.y - positionRef.current.y;
        const lagDistance = Math.hypot(lagX, lagY);
        const motionSpeed = Math.min(
          1,
          Math.max(velocityRef.current.speed / 1600, lagDistance / 42),
        );
        const smoothing =
          1 -
          Math.exp(
            -(reducedMotion ? 24 : 22 + motionSpeed * 24) * deltaSeconds,
          );

        positionRef.current.x += lagX * smoothing;
        positionRef.current.y += lagY * smoothing;

        const velocityAngle = Math.atan2(
          velocityRef.current.y,
          velocityRef.current.x || 0.0001,
        );
        const ringScale = reducedMotion
          ? 1
          : Math.min(1.16, 1 + lagDistance / 540 + motionSpeed * 0.05);
        const coreScale = reducedMotion
          ? 1
          : Math.min(1.08, 1 + lagDistance / 1280 + motionSpeed * 0.03);
        const trailScale = reducedMotion
          ? 1
          : Math.min(1.28, 1 + lagDistance / 420 + motionSpeed * 0.08);
        const tailScaleX = reducedMotion ? 1 : 1 + motionSpeed * 0.45;
        const tailScaleY = reducedMotion
          ? 1
          : Math.max(0.72, 1 - motionSpeed * 0.18);
        const trailOffsetX = Math.max(-16, Math.min(16, -lagX * 0.16));
        const trailOffsetY = Math.max(-16, Math.min(16, -lagY * 0.16));
        const glowOpacity = Math.min(
          overlayActive ? 0.96 : 0.78,
          (overlayActive ? 0.58 : 0.3) +
            lagDistance / 280 +
            motionSpeed * 0.18,
        );
        const flareOpacity = Math.min(
          overlayActive ? 0.92 : 0.72,
          0.18 + motionSpeed * 0.48 + pulseRef.current * 0.42,
        );
        const shellOpacity = Math.min(0.8, 0.24 + motionSpeed * 0.34);
        const burstOpacity = Math.min(
          0.9,
          motionSpeed * 0.26 + pulseRef.current * 0.8,
        );

        updatePointer({
          velocityX: velocityRef.current.x,
          velocityY: velocityRef.current.y,
          speed: velocityRef.current.speed,
        });

        element.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`;
        element.style.setProperty("--energy-ring-scale", ringScale.toFixed(3));
        element.style.setProperty("--energy-core-scale", coreScale.toFixed(3));
        element.style.setProperty(
          "--energy-trail-opacity",
          glowOpacity.toFixed(3),
        );
        element.style.setProperty(
          "--energy-trail-scale",
          trailScale.toFixed(3),
        );
        element.style.setProperty(
          "--energy-tail-scale-x",
          tailScaleX.toFixed(3),
        );
        element.style.setProperty(
          "--energy-tail-scale-y",
          tailScaleY.toFixed(3),
        );
        element.style.setProperty(
          "--energy-trail-offset-x",
          `${trailOffsetX.toFixed(2)}px`,
        );
        element.style.setProperty(
          "--energy-trail-offset-y",
          `${trailOffsetY.toFixed(2)}px`,
        );
        element.style.setProperty(
          "--energy-shell-opacity",
          shellOpacity.toFixed(3),
        );
        element.style.setProperty(
          "--energy-flare-opacity",
          flareOpacity.toFixed(3),
        );
        element.style.setProperty(
          "--energy-burst-opacity",
          burstOpacity.toFixed(3),
        );
        element.style.setProperty(
          "--energy-burst-scale",
          `${(1 + pulseRef.current * 0.35).toFixed(3)}`,
        );
        element.style.setProperty(
          "--energy-angle",
          `${velocityAngle.toFixed(4)}rad`,
        );
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
  }, [isMobile, overlayActive, reducedMotion, updatePointer]);

  if (isMobile) {
    return null;
  }

  return (
    <div
      className={`energy-field ${active ? "is-active" : ""} ${overlayActive ? "is-overlay-active" : ""}`.trim()}
      ref={fieldRef}
      aria-hidden="true"
    >
      <div className="energy-shell" />
      <div className="energy-flare" />
      <div className="energy-arc energy-arc-alpha" />
      <div className="energy-arc energy-arc-beta" />
      <div className="energy-core" />
      <div className="energy-ring" />
      <div className="energy-trail" />
      <div className="energy-burst" />
    </div>
  );
}
