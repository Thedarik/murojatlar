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

### Foydalanuvchi qismi
- React + TypeScript
- Supabase integratsiyasi (ma'lumotlarni saqlash)
- Uchta til variantlari: O'zbek (Lotin), O'zbek (Kiril), Rus
- Davlat idoralari dizayni (oq-qora ranglar, minimalizm)
- To'liq responsive dizayn (mobil, tablet, desktop)
- Barcha kerakli formalar maydonlari
- Loading va error handling
- Form validatsiyasi

### Admin Panel
- Admin autentifikatsiya (login/logout)
- Murojaatlarni ko'rish va boshqarish
- Qidirish funksiyasi (F.I.SH, telefon, mazmun bo'yicha)
- Filtrlash (tuman/shahar va tashkilot bo'yicha)
- Murojaatlarni o'chirish
- To'liq responsive admin panel
- Protected routes (faqat autentifikatsiya qilingan adminlar kirishi mumkin)

## Admin Panel

### Kirish
Admin panelga kirish uchun: `http://localhost:5173/admin/login`

**Default login ma'lumotlari:**
- Username: `admin`
- Password: `admin123`

⚠️ **Muhim**: Production uchun parolni o'zgartirish va xavfsiz autentifikatsiya (masalan, Supabase Auth) ishlatish tavsiya etiladi.

### Admin Panel Funksiyalari
1. **Murojaatlarni ko'rish** - Barcha murojaatlarni jadval ko'rinishida ko'rish
2. **Qidirish** - F.I.SH, telefon yoki murojaat mazmuni bo'yicha qidirish
3. **Filtrlash** - Tuman/shahar yoki tashkilot bo'yicha filtrlash
4. **O'chirish** - Keraksiz murojaatlarni o'chirish

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

