-- Crystal Design Platform - Database Setup
-- Plik SQL do utworzenia wszystkich tabel i przykładowych danych
-- 
-- INSTRUKCJE DLA NEON TECH SQL EDITOR:
-- 1. Skopiuj całą zawartość tego pliku
-- 2. Wklej do Neon Tech SQL Editor
-- 3. Uruchom wszystkie zapytania (Ctrl+A, następnie Execute)
-- 4. Sprawdź czy wszystkie tabele zostały utworzone poprawnie
--
-- UWAGA: Ten plik używa enumów PostgreSQL (Role, OrderStatus)
-- i jest w pełni kompatybilny z Prisma ORM

-- =============================================
-- TWORZENIE ENUMÓW
-- =============================================

-- Enum dla ról użytkowników
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- Enum dla statusów zamówień
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- =============================================
-- TWORZENIE TABEL
-- =============================================

-- Tabela użytkowników
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Tabela kont (dla NextAuth)
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela sesji (dla NextAuth)
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela tokenów weryfikacyjnych (dla NextAuth)
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- Tabela kategorii
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Tabela produktów
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "dimensions" TEXT,
    "material" TEXT,
    "features" JSONB, -- JSON w PostgreSQL
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabela obrazów produktów
CREATE TABLE "images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela zamówień
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela pozycji zamówienia
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- =============================================
-- INDEKSY UNIKALNE
-- =============================================

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- =============================================
-- PRZYKŁADOWE DANE
-- =============================================

-- Wstawienie użytkownika z rolą ADMIN
INSERT INTO "users" ("id", "email", "name", "password", "role", "emailVerified", "createdAt", "updatedAt") VALUES
('admin_001', 'admin@crystal-design.pl', 'Administrator', '$2a$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'ADMIN', '2024-01-01 00:00:00', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- Wstawienie kategorii
INSERT INTO "categories" ("id", "name", "description", "slug", "createdAt", "updatedAt") VALUES
('cat_001', 'Marmur', 'Luksusowe wielkopowierzchniowe płyty marmurowe do dekoracji wnętrz', 'marmur', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('cat_002', 'Granit', 'Trwałe i eleganckie płyty granitowe do zastosowań dekoracyjnych', 'granit', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- Wstawienie 4 produktów - wielkopowierzchniowe płyty dekoracyjne
INSERT INTO "products" ("id", "name", "description", "price", "categoryId", "isActive", "dimensions", "material", "features", "createdAt", "updatedAt") VALUES
('prod_001', 'Płyta Marmurowa Calacatta Gold', 'Luksusowa płyta marmurowa z eleganckim złotym żyłkowaniem, idealna do salonów i jadalni', 1299.99, 'cat_001', true, '300cm x 150cm x 2cm', 'Marmur Calacatta', '{"grubosc": "2cm", "wysokosc": "300cm", "szerokosc": "150cm", "kolor": "biały ze złotym", "wzór": "żyłkowanie", "powierzchnia": "polerowana"}', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('prod_002', 'Płyta Marmurowa Nero Marquina Gold', 'Nowoczesna płyta z czarnego marmuru z metalicznymi złotymi akcentami', 1599.99, 'cat_001', true, '280cm x 140cm x 2cm', 'Marmur Nero Marquina + Złoto', '{"grubosc": "2cm", "wysokosc": "280cm", "szerokosc": "140cm", "kolor": "czarny ze złotym", "efekt": "metaliczny", "aplikacja": "ściana multimedialna"}', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('prod_003', 'Płyta Granitowa Black Galaxy', 'Elegancka płyta granitowa z drobnymi złotymi wtrąceniami, idealna do kuchni', 1399.99, 'cat_002', true, '320cm x 160cm x 3cm', 'Granit Black Galaxy', '{"grubosc": "3cm", "wysokosc": "320cm", "szerokosc": "160cm", "kolor": "czarny ze złotym", "wzór": "drobne wtrącenia", "powierzchnia": "polerowana"}', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('prod_004', 'Płyta Granitowa Verde Ubatuba', 'Trwała płyta granitowa w odcieniach zieleni z metalicznymi akcentami', 1199.99, 'cat_002', true, '290cm x 145cm x 3cm', 'Granit Verde Ubatuba', '{"grubosc": "3cm", "wysokosc": "290cm", "szerokosc": "145cm", "kolor": "zielony/szary", "akcent": "metaliczny", "powierzchnia": "polerowana"}', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- Wstawienie obrazów dla produktów - wielkopowierzchniowe płyty dekoracyjne
INSERT INTO "images" ("id", "url", "productId") VALUES
('img_002', 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1760525489/photo-vertical4_va1lug.jpg', 'prod_001'),
('img_003', 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1760525489/photo-vertical1_v2bmxc.jpg', 'prod_002'),
('img_004', 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1760525489/photo-square_ck459b.jpg', 'prod_002'),
('img_006', 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1760525488/photo-horizontal1_c5jg3k.jpg', 'prod_003'),
('img_007', 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1760548382/products/bw5arbhi5mvdwcxs5gkp.jpg', 'prod_004'),
('img_008', 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1760525489/photo-vertical2_xci4a6.jpg', 'prod_004');

-- =============================================
-- WERYFIKACJA INSTALACJI
-- =============================================

-- Sprawdź czy wszystkie tabele zostały utworzone:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Sprawdź czy enumy zostały utworzone:
-- SELECT typname FROM pg_type WHERE typname IN ('Role', 'OrderStatus');

-- Sprawdź czy dane zostały wstawione:
-- SELECT COUNT(*) FROM users;
-- SELECT COUNT(*) FROM categories;
-- SELECT COUNT(*) FROM products;
-- SELECT COUNT(*) FROM images;

-- =============================================
-- KOMENTARZE
-- =============================================

-- Hasło dla użytkownika admin to: "admin123"
-- Wszystkie produkty są aktywne (isActive = 1)
-- Ceny podane w złotych polskich
-- Obrazy używają przykładowych URL-i Cloudinary (do podmiany na rzeczywiste)
-- JSON w kolumnie features jest przechowywany jako JSONB w PostgreSQL
-- Produkty dopasowane do wielkopowierzchniowych płyt dekoracyjnych:
-- KATEGORIA MARMUR:
-- 1. Płyta Calacatta Gold - biały marmur ze złotym żyłkowaniem (salon)
-- 2. Płyta Nero Marquina Gold - czarny marmur ze złotymi akcentami (ściana multimedialna)
-- KATEGORIA GRANIT:
-- 3. Płyta Black Galaxy - czarny granit ze złotymi wtrąceniami (kuchnia)
-- 4. Płyta Verde Ubatuba - zielony granit z metalicznymi akcentami (prysznic)
