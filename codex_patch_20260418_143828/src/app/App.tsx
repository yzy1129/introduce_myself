import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { AppRouterProvider, useAppRouter } from "@/app/AppRouter";
import { AppStateProvider, useAppState } from "@/app/AppState";
import { AppLink } from "@/components/AppLink";
import { ProjectSpotlight } from "@/components/ProjectSpotlight";
import { RouteTransition } from "@/components/RouteTransition";
import { SkillPanel } from "@/components/SkillPanel";
import { SoundToggle } from "@/components/SoundToggle";
import { siteContent } from "@/content/siteContent";
import { HomePage } from "@/pages/HomePage";
import { ChapterPage } from "@/pages/ChapterPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { UniverseCanvas } from "@/scene/UniverseCanvas";
import { Preloader } from "@/sections/Preloader";
import { EnergyField } from "@/systems/EnergyField";

gsap.registerPlugin(ScrollTrigger);

function AppHeader() {
  const { chapters, route, getChapterPath, isActivePath } = useAppRouter();
  const hudGlyph =
    Array.from(siteContent.hero.title).at(-1) ?? siteContent.preloader.initials;

  return (
    <header className="app-hud">
      <AppLink
        className={`hud-brand ${route.kind === "home" ? "is-active" : ""}`}
        to="/"
        aria-current={route.kind === "home" ? "page" : undefined}
      >
        <div className="hud-index-shell" aria-hidden="true">
          <span className="hud-index-orbit hud-index-orbit-alpha" />
          <span className="hud-index-orbit hud-index-orbit-beta" />
          <span className="hud-index">{hudGlyph}</span>
        </div>
        <div className="hud-copy">
          <span className="hud-kicker">个人品牌识别</span>
          <strong>{siteContent.hero.eyebrow}</strong>
          <p>沉浸式个人作品集系统</p>
        </div>
        <span className="hud-brand-signal">
          <span className="hud-brand-signal-dot" aria-hidden="true" />
          在线叙事
        </span>
      </AppLink>

      <nav className="hud-nav" aria-label="章节导航">
        {chapters.map((chapter) => (
          <AppLink
            key={chapter.id}
            className={`hud-nav-link ${isActivePath(getChapterPath(chapter)) ? "is-active" : ""}`}
            to={getChapterPath(chapter)}
            aria-current={isActivePath(getChapterPath(chapter)) ? "page" : undefined}
          >
            <span>{chapter.index}</span>
            <strong>{chapter.title}</strong>
          </AppLink>
        ))}
      </nav>

      <SoundToggle />
    </header>
  );
}

function AppViewport() {
  const {
    preloaderDismissed,
    dismissPreloader,
    reducedMotion,
    activeSection,
    setActiveSection,
    setSelectedSkillId,
    setSelectedProjectId,
  } = useAppState();
  const { route, transitionState } = useAppRouter();
  const [booted, setBooted] = useState(preloaderDismissed);

  useEffect(() => {
    const lenis = new Lenis({
      duration: reducedMotion ? 0.9 : 1.2,
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    frameId = window.requestAnimationFrame(raf);

    ScrollTrigger.defaults({
      scroller: document.documentElement,
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!booted) {
      return;
    }

    ScrollTrigger.refresh();
  }, [booted, route.pathname]);

  useEffect(() => {
    setSelectedSkillId(null);
    setSelectedProjectId(null);
    setActiveSection(
      route.kind === "chapter" || route.kind === "project"
        ? route.chapter.sectionId
        : route.kind === "home"
          ? "hero"
          : "not-found",
    );
  }, [route, setActiveSection, setSelectedProjectId, setSelectedSkillId]);

  useEffect(() => {
    document.body.dataset.section = activeSection;
    document.body.dataset.route =
      route.kind === "chapter" ? route.chapter.sectionId : route.kind;
  }, [activeSection, route]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("main-content")?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [route.pathname]);

  let pageContent;

  if (route.kind === "chapter") {
    pageContent = (
      <ChapterPage chapter={route.chapter} chapterIndex={route.chapterIndex} />
    );
  } else if (route.kind === "project") {
    pageContent = (
      <ProjectDetailPage
        project={route.project}
        projectIndex={route.projectIndex}
      />
    );
  } else if (route.kind === "not-found") {
    pageContent = <NotFoundPage />;
  } else {
    pageContent = <HomePage />;
  }

  return (
    <div className={`app-root ${booted ? "is-booted" : "is-loading"}`}>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <UniverseCanvas />
      <EnergyField />
      <AppHeader />
      <RouteTransition
        active={transitionState.active}
        phase={transitionState.phase}
        label={transitionState.label}
      />

      {!booted ? (
        <Preloader
          onComplete={() => {
            dismissPreloader();
            setBooted(true);
          }}
        />
      ) : null}

      {pageContent}

      <SkillPanel />
      <ProjectSpotlight />
    </div>
  );
}

export function App() {
  return (
    <AppRouterProvider>
      <AppStateProvider>
        <AppViewport />
      </AppStateProvider>
    </AppRouterProvider>
  );
}
