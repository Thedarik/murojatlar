# RLS Xatolik Tushuntirish

## Xatolik: "new row violates row-level security policy for table 'murojaatlar' [42501]"

### Bu xatolik nima degani?

**42501** - PostgreSQL xatolik kodi: "insufficient_privilege" (yetarli huquq yo'q)

Bu degani:
1. ✅ Jadval mavjud
2. ✅ Row Level Security (RLS) yoqilgan
3. ❌ INSERT operatsiyasi uchun policy mavjud emas yoki noto'g'ri
4. ❌ `anon` role uchun INSERT huquqi yo'q

### Nima sababdan chiqadi?

1. **RLS yoqilgan, lekin policy yo'q**
   - RLS yoqilgan, lekin INSERT uchun hech qanday policy yaratilmagan
   
2. **Policy mavjud, lekin ishlamayapti**
   - Policy yaratilgan, lekin `anon` role uchun ishlamayapti
   - Policy shartlari noto'g'ri

3. **GRANT komandalari ishlamagan**
   - Policy mavjud, lekin `anon` role ga jadval ustida huquq berilmagan

### Qanday hal qilish?

#### YECHIM 1: RLS ni o'chirish (eng sodda - test uchun)

```sql
ALTER TABLE public.murojaatlar DISABLE ROW LEVEL SECURITY;
```

Bu kodni ishga tushiring va test qiling. Agar ishlasa - muammo RLS da.

#### YECHIM 2: To'g'ri policy yaratish

Agar RLS ni yoqib qo'yish kerak bo'lsa:

```sql
-- 1. RLS ni yoqish
ALTER TABLE public.murojaatlar ENABLE ROW LEVEL SECURITY;

-- 2. Policy yaratish
CREATE POLICY "anon_insert" 
ON public.murojaatlar
AS PERMISSIVE
FOR INSERT
TO anon
WITH CHECK (true);

-- 3. GRANT qilish
GRANT INSERT ON public.murojaatlar TO anon;
GRANT USAGE ON SEQUENCE murojaatlar_id_seq TO anon;
```

#### YECHIM 3: To'liq yechim (FINAL_SOLUTION.sql)

`FINAL_SOLUTION.sql` faylini ishga tushiring - bu barcha muammolarni hal qiladi.

### Qanday tekshirish?

#### 1. RLS holatini tekshirish:

```sql
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'murojaatlar';
```

- **false** - RLS o'chirilgan ✅
- **true** - RLS yoqilgan ❌ (agar policy yo'q bo'lsa xatolik chiqadi)

#### 2. Policy'larni tekshirish:

```sql
SELECT 
  policyname,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'murojaatlar';
```

- Agar natija **bo'sh** - policy yo'q ❌
- Agar `anon` role uchun INSERT policy ko'rsatilgan - to'g'ri ✅

#### 3. Role huquqlarini tekshirish:

```sql
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'murojaatlar'
AND grantee = 'anon';
```

- Agar `INSERT` ko'rsatilgan - to'g'ri ✅
- Agar natija bo'sh yoki `INSERT` yo'q - xatolik ❌

### Eng sodda yechim

**Avval:** `FINAL_SOLUTION.sql` kodini ishga tushiring - bu RLS ni o'chiradi va to'liq huquq beradi.

**Keyin:** Veb-saytni test qiling - ishlashi kerak!

**Oxirida:** Agar kerak bo'lsa, RLS ni qayta yoqib to'g'ri policy yaratamiz.

