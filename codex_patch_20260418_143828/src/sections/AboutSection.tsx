import { siteContent } from "@/content/siteContent";
import { SectionFrame } from "@/components/SectionFrame";
import { RevealText } from "@/systems/RevealText";
import { AboutAvatarScene } from "@/scene/AboutAvatarScene";

const aboutSignals = [
  {
    label: "判断基线",
    value: "先定义问题，再定义界面与表达方式。",
  },
  {
    label: "工作姿态",
    value: "把结构、节奏与实现视为同一套系统。",
  },
  {
    label: "最终目标",
    value: "做出清晰、可信且值得继续探索的体验。",
  },
];

const aboutPrinciples = [
  {
    title: "不是只做页面",
    description:
      "我更关注产品为何成立、信息如何被理解，以及用户为什么愿意继续停留。",
  },
  {
    title: "不是堆满信息",
    description:
      "我偏好先建立认知路径，再逐层展开细节，让复杂内容仍然可读、可追踪。",
  },
  {
    title: "不是只顾观感",
    description:
      "性能、节奏、反馈和版式一起决定可信度，它们都属于产品本身。",
  },
];

export function AboutSection() {
  return (
    <SectionFrame
      id="about"
      index="01"
      heading={siteContent.about.heading}
      className="section-about"
    >
      <div className="about-grid">
        <div className="about-visual">
          <div className="about-visual-head">
            <span>人物剖面</span>
            <strong>工程 / 叙事 / 交互</strong>
          </div>
          <AboutAvatarScene />
          <div className="about-visual-signals">
            {aboutSignals.map((item) => (
              <div key={item.label} className="about-visual-signal">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
          <div className="about-visual-foot">
            <span>坐标注记</span>
            <p>
              我更关心一个体验如何被理解、被信任，以及是否值得被继续探索。
            </p>
          </div>
        </div>

        <div className="about-copy">
          <div className="about-copy-head">
            <span>方法说明</span>
            <strong>
              把产品逻辑、工程边界和表达节奏缝成同一套系统。
            </strong>
          </div>

          <RevealText content={siteContent.about.lead} className="about-lead" />

          <div className="about-presence-grid">
            {aboutSignals.map((item) => (
              <article key={item.label} className="about-presence-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>

          <div className="about-story-list">
            {siteContent.about.story.map((item) => (
              <RevealText key={item.id} content={item} />
            ))}
          </div>

          <div className="about-principles">
            {aboutPrinciples.map((item, index) => (
              <article key={item.title} className="about-principle-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <div className="about-meta">
            {siteContent.about.meta.map((item) => (
              <div key={item.label} className="about-meta-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
