import { siteContent } from "@/content/siteContent";
import { useAppState } from "@/app/AppState";
import { useAppRouter } from "@/app/AppRouter";
import { AppLink } from "@/components/AppLink";
import { useDialogFocusTrap } from "@/hooks/useDialogFocusTrap";

export function ProjectSpotlight() {
  const { selectedProjectId, setSelectedProjectId } = useAppState();
  const { getProjectPath } = useAppRouter();
  const projectIndex = siteContent.projects.entries.findIndex(
    (entry) => entry.id === selectedProjectId,
  );
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

  const projectNumber =
    projectIndex >= 0 ? String(projectIndex + 1).padStart(2, "0") : "--";
  const dossierMetrics = [
    {
      label: "能力信号",
      value: `${project.techStack.length} 项`,
    },
    {
      label: "交付结果",
      value: `${project.outcomes.length} 条`,
    },
    {
      label: "证据素材",
      value: `${project.media?.length ?? 0} 组`,
    },
    {
      label: "外部入口",
      value: `${project.links.length} 个`,
    },
  ];
  const evidenceTags =
    project.media?.map((item) =>
      item.kind === "image" ? "截图" : item.kind === "video" ? "视频" : "架构图",
    ) ?? ["待补素材"];
  const evidenceSummary = project.media?.length
    ? "素材层已经接入详情模型，独立详情页会继续展示截图、视频入口和架构图。"
    : "当前这份卷宗先突出结构和价值判断，后续仍可继续补入录屏、截图和架构材料。";

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
        <div className="overlay-header overlay-header-project">
          <div className="project-spotlight-heading">
            <span className="overlay-kicker">全屏项目卷宗 / {projectNumber}</span>
            <h3 id="project-spotlight-title">{project.title}</h3>
            <p className="project-spotlight-subtitle">{project.summary}</p>
          </div>
          <button
            className="overlay-close"
            onClick={() => setSelectedProjectId(null)}
          >
            关闭
          </button>
        </div>

        <div className="project-spotlight-shell">
          <section className="project-spotlight-stage">
            <div className="project-spotlight-stage-topline">
              <div className="project-spotlight-stage-badge">
                <span>项目形态</span>
                <strong>{project.visual}</strong>
              </div>
              <div className="project-spotlight-seal" aria-hidden="true">
                <em>Case File</em>
                <strong>{projectNumber}</strong>
              </div>
            </div>

            <div className="project-spotlight-stage-core">
              <strong>{project.solution}</strong>
              <p>{project.impact}</p>
            </div>

            <div className="project-spotlight-signal-grid">
              {dossierMetrics.map((item) => (
                <article key={item.label} className="project-spotlight-metric">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>

            <div className="project-spotlight-stage-panels">
              <article className="project-spotlight-stage-note">
                <span>项目价值</span>
                <p>{project.impact}</p>
              </article>
              <article className="project-spotlight-stage-note">
                <span>最强记忆点</span>
                <ul className="project-spotlight-inline-list">
                  {project.highlights.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="project-spotlight-evidence">
              <span>卷宗状态</span>
              <div className="tag-list">
                {evidenceTags.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
              <p>{evidenceSummary}</p>
            </div>

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
          </section>

          <div className="project-spotlight-content">
            <article className="project-spotlight-card is-wide is-problem">
              <span>问题背景</span>
              <strong>为什么要做这个项目</strong>
              <p>{project.problem}</p>
            </article>

            <article className="project-spotlight-card">
              <span>关键亮点</span>
              <strong>最值得先看的能力切面</strong>
              <ul className="project-spotlight-list">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="project-spotlight-card">
              <span>交付结果</span>
              <strong>最终沉淀了什么</strong>
              <ul className="project-spotlight-list">
                {project.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="project-spotlight-card is-wide">
              <span>技术路径</span>
              <strong>本项目的执行结构</strong>
              <div className="tag-list">
                {project.techStack.map((tech) => (
                  <span key={tech} className="tag">
                    {tech}
                  </span>
                ))}
              </div>
            </article>

            <article className="project-spotlight-card is-wide">
              <span>下一步入口</span>
              <strong>
                {project.media?.length
                  ? "这份卷宗已经具备继续向下钻取的证据层"
                  : "当前先从结构层继续深入查看这个项目"}
              </strong>
              <p>
                {project.media?.length
                  ? "进入独立详情页可以继续查看截图、视频入口和架构图，并把这份卷宗转换成更完整的项目证据链。"
                  : "虽然素材组还没接入，但独立详情页仍然保留完整的问题、方案、技术和结果说明，适合继续深读。"}
              </p>
            </article>

            {project.media?.length ? (
              <article className="project-spotlight-card is-wide">
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
