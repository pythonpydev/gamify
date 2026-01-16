import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/debug/auth
 *
 * Debug endpoint to check authentication status
 * This should be removed in production
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    return NextResponse.json({
      authenticated: !!user,
      userId: user?.id || null,
      email: user?.email || null,
      error: error?.message || null,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({
      authenticated: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}
