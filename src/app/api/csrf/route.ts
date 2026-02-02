import { NextResponse } from 'next/server';
import { getClientCsrfToken } from '@/lib/utils/csrf';

/**
 * GET /api/csrf - Get CSRF token for client-side use
 */
export async function GET() {
  try {
    const token = await getClientCsrfToken();
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
