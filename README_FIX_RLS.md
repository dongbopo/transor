# 🚀 CÁCH FIX RLS - NHANH NHẤT (2 PHÚT)

## ⚠️ VẤN ĐỀ:
Bạn gặp lỗi: `new row violates row-level security policy`

## ✅ GIẢI PHÁP NHANH NHẤT:

### Bước 1: Mở link này (đã tự động lấy project ID của bạn)
👉 **https://app.supabase.com/project/zwnlxsqptrtksqwjagui/sql/new**

### Bước 2: Copy SQL
Mở file `AUTO_FIX_RLS.sql` và **copy toàn bộ**

### Bước 3: Paste và Run
- Paste vào SQL Editor
- Click **"Run"**
- Đợi message "✅ SUCCESS"

### Bước 4: Test
- Refresh app
- Thêm API key → **Thành công!** ✅

## 📋 HOẶC COPY SQL NÀY (nếu không muốn mở file):

```sql
ALTER TABLE IF EXISTS public.user_api_keys ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_api_keys') LOOP
    EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.user_api_keys';
  END LOOP;
END $$;

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

## 🎯 KẾT QUẢ:
Sau khi chạy SQL, bạn sẽ có thể save API keys mà không còn lỗi!

---

**Lưu ý:** Tôi không thể tự chạy SQL vì cần quyền admin trong Supabase của bạn. 
Nhưng cách trên chỉ mất 2 phút và chỉ cần làm 1 lần!

