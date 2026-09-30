// src/lib/openai.ts - VERSÃO ECONÔMICA OTIMIZADA
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const OPENAI_CONFIG = {
  // Modelos disponíveis para Tier 1:
  model: 'gpt-3.5-turbo',        // ✅ Mantido (trocar para 'gpt-4o-mini' depois)
  // model: 'gpt-4o-mini',       // ✅ Novo, mais barato e obedece melhor o prompt
  // model: 'gpt-4-turbo',       // ❌ SÓ TIER 3+
  // model: 'gpt-4',             // ❌ SÓ TIER 3+

  temperature: 0.8,              // ✅ Mais natural para conversação (era 0.7)
  maxTokens: 200,                // ✅ Respostas curtas = mais rápido (era 1000)
  speechModel: 'tts-1',
  voice: 'nova',
  audioFormat: 'mp3',
} as const;