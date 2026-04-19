import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteContent } from "@/content/siteContent";
import { SectionFrame } from "@/components/SectionFrame";

export function TimelineSection() {
  const latestEntry = siteContent.timeline.entries.at(-1);
  const timelineSignals = [
    {
      label: "成长阶段",
      value: `${siteContent.timeline.entries.length} 次明显跃迁`,
    },
    {
      label: "最近状态",
      value: latestEntry?.year ?? "现在",
    },
    {
      label: "能力方向",
      value: "从单点执行走向系统整合",
    },
  ];
  const timelinePathDefinition =
    "M 40 214 C 150 146, 262 132, 370 172 S 566 244, 690 154 S 876 38, 960 106";

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        ".timeline-path-line",
        { strokeDashoffset: 1600 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#timeline",
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        },
      );
    });

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <SectionFrame
      id="timeline"
      index="04"
      heading={siteContent.timeline.heading}
      description={siteContent.timeline.description}
      className="section-timeline"
    >
      <div className="timeline-shell">
        <div className="timeline-shell-head">
          <span>时间航迹</span>
          <p>
            每个节点都不是履历片段，而是一次视角、方法或系统能力的跃迁。
          </p>
        </div>

        <div className="timeline-manifest">
          <div className="timeline-manifest-copy">
            <span>成长说明</span>
            <strong>这不是年份堆叠，而是能力一次次被重组后的证据带。</strong>
          </div>
          <p>
            我希望浏览者看到的不只是“做过什么”，而是“为什么会演化成现在的判断方式”，以及每个阶段如何进入后来的项目。
          </p>
        </div>

        <div className="timeline-ledger">
          {timelineSignals.map((item) => (
            <article key={item.label} className="timeline-ledger-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>

        {latestEntry ? (
          <div className="timeline-spotlight">
            <div className="timeline-spotlight-copy">
              <span>当前阶段</span>
              <strong>{latestEntry.title}</strong>
              <p>{latestEntry.description}</p>
            </div>
            <div className="timeline-spotlight-outcome">
              <span>当前结果</span>
              <p>{latestEntry.outcome}</p>
            </div>
          </div>
        ) : null}

        <svg
          className="timeline-path"
          viewBox="0 0 1000 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="timeline-path-aura"
            d={timelinePathDefinition}
          />
          <path
            className="timeline-path-line"
            d={timelinePathDefinition}
          />
        </svg>
        <div className="timeline-beacon timeline-beacon-alpha" />
        <div className="timeline-beacon timeline-beacon-beta" />

        <div className="timeline-nodes">
          {siteContent.timeline.entries.map((entry, index) => (
            <article
              key={entry.id}
              className={`timeline-node timeline-node-${index + 1} ${
                index === siteContent.timeline.entries.length - 1
                  ? "is-current"
                  : ""
              }`.trim()}
            >
              <span className="timeline-node-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="timeline-year">{entry.year}</span>
              <strong className="timeline-title">{entry.title}</strong>
              <p className="timeline-description">{entry.description}</p>
              <div className="timeline-outcome">
                <span>获得结果</span>
                <p>{entry.outcome}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
