# Supabase Database Setup - Qadam bo'lib ko'rsatma

Bu fayl Supabase da `murojaatlar` jadvalini yaratish uchun qadam bo'lib ko'rsatma.

## Qadam 1: Supabase Dashboard ga kiring

1. [Supabase Dashboard](https://supabase.com/dashboard) ga kiring
2. O'z loyihangizni tanlang (yoki yangi loyiha yarating)
3. Project Settings > API ga kiring va quyidagi ma'lumotlarni tekshiring:
   - **Project URL**: `https://aiyvldjxxixjkovgwqna.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpeXZsZGp4eGl4amtvdmd3cW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzg4NzMsImV4cCI6MjA3OTIxNDg3M30.NX4lLK-GmwsVceK48aQasWSoA1FzSLPbZiONO-tM5Co`

## Qadam 2: SQL Editor ni oching

1. Left sidebar dan **SQL Editor** ni tanlang
2. **New Query** tugmasini bosing

## Qadam 3: SQL kodini kiritish

1. `supabase.sql` faylini oching
2. **Barcha kodni** (-- dan boshlab oxirigacha) nusxalab oling
3. SQL Editor ga yopishtiring

**YOKI**

Quyidagi kodni to'g'ridan-to'g'ri nusxalab yopishtiring:

```sql
-- Murojaatlar jadvalini yaratish
CREATE TABLE IF NOT EXISTS public.murojaatlar (
  id BIGSERIAL PRIMARY KEY,
  fio VARCHAR(255) NOT NULL,
  telefon VARCHAR(50) NOT NULL,
  tuman_shahar VARCHAR(100) NOT NULL,
  manzil TEXT NOT NULL,
  murojaat_mazmuni TEXT NOT NULL,
  tashkilot VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index yaratish
CREATE INDEX IF NOT EXISTS idx_murojaatlar_created_at ON public.murojaatlar(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_murojaatlar_tuman_shahar ON public.murojaatlar(tuman_shahar);
CREATE INDEX IF NOT EXISTS idx_murojaatlar_tashkilot ON public.murojaatlar(tashkilot);

-- RLS yoqish
ALTER TABLE public.murojaatlar ENABLE ROW LEVEL SECURITY;

-- Eski policy'larni o'chirish
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.murojaatlar;
DROP POLICY IF EXISTS "Service role full access" ON public.murojaatlar;

-- Anon foydalanuvchilar uchun INSERT
CREATE POLICY "Allow anonymous insert" 
ON public.murojaatlar
FOR INSERT
TO anon
WITH CHECK (true);

-- Authenticated foydalanuvchilar uchun INSERT
CREATE POLICY "Allow authenticated insert" 
ON public.murojaatlar
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Service role uchun barcha operatsiyalar
CREATE POLICY "Service role full access" 
ON public.murojaatlar
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- updated_at avtomatik yangilanishi uchun funksiya
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger yaratish
DROP TRIGGER IF EXISTS update_murojaatlar_updated_at ON public.murojaatlar;

CREATE TRIGGER update_murojaatlar_updated_at 
  BEFORE UPDATE ON public.murojaatlar
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

## Qadam 4: SQL kodini ishga tushirish

1. **Run** tugmasini bosing (yoki `Ctrl + Enter`)
2. Xatoliklar bo'lmasa, "Success" xabari ko'rsatiladi
3. Jadval yaratilganini tekshirish uchun:
   - Left sidebar dan **Table Editor** ni oching
   - `murojaatlar` jadvalini ko'rish kerak

## Qadam 5: Jadvalni tekshirish

1. **Table Editor** dan `murojaatlar` jadvalini oching
2. Quyidagi ustunlar ko'rinishi kerak:
   - `id` (bigint, primary key)
   - `fio` (varchar)
   - `telefon` (varchar)
   - `tuman_shahar` (varchar)
   - `manzil` (text)
   - `murojaat_mazmuni` (text)
   - `tashkilot` (varchar)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

## Xatoliklar bo'lsa

Agar "table already exists" xatoligi bo'lsa:
1. Oldingi jadvalni o'chirish uchun quyidagi kodni ishga tushiring:
```sql
DROP TABLE IF EXISTS public.murojaatlar CASCADE;
```
2. Keyin boshqa kodni qayta ishga tushiring

## Muvaffaqiyatli yaratilgandan keyin

Jadval yaratilgandan keyin:
1. Veb-saytni qayta ishga tushiring
2. Form orqali test murojaat yuboring
3. Supabase Table Editor da murojaat saqlanganini tekshiring

## Maslahat

- Har bir o'zgarishdan keyin SQL kodini saqlang (Save query)
- RLS (Row Level Security) policies ni tekshirib turish kerak
- Indexlar tez qidirish uchun muhim
