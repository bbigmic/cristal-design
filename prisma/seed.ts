import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Rozpoczynam seedowanie bazy danych...');

  // Tworzenie użytkowników
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cristaldesign.pl' },
    update: {},
    create: {
      email: 'admin@cristaldesign.pl',
      name: 'Administrator',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'jan.kowalski@example.com' },
    update: {},
    create: {
      email: 'jan.kowalski@example.com',
      name: 'Jan Kowalski',
      password: hashedPassword,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'anna.nowak@example.com' },
    update: {},
    create: {
      email: 'anna.nowak@example.com',
      name: 'Anna Nowak',
      password: hashedPassword,
      role: 'USER',
    },
  });

  console.log('✅ Użytkownicy utworzeni');

  // Tworzenie kategorii
  const categories = [
    { name: 'Marmur', slug: 'marmur', description: 'Luksusowe wielkopowierzchniowe płyty marmurowe do dekoracji wnętrz' },
    { name: 'Granit', slug: 'granit', description: 'Trwałe i eleganckie płyty granitowe do zastosowań dekoracyjnych' },
  ];

  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    });
  }

  console.log('✅ Kategorie utworzone');

  // Pobierz kategorie do mapowania
  const categoryMap = new Map();
  const allCategories = await prisma.category.findMany();
  allCategories.forEach(cat => {
    categoryMap.set(cat.name, cat.id);
  });

  // Tworzenie produktów - wielkopowierzchniowe płyty dekoracyjne
  const products = [
    {
      name: 'Płyta Marmurowa Calacatta Gold',
      description: 'Luksusowa płyta marmurowa z eleganckim złotym żyłkowaniem, idealna do salonów i jadalni',
      price: 1299.99,
      category: 'Marmur',
      dimensions: '300cm x 150cm x 2cm',
      material: 'Marmur Calacatta',
      features: ['Grubość: 2cm', 'Wysokość: 300cm', 'Szerokość: 150cm', 'Kolor: biały ze złotym', 'Wzór: żyłkowanie', 'Powierzchnia: polerowana'],
      images: [
        'https://res.cloudinary.com/dd0dqviwc/image/upload/v1760525489/photo-vertical4_va1lug.jpg'
      ],
      isActive: true,
    },
    {
      name: 'Płyta Marmurowa Nero Marquina Gold',
      description: 'Nowoczesna płyta z czarnego marmuru z metalicznymi złotymi akcentami',
      price: 1599.99,
      category: 'Marmur',
      dimensions: '280cm x 140cm x 2cm',
      material: 'Marmur Nero Marquina + Złoto',
      features: ['Grubość: 2cm', 'Wysokość: 280cm', 'Szerokość: 140cm', 'Kolor: czarny ze złotym', 'Efekt: metaliczny', 'Aplikacja: ściana multimedialna'],
      images: [
        'https://res.cloudinary.com/dd0dqviwc/image/upload/v1760525489/photo-vertical1_v2bmxc.jpg',
        'https://res.cloudinary.com/dd0dqviwc/image/upload/v1760525489/photo-square_ck459b.jpg'
      ],
      isActive: true,
    },
    {
      name: 'Płyta Granitowa Black Galaxy',
      description: 'Elegancka płyta granitowa z drobnymi złotymi wtrąceniami, idealna do kuchni',
      price: 1399.99,
      category: 'Granit',
      dimensions: '320cm x 160cm x 3cm',
      material: 'Granit Black Galaxy',
      features: ['Grubość: 3cm', 'Wysokość: 320cm', 'Szerokość: 160cm', 'Kolor: czarny ze złotym', 'Wzór: drobne wtrącenia', 'Powierzchnia: polerowana'],
      images: [
        'https://res.cloudinary.com/dd0dqviwc/image/upload/v1760525488/photo-horizontal1_c5jg3k.jpg'
      ],
      isActive: true,
    },
    {
      name: 'Płyta Granitowa Verde Ubatuba',
      description: 'Trwała płyta granitowa w odcieniach zieleni z metalicznymi akcentami',
      price: 1199.99,
      category: 'Granit',
      dimensions: '290cm x 145cm x 3cm',
      material: 'Granit Verde Ubatuba',
      features: ['Grubość: 3cm', 'Wysokość: 290cm', 'Szerokość: 145cm', 'Kolor: zielony/szary', 'Akcent: metaliczny', 'Powierzchnia: polerowana'],
      images: [
        'https://res.cloudinary.com/dd0dqviwc/image/upload/v1760548382/products/bw5arbhi5mvdwcxs5gkp.jpg',
        'https://res.cloudinary.com/dd0dqviwc/image/upload/v1760525489/photo-vertical2_xci4a6.jpg'
      ],
      isActive: true,
    },
  ];

  for (const productData of products) {
    const { category, images, ...productWithoutCategory } = productData;
    const categoryId = categoryMap.get(category);
    
    if (categoryId) {
      await prisma.product.create({
        data: {
          ...productWithoutCategory,
          category: {
            connect: { id: categoryId }
          },
          images: {
            create: images.map(url => ({ url }))
          },
        },
      });
    }
  }

  console.log('✅ Produkty utworzone');

  // Tworzenie zamówień
  const product1 = await prisma.product.findFirst({ where: { name: 'Płyta Marmurowa Calacatta Gold' } });
  const product2 = await prisma.product.findFirst({ where: { name: 'Płyta Marmurowa Nero Marquina Gold' } });
  const product3 = await prisma.product.findFirst({ where: { name: 'Płyta Granitowa Black Galaxy' } });

  if (product1 && product2 && product3) {
    // Zamówienie 1
    const order1 = await prisma.order.create({
      data: {
        userId: user1.id,
        status: 'CONFIRMED',
        totalAmount: 2899.98,
        shippingAddress: 'ul. Przykładowa 123, 00-000 Warszawa',
        notes: 'Proszę o kontakt telefoniczny przed dostawą',
      },
    });

    await prisma.orderItem.createMany({
      data: [
        {
          orderId: order1.id,
          productId: product1.id,
          quantity: 2,
          price: product1.price,
        },
        {
          orderId: order1.id,
          productId: product2.id,
          quantity: 1,
          price: product2.price,
        },
      ],
    });

    // Zamówienie 2
    const order2 = await prisma.order.create({
      data: {
        userId: user2.id,
        status: 'DELIVERED',
        totalAmount: 1599.99,
        shippingAddress: 'ul. Testowa 456, 30-000 Kraków',
        notes: '',
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order2.id,
        productId: product2.id,
        quantity: 1,
        price: product2.price,
      },
    });

    // Zamówienie 3
    const order3 = await prisma.order.create({
      data: {
        userId: user1.id,
        status: 'PENDING',
        totalAmount: 1399.99,
        shippingAddress: 'ul. Główna 789, 80-000 Gdańsk',
        notes: 'Klient prosi o szybką realizację',
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order3.id,
        productId: product3.id,
        quantity: 1,
        price: product3.price,
      },
    });

    console.log('✅ Zamówienia utworzone');
  }

  console.log('🎉 Seedowanie zakończone pomyślnie!');
}

main()
  .catch((e) => {
    console.error('❌ Błąd podczas seedowania:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
