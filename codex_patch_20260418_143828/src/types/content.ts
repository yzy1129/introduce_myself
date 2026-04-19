export type RevealMode = "swap" | "expand" | "invert";

export type RevealContent = {
  id: string;
  base: string;
  enhanced: string;
  mode: RevealMode;
};

export type PerformanceTier = "high" | "medium" | "low";

export type SkillOrbit = "core" | "domain" | "tool";

export type SkillNode = {
  id: string;
  label: string;
  orbit: SkillOrbit;
  summary: string;
  details: string;
  projectRefs: string[];
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectEntry = {
  id: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  techStack: string[];
  impact: string;
  visual: string;
  highlights: string[];
  outcomes: string[];
  links: ProjectLink[];
};

export type TimelineEntry = {
  id: string;
  year: string;
  title: string;
  description: string;
  outcome: string;
};

export type ContactCommand = {
  command: string;
  description: string;
  response: string[];
};

export type HeroChapter = {
  id: string;
  sectionId: string;
  index: string;
  eyebrow: string;
  title: string;
  summary: string;
  preview: string;
  highlights: string[];
};

export type SiteContent = {
  preloader: {
    lines: string[];
    initials: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    intro: RevealContent;
    chapterAtlas: HeroChapter[];
    ctaLabel: string;
    ctaHint: string;
  };
  about: {
    heading: string;
    lead: RevealContent;
    story: RevealContent[];
    meta: Array<{ label: string; value: string }>;
  };
  skills: {
    heading: string;
    description: string;
    nodes: SkillNode[];
  };
  projects: {
    heading: string;
    description: string;
    entries: ProjectEntry[];
  };
  timeline: {
    heading: string;
    description: string;
    entries: TimelineEntry[];
  };
  contact: {
    heading: string;
    description: string;
    commands: ContactCommand[];
  };
};
