-- Crystal Design Platform - Database Setup
-- Plik SQL do utworzenia wszystkich tabel i przykładowych danych

-- =============================================
-- TWORZENIE TABEL
-- =============================================

-- Tabela użytkowników
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "emailVerified" DATETIME,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
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
    "expires" DATETIME NOT NULL,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela tokenów weryfikacyjnych (dla NextAuth)
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- Tabela kategorii
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Tabela produktów
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "dimensions" TEXT,
    "material" TEXT,
    "features" TEXT, -- JSON jako TEXT w SQLite
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
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
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalAmount" REAL NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela pozycji zamówienia
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- =============================================
-- INDEKSY
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
('prod_001', 'Płyta Marmurowa Calacatta Gold', 'Luksusowa płyta marmurowa z eleganckim złotym żyłkowaniem, idealna do salonów i jadalni', 1299.99, 'cat_001', 1, '300cm x 150cm x 2cm', 'Marmur Calacatta', '{"grubosc": "2cm", "wysokosc": "300cm", "szerokosc": "150cm", "kolor": "biały ze złotym", "wzór": "żyłkowanie", "powierzchnia": "polerowana"}', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('prod_002', 'Płyta Dekoracyjna Nero Marquina Gold', 'Nowoczesna płyta z czarnego marmuru z metalicznymi złotymi akcentami', 1599.99, 'cat_002', 1, '280cm x 140cm x 2cm', 'Marmur Nero Marquina + Złoto', '{"grubosc": "2cm", "wysokosc": "280cm", "szerokosc": "140cm", "kolor": "czarny ze złotym", "efekt": "metaliczny", "aplikacja": "ściana multimedialna"}', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('prod_003', 'Płyta Onyks z Kolorowym Żyłkowaniem', 'Wielkoformatowa płyta onyksowa z organicznymi wzorami w odcieniach turkusu i złota', 1899.99, 'cat_003', 1, '320cm x 160cm x 1.5cm', 'Onyks naturalny', '{"grubosc": "1.5cm", "wysokosc": "320cm", "szerokosc": "160cm", "kolor": "biały/turkus/złoty", "wzór": "organiczny", "przeznaczenie": "prysznic"}', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('prod_004', 'Płyta Marmurowa Carrara z Metalicznym Akcentem', 'Elegancka płyta marmurowa z subtelnym metalicznym żyłkowaniem', 1199.99, 'cat_004', 1, '290cm x 145cm x 2cm', 'Marmur Carrara + Metal', '{"grubosc": "2cm", "wysokosc": "290cm", "szerokosc": "145cm", "kolor": "biały/szary", "akcent": "metaliczny", "powierzchnia": "matowa"}', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- Wstawienie obrazów dla produktów - wielkopowierzchniowe płyty dekoracyjne
INSERT INTO "images" ("id", "url", "productId") VALUES
('img_001', 'https://res.cloudinary.com/your-cloud/image/upload/v1/products/plyta-calacatta-gold-1.jpg', 'prod_001'),
('img_002', 'https://res.cloudinary.com/your-cloud/image/upload/v1/products/plyta-calacatta-gold-2.jpg', 'prod_001'),
('img_003', 'https://res.cloudinary.com/your-cloud/image/upload/v1/products/plyta-nero-marquina-gold-1.jpg', 'prod_002'),
('img_004', 'https://res.cloudinary.com/your-cloud/image/upload/v1/products/plyta-nero-marquina-gold-2.jpg', 'prod_002'),
('img_005', 'https://res.cloudinary.com/your-cloud/image/upload/v1/products/plyta-onyks-kolorowa-1.jpg', 'prod_003'),
('img_006', 'https://res.cloudinary.com/your-cloud/image/upload/v1/products/plyta-onyks-kolorowa-2.jpg', 'prod_003'),
('img_007', 'https://res.cloudinary.com/your-cloud/image/upload/v1/products/plyta-carrara-metaliczna-1.jpg', 'prod_004'),
('img_008', 'https://res.cloudinary.com/your-cloud/image/upload/v1/products/plyta-carrara-metaliczna-2.jpg', 'prod_004');

-- =============================================
-- KOMENTARZE
-- =============================================

-- Hasło dla użytkownika admin to: "admin123"
-- Wszystkie produkty są aktywne (isActive = 1)
-- Ceny podane w złotych polskich
-- Obrazy używają przykładowych URL-i Cloudinary (do podmiany na rzeczywiste)
-- JSON w kolumnie features jest przechowywany jako TEXT w SQLite
-- Produkty dopasowane do wielkopowierzchniowych płyt dekoracyjnych:
-- 1. Płyta Calacatta Gold - biały marmur ze złotym żyłkowaniem (salon)
-- 2. Płyta Nero Marquina Gold - czarny marmur ze złotymi akcentami (ściana multimedialna)
-- 3. Płyta Onyks kolorowa - organiczne wzory w turkusie i złocie (prysznic)
-- 4. Płyta Carrara metaliczna - subtelne metaliczne żyłkowanie (kuchnia)
