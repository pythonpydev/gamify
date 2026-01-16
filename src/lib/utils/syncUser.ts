import { prisma } from '@/lib/db/prisma';
import type { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Syncs a Supabase Auth user to our Prisma database.
 *
 * This ensures we have a local User record for each authenticated user,
 * which is needed for relationships with sessions, categories, etc.
 *
 * @param supabaseUser - The Supabase auth user to sync
 * @returns The synced or created database user
 */
export async function syncUserToDatabase(supabaseUser: SupabaseUser) {
  const { id: authId, email } = supabaseUser;

  if (!email) {
    throw new Error('User must have an email address');
  }

  // Upsert the user - create if doesn't exist, update if does
  const user = await prisma.user.upsert({
    where: { authId },
    update: {
      email,
      updatedAt: new Date(),
    },
    create: {
      authId,
      email,
      currentChips: 0,
      totalChipsEarned: 0,
    },
  });

  // Create default categories for new users if they don't have any
  const existingCategories = await prisma.category.count({
    where: { userId: user.id },
  });

  if (existingCategories === 0) {
    await prisma.category.createMany({
      data: [
        { userId: user.id, name: 'General', color: '#6366f1', isDefault: true },
        { userId: user.id, name: 'Work', color: '#22c55e', isDefault: false },
        { userId: user.id, name: 'Study', color: '#3b82f6', isDefault: false },
        { userId: user.id, name: 'Personal', color: '#f59e0b', isDefault: false },
      ],
    });
  }

  return user;
}

/**
 * Gets a user from the database by Supabase auth ID.
 *
 * @param authId - The Supabase auth ID
 * @returns The user or null if not found
 */
export async function getUserFromDatabase(authId: string) {
  return prisma.user.findUnique({
    where: { authId },
    include: {
      categories: true,
    },
  });
}
