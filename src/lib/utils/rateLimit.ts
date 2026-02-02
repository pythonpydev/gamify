/**
 * Rate limiting utility
 * Implements a simple in-memory rate limiter for API routes
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.storage.forEach((entry, key) => {
      if (entry.resetTime < now) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.storage.delete(key));
  }

  check(identifier: string, limit: number, windowMs: number): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const entry = this.storage.get(identifier);

    // No entry or expired entry
    if (!entry || entry.resetTime < now) {
      const resetTime = now + windowMs;
      this.storage.set(identifier, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime,
      };
    }

    // Entry exists and not expired
    if (entry.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment count
    entry.count++;
    this.storage.set(identifier, entry);

    return {
      allowed: true,
      remaining: limit - entry.count,
      resetTime: entry.resetTime,
    };
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.storage.clear();
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Authentication endpoints - stricter limits
  AUTH: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  
  // Password reset - very strict
  PASSWORD_RESET: { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 requests per hour
  
  // API reads - generous limits
  API_READ: { limit: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  
  // API writes - moderate limits
  API_WRITE: { limit: 30, windowMs: 60 * 1000 }, // 30 requests per minute
  
  // Default fallback
  DEFAULT: { limit: 60, windowMs: 60 * 1000 }, // 60 requests per minute
} as const;

/**
 * Check rate limit for a given identifier and config
 */
export function checkRateLimit(
  identifier: string,
  config: { limit: number; windowMs: number } = RATE_LIMITS.DEFAULT
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
} {
  const result = rateLimiter.check(identifier, config.limit, config.windowMs);
  
  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    return { ...result, retryAfter };
  }
  
  return result;
}

/**
 * Get identifier for rate limiting (usually IP + endpoint)
 */
export function getRateLimitIdentifier(
  request: Request,
  endpoint: string
): string {
  // Try to get real IP from various headers (for production behind proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return `${ip}:${endpoint}`;
}

/**
 * Create rate limit headers for response
 */
export function getRateLimitHeaders(result: {
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  };
  
  if (result.retryAfter !== undefined) {
    headers['Retry-After'] = result.retryAfter.toString();
  }
  
  return headers;
}
