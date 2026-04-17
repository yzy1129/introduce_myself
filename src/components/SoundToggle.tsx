import { useCallback, useEffect, useRef } from "react";
import { useAppState } from "@/app/AppState";
import { useAppRouter } from "@/app/AppRouter";

type AudioEngine = {
  context: AudioContext;
  masterGain: GainNode;
  ambientGain: GainNode;
  baseOscillator: OscillatorNode;
  shimmerOscillator: OscillatorNode;
  driftOscillator: OscillatorNode;
  driftGain: GainNode;
};

const interactiveSelector =
  "a, button, input, [role='button'], .reveal-text, .hud-nav-link";

function createAudioEngine() {
  const context = new AudioContext();
  const masterGain = context.createGain();
  const ambientGain = context.createGain();
  const baseOscillator = context.createOscillator();
  const shimmerOscillator = context.createOscillator();
  const driftOscillator = context.createOscillator();
  const driftGain = context.createGain();

  masterGain.gain.value = 0.00001;
  ambientGain.gain.value = 0.00001;
  baseOscillator.type = "sine";
  baseOscillator.frequency.value = 58;
  shimmerOscillator.type = "triangle";
  shimmerOscillator.frequency.value = 116;
  driftOscillator.type = "sine";
  driftOscillator.frequency.value = 0.13;
  driftGain.gain.value = 3.8;

  driftOscillator.connect(driftGain);
  driftGain.connect(baseOscillator.frequency);
  baseOscillator.connect(ambientGain);
  shimmerOscillator.connect(ambientGain);
  ambientGain.connect(masterGain);
  masterGain.connect(context.destination);

  baseOscillator.start();
  shimmerOscillator.start();
  driftOscillator.start();

  return {
    context,
    masterGain,
    ambientGain,
    baseOscillator,
    shimmerOscillator,
    driftOscillator,
    driftGain,
  };
}

function schedulePulse(
  context: AudioContext,
  masterGain: GainNode,
  {
    type,
    frequency,
    destination = frequency * 0.58,
    duration,
    volume,
  }: {
    type: OscillatorType;
    frequency: number;
    destination?: number;
    duration: number;
    volume: number;
  },
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    Math.max(40, destination),
    now + duration,
  );
  gain.gain.setValueAtTime(0.00001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + duration * 0.18);
  gain.gain.exponentialRampToValueAtTime(0.00001, now + duration);

  oscillator.connect(gain);
  gain.connect(masterGain);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

export function SoundToggle() {
  const { soundEnabled, setSoundEnabled } = useAppState();
  const { transitionState } = useAppRouter();
  const engineRef = useRef<AudioEngine | null>(null);
  const lastHoverAtRef = useRef(0);
  const lastInteractiveRef = useRef<HTMLElement | null>(null);
  const lastPhaseRef = useRef(transitionState.phase);

  const ensureEngine = useCallback(async () => {
    if (typeof AudioContext === "undefined") {
      return null;
    }

    if (!engineRef.current) {
      engineRef.current = createAudioEngine();
    }

    if (engineRef.current.context.state === "suspended") {
      await engineRef.current.context.resume();
    }

    return engineRef.current;
  }, []);

  const playHoverPulse = useCallback(async () => {
    const now = performance.now();

    if (now - lastHoverAtRef.current < 110) {
      return;
    }

    lastHoverAtRef.current = now;
    const engine = await ensureEngine();

    if (!engine || !soundEnabled) {
      return;
    }

    schedulePulse(engine.context, engine.masterGain, {
      type: "triangle",
      frequency: 640,
      destination: 420,
      duration: 0.09,
      volume: 0.016,
    });
  }, [ensureEngine, soundEnabled]);

  const playClickPulse = useCallback(async () => {
    const engine = await ensureEngine();

    if (!engine || !soundEnabled) {
      return;
    }

    schedulePulse(engine.context, engine.masterGain, {
      type: "sine",
      frequency: 196,
      destination: 92,
      duration: 0.22,
      volume: 0.028,
    });

    schedulePulse(engine.context, engine.masterGain, {
      type: "triangle",
      frequency: 784,
      destination: 280,
      duration: 0.12,
      volume: 0.012,
    });
  }, [ensureEngine, soundEnabled]);

  const playRoutePulse = useCallback(async () => {
    const engine = await ensureEngine();

    if (!engine || !soundEnabled) {
      return;
    }

    schedulePulse(engine.context, engine.masterGain, {
      type: "sawtooth",
      frequency: 240,
      destination: 74,
      duration: 0.34,
      volume: 0.02,
    });
  }, [ensureEngine, soundEnabled]);

  useEffect(() => {
    void (async () => {
      const engine = await ensureEngine();

      if (!engine) {
        return;
      }

      const currentTime = engine.context.currentTime;
      engine.masterGain.gain.cancelScheduledValues(currentTime);
      engine.ambientGain.gain.cancelScheduledValues(currentTime);
      engine.shimmerOscillator.frequency.setValueAtTime(
        soundEnabled ? 116 : 92,
        currentTime,
      );
      engine.masterGain.gain.linearRampToValueAtTime(
        soundEnabled ? 0.9 : 0.00001,
        currentTime + 0.35,
      );
      engine.ambientGain.gain.linearRampToValueAtTime(
        soundEnabled ? 0.022 : 0.00001,
        currentTime + 0.45,
      );
    })();
  }, [ensureEngine, soundEnabled]);

  useEffect(() => {
    const handlePointerOver = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const interactive = target.closest(interactiveSelector);

      if (!(interactive instanceof HTMLElement)) {
        return;
      }

      if (interactive === lastInteractiveRef.current) {
        return;
      }

      lastInteractiveRef.current = interactive;
      void playHoverPulse();
    };

    const handlePointerMove = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (!target.closest(interactiveSelector)) {
        lastInteractiveRef.current = null;
      }
    };

    const handleFocusIn = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Element) || !target.closest(interactiveSelector)) {
        return;
      }

      void playHoverPulse();
    };

    const handleClick = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Element) || !target.closest(interactiveSelector)) {
        return;
      }

      void playClickPulse();
    };

    document.addEventListener("pointerover", handlePointerOver, true);
    document.addEventListener("pointermove", handlePointerMove, true);
    document.addEventListener("focusin", handleFocusIn, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver, true);
      document.removeEventListener("pointermove", handlePointerMove, true);
      document.removeEventListener("focusin", handleFocusIn, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, [playClickPulse, playHoverPulse]);

  useEffect(() => {
    if (
      transitionState.active &&
      transitionState.phase === "out" &&
      lastPhaseRef.current !== "out"
    ) {
      void playRoutePulse();
    }

    lastPhaseRef.current = transitionState.phase;
  }, [playRoutePulse, transitionState.active, transitionState.phase]);

  useEffect(() => {
    return () => {
      if (!engineRef.current) {
        return;
      }

      engineRef.current.baseOscillator.stop();
      engineRef.current.shimmerOscillator.stop();
      engineRef.current.driftOscillator.stop();
      engineRef.current.ambientGain.disconnect();
      engineRef.current.masterGain.disconnect();
      void engineRef.current.context.close();
    };
  }, []);

  return (
    <button
      className={`sound-toggle ${soundEnabled ? "is-enabled" : ""}`}
      aria-pressed={soundEnabled}
      onClick={async () => {
        if (!soundEnabled) {
          await ensureEngine();
          setSoundEnabled(true);
          return;
        }

        setSoundEnabled(false);
      }}
    >
      {soundEnabled ? "声音已开" : "声音已关"}
    </button>
  );
}
