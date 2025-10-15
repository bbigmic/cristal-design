import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { deleteImage, extractPublicId } from '@/lib/cloudinary';

const updateProductSchema = z.object({
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

// GET /api/products/[id] - Pobierz produkt po ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produkt nie został znaleziony' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Zaktualizuj produkt
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);

    // Sprawdź czy produkt istnieje
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produkt nie został znaleziony' },
        { status: 404 }
      );
    }

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

    // Usuń stare zdjęcia z Cloudinary
    const oldImageUrls = existingProduct.images.map(img => img.url);
    const newImageUrls = validatedData.images || [];
    const imagesToDelete = oldImageUrls.filter(url => !newImageUrls.includes(url));

    for (const imageUrl of imagesToDelete) {
      const publicId = extractPublicId(imageUrl);
      if (publicId) {
        try {
          await deleteImage(publicId);
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }
    }

    // Usuń stare zdjęcia z bazy danych
    await prisma.image.deleteMany({
      where: {
        productId: params.id,
        url: {
          in: imagesToDelete,
        },
      },
    });

    // Dodaj nowe zdjęcia do bazy danych
    const newImages = newImageUrls.filter(url => !oldImageUrls.includes(url));
    if (newImages.length > 0) {
      await prisma.image.createMany({
        data: newImages.map(url => ({
          url,
          productId: params.id,
        })),
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        categoryId: validatedData.categoryId,
        isActive: validatedData.isActive,
        dimensions: validatedData.dimensions,
        material: validatedData.material,
        features: validatedData.features,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Usuń produkt
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Sprawdź czy produkt istnieje
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produkt nie został znaleziony' },
        { status: 404 }
      );
    }

    // Usuń zdjęcia z Cloudinary
    for (const image of existingProduct.images) {
      const publicId = extractPublicId(image.url);
      if (publicId) {
        try {
          await deleteImage(publicId);
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }
    }

    // Usuń produkt z bazy danych (zdjęcia zostaną usunięte automatycznie przez cascade)
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Produkt został usunięty' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
