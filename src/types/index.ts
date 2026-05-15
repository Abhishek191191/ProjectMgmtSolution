export type ProjectMethodology = 'Let AI Decide' | 'Agile' | 'Waterfall' | 'Hybrid' | 'PRINCE2' | 'SAFe';
export type Industry = 'Technology' | 'Healthcare' | 'Finance' | 'Construction' | 'Government' | 'Retail' | 'Other';
export type ProjectType = 'New Product Development' | 'IT Implementation' | 'Process Improvement' | 'Infrastructure' | 'Research' | 'Other';
export type InterestLevel = 'High' | 'Medium' | 'Low';
export type RiskImpact = 'High' | 'Medium' | 'Low';
export type HealthScore = 'Green' | 'Amber' | 'Red';

export interface StakeholderCharter {
  name: string;
  department: string;
  interest: InterestLevel;
}

export interface RiskCharter {
  description: string;
  initialImpact: RiskImpact;
}

export interface ProjectCharter {
  // Step 1: Project Identity
  title: string;
  projectCode?: string;
  organizationName: string;
  industry: Industry;
  projectType: ProjectType;

  // Step 2: Project Brief
  description: string;
  businessProblem: string;
  expectedOutcomes: string;
  objectives: string[];

  // Step 3: People
  sponsorName: string;
  sponsorRole: string;
  projectManagerName: string;
  stakeholders: StakeholderCharter[];
  externalVendors?: string[];

  // Step 4: Scope
  inScope: string[];
  outOfScope: string[];
  keyDeliverables: string[];

  // Step 5: Constraints & Budget
  totalBudget: number;
  currency: string;
  deadline: string;
  teamSize: number;
  constraints: string;
  assumptions: string;

  // Step 6: Risks & Compliance
  knownRisks: RiskCharter[];
  regulatoryRequirements: boolean;
  regulatoryExplanation?: string;
  externalVendorDependency: boolean;
  previousSimilarProject: boolean;

  // Step 7: Preferences
  preferredMethodology: ProjectMethodology;
  reportingFrequency: 'Weekly' | 'Bi-weekly' | 'Monthly';
}

export interface ExecutiveSummary {
  overview: string;
  healthScore: HealthScore;
  healthReasoning: string;
  nextActions: string[];
  confidenceLevel?: string;
}

export interface StakeholderEntry {
  name: string;
  role: string;
  department: string;
  interest: string;
  influence: string;
  engagementStrategy: string;
}

export interface ProjectPhase {
  name: string;
  description: string;
  duration: string;
  keyActivities: string[];
  entryCriteria: string;
  exitCriteria: string;
  deliverables: string[];
  owner: string;
}

export interface WBSItem {
  id: string;
  level: number;
  task: string;
  description: string;
  duration: string;
  effort: string;
  owner: string;
  dependencies: string[];
}

export interface ResourceEntry {
  role: string;
  count: number;
  allocation: string;
  phases: string;
  type: 'Internal' | 'External';
  estimatedDailyRate: number;
  skills: string[];
}

export interface CostEntry {
  category: string;
  description: string;
  estimatedCost: number;
  phase: string;
}

export interface RiskEntry {
  id: string;
  risk: string;
  category: string;
  probability: number; // 1-5
  impact: number; // 1-5
  score: number;
  rating: string;
  owner: string;
  mitigation: string;
  contingency: string;
  triggers: string;
}

export interface QualityCheckpoint {
  checkpoint: string;
  phase: string;
  criteria: string;
}

export interface ProjectLifecycle {
  methodology: {
    methodology: string;
    confidence: string;
    reasoning: string;
    alternativeConsidered: string;
    whyNotAlternative: string;
  };
  executiveSummary: ExecutiveSummary;
  initiation: {
    smartObjectives: string[];
    stakeholderRegister: StakeholderEntry[];
    successCriteria: string[];
    governanceStructure: {
      approvalAuthority: string;
      escalationPath: string;
      steeringCommittee: string;
    };
  };
  phases: ProjectPhase[];
  wbs: {
    items: WBSItem[];
    criticalPath: string[];
    totalDuration: string;
    totalEffort: string;
  };
  resources: ResourceEntry[];
  costs: {
    breakdown: CostEntry[];
    totalBudget: number;
    budgetPhasing: string;
    procurementPlan: string;
  };
  risks: {
    register: RiskEntry[];
    top3CriticalRisks: string[];
    immediateActions: string[];
  };
  quality: {
    standards: string[];
    checkpoints: QualityCheckpoint[];
    defectTolerance: string;
    testingApproach: string;
  };
}
