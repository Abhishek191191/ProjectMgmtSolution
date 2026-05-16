import { ProjectCharter, ProjectLifecycle, ProjectPhase, WBSItem, ResourceEntry, CostEntry, RiskEntry, QualityCheckpoint, ExecutiveSummary, StakeholderEntry } from '../types';
import { callLLM } from './llm';

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

  const res = await callLLM(prompt, schema);
  return res as unknown as ProjectLifecycle['methodology'];
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
    overview: (res.executiveSummary as string) || (res.overview as string) || '',
    healthScore: (res.healthScore as ExecutiveSummary['healthScore']) || 'Green',
    healthReasoning: (res.healthReasoning as string) || '',
    nextActions: (res.top3NextActions as string[]) || (res.nextActions as string[]) || [],
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
    smartObjectives: (res.smartObjectives as string[]) || [],
    stakeholderRegister: (res.stakeholderRegister as StakeholderEntry[]) || [],
    successCriteria: (res.successCriteria as string[]) || [],
    governanceStructure: (res.governanceStructure as ProjectLifecycle["initiation"]["governanceStructure"]) || {
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
  return (res.phases as ProjectPhase[]) || [];
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
      "startDate": "string (YYYY-MM-DD)",
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
    items: (res.wbs as WBSItem[]) || [],
    criticalPath: (res.criticalPath as string[]) || [],
    totalDuration: (res.totalDuration as string) || '',
    totalEffort: (res.totalEffort as string) || ''
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
    resources: (res.resources as ResourceEntry[]) || [],
    costs: {
      breakdown: (res.costBreakdown as CostEntry[]) || [],
      totalBudget: (res.totalBudget as number) || 0,
      budgetPhasing: (res.budgetPhasing as string) || '',
      procurementPlan: (res.procurementPlan as string) || ''
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
      register: (res.risks as RiskEntry[]) || [],
      top3CriticalRisks: (res.top3CriticalRisks as string[]) || [],
      immediateActions: (res.immediateActions as string[]) || []
    },
    quality: {
      standards: (res.qualityStandards as string[]) || [],
      checkpoints: (res.qualityCheckpoints as QualityCheckpoint[]) || [],
      defectTolerance: (res.defectTolerance as string) || '',
      testingApproach: (res.testingApproach as string) || ''
    }
  };
}

export async function generateFullLifecycle(charter: ProjectCharter): Promise<ProjectLifecycle> {
  const methodology = await decideMethodology(charter);

  const [phases, risksAndQuality] = await Promise.all([
    generatePhases(charter, methodology.methodology),
    generateRisksAndQuality(charter)
  ]);

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
