/**
 * Rate Limiter for API calls
 * Implements token bucket algorithm
 */

class RateLimiter {
  constructor(options = {}) {
    this.maxRequests = options.maxRequests || 100;
    this.windowMs = options.windowMs || 60000;
    this.requests = [];
    this.enabled = options.enabled !== false;
  }

  checkLimit() {
    if (!this.enabled) {
      return { allowed: true, remaining: Infinity, resetAt: Date.now() + this.windowMs };
    }

    const now = Date.now();
    const windowStart = now - this.windowMs;

    this.requests = this.requests.filter(timestamp => timestamp > windowStart);

    const remaining = this.maxRequests - this.requests.length;

    if (remaining <= 0) {
      const oldestRequest = this.requests[0];
      const resetAt = oldestRequest + this.windowMs;

      return {
        allowed: false,
        remaining: 0,
        resetAt,
        retryAfter: Math.ceil((resetAt - now) / 1000),
        message: `Rate limit exceeded. Retry after ${Math.ceil((resetAt - now) / 1000)} seconds`
      };
    }

    this.requests.push(now);

    return {
      allowed: true,
      remaining: remaining - 1,
      resetAt: now + this.windowMs
    };
  }

  reset() {
    this.requests = [];
  }

  getStatus() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const recentRequests = this.requests.filter(timestamp => timestamp > windowStart);

    return {
      enabled: this.enabled,
      maxRequests: this.maxRequests,
      windowMs: this.windowMs,
      currentRequests: recentRequests.length,
      remaining: Math.max(0, this.maxRequests - recentRequests.length),
      resetAt: now + this.windowMs
    };
  }
}

export function createRateLimiter(options) {
  return new RateLimiter(options);
}

export { RateLimiter };
