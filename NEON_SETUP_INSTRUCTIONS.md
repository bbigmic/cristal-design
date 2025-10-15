# Instrukcje konfiguracji bazy danych w Neon Tech

## Problem
Błąd: `type "public.Role" does not exist` - oznacza, że enum `Role` nie został utworzony w bazie danych PostgreSQL.

## Rozwiązanie przez Neon Tech SQL Editor

### Krok 1: Przygotowanie
1. Otwórz Neon Tech Console
2. Przejdź do swojej bazy danych
3. Otwórz SQL Editor

### Krok 2: Wykonanie skryptu
1. Skopiuj całą zawartość pliku `database_setup.sql`
2. Wklej do Neon Tech SQL Editor
3. Uruchom wszystkie zapytania (Ctrl+A, następnie Execute)

### Krok 3: Weryfikacja
Po wykonaniu skryptu sprawdź czy wszystko działa:

```sql
-- Sprawdź czy enumy zostały utworzone
SELECT typname FROM pg_type WHERE typname IN ('Role', 'OrderStatus');

-- Sprawdź czy tabele zostały utworzone
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Sprawdź czy dane zostały wstawione
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM products;
```

### Krok 4: Aktualizacja DATABASE_URL
Upewnij się, że w pliku `.env` masz poprawny URL do bazy danych Neon:

```env
DATABASE_URL="postgresql://username:password@hostname:port/database_name?sslmode=require"
```

### Krok 5: Test aplikacji
Po skonfigurowaniu bazy danych:
1. Uruchom `npm run dev`
2. Spróbuj zarejestrować nowego użytkownika
3. Sprawdź czy błąd zniknął

## Główne zmiany w pliku SQL

1. **Dodano enumy PostgreSQL:**
   ```sql
   CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
   CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
   ```

2. **Poprawiono typy danych:**
   - `role` używa teraz enum `Role` zamiast `TEXT`
   - `status` używa teraz enum `OrderStatus` zamiast `TEXT`
   - `TIMESTAMP` zmieniono na `TIMESTAMP(3)` dla lepszej precyzji
   - `DECIMAL` zmieniono na `DOUBLE PRECISION` zgodnie z Prisma

3. **Dodano indeksy unikalne** wymagane przez Prisma

4. **Dodano instrukcje weryfikacji** na końcu pliku

## Alternatywne rozwiązanie (lokalnie)

Jeśli chcesz używać lokalnej bazy PostgreSQL:

```bash
# Uruchom PostgreSQL
brew services start postgresql

# Zastosuj migracje Prisma
npx prisma migrate deploy

# Wygeneruj klienta Prisma
npx prisma generate
```

## Kontakt
W przypadku problemów sprawdź logi aplikacji i upewnij się, że wszystkie tabele zostały utworzone poprawnie.
