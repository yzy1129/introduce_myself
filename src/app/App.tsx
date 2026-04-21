import { useEffect, useId, useRef, useState } from "react";
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
  const { contactCard } = siteContent.hero;
  const [wechatCardOpen, setWechatCardOpen] = useState(false);
  const [wechatImageVisible, setWechatImageVisible] = useState(
    Boolean(contactCard.imageSrc),
  );
  const brandShellRef = useRef<HTMLDivElement | null>(null);
  const wechatCardId = useId();

  useEffect(() => {
    setWechatCardOpen(false);
  }, [route.pathname]);

  useEffect(() => {
    setWechatImageVisible(Boolean(contactCard.imageSrc));
  }, [contactCard.imageSrc]);

  useEffect(() => {
    if (!wechatCardOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!brandShellRef.current?.contains(event.target as Node)) {
        setWechatCardOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setWechatCardOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [wechatCardOpen]);

  return (
    <header className="app-hud">
      <div className="hud-brand-shell" ref={brandShellRef}>
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
        </AppLink>

        <button
          type="button"
          className={`hud-contact-chip ${wechatCardOpen ? "is-open" : ""}`}
          aria-expanded={wechatCardOpen}
          aria-controls={wechatCardId}
          onClick={() => setWechatCardOpen((current) => !current)}
        >
          <span className="hud-contact-chip-dot" aria-hidden="true" />
          <span className="hud-contact-chip-copy">
            <strong>{contactCard.triggerLabel}</strong>
            <em>{contactCard.triggerHint}</em>
          </span>
        </button>

        <div
          id={wechatCardId}
          className={`hud-contact-card ${wechatCardOpen ? "is-open" : ""}`}
          hidden={!wechatCardOpen}
        >
          <div className="hud-contact-card-head">
            <span>{contactCard.panelEyebrow}</span>
            <button
              type="button"
              className="hud-contact-card-close"
              aria-label="关闭微信名片"
              onClick={() => setWechatCardOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="hud-contact-card-copy">
            <strong>{contactCard.panelTitle}</strong>
            <p>{contactCard.panelDescription}</p>
          </div>

          <div className="hud-contact-card-identity">
            <div className="hud-contact-card-avatar" aria-hidden="true">
              微
            </div>
            <div className="hud-contact-card-identity-copy">
              <strong>{contactCard.name}</strong>
              <p>{contactCard.location}</p>
            </div>
          </div>

          {wechatImageVisible && contactCard.imageSrc ? (
            <div className="hud-contact-card-image-shell">
              <img
                className="hud-contact-card-image"
                src={contactCard.imageSrc}
                alt={contactCard.imageAlt}
                loading="lazy"
                onError={() => setWechatImageVisible(false)}
              />
            </div>
          ) : (
            <div className="hud-contact-card-fallback">
              <strong>{contactCard.fallbackTitle}</strong>
              <p>{contactCard.fallbackBody}</p>
            </div>
          )}

          <p className="hud-contact-card-tip">{contactCard.tip}</p>
        </div>
      </div>

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
