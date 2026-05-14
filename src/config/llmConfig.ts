export type LLMProvider = 'openai' | 'anthropic' | 'mock';

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  temperature: number;
  maxTokens?: number;
}

export const llmConfig: LLMConfig = {
  // Change 'openai' to 'mock' if you don't have an API key and want to use built-in mock data
  // Or change to 'anthropic' if you want to use Claude (requires implementation in llm.ts)
  provider: (process.env.LLM_PROVIDER as LLMProvider) || 'openai',

  // Model selection
  // For OpenAI: 'gpt-4-turbo-preview', 'gpt-4o', 'gpt-3.5-turbo'
  // For Anthropic: 'claude-3-opus-20240229', 'claude-3-sonnet-20240229'
  model: process.env.LLM_MODEL || 'gpt-4-turbo-preview',

  temperature: 0.2,
  maxTokens: 4000,
};
