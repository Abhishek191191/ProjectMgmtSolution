export type ProjectMethodology = 'Agile' | 'Waterfall' | 'Hybrid';

export interface ProjectCharter {
  title: string;
  description: string;
  objectives: string[];
  stakeholders: string[];
  scope: string;
  constraints: string;
  assumptions: string;
}

export interface ResourceRequirement {
  role: string;
  count: number;
  skills: string[];
}

export interface Expense {
  category: string;
  description: string;
  estimatedCost: number;
}

export interface WBSItem {
  id: string;
  task: string;
  duration: string;
  dependencies: string[];
}

export interface RiskLogEntry {
  id: string;
  risk: string;
  impact: 'Low' | 'Medium' | 'High';
  probability: 'Low' | 'Medium' | 'High';
  mitigation: string;
}

export interface IssueLogEntry {
  id: string;
  issue: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Closed';
}

export interface ProjectLifecycle {
  methodology: ProjectMethodology;
  initiation: {
    stakeholders: string[];
    objectives: string[];
    successCriteria: string[];
  };
  stages: {
    name: string;
    description: string;
    deliverables: string[];
  }[];
  resources: ResourceRequirement[];
  expenses: Expense[];
  timeline: string;
  wbs: WBSItem[];
  risks: RiskLogEntry[];
  issues: IssueLogEntry[];
}
