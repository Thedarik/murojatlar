# Jizzax Viloyati Kuz-Qish Shtabi - Murojaatlar Veb-sayti

Aholidan murojaatlarni qabul qilish uchun maxsus veb-sayt.

## O'rnatish

```bash
npm install
```

## Supabase Database Setup

Avval Supabase SQL Editor'da `supabase.sql` faylidagi SQL kodini ishga tushiring:

1. Supabase Dashboard'ga kiring
2. SQL Editor'ni oching
3. `supabase.sql` faylidagi barcha SQL kodini nusxalab SQL Editor'ga yopishtiring
4. Run tugmasini bosing

Bu quyidagilarni yaratadi:
- `murojaatlar` jadvali
- Indexlar (tez qidirish uchun)
- Row Level Security (RLS) policies
- Triggerlar (updated_at avtomatik yangilanishi uchun)

## Ishga tushirish

```bash
npm run dev
```

Sayt http://localhost:5173 manzilida ochiladi.

## Build qilish

```bash
npm run build
```

## Xususiyatlar

- React + TypeScript
- Supabase integratsiyasi (ma'lumotlarni saqlash)
- Uchta til variantlari: O'zbek (Lotin), O'zbek (Kiril), Rus
- Davlat idoralari dizayni (oq-qora ranglar, minimalizm)
- To'liq responsive dizayn (mobil, tablet, desktop)
- Barcha kerakli formalar maydonlari
- Loading va error handling
- Form validatsiyasi

## Supabase Konfiguratsiya

Supabase konfiguratsiyasi `src/config/supabase.ts` faylida joylashgan. 

**Muhim**: Production uchun environment variables ishlatish tavsiya etiladi:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

`.env` fayl yaratish:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

