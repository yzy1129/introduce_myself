import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { siteContent } from "@/content/siteContent";
import { SectionFrame } from "@/components/SectionFrame";
import { useAppState } from "@/app/AppState";

const orbitLabels = {
  core: "核心层",
  domain: "领域层",
  tool: "工具层",
} as const;

const orbitGuide = [
  {
    orbit: "核心层",
    title: "决定我能稳定交付什么",
    description:
      "这里放的是最能代表判断方式、可持续迁移并能直接形成成果的核心能力。",
  },
  {
    orbit: "领域层",
    title: "决定我如何组织问题",
    description:
      "这里说明我如何在算法、交互、展示与验证之间做取舍，让系统不只可做，也可读。",
  },
  {
    orbit: "工具层",
    title: "决定我如何把方案落地",
    description:
      "这里不是工具堆砌，而是支撑实现效率、质量边界与扩展能力的执行体系。",
  },
];

const skillLayoutMap = {
  "skill-core-frontend": { x: "60%", y: "49%", width: "14.4rem" },
  "skill-core-systems": { x: "33%", y: "54%", width: "11.4rem" },
  "skill-domain-product": { x: "24%", y: "18%", width: "11rem" },
  "skill-domain-visual": { x: "44%", y: "84%", width: "10rem" },
  "skill-domain-performance": { x: "50%", y: "14%", width: "10.3rem" },
  "skill-tool-react": { x: "83%", y: "49%", width: "13.4rem" },
  "skill-tool-three": { x: "72%", y: "84%", width: "9.8rem" },
  "skill-tool-gsap": { x: "18%", y: "74%", width: "9.6rem" },
  "skill-tool-typescript": { x: "12.5%", y: "31%", width: "11.8rem" },
  "skill-tool-node": { x: "73%", y: "17%", width: "12.2rem" },
} as const;

function toPercentNumber(value: string) {
  return Number.parseFloat(value.replace("%", ""));
}

export function SkillsSection() {
  const { setSelectedSkillId } = useAppState();
  const [focusedSkillId, setFocusedSkillId] = useState(
    siteContent.skills.nodes[0]?.id ?? null,
  );
  const [rotation, setRotation] = useState(-8);
  const [dragging, setDragging] = useState(false);
  const [interactivePause, setInteractivePause] = useState(false);
  const dragStateRef = useRef({
    active: false,
    startX: 0,
    startRotation: -8,
  });
  const focusedEntry =
    siteContent.skills.nodes.find((item) => item.id === focusedSkillId) ??
    siteContent.skills.nodes[0];

  useEffect(() => {
    if (dragging || interactivePause) {
      return;
    }

    let frameId = 0;

    const tick = () => {
      setRotation((current) => current + 0.04);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [dragging, interactivePause]);

  useEffect(() => {
    if (!dragging) {
      return;
    }

    const handlePointerMove = (event: PointerEvent | globalThis.PointerEvent) => {
      if (!dragStateRef.current.active) {
        return;
      }

      setRotation(
        dragStateRef.current.startRotation +
          (event.clientX - dragStateRef.current.startX) * 0.18,
      );
    };

    const handlePointerUp = () => {
      dragStateRef.current.active = false;
      setDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging]);

  const focusedLinks = useMemo(() => {
    if (!focusedEntry) {
      return [];
    }

    return siteContent.skills.nodes
      .filter((entry) => entry.id !== focusedEntry.id)
      .filter((entry) => {
        return entry.projectRefs.some((projectRef) =>
          focusedEntry.projectRefs.includes(projectRef),
        );
      })
      .map((entry) => ({
        id: `${focusedEntry.id}-${entry.id}`,
        fromX: toPercentNumber(
          skillLayoutMap[focusedEntry.id as keyof typeof skillLayoutMap].x,
        ),
        fromY: toPercentNumber(
          skillLayoutMap[focusedEntry.id as keyof typeof skillLayoutMap].y,
        ),
        toX: toPercentNumber(skillLayoutMap[entry.id as keyof typeof skillLayoutMap].x),
        toY: toPercentNumber(skillLayoutMap[entry.id as keyof typeof skillLayoutMap].y),
      }));
  }, [focusedEntry]);

  return (
    <SectionFrame
      id="skills"
      index="02"
      heading={siteContent.skills.heading}
      description={siteContent.skills.description}
      className="section-skills"
    >
      {focusedEntry ? (
        <div className="skills-command">
          <div className="skills-command-copy">
            <span>{orbitLabels[focusedEntry.orbit]}</span>
            <strong>{focusedEntry.label}</strong>
            <p>{focusedEntry.summary}</p>
          </div>
          <div className="skills-command-detail">
            <p>{focusedEntry.details}</p>
            <div className="tag-list">
              {focusedEntry.projectRefs.map((projectRef) => (
                <span key={projectRef} className="tag">
                  {siteContent.projects.entries.find(
                    (project) => project.id === projectRef,
                  )?.title ?? projectRef}
                </span>
              ))}
            </div>
            <span className="skills-command-note">
              悬停节点会暂停旋转并显示关系连线，拖动背景可以旋转整个轨道系统。
            </span>
          </div>
        </div>
      ) : null}

      <div className="skills-reading-deck">
        {orbitGuide.map((item) => (
          <article key={item.orbit} className="skills-reading-card">
            <span>{item.orbit}</span>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </div>

      <div className="skills-orbits">
        <div
          className={`skills-map ${dragging ? "is-dragging" : ""}`.trim()}
          onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
            if ((event.target as HTMLElement).closest("button")) {
              return;
            }

            dragStateRef.current = {
              active: true,
              startX: event.clientX,
              startRotation: rotation,
            };
            setDragging(true);
            setInteractivePause(true);
          }}
          onPointerLeave={() => {
            if (!dragging) {
              setInteractivePause(false);
            }
          }}
        >
          <div className="skills-map-header">
            <div className="skills-map-copy">
              <span>前端 × 算法能力图谱</span>
              <strong>把研究能力、工程能力和叙事表达放进同一套可旋转轨道。</strong>
            </div>
            <div className="skills-map-readouts" aria-hidden="true">
              <span>{siteContent.skills.nodes.length} 个节点</span>
              <span>3 层能力</span>
              <span>{dragging ? "正在拖拽" : "支持拖拽旋转"}</span>
            </div>
          </div>

          <div className="skills-map-grid" aria-hidden="true" />

          <div
            className="skills-rotation-layer"
            style={
              {
                "--skills-rotation": `${rotation}deg`,
              } as CSSProperties
            }
          >
            <svg
              className="skills-link-graph"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {focusedLinks.map((link) => (
                <line
                  key={link.id}
                  x1={link.fromX}
                  y1={link.fromY}
                  x2={link.toX}
                  y2={link.toY}
                />
              ))}
            </svg>

            <div className="skills-signal skills-signal-alpha" aria-hidden="true" />
            <div className="skills-signal skills-signal-beta" aria-hidden="true" />
            <div className="skills-orbit-lane orbit-lane-tool" aria-hidden="true" />
            <div
              className="skills-orbit-lane orbit-lane-domain"
              aria-hidden="true"
            />
            <div className="skills-orbit-lane orbit-lane-core" aria-hidden="true" />
            <div className="skills-core-hub" aria-hidden="true">
              <span>能力核心</span>
              <strong>算法 × 结构 × 表达</strong>
            </div>
            <div className="skills-node-cluster">
              {siteContent.skills.nodes.map((item) => {
                const layout = skillLayoutMap[item.id as keyof typeof skillLayoutMap];

                return (
                  <button
                    key={item.id}
                    className={`skill-node-card orbit-${item.orbit} ${focusedSkillId === item.id ? "is-focused" : ""}`}
                    style={
                      {
                        "--node-x": layout.x,
                        "--node-y": layout.y,
                        "--node-width": layout.width,
                      } as CSSProperties
                    }
                    onMouseEnter={() => {
                      setFocusedSkillId(item.id);
                      setInteractivePause(true);
                    }}
                    onMouseLeave={() => setInteractivePause(false)}
                    onFocus={() => {
                      setFocusedSkillId(item.id);
                      setInteractivePause(true);
                    }}
                    onBlur={() => setInteractivePause(false)}
                    onClick={() => setSelectedSkillId(item.id)}
                  >
                    <span className="skill-node-card-layer">
                      {orbitLabels[item.orbit]}
                    </span>
                    <strong>{item.label}</strong>
                    <small>{item.projectRefs.length} 项项目验证</small>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="skills-map-legend" aria-hidden="true">
            <span>核心能力</span>
            <span>领域能力</span>
            <span>工具生态</span>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
