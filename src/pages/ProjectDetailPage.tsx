import { siteContent } from "@/content/siteContent";
import { AppLink } from "@/components/AppLink";
import { ProjectMediaGallery } from "@/components/ProjectMediaGallery";
import { useAppRouter } from "@/app/AppRouter";
import { useAppState } from "@/app/AppState";
import type { ProjectEntry } from "@/types/content";

type ProjectDetailPageProps = {
  project: ProjectEntry;
  projectIndex: number;
};

export function ProjectDetailPage({
  project,
  projectIndex,
}: ProjectDetailPageProps) {
  const { setSelectedProjectId } = useAppState();
  const { projects, getProjectPath } = useAppRouter();
  const previousProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject =
    projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;
  const primaryLink = project.links[0];
  const signalCards = [
    {
      label: "项目编号",
      value: String(projectIndex + 1).padStart(2, "0"),
    },
    {
      label: "能力联动",
      value: `${project.techStack.length} 项`,
    },
    {
      label: "项目形态",
      value: project.visual,
    },
    {
      label: "证据素材",
      value: `${project.media?.length ?? 0} 组`,
    },
  ];
  const previousStop = previousProject
    ? {
        label: "上一个项目",
        title: previousProject.title,
        summary: previousProject.summary,
        to: getProjectPath(previousProject),
      }
    : {
        label: "返回项目章节",
        title: siteContent.projects.heading,
        summary: "回到项目总览页，重新选择要深入查看的项目。",
        to: "/projects",
      };
  const nextStop = nextProject
    ? {
        label: "下一个项目",
        title: nextProject.title,
        summary: nextProject.summary,
        to: getProjectPath(nextProject),
      }
    : {
        label: "返回项目章节",
        title: siteContent.projects.heading,
        summary: "你已经看到当前章节的最后一个项目，可以回到项目总览继续选择。",
        to: "/projects",
      };
  const progressLabel = `项目 ${String(projectIndex + 1).padStart(2, "0")} / 共 ${String(
    projects.length,
  ).padStart(2, "0")} 个`;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="app-main app-main-project-detail app-main-project-route"
    >
      <section className="route-hero route-hero-project-detail route-hero-projects">
        <div className="route-hero-shell route-hero-shell-project">
          <div className="route-hero-copy">
            <span className="route-hero-index">
              项目 / {String(projectIndex + 1).padStart(2, "0")}
            </span>
            <span className="route-hero-eyebrow">{project.visual}</span>
            <h1>{project.title}</h1>
            <p className="route-hero-lead">{project.summary}</p>
            <p className="route-hero-summary">
              这一页会把项目拆成问题、方案、技术路径与实际价值，让浏览者判断我的思考和交付是否可靠。
            </p>

            <div className="route-hero-ledger route-hero-ledger-project">
              {signalCards.map((item) => (
                <div key={item.label} className="route-hero-ledger-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="route-hero-actions">
              {primaryLink ? (
                <a
                  className="hero-core-button chapter-route-link"
                  href={primaryLink.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="hero-core-button-halo" aria-hidden="true" />
                  <span className="hero-core-button-pulse" aria-hidden="true" />
                  <span className="hero-core-button-copy">
                    <strong>{primaryLink.label}</strong>
                    <em>打开项目外部入口</em>
                  </span>
                </a>
              ) : null}
              <button
                className="chapter-route-home chapter-route-home-button"
                onClick={() => setSelectedProjectId(project.id)}
              >
                打开沉浸卷宗
              </button>
              <AppLink className="chapter-route-home" to="/projects">
                返回项目总览
              </AppLink>
            </div>
          </div>

          <div
            className="route-hero-visual route-hero-visual-project"
            aria-hidden="true"
          >
            <div className="route-hero-grid" />
            <div className="route-hero-beam" />

            <div className="route-hero-visual-shell">
              <div className="route-hero-stage-card route-hero-stage-card-project">
                <span>案例卷宗</span>
                <strong>从项目表象进入结构层，看它如何证明能力。</strong>
                <p>
                  这里保留独立详情页，不再用模态窗浅尝即止，让每个案例都拥有完整的叙事空间。
                </p>
              </div>

              <div className="route-hero-system">
                <div className="route-hero-core route-hero-core-project">
                  <span>{project.visual}</span>
                  <strong>{project.title}</strong>
                </div>
                <div className="route-hero-orbit route-hero-orbit-alpha" />
                <div className="route-hero-orbit route-hero-orbit-beta" />
                {project.techStack.slice(0, 3).map((item, index) => (
                  <div
                    key={item}
                    className={`route-hero-node route-hero-node-${index + 1}`}
                  >
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="route-hero-ribbon">
                {project.techStack.slice(0, 3).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="project-detail-section story-section">
        <div className="project-detail-signal-bar">
          {signalCards.map((item) => (
            <article key={item.label} className="project-detail-signal-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>

        <div className="project-detail-shell">
          <div className="project-detail-main">
            <div className="project-detail-card">
              <span>问题背景</span>
              <strong>为什么要做这个项目</strong>
              <p>{project.problem}</p>
            </div>
            <div className="project-detail-card">
              <span>解决方案</span>
              <strong>我如何组织结构与体验</strong>
              <p>{project.solution}</p>
            </div>
            <div className="project-detail-card">
              <span>结果价值</span>
              <strong>最终交付带来了什么</strong>
              <p>{project.impact}</p>
            </div>
            <div className="project-detail-card">
              <span>项目亮点</span>
              <strong>这一项目最值得被记住的部分</strong>
              <div className="project-detail-list">
                {project.highlights.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>

          <aside className="project-detail-side">
            <div className="project-detail-stack">
              <span>技术路径</span>
              <strong>本项目使用的能力结构</strong>
              <div className="tag-list">
                {project.techStack.map((tech) => (
                  <span key={tech} className="tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="project-detail-stack">
              <span>交付结果</span>
              <strong>项目最终形成了什么</strong>
              <div className="project-detail-list">
                {project.outcomes.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
            <div className="project-detail-links">
              <span>外部入口</span>
              <div className="modal-links">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {project.media?.length ? (
          <div className="project-detail-media-block">
            <div className="project-detail-media-head">
              <span>证据素材</span>
              <strong>截图、视频与架构图会在这里形成更完整的项目证据层。</strong>
              <p>
                这部分现在已经支持三类素材。你后续只需要替换数据源和本地文件，就能把真实截图、录屏和结构图接进来。
              </p>
            </div>
            <ProjectMediaGallery items={project.media} />
          </div>
        ) : null}
      </section>

      <section className="chapter-crossroads story-section">
        <div className="chapter-crossroads-shell">
          <div className="chapter-crossroads-head">
            <span>继续查看项目</span>
            <p>按项目顺序继续向前浏览，走到末尾时会自然回到项目总览页。</p>
          </div>

          <div className="chapter-crossroads-grid">
            <AppLink className="chapter-crossroads-card" to={previousStop.to}>
              <em>{previousStop.label}</em>
              <strong>{previousStop.title}</strong>
              <p>{previousStop.summary}</p>
            </AppLink>
            <article className="chapter-crossroads-card chapter-crossroads-card-current">
              <em>当前项目</em>
              <strong>{project.title}</strong>
              <p>{progressLabel} · {project.summary}</p>
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
