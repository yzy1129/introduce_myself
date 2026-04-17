import { siteContent } from "@/content/siteContent";
import { useAppState } from "@/app/AppState";
import { useDialogFocusTrap } from "@/hooks/useDialogFocusTrap";

export function SkillPanel() {
  const { selectedSkillId, setSelectedSkillId } = useAppState();
  const skill = siteContent.skills.nodes.find((entry) => entry.id === selectedSkillId);
  const dialogRef = useDialogFocusTrap({
    active: Boolean(skill),
    onClose: () => setSelectedSkillId(null),
  });

  if (!skill) {
    return null;
  }

  return (
    <div className="overlay-panel" role="dialog" aria-modal="true">
      <button className="overlay-backdrop" onClick={() => setSelectedSkillId(null)} aria-label="关闭技能面板" />
      <div
        ref={dialogRef}
        className="overlay-card"
        tabIndex={-1}
        aria-labelledby="skill-panel-title"
      >
        <div className="overlay-header">
          <div>
            <span className="overlay-kicker">技能节点</span>
            <h3 id="skill-panel-title">{skill.label}</h3>
          </div>
          <button className="overlay-close" onClick={() => setSelectedSkillId(null)}>
            关闭
          </button>
        </div>
        <p className="overlay-summary">{skill.summary}</p>
        <div className="overlay-detail-block">
          <span>能力说明</span>
          <p>{skill.details}</p>
        </div>
        <div className="overlay-detail-block">
          <span>关联项目</span>
          <div className="tag-list">
            {skill.projectRefs.map((projectRef) => (
              <span key={projectRef} className="tag">
                {siteContent.projects.entries.find((project) => project.id === projectRef)?.title ?? projectRef}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
