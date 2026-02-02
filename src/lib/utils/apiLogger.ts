/**
 * API request logging utility for security monitoring
 */

export interface LogEntry {
  timestamp: string;
  method: string;
  path: string;
  userId?: string;
  ip: string;
  userAgent: string;
  statusCode?: number;
  duration?: number;
  error?: string;
  rateLimited?: boolean;
}

/**
 * Log API request
 */
export function logRequest(entry: LogEntry): void {
  const logLine = JSON.stringify({
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString(),
  });
  
  // In production, this would go to a proper logging service
  // For now, using console with structured logging
  if (entry.error || entry.rateLimited || (entry.statusCode && entry.statusCode >= 400)) {
    console.error('[API_SECURITY]', logLine);
  } else {
    console.log('[API_REQUEST]', logLine);
  }
}

/**
 * Extract request metadata for logging
 */
export function getRequestMetadata(request: Request): {
  ip: string;
  userAgent: string;
  method: string;
  path: string;
} {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const url = new URL(request.url);
  
  return {
    ip,
    userAgent,
    method: request.method,
    path: url.pathname,
  };
}

/**
 * Log security event (failed auth, rate limit, etc.)
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, unknown>,
  request?: Request
): void {
  const metadata = request ? getRequestMetadata(request) : {};
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ...details,
    ...metadata,
  };
  
  console.warn('[SECURITY_EVENT]', JSON.stringify(logEntry));
}

/**
 * Detect suspicious patterns in requests
 */
export function detectSuspiciousActivity(
  request: Request,
  body?: unknown
): { suspicious: boolean; reason?: string } {
  const url = new URL(request.url);
  const path = url.pathname;
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check for SQL injection attempts in query params
  const queryString = url.search.toLowerCase();
  const sqlPatterns = /(\bunion\b|\bselect\b|\binsert\b|\bdelete\b|\bdrop\b|\b--|\b;)/;
  if (sqlPatterns.test(queryString)) {
    return { suspicious: true, reason: 'SQL injection pattern in query' };
  }
  
  // Check for path traversal attempts
  if (path.includes('..') || path.includes('%2e%2e')) {
    return { suspicious: true, reason: 'Path traversal attempt' };
  }
  
  // Check for missing or suspicious user agent
  if (!userAgent || userAgent.length < 10) {
    return { suspicious: true, reason: 'Suspicious user agent' };
  }
  
  // Check for XSS patterns in body
  if (body && typeof body === 'object') {
    const bodyStr = JSON.stringify(body).toLowerCase();
    const xssPatterns = /<script|javascript:|onerror=|onload=/;
    if (xssPatterns.test(bodyStr)) {
      return { suspicious: true, reason: 'XSS pattern in request body' };
    }
  }
  
  return { suspicious: false };
}
