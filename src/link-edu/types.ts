// ── LINK 교육 영상 템플릿 시스템 타입 정의 ──

export type LinkCategory = "L" | "I" | "N" | "K";

// ── 에피소드 메타데이터 ──
export type EpisodeMeta = {
  id: string;
  title: string;
  category: LinkCategory;
  episodeNumber: number;
  palette: string;
  audioFile: string;
  bgmFile?: string;
  bgmVolume?: number;
  totalDurationFrames: number;
};

// ── 오디오 싱크 ──
export type AudioSync = {
  startFrame: number;
  cues?: Record<string, number>;
};

// ── 장면별 Props ──

export type DialogueExchange = {
  speaker: "customer" | "fp";
  text: string;
  emoji?: string;
  delay: number;
};

export type DialogueSceneProps = {
  exchanges: DialogueExchange[];
  headline?: string;
};

export type ComparisonSide = {
  label: string;
  text: string;
  emoji?: string;
  subText?: string;
};

export type ComparisonSceneProps = {
  wrong: ComparisonSide;
  right: ComparisonSide;
  headline?: string;
};

export type KeywordSceneProps = {
  headline: string;
  sub?: string;
  emoji?: string;
  accentWord?: string;
  number?: { from: number; to: number; suffix?: string };
};

export type ProcessStep = {
  label: string;
  emoji?: string;
  description?: string;
};

export type ProcessSceneProps = {
  steps: ProcessStep[];
  direction?: "vertical" | "horizontal";
  headline?: string;
};

export type ListItem = {
  emoji: string;
  text: string;
  sub?: string;
};

export type ListSceneProps = {
  items: ListItem[];
  layout?: "cards" | "bullets";
  headline?: string;
};

export type QuoteSceneProps = {
  quote: string;
  attribution?: string;
  context?: string;
  accentWords?: string[];
};

export type OpeningProps = {
  category: LinkCategory;
  episodeTitle: string;
  seriesName?: string;
};

export type SectionTransitionProps = {
  sectionNumber: number;
  sectionTitle: string;
  emoji?: string;
};

export type ClosingProps = {
  takeaway: string;
  cta?: string;
  emoji?: string;
};

export type TitleCardProps = {
  category: LinkCategory;
  categoryLabel: string;
  episodeTitle: string;
};

// ── 장면 유니온 ──
export type EpisodeScene =
  | ({ type: "opening" } & OpeningProps & AudioSync)
  | ({ type: "dialogue" } & DialogueSceneProps & AudioSync)
  | ({ type: "comparison" } & ComparisonSceneProps & AudioSync)
  | ({ type: "keyword" } & KeywordSceneProps & AudioSync)
  | ({ type: "process" } & ProcessSceneProps & AudioSync)
  | ({ type: "list" } & ListSceneProps & AudioSync)
  | ({ type: "quote" } & QuoteSceneProps & AudioSync)
  | ({ type: "transition" } & SectionTransitionProps & AudioSync)
  | ({ type: "closing" } & ClosingProps & AudioSync)
  | ({ type: "titlecard" } & TitleCardProps & AudioSync);

// ── 에피소드 전체 ──
export type EpisodeData = {
  meta: EpisodeMeta;
  scenes: EpisodeScene[];
};
