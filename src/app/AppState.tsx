import {
  type MutableRefObject,
  useCallback,
  createContext,
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import type { PerformanceTier } from "@/types/content";

type PointerState = {
  x: number;
  y: number;
  active: boolean;
  velocityX: number;
  velocityY: number;
  speed: number;
};

type AppStateValue = {
  pointerRef: MutableRefObject<PointerState>;
  updatePointer: (pointer: Partial<PointerState>) => void;
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
  hoveredRevealId: string | null;
  setHoveredRevealId: (revealId: string | null) => void;
  performanceTier: PerformanceTier;
  reducedMotion: boolean;
  isMobile: boolean;
  preloaderDismissed: boolean;
  dismissPreloader: () => void;
  selectedSkillId: string | null;
  setSelectedSkillId: (skillId: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (projectId: string | null) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  registerSectionElement: (id: string, element: HTMLElement | null) => void;
  getSectionElement: (id: string) => HTMLElement | null;
};

const AppStateContext = createContext<AppStateValue | null>(null);

const PRELOADER_SESSION_KEY = "digital-universe-preloader";
const SOUND_PREFERENCE_KEY = "digital-universe-bgm-v2";

function detectReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function detectMobile(): boolean {
  return window.matchMedia("(max-width: 768px)").matches;
}

function detectPerformanceTier(
  reducedMotion: boolean,
  isMobile: boolean,
): PerformanceTier {
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory =
    "deviceMemory" in navigator
      ? Number(
          (navigator as Navigator & { deviceMemory?: number }).deviceMemory ??
            4,
        )
      : 4;

  if (reducedMotion) {
    return "low";
  }

  if (isMobile && (cores <= 4 || memory <= 4)) {
    return "low";
  }

  if (cores >= 8 && memory >= 8 && !isMobile) {
    return "high";
  }

  return "medium";
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const pointerRef = useRef<PointerState>({
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
    active: false,
    velocityX: 0,
    velocityY: 0,
    speed: 0,
  });
  const [reducedMotion, setReducedMotion] = useState(detectReducedMotion);
  const [isMobile, setIsMobile] = useState(detectMobile);
  const [performanceTier, setPerformanceTier] = useState<PerformanceTier>(
    detectPerformanceTier(reducedMotion, isMobile),
  );
  const [activeSection, setActiveSectionState] = useState("hero");
  const [hoveredRevealId, setHoveredRevealId] = useState<string | null>(null);
  const [preloaderDismissed, setPreloaderDismissed] = useState(() => {
    if (detectReducedMotion()) {
      return true;
    }

    return sessionStorage.getItem(PRELOADER_SESSION_KEY) === "done";
  });
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem(SOUND_PREFERENCE_KEY) !== "off";
  });
  const sectionElementsRef = useRef(new Map<string, HTMLElement>());

  const setActiveSection = useCallback((sectionId: string) => {
    startTransition(() => {
      setActiveSectionState(sectionId);
    });
  }, []);

  const dismissPreloader = useCallback(() => {
    setPreloaderDismissed(true);
    sessionStorage.setItem(PRELOADER_SESSION_KEY, "done");
  }, []);

  const registerSectionElement = useCallback(
    (id: string, element: HTMLElement | null) => {
      if (element) {
        sectionElementsRef.current.set(id, element);
        return;
      }

      sectionElementsRef.current.delete(id);
    },
    [],
  );

  const getSectionElement = useCallback((id: string) => {
    return sectionElementsRef.current.get(id) ?? null;
  }, []);

  const updatePointer = useCallback((pointer: Partial<PointerState>) => {
    Object.assign(pointerRef.current, pointer);
  }, []);

  useEffect(() => {
    const reducedMotionMedia = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const mobileMedia = window.matchMedia("(max-width: 768px)");

    const handlePreferencesChange = () => {
      const nextReducedMotion = reducedMotionMedia.matches;
      const nextMobile = mobileMedia.matches;
      setReducedMotion(nextReducedMotion);
      setIsMobile(nextMobile);
      setPerformanceTier(detectPerformanceTier(nextReducedMotion, nextMobile));
    };

    reducedMotionMedia.addEventListener("change", handlePreferencesChange);
    mobileMedia.addEventListener("change", handlePreferencesChange);

    return () => {
      reducedMotionMedia.removeEventListener("change", handlePreferencesChange);
      mobileMedia.removeEventListener("change", handlePreferencesChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      SOUND_PREFERENCE_KEY,
      soundEnabled ? "on" : "off",
    );
  }, [soundEnabled]);

  const value: AppStateValue = {
    pointerRef,
    updatePointer,
    activeSection,
    setActiveSection,
    hoveredRevealId,
    setHoveredRevealId,
    performanceTier,
    reducedMotion,
    isMobile,
    preloaderDismissed,
    dismissPreloader,
    selectedSkillId,
    setSelectedSkillId,
    selectedProjectId,
    setSelectedProjectId,
    soundEnabled,
    setSoundEnabled,
    registerSectionElement,
    getSectionElement,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
}
