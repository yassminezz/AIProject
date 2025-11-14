export interface MindMapNode {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  iconType: 'concept' | 'fact' | 'formula' | 'example';
}

export interface MindMapData {
  mainTopic: string;
  nodes: MindMapNode[];
}

export interface DetailedSummary {
  introduction: string;
  sections: {
    title: string;
    content: string;
  }[];
  conclusion: string;
}

export enum AppState {
  LANDING = 'LANDING',
  GENERATING = 'GENERATING',
  VIEWING = 'VIEWING'
}

export type Language = 'fr' | 'en' | 'ar';