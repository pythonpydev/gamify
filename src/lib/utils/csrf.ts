/**
 * CSRF protection utility
 */

import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const CSRF_TOKEN_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Generate a random CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Set CSRF token in cookie
 */
export async function setCsrfToken(): Promise<string> {
  const token = generateCsrfToken();
  const cookieStore = await cookies();
  
  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
  
  return token;
}

/**
 * Get CSRF token from cookies
 */
export async function getCsrfToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_TOKEN_NAME)?.value;
}

/**
 * Verify CSRF token from request
 */
export async function verifyCsrfToken(request: NextRequest): Promise<boolean> {
  // Skip CSRF check for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true;
  }
  
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get(CSRF_TOKEN_NAME)?.value;
  const tokenFromHeader = request.headers.get(CSRF_HEADER_NAME);
  
  if (!tokenFromCookie || !tokenFromHeader) {
    return false;
  }
  
  return tokenFromCookie === tokenFromHeader;
}

/**
 * Get CSRF token for client-side use
 * This should be called from a GET endpoint to provide token to client
 */
export async function getClientCsrfToken(): Promise<string> {
  let token = await getCsrfToken();
  
  if (!token) {
    token = await setCsrfToken();
  }
  
  return token;
}
