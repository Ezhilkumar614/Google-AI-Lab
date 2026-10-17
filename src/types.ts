export type CategoryType = 
  | 'Financial' 
  | 'Career' 
  | 'Lifestyle' 
  | 'Growth' 
  | 'Risk' 
  | 'Emotional' 
  | 'Strategic' 
  | 'Personal'
  | 'Tech'
  | 'Operational'
  | 'Speed';

export interface DecisionOption {
  id: string;
  name: string;
  description?: string;
}

export interface ProConItem {
  id: string;
  text: string;
  explanation: string;
  category: CategoryType;
  weight: number; // 1 to 10
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionAnalysis {
  id: string;
  name: string;
  tagline: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: SWOTAnalysis;
}

export interface ComparisonCriterion {
  name: string;
  category: string;
  importance: 'Critical' | 'High' | 'Medium';
  scores: Record<string, { rating: number; rationale: string }>; // optionId -> { rating, rationale }
  winnerOptionId?: string;
}

export interface Verdict {
  recommendedOptionId: string;
  recommendedOptionName: string;
  confidencePercentage: number;
  headline: string;
  executiveRationale: string;
  theTiebreakerFactor: string; // The deciding factor that breaks the tie
  rule101010: {
    in10Minutes: string;
    in10Months: string;
    in10Years: string;
  };
  devilsAdvocate: {
    blindspot: string;
    harshTruth: string;
    howToMitigate: string;
  };
  testDriveExperiment: {
    title: string;
    description: string;
    duration: string;
  };
}

export interface DecisionInput {
  id: string;
  title: string;
  category: string;
  context: string;
  urgency: 'low' | 'medium' | 'high';
  reversible: 'type1_irreversible' | 'type2_reversible' | 'unknown';
  options: DecisionOption[];
  createdAt: number;
}

export interface AnalysisResult {
  id: string;
  decisionInput: DecisionInput;
  timestamp: number;
  summary: string;
  options: OptionAnalysis[];
  comparisonMatrix: {
    criteria: ComparisonCriterion[];
  };
  verdict: Verdict;
}

export interface FollowupMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
}
