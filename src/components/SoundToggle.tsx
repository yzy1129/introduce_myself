import { useCallback, useEffect, useRef, useState } from "react";
import { useAppState } from "@/app/AppState";
import { resolveAssetPath } from "@/utils/resolveAssetPath";

const AUDIO_SOURCE = resolveAssetPath("/audio/BGM.mp3");
const TARGET_VOLUME = 0.42;
const FADE_IN_MS = 520;
const FADE_OUT_MS = 260;

type FadeOptions = {
  duration: number;
  pauseOnEnd?: boolean;
};

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function SoundToggle() {
  const { soundEnabled, setSoundEnabled } = useAppState();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const stopFade = useCallback(() => {
    if (fadeFrameRef.current !== null) {
      window.cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  }, []);

  const fadeVolume = useCallback(
    (
      audio: HTMLAudioElement,
      targetVolume: number,
      { duration, pauseOnEnd = false }: FadeOptions,
    ) => {
      stopFade();

      const safeTarget = clampVolume(targetVolume);
      const startingVolume = audio.volume;

      if (Math.abs(startingVolume - safeTarget) < 0.01 || duration <= 0) {
        audio.volume = safeTarget;

        if (pauseOnEnd && safeTarget === 0) {
          audio.pause();
        }

        return;
      }

      const startAt = performance.now();

      const updateVolume = (frameAt: number) => {
        const progress = Math.min((frameAt - startAt) / duration, 1);
        audio.volume = clampVolume(
          startingVolume + (safeTarget - startingVolume) * progress,
        );

        if (progress < 1) {
          fadeFrameRef.current = window.requestAnimationFrame(updateVolume);
          return;
        }

        fadeFrameRef.current = null;

        if (pauseOnEnd && safeTarget === 0) {
          audio.pause();
        }
      };

      fadeFrameRef.current = window.requestAnimationFrame(updateVolume);
    },
    [stopFade],
  );

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(AUDIO_SOURCE);
      audio.loop = true;
      audio.preload = "auto";
      audio.autoplay = true;
      audio.volume = 0;
      audioRef.current = audio;
    }

    return audioRef.current;
  }, []);

  const startPlayback = useCallback(async () => {
    const audio = ensureAudio();
    const needsFadeIn = audio.paused;

    stopFade();

    if (needsFadeIn) {
      audio.volume = 0;
    }

    try {
      await audio.play();
      setAutoplayBlocked(false);
      fadeVolume(audio, TARGET_VOLUME, {
        duration: needsFadeIn ? FADE_IN_MS : 160,
      });
      return true;
    } catch {
      setAutoplayBlocked(true);
      return false;
    }
  }, [ensureAudio, fadeVolume, stopFade]);

  const stopPlayback = useCallback(() => {
    const audio = ensureAudio();
    setAutoplayBlocked(false);

    if (audio.paused) {
      audio.volume = 0;
      return;
    }

    fadeVolume(audio, 0, {
      duration: FADE_OUT_MS,
      pauseOnEnd: true,
    });
  }, [ensureAudio, fadeVolume]);

  useEffect(() => {
    ensureAudio();

    return () => {
      stopFade();
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [ensureAudio, stopFade]);

  useEffect(() => {
    if (soundEnabled) {
      void startPlayback();
      return;
    }

    stopPlayback();
  }, [soundEnabled, startPlayback, stopPlayback]);

  useEffect(() => {
    if (!soundEnabled || !autoplayBlocked) {
      return;
    }

    const handleUserActivation = () => {
      void startPlayback();
    };

    window.addEventListener("pointerdown", handleUserActivation, true);
    window.addEventListener("keydown", handleUserActivation, true);

    return () => {
      window.removeEventListener("pointerdown", handleUserActivation, true);
      window.removeEventListener("keydown", handleUserActivation, true);
    };
  }, [autoplayBlocked, soundEnabled, startPlayback]);

  const title = autoplayBlocked
    ? "浏览器阻止了自动播放，点击恢复背景音乐"
    : soundEnabled
      ? "点击关闭背景音乐"
      : "点击开启背景音乐";

  return (
    <button
      type="button"
      className={`sound-toggle ${soundEnabled ? "is-enabled" : ""}`}
      aria-pressed={soundEnabled}
      title={title}
      onClick={() => {
        if (soundEnabled) {
          setSoundEnabled(false);
          stopPlayback();
          return;
        }

        setSoundEnabled(true);
        void startPlayback();
      }}
    >
      {soundEnabled ? "BGM 已开" : "BGM 已关"}
    </button>
  );
}
