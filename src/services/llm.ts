import OpenAI from 'openai';
import { llmConfig } from '../config/llmConfig';

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    return null;
  }
  return new OpenAI({ apiKey });
};


export async function callLLM(prompt: string, systemMessage: string = "You are a senior project management consultant.") {
  try {
    // If provider is explicitly set to mock, or if we're in development without keys
    if (llmConfig.provider === 'mock') {
      console.info('Using mock LLM provider as configured.');
      return mockLLMResponse(prompt);
    }

    if (llmConfig.provider === 'openai') {
      const openai = getOpenAIClient();
      if (!openai) {
        console.warn('OpenAI API key is not set. Falling back to mock data.');
        return mockLLMResponse(prompt);
      }

      const response = await openai.chat.completions.create({
        model: llmConfig.model,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: llmConfig.temperature,
        max_tokens: llmConfig.maxTokens,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    }

    if (llmConfig.provider === 'anthropic') {
      // This is a placeholder for Anthropic implementation
      console.warn('Anthropic provider selected but not fully implemented. Falling back to mock.');
      return mockLLMResponse(prompt);
    }

    throw new Error(`Unsupported LLM provider: ${llmConfig.provider}`);
  } catch (error) {
    console.error('Error calling LLM:', error);
    throw new Error('Failed to communicate with LLM service');
  }
}

function mockLLMResponse(prompt: string) {
  const p = prompt.toLowerCase();
  // Simple mock logic for development when API key is missing
  if (p.includes("initiation")) {
    return {
      stakeholders: ['Project Sponsor', 'Team Lead', 'Customer Representative'],
      objectives: ['Complete MVP', 'Verify Security', 'User Acceptance Testing'],
      successCriteria: ['All tests pass', 'No P1 bugs', 'Positive customer feedback']
    };
  }
  if (p.includes("planning") || p.includes("wbs")) {
    return {
      stages: [
        { name: 'Sprint 1', description: 'Setup and MVP', deliverables: ['Initial Draft'] },
        { name: 'Sprint 2', description: 'Feedback loop', deliverables: ['Refined Draft'] }
      ],
      resources: [{ role: 'Project Manager', count: 1 }, { role: 'Developer', count: 2 }],
      expenses: [{ category: 'Software', description: 'SaaS licenses', estimatedCost: 500 }],
      timeline: '4 weeks',
      wbs: [
        { id: '1', task: 'Requirement Analysis', duration: '1 week', dependencies: [] },
        { id: '2', task: 'System Design', duration: '1 week', dependencies: ['1'] }
      ]
    };
  }
  if (p.includes("risks") || p.includes("logs")) {
    return {
      risks: [{ id: '1', risk: 'Budget Overrun', impact: 'High', probability: 'Medium', mitigation: 'Strict monitoring' }],
      issues: [{ id: '1', issue: 'Dependency Latency', severity: 'Medium', status: 'Open' }]
    };
  }
  if (p.includes("methodology")) {
    return { methodology: 'Agile', reasoning: 'Mocked reasoning for Agile.' };
  }
  return {
    mocked: true,
    message: "This is a mocked response because no API key was provided or provider was set to mock.",
  };
}
