# 🔧 SỬA LỖI RLS - HƯỚNG DẪN NHANH

## Lỗi bạn đang gặp:
```
new row violates row-level security policy for table "user_api_keys"
```

## Cách sửa (2 phút):

### Bước 1: Mở Supabase
1. Vào https://app.supabase.com
2. Login và chọn project của bạn
3. Click vào **SQL Editor** (menu bên trái)

### Bước 2: Chạy SQL
1. Mở file `FIX_RLS_SIMPLE.sql` 
2. **COPY TOÀN BỘ** nội dung
3. Paste vào SQL Editor
4. Click nút **Run** (hoặc Ctrl+Enter)

### Bước 3: Test
1. Quay lại app
2. Refresh browser
3. Thêm API key → Sẽ thành công! ✅

## SQL cần chạy (copy toàn bộ):

```sql
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can manage own API keys" ON public.user_api_keys;

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

## ⚠️ QUAN TRỌNG:
- **PHẢI** chạy SQL này trong Supabase
- Nếu không chạy, sẽ không thể save API key
- Chỉ cần chạy **1 lần duy nhất**

## ✅ Sau khi fix:
- Có thể save API keys bình thường
- Bảo mật vẫn được đảm bảo (RLS hoạt động)
- Không còn lỗi nữa

