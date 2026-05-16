import { ProjectCharter, ProjectLifecycle } from '../types';

export const INITIAL_CHARTER: ProjectCharter = {
  title: "",
  organizationName: "",
  industry: "Technology",
  projectType: "IT Implementation",
  description: "",
  businessProblem: "",
  expectedOutcomes: "",
  objectives: [""],
  sponsorName: "",
  sponsorRole: "",
  projectManagerName: "",
  stakeholders: [{ name: "", department: "", interest: "Medium" }],
  inScope: [""],
  outOfScope: [""],
  keyDeliverables: [""],
  totalBudget: 0,
  currency: "USD",
  deadline: "",
  teamSize: 1,
  constraints: "",
  assumptions: "",
  knownRisks: [{ description: "", initialImpact: "Medium" }],
  regulatoryRequirements: false,
  externalVendorDependency: false,
  previousSimilarProject: false,
  preferredMethodology: "Let AI Decide",
  reportingFrequency: "Weekly",
};

export async function generateProjectLifecycle(charter: ProjectCharter): Promise<ProjectLifecycle> {
  const response = await fetch('/api/generate-lifecycle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ charter }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate project lifecycle');
  }

  return response.json();
}
