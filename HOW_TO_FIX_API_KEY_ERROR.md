# 🔧 Cách Sửa Lỗi "row-level security policy" khi Save API Key

## Vấn đề
Khi save API key, bạn gặp lỗi:
```
new row violates row-level security policy for table "user_api_keys"
```

## Nguyên nhân
Supabase Row Level Security (RLS) chưa được setup đúng cho table `user_api_keys`.

## Giải pháp (3 bước)

### Bước 1: Mở Supabase Dashboard
1. Đăng nhập vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào **SQL Editor** (trong menu bên trái)

### Bước 2: Chạy SQL Fix
Copy và paste toàn bộ nội dung file `FIX_RLS_POLICIES.sql` vào SQL Editor, rồi click **Run**.

Hoặc copy trực tiếp đây:

```sql
-- Enable RLS
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can manage own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can insert own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can update own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can delete own API keys" ON public.user_api_keys;

-- Create policies
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

### Bước 3: Test lại
1. Refresh browser
2. Vào Settings
3. Thêm API key → Sẽ save thành công! ✅

## Lưu ý
- RLS policies này đảm bảo user chỉ có thể access API keys của chính họ
- Rất quan trọng cho bảo mật
- Chỉ cần chạy một lần

## Nếu vẫn lỗi
Kiểm tra:
1. Bạn đã login chưa? (RLS cần auth.uid())
2. Table `user_api_keys` đã được tạo chưa?
3. Bạn có quyền admin trong Supabase project?

