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

export type ProjectMediaKind = "image" | "video" | "diagram";

export type ProjectMedia = {
  id: string;
  kind: ProjectMediaKind;
  title: string;
  description: string;
  src?: string;
  poster?: string;
  alt?: string;
  href?: string;
  ctaLabel?: string;
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
  media?: ProjectMedia[];
};

export type ContactCommandAction = {
  id: string;
  label: string;
  value: string;
  href?: string;
  to?: string;
  copyValue?: string;
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
  actions?: ContactCommandAction[];
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

export type HeroContactCard = {
  triggerLabel: string;
  triggerHint: string;
  panelEyebrow: string;
  panelTitle: string;
  panelDescription: string;
  name: string;
  location: string;
  imageSrc?: string;
  imageAlt: string;
  tip: string;
  fallbackTitle: string;
  fallbackBody: string;
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
    contactCard: HeroContactCard;
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
