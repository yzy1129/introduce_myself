import { useEffect } from "react";
import gsap from "gsap";
import { siteContent } from "@/content/siteContent";
import { useAppRouter } from "@/app/AppRouter";
import { AppLink } from "@/components/AppLink";
import { RevealText } from "@/systems/RevealText";
import { useSectionRegistration } from "@/hooks/useSectionRegistration";

export function HeroSection() {
  const { getChapterPath } = useAppRouter();
  const ref = useSectionRegistration("hero");
  const launchPath = getChapterPath(siteContent.hero.chapterAtlas[0]);

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .fromTo(
        ".hero-eyebrow",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0,
      )
      .fromTo(
        ".hero-stage",
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95 },
        0.12,
      )
      .fromTo(
        ".hero-subtitle",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 0.9, duration: 0.8 },
        0.3,
      )
      .fromTo(
        ".hero-atlas-shell",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.82 },
        0.42,
      )
      .fromTo(
        ".hero-actions",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 },
        0.5,
      );

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={ref}
      data-section-id="hero"
      className="hero-section story-section"
    >
      <div className="hero-copy">
        <span className="hero-eyebrow">{siteContent.hero.eyebrow}</span>
        <div className="hero-stage">
          <div
            className="hero-stage-ring hero-stage-ring-alpha"
            aria-hidden="true"
          />
          <div
            className="hero-stage-ring hero-stage-ring-beta"
            aria-hidden="true"
          />
          <div className="hero-stage-glow" aria-hidden="true" />
          <div className="hero-stage-panel">
            <RevealText
              content={siteContent.hero.intro}
              as="h1"
              className="hero-greeting hero-intro-heading"
            />
            <p className="hero-subtitle">{siteContent.hero.subtitle}</p>
          </div>
        </div>
        <div className="hero-atlas-shell">
          <div className="hero-atlas-heading">
            <span className="hero-atlas-kicker">章节星图</span>
            <p>先看到整个项目的内容框架，再决定从哪一章深入进入。</p>
          </div>
          <div className="hero-atlas" role="list" aria-label="项目内容框架">
            {siteContent.hero.chapterAtlas.map((chapter) => (
              <AppLink
                key={chapter.id}
                className="hero-chapter-card"
                to={getChapterPath(chapter)}
              >
                <span className="hero-chapter-index">{chapter.index}</span>
                <span className="hero-chapter-eyebrow">{chapter.eyebrow}</span>
                <strong>{chapter.title}</strong>
                <p>{chapter.summary}</p>
                <span className="hero-chapter-link">进入独立章节页</span>
              </AppLink>
            ))}
          </div>
        </div>
        <div className="hero-actions">
          <AppLink
            className="hero-core-button"
            to={launchPath}
          >
            <span className="hero-core-button-halo" aria-hidden="true" />
            <span className="hero-core-button-pulse" aria-hidden="true" />
            <span className="hero-core-button-copy">
              <strong>{siteContent.hero.ctaLabel}</strong>
              <em>{siteContent.hero.ctaHint}</em>
            </span>
          </AppLink>
        </div>
      </div>
      <div className="hero-scanlines" aria-hidden="true" />
    </section>
  );
}
