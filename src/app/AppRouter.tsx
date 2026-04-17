import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { siteContent } from "@/content/siteContent";
import type { HeroChapter, ProjectEntry } from "@/types/content";

export type AppRoute =
  | { kind: "home"; pathname: "/" }
  | {
      kind: "chapter";
      pathname: string;
      chapter: HeroChapter;
      chapterIndex: number;
    }
  | {
      kind: "project";
      pathname: string;
      chapter: HeroChapter;
      project: ProjectEntry;
      projectIndex: number;
    }
  | { kind: "not-found"; pathname: string };

type RouteTransitionPhase = "idle" | "out" | "in";

type RouteTransitionState = {
  active: boolean;
  label: string;
  phase: RouteTransitionPhase;
};

type AppRouterValue = {
  pathname: string;
  route: AppRoute;
  chapters: HeroChapter[];
  projects: ProjectEntry[];
  transitionState: RouteTransitionState;
  navigate: (to: string) => void;
  getChapterPath: (chapter: HeroChapter) => string;
  getProjectPath: (project: ProjectEntry) => string;
  isActivePath: (path: string) => boolean;
};

const AppRouterContext = createContext<AppRouterValue | null>(null);

function normalizePath(pathname: string) {
  const stripped = pathname.replace(/\/+$/, "");
  return stripped === "" ? "/" : stripped;
}

function getChapterPathInternal(chapter: HeroChapter) {
  return `/${chapter.sectionId}`;
}

function getProjectSlug(project: ProjectEntry) {
  return project.id.replace(/^project-/, "");
}

function getProjectPathInternal(project: ProjectEntry) {
  return `/projects/${getProjectSlug(project)}`;
}

function getRouteLabel(route: AppRoute) {
  if (route.kind === "chapter") {
    return route.chapter.title;
  }

  if (route.kind === "project") {
    return route.project.title;
  }

  if (route.kind === "home") {
    return siteContent.hero.eyebrow;
  }

  return "页面未找到";
}

function resolveRoute(pathname: string): AppRoute {
  const normalizedPath = normalizePath(pathname);
  const chapters = siteContent.hero.chapterAtlas;
  const projectsChapter = chapters.find((chapter) => chapter.sectionId === "projects");
  const projects = siteContent.projects.entries;

  if (normalizedPath === "/") {
    return { kind: "home", pathname: "/" };
  }

  const chapterIndex = chapters.findIndex(
    (chapter) => getChapterPathInternal(chapter) === normalizedPath,
  );

  if (chapterIndex >= 0) {
    return {
      kind: "chapter",
      pathname: normalizedPath,
      chapter: chapters[chapterIndex],
      chapterIndex,
    };
  }

  const projectIndex = projects.findIndex(
    (project) => getProjectPathInternal(project) === normalizedPath,
  );

  if (projectIndex >= 0 && projectsChapter) {
    return {
      kind: "project",
      pathname: normalizedPath,
      chapter: projectsChapter,
      project: projects[projectIndex],
      projectIndex,
    };
  }

  return { kind: "not-found", pathname: normalizedPath };
}

export function AppRouterProvider({ children }: PropsWithChildren) {
  const [pathname, setPathname] = useState(() =>
    normalizePath(window.location.pathname),
  );
  const transitionTimersRef = useRef<number[]>([]);
  const [transitionState, setTransitionState] = useState<RouteTransitionState>(
    () => ({
      active: false,
      label: getRouteLabel(resolveRoute(normalizePath(window.location.pathname))),
      phase: "idle",
    }),
  );

  const clearTransitionTimers = useCallback(() => {
    transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimersRef.current = [];
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const nextPath = normalizePath(window.location.pathname);
      const nextRoute = resolveRoute(nextPath);
      const nextLabel = getRouteLabel(nextRoute);

      clearTransitionTimers();
      setTransitionState({
        active: true,
        label: nextLabel,
        phase: "in",
      });
      setPathname(nextPath);

      transitionTimersRef.current.push(
        window.setTimeout(() => {
          setTransitionState({
            active: false,
            label: nextLabel,
            phase: "idle",
          });
        }, 620),
      );
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [clearTransitionTimers]);

  useEffect(() => {
    return () => {
      clearTransitionTimers();
    };
  }, [clearTransitionTimers]);

  const navigate = useCallback(
    (to: string) => {
      const nextPath = normalizePath(to);

      if (nextPath === pathname) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const nextRoute = resolveRoute(nextPath);
      const nextLabel = getRouteLabel(nextRoute);

      clearTransitionTimers();
      setTransitionState({
        active: true,
        label: nextLabel,
        phase: "out",
      });

      transitionTimersRef.current.push(
        window.setTimeout(() => {
          window.history.pushState({}, "", nextPath);
          startTransition(() => {
            setPathname(nextPath);
          });
          window.scrollTo({ top: 0, behavior: "auto" });
          setTransitionState({
            active: true,
            label: nextLabel,
            phase: "in",
          });

          transitionTimersRef.current.push(
            window.setTimeout(() => {
              setTransitionState({
                active: false,
                label: nextLabel,
                phase: "idle",
              });
            }, 640),
          );
        }, 420),
      );
    },
    [clearTransitionTimers, pathname],
  );

  const route = useMemo(() => resolveRoute(pathname), [pathname]);

  const value = useMemo<AppRouterValue>(
    () => ({
      pathname,
      route,
      chapters: siteContent.hero.chapterAtlas,
      projects: siteContent.projects.entries,
      transitionState,
      navigate,
      getChapterPath: getChapterPathInternal,
      getProjectPath: getProjectPathInternal,
      isActivePath: (path: string) => {
        const normalizedPath = normalizePath(path);

        if (normalizePath(pathname) === normalizedPath) {
          return true;
        }

        return route.kind === "project" && normalizedPath === "/projects";
      },
    }),
    [navigate, pathname, route, transitionState],
  );

  return (
    <AppRouterContext.Provider value={value}>
      {children}
    </AppRouterContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppRouter() {
  const context = useContext(AppRouterContext);

  if (!context) {
    throw new Error("useAppRouter must be used within AppRouterProvider");
  }

  return context;
}
