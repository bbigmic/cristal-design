# CRISTAL DESIGN - Platforma Sprzedaży Płyt Dekoracyjnych

Nowoczesna platforma e-commerce do sprzedaży wielkoformatowych płyt dekoracyjnych CRISTAL DESIGN. Aplikacja zawiera stronę główną z sekcjami emotions, logic, offer oraz kompletny panel administracyjny do zarządzania produktami, użytkownikami i zamówieniami.

## 🚀 Funkcjonalności

### Strona Główna
- **Sekcja Emotions**: Hero section z atrakcyjnym designem i zdjęciami
- **Sekcja Logic**: Prezentacja zalet produktów i korzyści
- **Sekcja Offer**: Katalog produktów z możliwością dodawania do koszyka
- **Sekcja Kontakt**: Formularz kontaktowy i dane firmy
- **Responsywny design** na wszystkich urządzeniach

### Panel Administracyjny
- **Dashboard**: Przegląd statystyk i ostatnich aktywności
- **Zarządzanie produktami**: Dodawanie, edycja, usuwanie produktów
- **Zarządzanie użytkownikami**: Lista użytkowników z rolami i statusami
- **Zarządzanie zamówieniami**: Pełna obsługa zamówień klientów
- **Ustawienia**: Konfiguracja platformy i parametrów biznesowych

## 🛠️ Technologie

- **Next.js 14** - Framework React z App Router
- **TypeScript** - Typowanie statyczne
- **Tailwind CSS** - Stylowanie utility-first
- **Prisma** - ORM do zarządzania bazą danych
- **PostgreSQL** - Baza danych
- **NextAuth.js** - Autoryzacja (do zaimplementowania)
- **Radix UI** - Komponenty UI
- **Lucide React** - Ikony

## 📦 Instalacja

1. **Sklonuj repozytorium**
```bash
git clone <repository-url>
cd crystal-design-platform
```

2. **Zainstaluj zależności**
```bash
npm install
```

3. **Skonfiguruj bazę danych**
```bash
# Utwórz plik .env.local z konfiguracją bazy danych
cp .env.local.example .env.local

# Uruchom migracje Prisma
npx prisma migrate dev
```

4. **Uruchom aplikację**
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`

## 🗄️ Konfiguracja Bazy Danych

Przed uruchomieniem aplikacji musisz skonfigurować bazę danych PostgreSQL:

1. Zainstaluj PostgreSQL
2. Utwórz bazę danych dla aplikacji
3. Zaktualizuj `DATABASE_URL` w pliku `.env.local`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/crystal_design_db"
```

4. Uruchom migracje:
```bash
npx prisma migrate dev
```

## 📁 Struktura Projektu

```
src/
├── app/                    # App Router Next.js
│   ├── admin/             # Panel administracyjny
│   │   ├── products/      # Zarządzanie produktami
│   │   ├── users/         # Zarządzanie użytkownikami
│   │   ├── orders/        # Zarządzanie zamówieniami
│   │   └── settings/      # Ustawienia platformy
│   ├── api/               # API endpoints
│   └── page.tsx           # Strona główna
├── components/            # Komponenty React
│   ├── ui/               # Komponenty UI (shadcn/ui)
│   ├── sections/         # Sekcje strony głównej
│   ├── navigation.tsx    # Nawigacja
│   └── footer.tsx        # Stopka
├── lib/                  # Utilities i konfiguracja
│   ├── prisma.ts         # Konfiguracja Prisma
│   └── utils.ts          # Funkcje pomocnicze
└── types/                # Definicje TypeScript
    └── index.ts          # Typy aplikacji
```

## 🎨 Design System

Aplikacja wykorzystuje nowoczesny design system z:
- **Kolory**: Niebieski (#3B82F6) i fioletowy (#8B5CF6) jako główne
- **Typografia**: Inter font dla czytelności
- **Komponenty**: Spójne komponenty UI z Radix UI
- **Responsywność**: Mobile-first approach
- **Animacje**: Subtelne przejścia i hover effects

## 🔐 Autoryzacja

Panel administracyjny wymaga autoryzacji (do zaimplementowania):
- Logowanie użytkowników
- Role: USER, ADMIN
- Ochrona tras administracyjnych
- Sesje użytkowników

## 📱 Responsywność

Aplikacja jest w pełni responsywna:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🚀 Deployment

Aplikacja jest gotowa do deploymentu na:
- **Vercel** (zalecane)
- **Netlify**
- **AWS**
- **DigitalOcean**

## 📞 Kontakt

- **Email**: kontakt@cristaldesign.pl
- **Telefon**: +48 123 456 789
- **Adres**: ul. Przykładowa 123, 00-000 Warszawa

## 📄 Licencja

Wszystkie prawa zastrzeżone © 2024 CRISTAL DESIGN