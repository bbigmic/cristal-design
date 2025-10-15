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

  // Tworzenie produktów
  const products = [
    {
      name: 'Płyta Marmurowa Bianco',
      description: 'Elegancka płyta w kolorze białym z subtelnymi żyłkami. Idealna do nowoczesnych aranżacji kuchennych i łazienkowych.',
      price: 450,
      category: 'Marmur',
      dimensions: '120x60 cm',
      material: 'Marmur',
      features: ['Wodoodporna', 'Ognioodporna', 'Łatwa w obróbce', 'Docinamy pod wymiar'],
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'],
      isActive: true,
    },
    {
      name: 'Płyta Granitowa Nero',
      description: 'Czarna płyta granitowa o wyjątkowej trwałości. Doskonała do eleganckich wnętrz.',
      price: 520,
      category: 'Granit',
      dimensions: '120x60 cm',
      material: 'Granit',
      features: ['Wodoodporna', 'Ognioodporna', 'Łatwa w obróbce', 'Docinamy pod wymiar'],
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'],
      isActive: true,
    },
    {
      name: 'Płyta Ceramiczna Modern',
      description: 'Nowoczesna płyta ceramiczna w stylu minimalistycznym. Idealna do współczesnych aranżacji.',
      price: 380,
      category: 'Ceramika',
      dimensions: '120x60 cm',
      material: 'Ceramika',
      features: ['Wodoodporna', 'Ognioodporna', 'Łatwa w obróbce', 'Docinamy pod wymiar'],
      images: ['https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'],
      isActive: true,
    },
    {
      name: 'Płyta Kwarcowa Lux',
      description: 'Luksusowa płyta kwarcowa o wyjątkowym połysku. Najwyższa jakość dla wymagających klientów.',
      price: 680,
      category: 'Kwarc',
      dimensions: '120x60 cm',
      material: 'Kwarc',
      features: ['Wodoodporna', 'Ognioodporna', 'Łatwa w obróbce', 'Docinamy pod wymiar'],
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'],
      isActive: true,
    },
    {
      name: 'Płyta Marmurowa Carrara',
      description: 'Klasyczna płyta marmurowa Carrara z charakterystycznymi żyłkami. Timeless design.',
      price: 580,
      category: 'Marmur',
      dimensions: '120x60 cm',
      material: 'Marmur',
      features: ['Wodoodporna', 'Ognioodporna', 'Łatwa w obróbce', 'Docinamy pod wymiar'],
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'],
      isActive: true,
    },
    {
      name: 'Płyta Granitowa Verde',
      description: 'Zielona płyta granitowa o naturalnym wyglądzie. Idealna do rustykalnych aranżacji.',
      price: 490,
      category: 'Granit',
      dimensions: '120x60 cm',
      material: 'Granit',
      features: ['Wodoodporna', 'Ognioodporna', 'Łatwa w obróbce', 'Docinamy pod wymiar'],
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'],
      isActive: false,
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { name: productData.name },
      update: {},
      create: productData,
    });
  }

  console.log('✅ Produkty utworzone');

  // Tworzenie zamówień
  const product1 = await prisma.product.findFirst({ where: { name: 'Płyta Marmurowa Bianco' } });
  const product2 = await prisma.product.findFirst({ where: { name: 'Płyta Granitowa Nero' } });
  const product3 = await prisma.product.findFirst({ where: { name: 'Płyta Ceramiczna Modern' } });

  if (product1 && product2 && product3) {
    // Zamówienie 1
    const order1 = await prisma.order.create({
      data: {
        userId: user1.id,
        status: 'CONFIRMED',
        totalAmount: 1100,
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
        totalAmount: 520,
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
        totalAmount: 380,
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
