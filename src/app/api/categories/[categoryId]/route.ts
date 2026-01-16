import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db/prisma';

interface RouteParams {
  params: Promise<{ categoryId: string }>;
}

/**
 * GET /api/categories/[categoryId]
 *
 * Returns a specific category
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { categoryId } = await params;
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
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: user.id,
      },
      include: {
        _count: {
          select: { sessions: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      category: {
        id: category.id,
        name: category.name,
        color: category.color,
        isDefault: category.isDefault,
        sessionCount: category._count.sessions,
      },
    });
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/categories/[categoryId]
 *
 * Updates a specific category
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { categoryId } = await params;
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
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check category exists and belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: user.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, color } = body;

    // Build update data
    const updateData: { name?: string; color?: string } = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Category name cannot be empty' },
          { status: 400 }
        );
      }

      if (name.trim().length > 50) {
        return NextResponse.json(
          { error: 'Category name must be 50 characters or less' },
          { status: 400 }
        );
      }

      // Check for duplicate name (excluding current category)
      const existing = await prisma.category.findFirst({
        where: {
          userId: user.id,
          name: { equals: name.trim(), mode: 'insensitive' },
          id: { not: categoryId },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'A category with this name already exists' },
          { status: 400 }
        );
      }

      updateData.name = name.trim();
    }

    if (color !== undefined) {
      updateData.color = color;
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
    });

    return NextResponse.json({ category: updatedCategory });
  } catch (error) {
    console.error('Failed to update category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[categoryId]
 *
 * Deletes a specific category
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { categoryId } = await params;
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
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check category exists and belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: user.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if this is the user's only category
    const categoryCount = await prisma.category.count({
      where: { userId: user.id },
    });

    if (categoryCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete your only category. Create another category first.' },
        { status: 400 }
      );
    }

    // Get the default category to reassign sessions
    const defaultCategory = await prisma.category.findFirst({
      where: {
        userId: user.id,
        isDefault: true,
        id: { not: categoryId },
      },
    });

    // If no default, get any other category
    const fallbackCategory = defaultCategory || await prisma.category.findFirst({
      where: {
        userId: user.id,
        id: { not: categoryId },
      },
    });

    if (fallbackCategory) {
      // Reassign sessions to the fallback category
      await prisma.studySession.updateMany({
        where: { categoryId },
        data: { categoryId: fallbackCategory.id },
      });
    }

    // Delete the category
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
