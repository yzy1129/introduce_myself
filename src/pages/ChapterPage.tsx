import { siteContent } from "@/content/siteContent";
import { useAppRouter } from "@/app/AppRouter";
import { useAppState } from "@/app/AppState";
import type { HeroChapter } from "@/types/content";
import { AboutSection } from "@/sections/AboutSection";
import { SkillsSection } from "@/sections/SkillsSection";
import { ProjectsSection } from "@/sections/ProjectsSection";
import { TimelineSection } from "@/sections/TimelineSection";
import { ContactSection } from "@/sections/ContactSection";
import { AppLink } from "@/components/AppLink";

const sectionComponentMap = {
  about: AboutSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  timeline: TimelineSection,
  contact: ContactSection,
} as const;

const chapterHeroStageMap: Record<
  string,
  {
    kicker: string;
    title: string;
    description: string;
    signals: string[];
  }
> = {
  about: {
    kicker: "人物坐标",
    title: "把判断方式、边界感与表达力公开成一份可读档案。",
    description:
      "这一章不是简历摘要，而是我如何理解问题、如何控制节奏、如何让体验建立信任的完整入口。",
    signals: ["方法论", "边界感", "表达力"],
  },
  skills: {
    kicker: "能力图谱",
    title: "把核心能力、领域方法和工具生态排布成一套可导航结构。",
    description:
      "不是罗列名词，而是告诉浏览者我真正擅长什么、这些能力如何互相支撑、又如何转化成项目交付。",
    signals: ["核心轨道", "领域判断", "工具落点"],
  },
  projects: {
    kicker: "证据系统",
    title: "让每个项目都从问题、方案到结果层层展开，形成真实证据链。",
    description:
      "我把项目详情做成独立子路由，让每次深入查看都像进入一份单独展开的案例卷宗。",
    signals: ["问题定义", "方案组织", "结果证明"],
  },
  timeline: {
    kicker: "演化记录",
    title: "把成长解释为一次次视角升级，而不是一条扁平时间线。",
    description:
      "每个节点都对应能力结构的一次跃迁，最终汇合成现在这个更完整的产品与前端叙事体系。",
    signals: ["阶段跃迁", "能力复利", "系统整合"],
  },
  contact: {
    kicker: "连接信号",
    title: "把好奇心转化成合作动作，让浏览真正有下一步。",
    description:
      "这一章负责把前面累积的兴趣沉淀成真实入口，让人知道可以如何联系、如何继续交流与推进合作。",
    signals: ["合作方向", "沟通入口", "下一步"],
  },
};

type ChapterPageProps = {
  chapter: HeroChapter;
  chapterIndex: number;
};

export function ChapterPage({ chapter, chapterIndex }: ChapterPageProps) {
  const { chapters, getChapterPath } = useAppRouter();
  const { getSectionElement } = useAppState();

  const SectionComponent =
    sectionComponentMap[chapter.sectionId as keyof typeof sectionComponentMap];
  const previousChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;
  const heroStage =
    chapterHeroStageMap[chapter.sectionId] ?? chapterHeroStageMap.about;
  const previousStop = previousChapter
    ? {
        label: "上一章",
        title: previousChapter.title,
        summary: previousChapter.summary,
        to: getChapterPath(previousChapter),
      }
    : {
        label: "回到首页",
        title: siteContent.hero.eyebrow,
        summary: "先回到章节星图，从整体结构重新选择你的浏览入口。",
        to: "/",
      };
  const nextStop = nextChapter
    ? {
        label: "下一章",
        title: nextChapter.title,
        summary: nextChapter.summary,
        to: getChapterPath(nextChapter),
      }
    : {
        label: "返回起点",
        title: siteContent.hero.eyebrow,
        summary: "你已经抵达最后一章，下一步回到首页重新浏览整条主航线。",
        to: "/",
      };
  const progressLabel = `第 ${String(chapterIndex + 1).padStart(2, "0")} 章 / 共 ${String(
    chapters.length,
  ).padStart(2, "0")} 章`;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`app-main app-main-chapter app-main-chapter-${chapter.sectionId}`}
    >
      <section
        className={`route-hero route-hero-chapter route-hero-${chapter.sectionId}`}
      >
        <div className="route-hero-shell">
          <div className="route-hero-copy">
            <span className="route-hero-index">{chapter.index}</span>
            <span className="route-hero-eyebrow">{chapter.eyebrow}</span>
            <h1>{chapter.title}</h1>
            <p className="route-hero-lead">{chapter.summary}</p>
            <p className="route-hero-summary">{chapter.preview}</p>

            <div className="route-hero-ledger">
              {chapter.highlights.map((item, index) => (
                <div key={item} className="route-hero-ledger-card">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>

            <div className="route-hero-actions">
              <button
                className="hero-core-button chapter-route-button"
                onClick={() => {
                  getSectionElement(chapter.sectionId)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                <span className="hero-core-button-halo" aria-hidden="true" />
                <span className="hero-core-button-pulse" aria-hidden="true" />
                <span className="hero-core-button-copy">
                  <strong>进入正文</strong>
                  <em>开始阅读这一章</em>
                </span>
              </button>
              <AppLink className="chapter-route-home" to="/">
                返回章节星图
              </AppLink>
            </div>
          </div>

          <div className="route-hero-visual" aria-hidden="true">
            <div className="route-hero-grid" />
            <div className="route-hero-beam" />

            <div className="route-hero-visual-shell">
              <div className="route-hero-stage-card">
                <span>{heroStage.kicker}</span>
                <strong>{heroStage.title}</strong>
                <p>{heroStage.description}</p>
              </div>

              <div className="route-hero-system">
                <div className="route-hero-core">
                  <span>{chapter.index}</span>
                  <strong>{chapter.title}</strong>
                </div>
                <div className="route-hero-orbit route-hero-orbit-alpha" />
                <div className="route-hero-orbit route-hero-orbit-beta" />
                {chapter.highlights.map((item, index) => (
                  <div
                    key={item}
                    className={`route-hero-node route-hero-node-${index + 1}`}
                  >
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="route-hero-ribbon">
                {heroStage.signals.map((signal) => (
                  <span key={signal}>{signal}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionComponent />

      <section className="chapter-crossroads story-section">
        <div className="chapter-crossroads-shell">
          <div className="chapter-crossroads-head">
            <span>继续航行</span>
            <p>
              按照主航线继续向前浏览；抵达最后一章后，出口会回到最初的章节星图。
            </p>
          </div>

          <div className="chapter-crossroads-grid">
            <AppLink className="chapter-crossroads-card" to={previousStop.to}>
              <em>{previousStop.label}</em>
              <strong>{previousStop.title}</strong>
              <p>{previousStop.summary}</p>
            </AppLink>
            <article className="chapter-crossroads-card chapter-crossroads-card-current">
              <em>当前航段</em>
              <strong>{chapter.title}</strong>
              <p>{progressLabel} · {chapter.summary}</p>
            </article>
            <AppLink className="chapter-crossroads-card" to={nextStop.to}>
              <em>{nextStop.label}</em>
              <strong>{nextStop.title}</strong>
              <p>{nextStop.summary}</p>
            </AppLink>
          </div>
        </div>
      </section>
    </main>
  );
}
