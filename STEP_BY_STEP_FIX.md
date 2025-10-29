# 🔧 SỬA LỖI RLS - HƯỚNG DẪN TỪNG BƯỚC

## ⚠️ LỖI HIỆN TẠI:
```
new row violates row-level security policy for table "user_api_keys"
```

## ✅ CÁCH SỬA (3 BƯỚC ĐƠN GIẢN):

### BƯỚC 1: Mở Supabase Dashboard
1. Mở browser
2. Vào: **https://app.supabase.com**
3. **Login** vào account của bạn
4. Chọn **project** của bạn (project chứa Transer app)

### BƯỚC 2: Mở SQL Editor
1. Trong menu bên trái, click **"SQL Editor"**
2. Click nút **"New query"** (nếu có)

### BƯỚC 3: Copy & Chạy SQL
1. Mở file **`AUTO_FIX_RLS.sql`** trong project này
2. **COPY TOÀN BỘ** nội dung (Ctrl+A, Ctrl+C)
3. **PASTE** vào SQL Editor trong Supabase
4. Click nút **"Run"** (hoặc nhấn **Ctrl+Enter**)
5. Đợi kết quả → Sẽ thấy message "✅ SUCCESS"

## 📋 SQL CẦN CHẠY (copy toàn bộ):

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

## ✅ SAU KHI CHẠY SQL:

1. **Quay lại app** (browser)
2. **Refresh** trang (F5)
3. Vào **Settings**
4. Thêm **API key** → Sẽ **thành công**! ✅

## 🎯 KẾT QUẢ MONG ĐỢI:

Sau khi chạy SQL, bạn sẽ thấy:
- ✅ Message "SUCCESS" trong Supabase
- ✅ Có thể save API keys trong app
- ✅ Không còn lỗi RLS

## ❓ NẾU VẪN LỖI:

1. Kiểm tra bạn đã **login** chưa trong app?
2. Kiểm tra SQL có chạy **thành công** không trong Supabase?
3. Kiểm tra **table `user_api_keys`** đã tồn tại chưa?

## 📸 SCREENSHOT HƯỚNG DẪN:

1. Supabase Dashboard → SQL Editor
2. Paste SQL code
3. Click "Run"
4. Xem kết quả "✅ SUCCESS"

---

**LƯU Ý:** File `AUTO_FIX_RLS.sql` đã có sẵn trong project này, chỉ cần copy và chạy!

