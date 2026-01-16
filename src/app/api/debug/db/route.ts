import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/debug/db
 *
 * Debug endpoint to check database connection and user sync status
 * This should be removed in production
 */
export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
  };

  try {
    // Check Supabase auth
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    results.auth = {
      authenticated: !!authUser,
      userId: authUser?.id || null,
      email: authUser?.email || null,
      error: authError?.message || null,
    };

    if (!authUser) {
      return NextResponse.json(results);
    }

    // Check database connection
    try {
      const dbUser = await prisma.user.findUnique({
        where: { authId: authUser.id },
        select: { 
          id: true, 
          email: true, 
          displayName: true,
          currentChips: true,
        },
      });

      results.database = {
        connected: true,
        userExists: !!dbUser,
        user: dbUser,
      };

      if (dbUser) {
        // Check categories
        const categories = await prisma.category.findMany({
          where: { userId: dbUser.id },
          select: { id: true, name: true },
        });

        results.categories = {
          count: categories.length,
          items: categories,
        };
      }
    } catch (dbError) {
      results.database = {
        connected: false,
        error: dbError instanceof Error ? dbError.message : 'Unknown database error',
      };
    }

    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({
      ...results,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
