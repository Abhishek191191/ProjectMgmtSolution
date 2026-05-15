// src/config/brain.config.ts
// ================================================================
// BRAIN CONFIGURATION — Edit this file to change the AI model.
// This is the only file you need to touch to switch AI providers.
// ================================================================

export type BrainProvider = 'openai' | 'anthropic' | 'local' | 'mock';

export const BRAIN = {
  // STEP 1: Choose your provider
  // 'openai'    → OpenAI API (GPT-4o, GPT-4-turbo, GPT-3.5-turbo)
  // 'anthropic' → Anthropic API (Claude models)
  // 'local'     → Any local model via Ollama, LM Studio, Jan.ai etc.
  // 'mock'      → No API needed. Uses built-in sample data.
  provider: (process.env.AI_PROVIDER as BrainProvider) || 'mock',

  // STEP 2: Set your API key (not needed for 'local' or 'mock')
  apiKey: process.env.AI_API_KEY || '',

  // STEP 3: Choose your model
  // OpenAI:    'gpt-4o' | 'gpt-4-turbo' | 'gpt-3.5-turbo'
  // Anthropic: 'claude-3-5-sonnet-20241022' | 'claude-3-opus-20240229'
  // Local:     'llama3' | 'mistral' | 'phi3' | 'gemma3' | 'deepseek-r1'
  //            (use whatever model name is running in your local server)
  model: process.env.AI_MODEL || 'gpt-4o',

  // STEP 4: Base URL — only needed for local models
  // Ollama default:    http://localhost:11434/v1
  // LM Studio default: http://localhost:1234/v1
  // Leave blank for OpenAI and Anthropic (they use their default URLs)
  baseURL: process.env.AI_BASE_URL || '',

  // Generation settings
  temperature: 0.2,
  maxTokens: 4000,

  // The AI's identity and expertise — edit this to change its persona
  systemPrompt: `You are an expert Senior Project Manager with 20+ years of experience
and PMP, PMI-ACP, and PRINCE2 certifications. You have delivered complex projects across
Technology, Healthcare, Finance, and Construction industries. You think and plan like a
real PM — comprehensive, structured, risk-aware, and business-focused. You follow PMI
PMBOK 7th Edition and Agile/Hybrid principles rigorously. When generating project plans,
be specific, detailed, and actionable — never vague or generic. All outputs must be
production-quality documents a real organization could act on immediately.
Always return valid JSON matching the requested schema exactly.`,
};
