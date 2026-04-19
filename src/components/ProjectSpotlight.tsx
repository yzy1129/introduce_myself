import { siteContent } from "@/content/siteContent";
import { useAppState } from "@/app/AppState";
import { useAppRouter } from "@/app/AppRouter";
import { AppLink } from "@/components/AppLink";
import { useDialogFocusTrap } from "@/hooks/useDialogFocusTrap";

export function ProjectSpotlight() {
  const { selectedProjectId, setSelectedProjectId } = useAppState();
  const { getProjectPath } = useAppRouter();
  const project = siteContent.projects.entries.find(
    (entry) => entry.id === selectedProjectId,
  );
  const dialogRef = useDialogFocusTrap({
    active: Boolean(project),
    onClose: () => setSelectedProjectId(null),
  });

  if (!project) {
    return null;
  }

  return (
    <div className="overlay-panel" role="dialog" aria-modal="true">
      <button
        className="overlay-backdrop"
        onClick={() => setSelectedProjectId(null)}
        aria-label="关闭项目卷宗"
      />
      <div
        ref={dialogRef}
        className="overlay-card overlay-card-project"
        tabIndex={-1}
        aria-labelledby="project-spotlight-title"
      >
        <div className="overlay-header">
          <div>
            <span className="overlay-kicker">全屏项目卷宗</span>
            <h3 id="project-spotlight-title">{project.title}</h3>
          </div>
          <button
            className="overlay-close"
            onClick={() => setSelectedProjectId(null)}
          >
            关闭
          </button>
        </div>

        <div className="project-spotlight-grid">
          <div className="project-spotlight-stage">
            <span>{project.visual}</span>
            <strong>{project.summary}</strong>
            <p>{project.solution}</p>
            <div className="project-spotlight-links">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  className="project-spotlight-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
              <AppLink
                className="project-spotlight-link is-secondary"
                to={getProjectPath(project)}
                onClick={() => setSelectedProjectId(null)}
              >
                进入独立详情页
              </AppLink>
            </div>
          </div>

          <div className="project-spotlight-content">
            <article className="project-spotlight-card">
              <span>问题背景</span>
              <strong>为什么要做这个项目</strong>
              <p>{project.problem}</p>
            </article>

            <article className="project-spotlight-card">
              <span>关键亮点</span>
              <ul className="project-spotlight-list">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="project-spotlight-card">
              <span>交付结果</span>
              <ul className="project-spotlight-list">
                {project.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="project-spotlight-card">
              <span>技术路径</span>
              <div className="tag-list">
                {project.techStack.map((tech) => (
                  <span key={tech} className="tag">
                    {tech}
                  </span>
                ))}
              </div>
              <p>{project.impact}</p>
            </article>

            {project.media?.length ? (
              <article className="project-spotlight-card">
                <span>证据素材</span>
                <strong>{project.media.length} 组素材已接入详情模型</strong>
                <div className="tag-list">
                  {project.media.map((item) => (
                    <span key={item.id} className="tag">
                      {item.kind === "image"
                        ? "截图"
                        : item.kind === "video"
                          ? "视频"
                          : "架构图"}
                    </span>
                  ))}
                </div>
                <p>进入独立详情页可以查看完整的截图、视频入口和架构图展示。</p>
              </article>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
