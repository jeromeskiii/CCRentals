/**
 * Model abstraction for multiple AI providers
 * Supports: OpenAI, Anthropic, MiniMax, Zhipu, Opencode, Fake
 */

import { createRateLimiter } from './rate_limiter.js';

// Global rate limiter instance
const rateLimiter = createRateLimiter({
  maxRequests: 100,
  windowMs: 60000,
  enabled: process.env.BLINK_RATE_LIMIT_ENABLED !== '0',
});

function ensureFetchAvailable() {
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available. Use Node 18+ or higher to run blink.');
  }
}

function checkRateLimit() {
  const status = rateLimiter.checkLimit();

  if (!status.allowed) {
    throw new Error(`Rate limit exceeded. ${status.message}`);
  }

  return status;
}

function getRateLimitStatus() {
  return rateLimiter.getStatus();
}

function createFakeModel() {
  const id = process.env.BLINK_MODEL || 'fake-echo';

  return {
    id,
    maxContextTokens: 2048,
    supportsTools: false,
    supportsJsonSchema: false,
    latencyProfile: {
      p50: 50,
      p95: 150,
    },
    async *complete({ prompt }) {
      const text = `Echo: ${prompt}`;
      const chunkSize = 16;

      for (let i = 0; i < text.length; i += chunkSize) {
        yield text.slice(i, i + chunkSize);
      }
    },
    getRateLimitStatus,
  };
}

function createOpenAIModelFromEnv() {
  ensureFetchAvailable();

  const apiKey = process.env.BLINK_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing BLINK_API_KEY or OPENAI_API_KEY for OpenAI provider.');
  }

  const modelId = process.env.BLINK_MODEL || 'gpt-4.1-mini';
  const baseUrl = process.env.BLINK_API_BASE || 'https://api.openai.com/v1/chat/completions';

  return {
    id: modelId,
    maxContextTokens: 128000,
    supportsTools: true,
    supportsJsonSchema: true,
    latencyProfile: {
      p50: 300,
      p95: 800,
    },
    async *complete({ prompt }) {
      checkRateLimit();

      const body = {
        model: modelId,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      };

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`OpenAI request failed with status ${response.status}: ${text}`);
      }

      const json = await response.json();
      const content =
        json &&
        json.choices &&
        json.choices[0] &&
        json.choices[0].message &&
        typeof json.choices[0].message.content === 'string'
          ? json.choices[0].message.content
          : '';

      const text = content || '';
      const chunkSize = 32;

      for (let i = 0; i < text.length; i += chunkSize) {
        yield text.slice(i, i + chunkSize);
      }
    },
    getRateLimitStatus,
  };
}

function createAnthropicModelFromEnv() {
  ensureFetchAvailable();

  const apiKey = process.env.BLINK_API_KEY || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('Missing BLINK_API_KEY or ANTHROPIC_API_KEY for Anthropic provider.');
  }

  const modelId = process.env.BLINK_MODEL || 'claude-3-5-sonnet-20241022';
  const baseUrl = process.env.BLINK_API_BASE || 'https://api.anthropic.com/v1/messages';

  return {
    id: modelId,
    maxContextTokens: 200000,
    supportsTools: true,
    supportsJsonSchema: true,
    latencyProfile: {
      p50: 500,
      p95: 1500,
    },
    async *complete({ prompt }) {
      checkRateLimit();

      const body = {
        model: modelId,
        max_tokens: 4096,
        system: 'You are a helpful assistant.',
        messages: [{ role: 'user', content: prompt }],
      };

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Anthropic request failed with status ${response.status}: ${text}`);
      }

      const json = await response.json();
      const content =
        json && json.content && json.content[0] && json.content[0].type === 'text'
          ? json.content[0].text
          : '';

      const text = content || '';
      const chunkSize = 32;

      for (let i = 0; i < text.length; i += chunkSize) {
        yield text.slice(i, i + chunkSize);
      }
    },
    getRateLimitStatus,
  };
}

function createMinimaxModelFromEnv() {
  ensureFetchAvailable();

  const apiKey = process.env.BLINK_API_KEY || process.env.MINIMAX_API_KEY;

  if (!apiKey) {
    throw new Error('Missing BLINK_API_KEY or MINIMAX_API_KEY for MiniMax provider.');
  }

  const modelId = process.env.BLINK_MODEL || 'MiniMax-M2.1';
  const baseUrl = process.env.BLINK_API_BASE || 'https://api.minimax.io/anthropic/v1/messages';

  return {
    id: modelId,
    maxContextTokens: 200000,
    supportsTools: true,
    supportsJsonSchema: true,
    latencyProfile: {
      p50: 400,
      p95: 1200,
    },
    async *complete({ prompt }) {
      checkRateLimit();

      const body = {
        model: modelId,
        max_tokens: 4096,
        system: 'You are a helpful assistant.',
        messages: [{ role: 'user', content: prompt }],
      };

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`MiniMax request failed with status ${response.status}: ${text}`);
      }

      const json = await response.json();
      const content =
        json && json.content && json.content[0] && json.content[0].type === 'text'
          ? json.content[0].text
          : '';

      const text = content || '';
      const chunkSize = 32;

      for (let i = 0; i < text.length; i += chunkSize) {
        yield text.slice(i, i + chunkSize);
      }
    },
    getRateLimitStatus,
  };
}

export function createModelFromEnv() {
  const provider = process.env.BLINK_PROVIDER || 'fake';

  if (provider === 'fake') {
    return createFakeModel();
  }

  if (provider === 'openai') {
    return createOpenAIModelFromEnv();
  }

  if (provider === 'anthropic') {
    return createAnthropicModelFromEnv();
  }

  if (provider === 'minimax') {
    return createMinimaxModelFromEnv();
  }

  throw new Error(
    `Unsupported BLINK_PROVIDER "${provider}". Supported providers: fake, openai, anthropic, minimax.`
  );
}
