import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateCategorySchema = z.object({
  name: z.string().min(1, 'Nazwa kategorii jest wymagana'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug jest wymagany'),
});

// GET /api/categories/[id] - Pobierz kategorię po ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        products: {
          include: {
            images: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Kategoria nie została znaleziona' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Zaktualizuj kategorię
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);

    // Sprawdź czy kategoria istnieje
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Kategoria nie została znaleziona' },
        { status: 404 }
      );
    }

    // Sprawdź czy slug nie jest używany przez inną kategorię
    const slugConflict = await prisma.category.findFirst({
      where: {
        slug: validatedData.slug,
        id: { not: params.id },
      },
    });

    if (slugConflict) {
      return NextResponse.json(
        { error: 'Kategoria o takim slug już istnieje' },
        { status: 400 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Usuń kategorię
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Sprawdź czy kategoria istnieje
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Kategoria nie została znaleziona' },
        { status: 404 }
      );
    }

    // Sprawdź czy kategoria ma produkty
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { error: 'Nie można usunąć kategorii, która ma przypisane produkty' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Kategoria została usunięta' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
