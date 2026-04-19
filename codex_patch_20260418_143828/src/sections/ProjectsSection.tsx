import { useState } from "react";
import { useAppRouter } from "@/app/AppRouter";
import { useAppState } from "@/app/AppState";
import { AppLink } from "@/components/AppLink";
import { siteContent } from "@/content/siteContent";
import { SectionFrame } from "@/components/SectionFrame";

export function ProjectsSection() {
  const { getProjectPath } = useAppRouter();
  const { setSelectedProjectId } = useAppState();
  const [activeProjectId, setActiveProjectId] = useState(
    siteContent.projects.entries[0]?.id ?? null,
  );
  const activeProject =
    siteContent.projects.entries.find((entry) => entry.id === activeProjectId) ??
    siteContent.projects.entries[0];

  return (
    <SectionFrame
      id="projects"
      index="03"
      heading={siteContent.projects.heading}
      description={siteContent.projects.description}
      className="section-projects"
      aside={
        activeProject ? (
          <div className="projects-aside">
            <span>{activeProject.visual}</span>
            <strong>{activeProject.title}</strong>
            <p>{activeProject.summary}</p>
            <div className="projects-aside-tags">
              {activeProject.techStack.slice(0, 3).map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
            <div className="projects-aside-actions">
              <button
                className="projects-aside-link projects-aside-button"
                onClick={() => setSelectedProjectId(activeProject.id)}
              >
                打开沉浸卷宗
              </button>
              <AppLink
                className="projects-aside-link"
                to={getProjectPath(activeProject)}
              >
                进入项目详情页
              </AppLink>
            </div>
          </div>
        ) : null
      }
    >
      <div className="projects-layout">
        <div className="projects-list">
          <div className="projects-board-header">
            <span>项目档案库</span>
            <p>从问题、方案到价值证明，以证据板的方式逐层展开。</p>
          </div>
          {siteContent.projects.entries.map((project, index) => (
            <article
              key={project.id}
              className={`project-card ${activeProjectId === project.id ? "is-active" : ""}`}
              onMouseEnter={() => setActiveProjectId(project.id)}
              onFocus={() => setActiveProjectId(project.id)}
            >
              <div className="project-card-rail">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <em>{project.visual}</em>
              </div>
              <div className="project-card-body">
                <div className="project-card-meta">
                  <span>{project.techStack.length} 项能力信号</span>
                  <span>可展开查看细节</span>
                  <span>详情为独立子页</span>
                </div>
                <div className="project-card-head">
                  <h3>{project.title}</h3>
                  <div className="project-card-actions">
                    <button onClick={() => setSelectedProjectId(project.id)}>
                      全屏卷宗
                    </button>
                    <AppLink to={getProjectPath(project)}>查看详情</AppLink>
                  </div>
                </div>
                <p className="project-summary">{project.summary}</p>
                <div className="project-tag-preview">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="project-reveal">
                  <p>
                    <strong>问题</strong>
                    <span>{project.problem}</span>
                  </p>
                  <p>
                    <strong>方案</strong>
                    <span>{project.solution}</span>
                  </p>
                  <p>
                    <strong>技术</strong>
                    <span>{project.techStack.join(" / ")}</span>
                  </p>
                  <p>
                    <strong>价值</strong>
                    <span>{project.impact}</span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
