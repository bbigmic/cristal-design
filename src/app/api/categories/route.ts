import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Nazwa kategorii jest wymagana'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug jest wymagany'),
});

// GET /api/categories - Pobierz wszystkie kategorie
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Utwórz nową kategorię
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);

    // Sprawdź czy kategoria o takim slug już istnieje
    const existingCategory = await prisma.category.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Kategoria o takim slug już istnieje' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: validatedData,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
