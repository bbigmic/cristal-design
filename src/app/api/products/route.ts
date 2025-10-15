import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1, 'Nazwa produktu jest wymagana'),
  description: z.string().optional(),
  price: z.number().min(0, 'Cena musi być większa lub równa 0'),
  categoryId: z.string().min(1, 'Kategoria jest wymagana'),
  isActive: z.boolean().default(true),
  dimensions: z.string().optional(),
  material: z.string().optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

// GET /api/products - Pobierz wszystkie produkty
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const isActive = searchParams.get('isActive');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: {
      categoryId?: string;
      isActive?: boolean;
    } = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Utwórz nowy produkt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Sprawdź czy kategoria istnieje
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Kategoria nie została znaleziona' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        categoryId: validatedData.categoryId,
        isActive: validatedData.isActive,
        dimensions: validatedData.dimensions,
        material: validatedData.material,
        features: validatedData.features,
        images: {
          create: validatedData.images?.map((url) => ({ url })) || [],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
