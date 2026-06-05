export interface RoadmapResource {
  title: string;
  url: string;
  type: "course" | "book" | "article" | "video" | "paper" | "tutorial" | string;
  isPaid: boolean;
  platform?: string;
}

export interface RoadmapNode {
  id: string;
  label: string;
  type:
    | "prerequisite"
    | "core"
    | "practice"
    | "advanced"
    | "optional"
    | "reflection"
    | string;
  source: "from_audio" | "ai_recommended" | string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | string;
  estimatedTime?: string;
  resources?: RoadmapResource[];
  order: number;
}

export interface RoadmapSection {
  number: number;
  title: string;
  emoji: string;
  description: string;
  nodes: RoadmapNode[];
}

export interface RoadmapLegend {
  type: string;
  emoji: string;
  label: string;
  color: string;
}

export interface RoadmapData {
  title: string;
  estimatedTotalTime: string;
  sections: RoadmapSection[];
  topics_extracted: string[];
  legend: RoadmapLegend[];
}
