import { ProjectCharter, ProjectLifecycle, ProjectPhase, WBSItem, ResourceEntry, CostEntry, RiskEntry, QualityCheckpoint, ExecutiveSummary, StakeholderEntry } from '../types';
import { callLLM } from './llm';
import { BRAIN } from '../config/brain.config';

function formatCharterForPrompt(charter: ProjectCharter): string {
  return JSON.stringify(charter, null, 2);
}

export async function decideMethodology(charter: ProjectCharter) {
  const prompt = `
    Analyze the following project charter and decide whether an Agile, Waterfall, Hybrid, PRINCE2, or SAFe methodology is most suitable.
    If the user specified a preference other than "Let AI Decide", prioritize that but still provide reasoning.

    Project Charter:
    ${formatCharterForPrompt(charter)}
  `;

  const schema = `{
    "methodology": "string",
    "confidence": "string",
    "reasoning": "string",
    "alternativeConsidered": "string",
    "whyNotAlternative": "string"
  }`;

  return await callLLM(prompt, schema) as ProjectLifecycle['methodology'];
}

export async function generateExecutiveSummary(charter: ProjectCharter, methodology: string) {
  const prompt = `
    Generate an executive summary for this project.
    Methodology: ${methodology}
    Project Charter:
    ${formatCharterForPrompt(charter)}
  `;

  const schema = `{
    "executiveSummary": "string",
    "healthScore": "Green | Amber | Red",
    "healthReasoning": "string",
    "top3NextActions": ["string", "string", "string"]
  }`;

  const res = await callLLM(prompt, schema);
  return {
    overview: res.executiveSummary || res.overview || '',
    healthScore: res.healthScore || 'Green',
    healthReasoning: res.healthReasoning || '',
    nextActions: res.top3NextActions || res.nextActions || [],
    confidenceLevel: 'High'
  } as ExecutiveSummary;
}

export async function generateInitiation(charter: ProjectCharter) {
  const prompt = `
    Generate initiation details for this project:
    1. SMART objectives.
    2. Stakeholder register with engagement strategies.
    3. Success criteria (measurable KPIs).
    4. Governance structure.

    Project Charter:
    ${formatCharterForPrompt(charter)}
  `;

  const schema = `{
    "smartObjectives": ["string"],
    "stakeholderRegister": [{ "name": "string", "role": "string", "department": "string", "interest": "string", "influence": "string", "engagementStrategy": "string" }],
    "successCriteria": ["string"],
    "governanceStructure": {
      "approvalAuthority": "string",
      "escalationPath": "string",
      "steeringCommittee": "string"
    }
  }`;

  const res = await callLLM(prompt, schema);
  return {
    smartObjectives: res.smartObjectives || [],
    stakeholderRegister: res.stakeholderRegister || [],
    successCriteria: res.successCriteria || [],
    governanceStructure: res.governanceStructure || {
      approvalAuthority: '',
      escalationPath: '',
      steeringCommittee: ''
    }
  };
}

export async function generatePhases(charter: ProjectCharter, methodology: string) {
  const prompt = `
    Generate project phases for this project using ${methodology} methodology.
    Project Charter:
    ${formatCharterForPrompt(charter)}
  `;

  const schema = `{
    "phases": [{
      "name": "string",
      "description": "string",
      "duration": "string",
      "keyActivities": ["string"],
      "entryCriteria": "string",
      "exitCriteria": "string",
      "deliverables": ["string"],
      "owner": "string"
    }]
  }`;

  const res = await callLLM(prompt, schema);
  return (res.phases || []) as ProjectPhase[];
}

export async function generateWBS(charter: ProjectCharter, phases: ProjectPhase[]) {
  const prompt = `
    Generate a 3-level hierarchical WBS based on these phases:
    ${JSON.stringify(phases, null, 2)}

    Project Charter:
    ${formatCharterForPrompt(charter)}
  `;

  const schema = `{
    "wbs": [{
      "id": "string",
      "level": "number",
      "task": "string",
      "description": "string",
      "duration": "string",
      "effort": "string",
      "owner": "string",
      "dependencies": ["string"]
    }],
    "criticalPath": ["string"],
    "totalDuration": "string",
    "totalEffort": "string"
  }`;

  const res = await callLLM(prompt, schema);
  return {
    items: res.wbs || [],
    criticalPath: res.criticalPath || [],
    totalDuration: res.totalDuration || '',
    totalEffort: res.totalEffort || ''
  } as ProjectLifecycle['wbs'];
}

export async function generateResourcesAndBudget(charter: ProjectCharter) {
  const prompt = `
    Generate a resource plan and cost breakdown for this project.
    Project Charter:
    ${formatCharterForPrompt(charter)}
  `;

  const schema = `{
    "resources": [{
      "role": "string",
      "count": "number",
      "allocation": "string",
      "phases": "string",
      "type": "Internal | External",
      "estimatedDailyRate": "number",
      "skills": ["string"]
    }],
    "costBreakdown": [{
      "category": "string",
      "description": "string",
      "estimatedCost": "number",
      "phase": "string"
    }],
    "totalBudget": "number",
    "budgetPhasing": "string",
    "procurementPlan": "string"
  }`;

  const res = await callLLM(prompt, schema);
  return {
    resources: (res.resources || []) as ResourceEntry[],
    costs: {
      breakdown: (res.costBreakdown || []) as CostEntry[],
      totalBudget: res.totalBudget || 0,
      budgetPhasing: res.budgetPhasing || '',
      procurementPlan: res.procurementPlan || ''
    }
  };
}

export async function generateRisksAndQuality(charter: ProjectCharter) {
  const prompt = `
    Generate a risk register and quality plan for this project.
    Project Charter:
    ${formatCharterForPrompt(charter)}
  `;

  const schema = `{
    "risks": [{
      "id": "string",
      "risk": "string",
      "category": "string",
      "probability": "number (1-5)",
      "impact": "number (1-5)",
      "score": "number",
      "rating": "string",
      "owner": "string",
      "mitigation": "string",
      "contingency": "string",
      "triggers": "string"
    }],
    "top3CriticalRisks": ["string (ID)"],
    "immediateActions": ["string"],
    "qualityStandards": ["string"],
    "qualityCheckpoints": [{
      "checkpoint": "string",
      "phase": "string",
      "criteria": "string"
    }],
    "defectTolerance": "string",
    "testingApproach": "string"
  }`;

  const res = await callLLM(prompt, schema);
  return {
    risks: {
      register: (res.risks || []) as RiskEntry[],
      top3CriticalRisks: (res.top3CriticalRisks || []) as string[],
      immediateActions: (res.immediateActions || []) as string[]
    },
    quality: {
      standards: (res.qualityStandards || []) as string[],
      checkpoints: (res.qualityCheckpoints || []) as QualityCheckpoint[],
      defectTolerance: res.defectTolerance || '',
      testingApproach: res.testingApproach || ''
    }
  };
}

export async function generateFullLifecycle(charter: ProjectCharter): Promise<ProjectLifecycle> {
  // 1. decideMethodology
  const methodology = await decideMethodology(charter);

  // Parallel calls (2, 3, 6 from the instructions)
  // Instructions say: Run calls 2, 3, 6 in parallel. Run 4 after 1. Run 5 after 4. Run 7 in parallel with 4.

  // 4 and 7 in parallel after 1
  const [phases, risksAndQuality] = await Promise.all([
    generatePhases(charter, methodology.methodology),
    generateRisksAndQuality(charter)
  ]);

  // 2, 3, 6, and 5 in parallel
  // 5 depends on 4 (phases)
  const [execSummary, initiation, resAndBudget, wbs] = await Promise.all([
    generateExecutiveSummary(charter, methodology.methodology),
    generateInitiation(charter),
    generateResourcesAndBudget(charter),
    generateWBS(charter, phases)
  ]);

  return {
    methodology,
    executiveSummary: execSummary,
    initiation,
    phases,
    wbs,
    resources: resAndBudget.resources,
    costs: resAndBudget.costs,
    risks: risksAndQuality.risks,
    quality: risksAndQuality.quality
  };
}
