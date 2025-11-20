-- ============================================
-- OXIRGI YECHIM - RLS XATOLIGINI HAL QILISH
-- ============================================
-- Bu kodni Supabase SQL Editor'da ishga tushiring
-- Bu kod RLS ni o'chiradi va to'liq huquq beradi
-- ============================================

-- ============================================
-- QADAM 1: RLS ni butunlay o'chirish
-- ============================================
ALTER TABLE public.murojaatlar DISABLE ROW LEVEL SECURITY;

-- ============================================
-- QADAM 2: BARCHA POLICY'LARNI O'CHIRISH
-- ============================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'murojaatlar' 
    AND schemaname = 'public'
  ) LOOP
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.murojaatlar CASCADE', r.policyname);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END LOOP;
END $$;

-- Qo'shimcha o'chirish (barcha variantlar)
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "allow_anonymous_insert" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "anon_insert_policy" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "allow_authenticated_insert" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "authenticated_insert_policy" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "Service role full access" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "allow_service_role_all" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "service_role_all_policy" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "allow_public_insert" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "public_insert_policy" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "allow_postgres_all" ON public.murojaatlar CASCADE;

-- ============================================
-- QADAM 3: ROLE'LARGA TO'LIQ HUQUQ BERISH
-- ============================================
-- Bu eng muhim qadam - anon role ga huquq berish
GRANT ALL PRIVILEGES ON public.murojaatlar TO anon;
GRANT ALL PRIVILEGES ON public.murojaatlar TO authenticated;
GRANT ALL PRIVILEGES ON public.murojaatlar TO public;

-- Sequence uchun huquq
GRANT ALL PRIVILEGES ON SEQUENCE murojaatlar_id_seq TO anon;
GRANT ALL PRIVILEGES ON SEQUENCE murojaatlar_id_seq TO authenticated;
GRANT ALL PRIVILEGES ON SEQUENCE murojaatlar_id_seq TO public;

-- ============================================
-- QADAM 4: JADVAL OWNER NI O'ZGARTIRISH
-- ============================================
ALTER TABLE public.murojaatlar OWNER TO postgres;

-- ============================================
-- QADAM 5: TEKSHIRISH
-- ============================================
-- RLS holatini tekshirish (false bo'lishi KERAK)
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'murojaatlar'
AND schemaname = 'public';

-- Agar natija: rls_enabled = false bo'lsa - to'g'ri!
-- Agar natija: rls_enabled = true bo'lsa - xatolik bor!

-- Policy'lar o'chirilganini tekshirish (bo'sh bo'lishi kerak)
SELECT 
  policyname,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'murojaatlar' 
AND schemaname = 'public';

-- Agar natija bo'sh bo'lsa - to'g'ri!

-- Role permissions ni tekshirish
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'murojaatlar'
AND table_schema = 'public'
AND grantee IN ('anon', 'authenticated', 'public')
ORDER BY grantee, privilege_type;

-- Agar natijada INSERT, SELECT, UPDATE, DELETE ko'rsatilgan bo'lsa - to'g'ri!

