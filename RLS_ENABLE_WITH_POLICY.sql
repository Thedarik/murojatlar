-- ============================================
-- RLS ni yoqish va to'g'ri policy yaratish
-- ============================================
-- Agar RLS_DISABLE_FIX.sql ishlasa, keyin bu kodni ishga tushiring
-- ============================================

-- ============================================
-- QADAM 1: RLS ni yoqish
-- ============================================
ALTER TABLE public.murojaatlar ENABLE ROW LEVEL SECURITY;

-- ============================================
-- QADAM 2: Barcha eski policy'larni o'chirish
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

-- ============================================
-- QADAM 3: YANGI POLICY'LAR YARATISH (eng sodda variant)
-- ============================================

-- Anon uchun INSERT - AS PERMISSIVE bilan
CREATE POLICY "anon_insert_policy" 
ON public.murojaatlar
AS PERMISSIVE
FOR INSERT
TO anon
WITH CHECK (true);

-- Authenticated uchun INSERT
CREATE POLICY "authenticated_insert_policy" 
ON public.murojaatlar
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Public uchun INSERT (qo'shimcha)
CREATE POLICY "public_insert_policy" 
ON public.murojaatlar
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (true);

-- Service role uchun ALL
CREATE POLICY "service_role_all_policy" 
ON public.murojaatlar
AS PERMISSIVE
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- QADAM 4: Role'larga huquq berish (yana bir bor)
-- ============================================
GRANT INSERT, SELECT ON public.murojaatlar TO anon;
GRANT INSERT, SELECT ON public.murojaatlar TO authenticated;
GRANT INSERT, SELECT ON public.murojaatlar TO public;
GRANT USAGE, SELECT ON SEQUENCE murojaatlar_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE murojaatlar_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE murojaatlar_id_seq TO public;

-- ============================================
-- TEKSHIRISH
-- ============================================
-- Policy'lar yaratilganini tekshirish
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  with_check
FROM pg_policies 
WHERE tablename = 'murojaatlar' 
AND schemaname = 'public'
ORDER BY policyname;

-- RLS holati
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'murojaatlar'
AND schemaname = 'public';

