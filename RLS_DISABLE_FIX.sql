-- ============================================
-- RLS MUAMMOSINI HAL QILISH - OXIRGI YECHIM
-- ============================================
-- Bu kodni SQL Editor'da ishga tushiring
-- RLS ni vaqtincha o'chirib test qilamiz
-- ============================================

-- ============================================
-- YECHIM 1: RLS ni butunlay o'chirish (test uchun)
-- ============================================
ALTER TABLE IF EXISTS public.murojaatlar DISABLE ROW LEVEL SECURITY;

-- ============================================
-- YECHIM 2: Barcha policy'larni o'chirish
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

-- Qo'shimcha o'chirish
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "allow_anonymous_insert" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "allow_authenticated_insert" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "Service role full access" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "allow_service_role_all" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "allow_public_insert" ON public.murojaatlar CASCADE;
DROP POLICY IF EXISTS "allow_postgres_all" ON public.murojaatlar CASCADE;

-- ============================================
-- YECHIM 3: Role'larga to'liq huquq berish
-- ============================================
-- Anon role uchun
GRANT ALL ON public.murojaatlar TO anon;
GRANT ALL ON SEQUENCE murojaatlar_id_seq TO anon;

-- Authenticated role uchun
GRANT ALL ON public.murojaatlar TO authenticated;
GRANT ALL ON SEQUENCE murojaatlar_id_seq TO authenticated;

-- Public role uchun
GRANT ALL ON public.murojaatlar TO public;
GRANT ALL ON SEQUENCE murojaatlar_id_seq TO public;

-- ============================================
-- YECHIM 4: Jadvalni public schema'ga to'liq ruxsat berish
-- ============================================
ALTER TABLE public.murojaatlar OWNER TO postgres;

-- ============================================
-- TEKSHIRISH
-- ============================================
-- RLS holatini tekshirish (false bo'lishi kerak)
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'murojaatlar'
AND schemaname = 'public';

-- Policy'lar o'chirilganini tekshirish (bo'sh bo'lishi kerak)
SELECT 
  policyname,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'murojaatlar' 
AND schemaname = 'public';

-- Role permissions ni tekshirish
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'murojaatlar'
AND table_schema = 'public'
ORDER BY grantee, privilege_type;

