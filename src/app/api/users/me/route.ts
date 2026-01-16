import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db/prisma';
import { syncUserToDatabase } from '@/lib/utils/syncUser';

/**
 * GET /api/users/me
 *
 * Returns the current authenticated user's profile data.
 * Auto-creates the database user if they don't exist (syncs from Supabase Auth).
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { authId: authUser.id },
      select: {
        id: true,
        email: true,
        displayName: true,
        currentChips: true,
        totalChipsEarned: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // If user doesn't exist in database, sync them from Supabase Auth
    if (!user) {
      try {
        const syncedUser = await syncUserToDatabase(authUser);
        user = {
          id: syncedUser.id,
          email: syncedUser.email,
          displayName: syncedUser.displayName,
          currentChips: syncedUser.currentChips,
          totalChipsEarned: syncedUser.totalChipsEarned,
          createdAt: syncedUser.createdAt,
          updatedAt: syncedUser.updatedAt,
        };
      } catch (syncError) {
        console.error('Failed to sync user to database:', syncError);
        return NextResponse.json(
          { error: 'Failed to create user in database' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/me
 *
 * Updates the current authenticated user's profile data
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { authId: authUser.id },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { displayName } = body;

    // Build update data
    const updateData: { displayName?: string } = {};

    if (displayName !== undefined) {
      if (displayName !== null && typeof displayName !== 'string') {
        return NextResponse.json(
          { error: 'Display name must be a string' },
          { status: 400 }
        );
      }

      if (displayName && displayName.length > 50) {
        return NextResponse.json(
          { error: 'Display name must be 50 characters or less' },
          { status: 400 }
        );
      }

      updateData.displayName = displayName?.trim() || null;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        displayName: true,
        currentChips: true,
        totalChipsEarned: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
