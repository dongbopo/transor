# 🔧 HƯỚNG DẪN SỬA LỖI - ĐÚNG CÁCH

## ⚠️ LỖI BẠN ĐÃ GẶP:
Bạn đã copy **CSS code** vào SQL Editor, gây ra lỗi syntax!

## ✅ CÁCH ĐÚNG:

### Bước 1: Mở file SQL (KHÔNG phải CSS!)
Mở file: **`COPY_THIS_SQL_ONLY.sql`**

### Bước 2: Copy CHỈ SQL code
- Chọn **TOÀN BỘ** nội dung file `COPY_THIS_SQL_ONLY.sql`
- COPY (Ctrl+C hoặc Cmd+C)

### Bước 3: Paste vào Supabase SQL Editor
1. Vào: https://app.supabase.com/project/zwnlxsqptrtksqwjagui/sql/new
2. **PASTE** SQL code vào editor
3. Click **"Run"**

## 📋 SQL CODE CẦN COPY (từ file COPY_THIS_SQL_ONLY.sql):

```sql
ALTER TABLE IF EXISTS public.user_api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can manage own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can insert own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can update own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can delete own API keys" ON public.user_api_keys;

CREATE POLICY "Users can view own API keys" 
ON public.user_api_keys FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys" 
ON public.user_api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" 
ON public.user_api_keys FOR UPDATE 
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" 
ON public.user_api_keys FOR DELETE USING (auth.uid() = user_id);
```

## ❌ KHÔNG COPY:
- ❌ CSS code (từ index.css)
- ❌ JavaScript code
- ❌ Bất kỳ code nào khác ngoài SQL

## ✅ CHỈ COPY:
- ✅ SQL code (từ COPY_THIS_SQL_ONLY.sql)

## 🎯 SAU KHI CHẠY ĐÚNG SQL:
Bạn sẽ thấy message "Success" hoặc "No rows returned" → Thành công!

Sau đó quay lại app và thêm API key → Sẽ save được! ✅

