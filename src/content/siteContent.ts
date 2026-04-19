import type { SiteContent } from "@/types/content";

export const siteContent: SiteContent = {
  preloader: {
    lines: [
      "初始化个人宇宙坐标...",
      "载入项目证据与研究轨迹...",
      "构建杨子煜的数字表达系统...",
    ],
    initials: "杨",
  },
  hero: {
    eyebrow: "数字宇宙",
    title: "杨子煜",
    subtitle:
      "聚焦计算机视觉、语音交互与前端叙事表达的沉浸式个人作品集。",
    intro: {
      id: "hero-intro",
      base: "你好，我是杨子煜",
      enhanced: "HELLO, I'M Yang Ziyu",
      mode: "swap",
    },
    chapterAtlas: [
      {
        id: "chapter-about",
        sectionId: "about",
        index: "01",
        eyebrow: "人物底层",
        title: "关于我",
        summary:
          "先认识我的判断方式、学习路径和做事节奏，再进入后面的能力结构与项目证据。",
        preview:
          "这一章不是普通的自我介绍，而是把我如何拆解问题、如何组织实现、如何把技术转成可读体验完整展开。",
        highlights: ["问题拆解", "工程表达", "研究取向"],
      },
      {
        id: "chapter-skills",
        sectionId: "skills",
        index: "02",
        eyebrow: "能力结构",
        title: "技能宇宙",
        summary:
          "把算法、工程、界面与表达能力排布成一套可导航的能力图谱，而不是简单堆叠名词。",
        preview:
          "这里展示的不只是会什么，而是这些能力如何互相支撑，最终落到真实项目与可交付结果上。",
        highlights: ["核心能力", "领域方法", "工具落点"],
      },
      {
        id: "chapter-projects",
        sectionId: "projects",
        index: "03",
        eyebrow: "证据系统",
        title: "项目验证",
        summary:
          "通过真实项目展示我如何定义问题、选择方案、推进实现并交付可验证结果。",
        preview:
          "每个项目都会从问题、方案、关键技术和最终价值层层展开，形成一条完整的证据链。",
        highlights: ["问题定义", "方案组织", "结果证明"],
      },
      {
        id: "chapter-timeline",
        sectionId: "timeline",
        index: "04",
        eyebrow: "演化轨迹",
        title: "成长轨迹",
        summary:
          "不是一条扁平时间线，而是能力结构、研究兴趣与表达方式持续升级的过程。",
        preview:
          "如果前几章说明了我现在能做什么，这一章则解释这些能力是如何形成并逐步整合起来的。",
        highlights: ["阶段跃迁", "能力复利", "系统整合"],
      },
      {
        id: "chapter-contact",
        sectionId: "contact",
        index: "05",
        eyebrow: "真实连接",
        title: "建立连接",
        summary:
          "把浏览沉淀成真实联系，让对项目和能力的兴趣有明确的下一步入口。",
        preview:
          "这一章会给出联系渠道、仓库入口和项目列表，把好奇心转成可以继续交流与协作的动作。",
        highlights: ["联系入口", "仓库信号", "下一步动作"],
      },
    ],
    ctaLabel: "启动主航线",
    ctaHint: "按章节顺序深入浏览",
  },
  about: {
    heading: "关于我",
    lead: {
      id: "about-lead",
      base: "我关注的不只是模型能不能跑起来，也关注技术如何被表达、被理解、被信任。",
      enhanced:
        "我希望把算法能力、工程实现和界面叙事缝成同一套可读、可验证、可交付的系统。",
      mode: "expand",
    },
    story: [
      {
        id: "about-story-1",
        base: "我偏好先把问题拆清楚，再决定界面、结构和实现方式。",
        enhanced:
          "无论是做检测系统、语音助手还是作品集，我都会先确认目标、约束和验证方式，再进入编码。",
        mode: "expand",
      },
      {
        id: "about-story-2",
        base: "我擅长在算法结果和用户感知之间搭桥，而不是把技术单独展示出来。",
        enhanced:
          "对我来说，模型、交互、排版和反馈不是分开的模块，它们一起决定一个系统是否真正可信。",
        mode: "expand",
      },
      {
        id: "about-story-3",
        base: "我在学习与项目中持续把研究思路转成可以演示、可以复用、可以讲清楚的成果。",
        enhanced:
          "这也是我做这个个人数字空间的原因：它不仅展示结果，更展示我是如何组织这些结果的。",
        mode: "expand",
      },
    ],
    meta: [
      {
        label: "关注方向",
        value: "计算机视觉、语音交互、前端叙事表达",
      },
      {
        label: "工作方式",
        value: "先拆问题，再建结构，再精修交互与呈现",
      },
      {
        label: "目标",
        value: "做出清晰、可靠、可被继续探索的系统",
      },
    ],
  },
  skills: {
    heading: "技能宇宙",
    description:
      "核心能力决定我能直接交付什么，领域能力决定我如何组织问题，工具体系决定我如何把方案落到代码与系统里。",
    nodes: [
      {
        id: "skill-core-frontend",
        label: "交互型前端表达",
        orbit: "core",
        summary:
          "把结构、动效、信息层级和交互反馈组织成有叙事感的前端体验。",
        details:
          "我不把前端只看成界面拼装，而是把它当成技术结果对外表达的第一现场，负责把复杂系统讲清楚。",
        projectRefs: [
          "project-digital-universe",
          "project-voice-assistant",
          "project-developer-cheatsheet",
          "project-pet-hospital-website",
        ],
      },
      {
        id: "skill-core-systems",
        label: "系统拆解与建模",
        orbit: "core",
        summary:
          "能把模糊需求整理成可执行的模块边界、数据路径和验证方式。",
        details:
          "无论是研究项目还是产品型页面，我都倾向先定义输入、过程和输出，再决定技术方案和呈现结构。",
        projectRefs: [
          "project-remote-sensing-detection",
          "project-voice-assistant",
          "project-digital-universe",
          "project-developer-cheatsheet",
          "project-pet-hospital-website",
        ],
      },
      {
        id: "skill-domain-product",
        label: "研究问题落地",
        orbit: "domain",
        summary:
          "把课题目标转成可实现的训练流程、交互流程和结果说明。",
        details:
          "我习惯在模型效果、演示路径和展示成本之间做平衡，让研究成果不只停留在代码层面。",
        projectRefs: [
          "project-remote-sensing-detection",
          "project-digital-universe",
        ],
      },
      {
        id: "skill-domain-visual",
        label: "空间化交互设计",
        orbit: "domain",
        summary:
          "用空间层级、动效节奏和视觉引导帮助用户理解信息结构。",
        details:
          "我会让动效服务于理解，而不是只做装饰，让浏览者在探索过程中自然建立认知。",
        projectRefs: [
          "project-digital-universe",
          "project-voice-assistant",
          "project-developer-cheatsheet",
          "project-pet-hospital-website",
        ],
      },
      {
        id: "skill-domain-performance",
        label: "多模态交互思维",
        orbit: "domain",
        summary:
          "关注语音、视觉和界面反馈的协同，让系统具备更完整的交互闭环。",
        details:
          "这让我在做语音助手和沉浸式作品集时，都会同时考虑输入方式、反馈方式和使用节奏。",
        projectRefs: ["project-voice-assistant", "project-digital-universe"],
      },
      {
        id: "skill-tool-react",
        label: "React / Vue 界面工程",
        orbit: "tool",
        summary: "构建组件化、可维护、可持续演进的前端界面系统。",
        details:
          "我会用组件、状态和样式系统把复杂页面拆成稳定结构，让界面不只是能做出来，也能继续扩展。",
        projectRefs: [
          "project-digital-universe",
          "project-voice-assistant",
          "project-developer-cheatsheet",
          "project-pet-hospital-website",
        ],
      },
      {
        id: "skill-tool-three",
        label: "Three.js 空间场景",
        orbit: "tool",
        summary: "用三维场景建立空间感、沉浸感和更强的视觉记忆点。",
        details:
          "当二维页面不足以表达层次和氛围时，我会引入 3D 场景与运动语言来强化叙事。",
        projectRefs: ["project-digital-universe", "project-developer-cheatsheet"],
      },
      {
        id: "skill-tool-gsap",
        label: "GSAP 动画编排",
        orbit: "tool",
        summary: "精细控制滚动、过渡、Reveal 与交互动效的时序。",
        details:
          "我把 GSAP 当作节奏控制器，用它统一页面中不同层级的动效关系和过渡体验。",
        projectRefs: ["project-digital-universe"],
      },
      {
        id: "skill-tool-typescript",
        label: "Python / TypeScript 工程",
        orbit: "tool",
        summary: "同时覆盖研究代码与前端工程，实现从算法到展示的完整链路。",
        details:
          "Python 更适合模型、数据和服务逻辑，TypeScript 更适合界面和工程边界，我会把两者衔接成完整系统。",
        projectRefs: [
          "project-remote-sensing-detection",
          "project-voice-assistant",
          "project-digital-universe",
          "project-developer-cheatsheet",
          "project-pet-hospital-website",
        ],
      },
      {
        id: "skill-tool-node",
        label: "模型训练与部署流程",
        orbit: "tool",
        summary: "围绕数据准备、训练验证、脚本化流程和演示交付组织工程。",
        details:
          "我关注的不只是模型训练本身，也关注如何让结果可复现、可展示、可继续迭代。",
        projectRefs: [
          "project-remote-sensing-detection",
          "project-voice-assistant",
        ],
      },
    ],
  },
  projects: {
    heading: "项目验证",
    description:
      "我把项目拆成问题、方案、技术路径与最终价值，让浏览者能直接判断这些能力是否真的经过实践验证。",
    entries: [
      {
        id: "project-remote-sensing-detection",
        title: "面向遥感影像的小目标检测系统",
        summary:
          "围绕遥感场景中的小目标识别问题，完成从模型训练到结果展示的一套检测系统实践。",
        problem:
          "遥感影像中的目标尺寸小、背景复杂、尺度差异大，直接检测往往容易出现漏检和特征不明显的问题。",
        solution:
          "我将数据处理、模型训练、结果验证和系统展示串成完整流程，让检测效果不只停留在实验结果，而是能够被持续验证与演示。",
        techStack: ["Python", "PyTorch", "目标检测", "遥感影像", "数据处理"],
        impact:
          "形成了一套围绕小目标检测课题的完整实践路径，便于展示模型能力、分析效果并支撑项目答辩与后续迭代。",
        visual: "遥感目标检测 / 研究系统",
        highlights: [
          "从数据到模型到展示的完整闭环",
          "聚焦复杂背景下的小目标检测问题",
          "结果能够用于答辩、演示与持续验证",
        ],
        outcomes: [
          "完成检测系统主体流程搭建",
          "整理训练、验证与展示所需的关键模块",
          "把研究结果组织成可演示的系统成果",
        ],
        links: [
          {
            label: "Gitee 仓库",
            href: "https://gitee.com/yzyandhh/bysj_yzy",
          },
        ],
        media: [
          {
            id: "remote-sensing-overview",
            kind: "image",
            title: "检测结果总览截图",
            description:
              "用一张总览图展示系统界面、目标框分布和结果阅读路径，方便快速说明项目的可视化输出。",
            src: "project-media/remote-sensing-overview.svg",
            alt: "遥感目标检测系统总览截图示意图",
            ctaLabel: "查看截图",
          },
          {
            id: "remote-sensing-architecture",
            kind: "diagram",
            title: "训练与验证流程架构图",
            description:
              "把数据处理、训练、验证和结果展示拆成一条清晰流程，便于答辩和项目沟通时快速解释系统结构。",
            src: "project-media/remote-sensing-architecture.svg",
            alt: "遥感目标检测系统架构图",
            ctaLabel: "查看架构图",
          },
        ],
      },
      {
        id: "project-voice-assistant",
        title: "智能语音助手",
        summary:
          "一套围绕语音输入、命令理解与交互反馈组织的智能语音助手项目。",
        problem:
          "语音类系统往往容易停留在单点识别能力，缺少从输入、反馈到可操作结果的完整交互闭环。",
        solution:
          "我把语音输入、命令响应、反馈节奏和界面表达一起组织，让助手不仅能回应，还能形成完整的使用路径。",
        techStack: ["Python", "语音识别", "语音交互", "界面逻辑", "脚本工程"],
        impact:
          "验证了我在多模态交互方向的实践能力，也让我更关注系统反馈节奏和用户感知之间的关系。",
        visual: "语音交互 / 助手系统",
        highlights: [
          "从输入到反馈的完整语音交互路径",
          "把功能实现和用户感知同时纳入设计",
          "适合展示智能助手类系统的整体思路",
        ],
        outcomes: [
          "完成语音助手基础能力搭建",
          "验证命令响应与界面反馈的联动方式",
          "沉淀了一套适合继续扩展的交互结构",
        ],
        links: [
          {
            label: "Gitee 仓库",
            href: "https://gitee.com/yzyandhh/yuyin-robot",
          },
        ],
        media: [
          {
            id: "voice-assistant-screen",
            kind: "image",
            title: "语音助手交互截图",
            description:
              "展示命令输入、状态反馈和结果返回的界面关系，让交互闭环一眼可读。",
            src: "project-media/voice-assistant-console.svg",
            alt: "智能语音助手交互截图示意图",
            ctaLabel: "查看截图",
          },
          {
            id: "voice-assistant-architecture",
            kind: "diagram",
            title: "语音流程架构图",
            description:
              "把语音输入、识别、命令理解和反馈输出拆成层次清晰的结构图，便于继续扩展。",
            src: "project-media/voice-assistant-architecture.svg",
            alt: "智能语音助手架构图",
            ctaLabel: "查看架构图",
          },
        ],
      },
      {
        id: "project-developer-cheatsheet",
        title: "开发者速查表",
        summary:
          "一个把常用开发命令、工具入口和高频知识整理成可快速检索页面的开发效率站点。",
        problem:
          "开发过程中经常需要反复查找命令、文档入口和常用片段，如果信息散落在多个网页和笔记里，就会不断打断工作流。",
        solution:
          "我把常见开发内容整理成统一的速查入口，用更轻量、更直接的页面结构降低信息跳转成本，让高频知识可以快速定位和复用。",
        techStack: ["React", "TypeScript", "前端工程", "信息整理", "效率工具"],
        impact:
          "这个项目验证了我不仅能做展示型页面，也能把高频需求整理成真正有用的开发辅助工具。",
        visual: "开发工具 / 效率站点",
        highlights: [
          "围绕真实开发高频需求组织信息结构",
          "把速查、导航和使用效率放在同一优先级",
          "适合作为长期维护和持续补充的工具型项目",
        ],
        outcomes: [
          "完成面向开发场景的速查站点结构设计",
          "整理出更适合快速定位的内容入口方式",
          "形成可以继续扩展的效率工具雏形",
        ],
        links: [
          {
            label: "在线访问",
            href: "https://aizcaid.cn/",
          },
        ],
        media: [
          {
            id: "developer-cheatsheet-home",
            kind: "image",
            title: "速查首页截图",
            description:
              "展示速查表首页的导航方式和信息分区，让访问者能快速理解这个工具型项目的核心价值。",
            src: "project-media/developer-cheatsheet-home.svg",
            alt: "开发者速查表首页截图示意图",
            ctaLabel: "查看截图",
          },
          {
            id: "developer-cheatsheet-architecture",
            kind: "diagram",
            title: "内容组织架构图",
            description:
              "把页面导航、分类内容和检索路径拆成一张结构图，说明这个项目如何围绕效率需求组织页面。",
            src: "project-media/developer-cheatsheet-architecture.svg",
            alt: "开发者速查表架构图",
            ctaLabel: "查看架构图",
          },
        ],
      },
      {
        id: "project-pet-hospital-website",
        title: "宠物医院网站前端框架",
        summary:
          "一个围绕宠物医院官网场景搭建的前端展示框架，用统一的页面结构承接品牌介绍、服务信息与站点导览。",
        problem:
          "宠物医院类网站通常要同时承载品牌形象、服务介绍、就诊信息和信任感表达，如果页面结构松散、信息入口不清晰，就很难形成专业稳定的第一印象。",
        solution:
          "我把首页展示、服务分区、信息卡片与导航关系整理成一套更适合行业官网场景的前端框架，让页面既能快速上线展示，也方便后续继续补充具体业务内容。",
        techStack: ["前端框架", "响应式布局", "组件化页面", "官网展示", "信息分区"],
        impact:
          "这个项目补充了我在行业展示型网站方向的前端落地能力，说明我不仅能做个性化表达，也能围绕真实场景组织更稳健、可扩展的页面框架。",
        visual: "宠物医疗 / 官网前端框架",
        highlights: [
          "围绕宠物医院场景组织首页、服务与品牌展示结构",
          "适合作为后续补充预约、医生介绍和门店信息的前端底座",
          "用更统一的页面框架承接医疗服务类网站的专业感表达",
        ],
        outcomes: [
          "完成宠物医院主题网站的前端框架搭建",
          "沉淀可继续扩展内容模块的展示页结构",
          "提供可直接访问的线上演示入口",
        ],
        links: [
          {
            label: "在线访问",
            href: "https://pet-hospital-website-eight.vercel.app",
          },
        ],
      },
      {
        id: "project-digital-universe",
        title: "心动告白",
        summary:
          "把我的项目、能力与研究兴趣组织成一套可探索、可叙事、可持续扩展的个人数字空间。",
        problem:
          "传统作品集往往只做信息罗列，难以同时展示技术能力、表达能力和系统组织能力。",
        solution:
          "我以宇宙空间为隐喻，把路由、3D 场景、动效、Reveal、项目卷宗和联系入口整合成一套沉浸式前端系统。",
        techStack: [
          "React",
          "TypeScript",
          "Three.js",
          "GSAP",
          "Lenis",
        ],
        impact:
          "这个项目本身就是一次能力整合证明，展示了我如何把工程、交互、视觉与内容组织成统一表达。",
        visual: "沉浸式作品集 / 数字空间",
        highlights: [
          "首页星图、章节页与项目详情的多层结构",
          "3D 宇宙背景、能量场与 Reveal 信息机制",
          "项目卷宗、声音反馈与可访问性同步考虑",
        ],
        outcomes: [
          "完成可构建、可部署的沉浸式作品集系统",
          "把个人项目组织成可持续扩展的内容模型",
          "形成一套更贴近个人风格的前端表达方式",
        ],
        links: [
          {
            label: "在线访问",
            href: "https://love-heart-rouge.vercel.app",
          },
        ],
        media: [
          {
            id: "digital-universe-atlas",
            kind: "image",
            title: "章节星图截图",
            description:
              "突出首页的章节星图入口和整体叙事结构，说明这个项目不是单页堆叠而是分章组织。",
            src: "project-media/digital-universe-atlas.svg",
            alt: "数字宇宙作品集章节星图截图",
            ctaLabel: "查看截图",
          },
          {
            id: "digital-universe-demo",
            kind: "video",
            title: "交互演示入口",
            description:
              "这里先预留录屏与视频位，当前可直接打开在线版本体验完整的路由、动效和章节切换。",
            poster: "project-media/digital-universe-demo-poster.svg",
            href: "https://love-heart-rouge.vercel.app",
            ctaLabel: "打开在线演示",
          },
          {
            id: "digital-universe-architecture",
            kind: "diagram",
            title: "前端系统架构图",
            description:
              "把内容模型、章节路由、3D 背景、全局状态和弹层系统拆成一张结构图，方便说明工程组织方式。",
            src: "project-media/digital-universe-architecture.svg",
            alt: "数字宇宙作品集架构图",
            ctaLabel: "查看架构图",
          },
        ],
      },
    ],
  },
  timeline: {
    heading: "成长轨迹",
    description:
      "这不是简单的年份堆叠，而是一条从代码实现走向系统组织、从算法实践走向完整表达的能力演化路径。",
    entries: [
      {
        id: "timeline-1",
        year: "2022",
        title: "建立基础",
        description:
          "进入大学后开始系统学习编程与软件实现，从单点功能练习逐步过渡到理解完整项目流程与协作方式。",
        outcome:
          "打下了代码实现和工程思维的基础，也开始意识到“能跑起来”和“能讲清楚”是两件不同的事。",
      },
      {
        id: "timeline-2",
        year: "2023",
        title: "进入智能方向",
        description:
          "逐步把学习重点转向计算机视觉、语音交互等智能系统方向，开始关注模型、数据和交互之间的关系。",
        outcome:
          "能力边界从单纯编码扩展到算法理解、数据处理和交互流程设计。",
      },
      {
        id: "timeline-3",
        year: "2024",
        title: "形成项目证据",
        description:
          "通过遥感小目标检测系统和智能语音助手，把研究兴趣落成能够展示和验证的真实项目。",
        outcome:
          "开始积累可被外界直接判断的项目成果，而不是停留在零散练习与局部实验上。",
      },
      {
        id: "timeline-4",
        year: "现在",
        title: "整合成表达系统",
        description:
          "把算法实践、前端交互和个人表达整合到同一个数字作品集里，让技术能力与表达方式形成统一形象。",
        outcome:
          "这个项目本身就是当前阶段的总结：它不仅展示我做过什么，也展示我如何组织这些结果。",
      },
    ],
  },
  contact: {
    heading: "建立连接",
    description:
      "如果你想进一步查看项目仓库、继续交流项目细节，或者直接联系我，这一章就是整个旅程的真实入口。",
    commands: [
      {
        command: "帮助",
        description: "查看可用命令",
        response: [
          "可用命令：",
          "帮助   查看可用命令",
          "联系   查看联系方式",
          "仓库   查看仓库入口",
          "项目   查看项目链接列表",
        ],
      },
      {
        command: "联系",
        description: "显示联系方式",
        response: [
          "邮箱   : 3188721533@qq.com",
          "协作   : 支持远程沟通与项目交流",
          "状态   : 可继续交流研究与前端方向项目",
          "动作   : 支持直接复制邮箱",
        ],
        actions: [
          {
            id: "contact-copy-email",
            label: "复制邮箱",
            value: "3188721533@qq.com",
            copyValue: "3188721533@qq.com",
          },
        ],
      },
      {
        command: "仓库",
        description: "显示仓库地址",
        response: [
          "Gitee  : https://gitee.com/yzyandhh",
          "GitHub : https://github.com/yzy1129",
          "方向   : 前端表达、交互系统、项目组织",
          "动作   : 支持一键打开对应仓库主页",
        ],
        actions: [
          {
            id: "repo-gitee",
            label: "打开 Gitee",
            value: "gitee.com/yzyandhh",
            href: "https://gitee.com/yzyandhh",
          },
          {
            id: "repo-github",
            label: "打开 GitHub",
            value: "github.com/yzy1129",
            href: "https://github.com/yzy1129",
          },
        ],
      },
      {
        command: "项目",
        description: "显示项目列表",
        response: [
          "项目 1 : 面向遥感影像的小目标检测系统",
          "链接   : https://gitee.com/yzyandhh/bysj_yzy",
          "项目 2 : 智能语音助手",
          "链接   : https://gitee.com/yzyandhh/yuyin-robot",
          "项目 3 : 开发者速查表",
          "链接   : https://aizcaid.cn/",
          "项目 4 : 宠物医院网站前端框架",
          "链接   : https://pet-hospital-website-eight.vercel.app",
          "项目 5 : 心动告白",
          "链接   : https://love-heart-rouge.vercel.app",
          "动作   : 下方按钮可直接跳转到对应项目入口",
        ],
        actions: [
          {
            id: "project-open-remote-sensing",
            label: "打开项目 1",
            value: "bysj_yzy",
            href: "https://gitee.com/yzyandhh/bysj_yzy",
          },
          {
            id: "project-open-voice-assistant",
            label: "打开项目 2",
            value: "yuyin-robot",
            href: "https://gitee.com/yzyandhh/yuyin-robot",
          },
          {
            id: "project-open-developer-cheatsheet",
            label: "打开项目 3",
            value: "aizcaid.cn",
            href: "https://aizcaid.cn/",
          },
          {
            id: "project-open-pet-hospital-website",
            label: "打开项目 4",
            value: "pet-hospital-website-eight.vercel.app",
            href: "https://pet-hospital-website-eight.vercel.app",
          },
          {
            id: "project-open-digital-universe",
            label: "打开项目 5",
            value: "love-heart-rouge.vercel.app",
            href: "https://love-heart-rouge.vercel.app",
          },
        ],
      },
    ],
  },
};
