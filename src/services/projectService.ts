import { ProjectCharter, ProjectMethodology, ProjectLifecycle } from '@/types';
import { callLLM } from './llm';

function formatCharterForPrompt(charter: ProjectCharter): string {
  return JSON.stringify(charter, null, 2);
}

export async function decideMethodology(charter: ProjectCharter): Promise<ProjectMethodology> {
  const prompt = `
    Analyze the following project charter and decide whether an Agile, Waterfall, or Hybrid methodology is most suitable.
    Provide your answer in JSON format with a "methodology" field and a "reasoning" field.

    Project Charter:
    ${formatCharterForPrompt(charter)}
  `;

  const result = await callLLM(prompt, "You are an expert in PMI standards and Agile methodologies.");
  return result.methodology || 'Agile'; // Fallback to Agile
}

export async function generateInitiationChunk(charter: ProjectCharter) {
  const prompt = `
    Based on the project charter, extract and refine the initiation details:
    1. Key Stakeholders and their roles.
    2. High-level project objectives.
    3. Success criteria.

    Project Charter:
    ${formatCharterForPrompt(charter)}

    Return JSON format.
  `;
  return await callLLM(prompt);
}

export async function generatePlanningChunk(charter: ProjectCharter, methodology: ProjectMethodology) {
  const prompt = `
    Based on the ${methodology} methodology and the project charter, generate:
    1. A Work Breakdown Structure (WBS) or Backlog structure.
    2. Estimated timeline and stages.
    3. Resource requirements.
    4. Estimated expenses.

    Project Charter:
    ${formatCharterForPrompt(charter)}

    Return JSON format matching the ProjectLifecycle type structure.
  `;
  return await callLLM(prompt);
}

export async function generateLogsChunk(charter: ProjectCharter) {
  const prompt = `
    Identify potential risks and common issues for the following project:
    Project Charter:
    ${formatCharterForPrompt(charter)}

    Return a JSON object with "risks" (array of RiskLogEntry) and "issues" (array of IssueLogEntry).
  `;
  return await callLLM(prompt);
}

export async function generateFullLifecycle(charter: ProjectCharter): Promise<ProjectLifecycle> {
  const methodology = await decideMethodology(charter);

  // In a real app, these could be parallelized
  const planning = await generatePlanningChunk(charter, methodology);
  const logs = await generateLogsChunk(charter);
  const initiation = await generateInitiationChunk(charter);

  return {
    methodology,
    initiation: {
      stakeholders: initiation.stakeholders || [],
      objectives: initiation.objectives || [],
      successCriteria: initiation.successCriteria || [],
    },
    stages: planning.stages || [],
    resources: planning.resources || [],
    expenses: planning.expenses || [],
    timeline: planning.timeline || '',
    wbs: planning.wbs || [],
    risks: logs.risks || [],
    issues: logs.issues || [],
  };
}
