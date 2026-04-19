import { useCallback, useEffect, useRef } from "react";
import { useAppState } from "@/app/AppState";
import { useAppRouter } from "@/app/AppRouter";

type AudioContextConstructor = typeof AudioContext;

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

function getAudioContextClass(): AudioContextConstructor | null {
  if (typeof window === "undefined") {
    return null;
  }

  const audioWindow = window as typeof window & {
    webkitAudioContext?: AudioContextConstructor;
  };

  return window.AudioContext ?? audioWindow.webkitAudioContext ?? null;
}

function createAudioEngine(AudioContextClass: AudioContextConstructor) {
  const context = new AudioContextClass();
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

function isEngineRunning(engine: AudioEngine) {
  return engine.context.state === "running";
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

  const ensureEngine = useCallback(
    async ({ activate = false }: { activate?: boolean } = {}) => {
      const AudioContextClass = getAudioContextClass();

      if (!AudioContextClass) {
        return null;
      }

      if (!engineRef.current) {
        engineRef.current = createAudioEngine(AudioContextClass);
      }

      if (activate && engineRef.current.context.state === "suspended") {
        try {
          await engineRef.current.context.resume();
        } catch {
          return engineRef.current;
        }
      }

      return engineRef.current;
    },
    [],
  );

  const unlockEngine = useCallback(async () => {
    const engine = await ensureEngine({ activate: true });

    if (!engine || !isEngineRunning(engine)) {
      return null;
    }

    return engine;
  }, [ensureEngine]);

  const armEngine = useCallback(async () => {
    const engine = await unlockEngine();

    if (!engine) {
      return null;
    }

    const now = engine.context.currentTime;
    engine.masterGain.gain.cancelScheduledValues(now);
    engine.ambientGain.gain.cancelScheduledValues(now);
    engine.masterGain.gain.setValueAtTime(
      Math.max(engine.masterGain.gain.value, 0.12),
      now,
    );
    engine.ambientGain.gain.setValueAtTime(
      Math.max(engine.ambientGain.gain.value, 0.014),
      now,
    );
    engine.masterGain.gain.linearRampToValueAtTime(0.24, now + 0.16);
    engine.ambientGain.gain.linearRampToValueAtTime(0.04, now + 0.22);

    return engine;
  }, [unlockEngine]);

  const playActivationPulse = useCallback(async () => {
    const engine = await armEngine();

    if (!engine) {
      return;
    }

    schedulePulse(engine.context, engine.masterGain, {
      type: "triangle",
      frequency: 420,
      destination: 860,
      duration: 0.18,
      volume: 0.05,
    });

    schedulePulse(engine.context, engine.masterGain, {
      type: "sine",
      frequency: 164,
      destination: 248,
      duration: 0.26,
      volume: 0.032,
    });
  }, [armEngine]);

  const playHoverPulse = useCallback(async () => {
    const now = performance.now();

    if (now - lastHoverAtRef.current < 110) {
      return;
    }

    lastHoverAtRef.current = now;
    const engine = await ensureEngine();

    if (!engine || !soundEnabled || !isEngineRunning(engine)) {
      return;
    }

    schedulePulse(engine.context, engine.masterGain, {
      type: "triangle",
      frequency: 640,
      destination: 420,
      duration: 0.09,
      volume: 0.028,
    });
  }, [ensureEngine, soundEnabled]);

  const playClickPulse = useCallback(async () => {
    if (!soundEnabled) {
      return;
    }

    const engine = await armEngine();

    if (!engine) {
      return;
    }

    schedulePulse(engine.context, engine.masterGain, {
      type: "sine",
      frequency: 196,
      destination: 92,
      duration: 0.22,
      volume: 0.046,
    });

    schedulePulse(engine.context, engine.masterGain, {
      type: "triangle",
      frequency: 784,
      destination: 280,
      duration: 0.12,
      volume: 0.022,
    });
  }, [armEngine, soundEnabled]);

  const playRoutePulse = useCallback(async () => {
    const engine = await ensureEngine();

    if (!engine || !soundEnabled || !isEngineRunning(engine)) {
      return;
    }

    schedulePulse(engine.context, engine.masterGain, {
      type: "sawtooth",
      frequency: 240,
      destination: 74,
      duration: 0.34,
      volume: 0.032,
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
        soundEnabled ? 0.24 : 0.00001,
        currentTime + 0.35,
      );
      engine.ambientGain.gain.linearRampToValueAtTime(
        soundEnabled ? 0.04 : 0.00001,
        currentTime + 0.45,
      );
    })();
  }, [ensureEngine, soundEnabled]);

  useEffect(() => {
    if (!soundEnabled) {
      return;
    }

    // Some browsers only allow audio to start after a trusted gesture.
    const handleUserActivation = () => {
      void unlockEngine();
    };

    window.addEventListener("pointerdown", handleUserActivation, true);
    window.addEventListener("keydown", handleUserActivation, true);

    return () => {
      window.removeEventListener("pointerdown", handleUserActivation, true);
      window.removeEventListener("keydown", handleUserActivation, true);
    };
  }, [soundEnabled, unlockEngine]);

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
      type="button"
      className={`sound-toggle ${soundEnabled ? "is-enabled" : ""}`}
      aria-pressed={soundEnabled}
      title={soundEnabled ? "点击关闭交互音效" : "点击开启交互音效"}
      onClick={async () => {
        if (!soundEnabled) {
          setSoundEnabled(true);
          await playActivationPulse();
          return;
        }

        setSoundEnabled(false);
      }}
    >
      {soundEnabled ? "声音已开" : "声音已关"}
    </button>
  );
}
