# 🚀 Transer - Hướng Dẫn Setup Để App Hoạt Động

## 📋 Tổng Quan

Để Transer hoạt động hoàn chỉnh, bạn cần setup:

1. **Supabase** - Backend (Database + Auth + Storage)
2. **Google OAuth** - Đăng nhập
3. **LLM API Keys** - Translation
4. **Environment Variables** - Config
5. **Deploy** - Lên production

---

## 1️⃣ SETUP SUPABASE (15 phút)

### Bước 1: Tạo Supabase Project

1. Truy cập: https://supabase.com
2. Click **"Start your project"**
3. Sign up/Login (miễn phí)
4. Click **"New Project"**
   - **Name:** `transor`
   - **Database Password:** Tạo password mạnh (save lại)
   - **Region:** `Southeast Asia (Singapore)` (gần VN nhất)
   - Click **"Create new project"**
5. Đợi 2-3 phút để project được tạo

### Bước 2: Lấy API Keys

1. Trong Supabase Dashboard, vào **Settings** > **API**
2. Copy các thông tin sau:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGc...
   service_role key: eyJhbGc... (bảo mật, không public)
   ```

### Bước 3: Setup Database Tables

1. Vào **SQL Editor** trong Supabase
2. Click **"New query"**
3. Paste SQL này và chạy:

```sql
-- Users table (mở rộng auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  license_status TEXT DEFAULT 'trial' CHECK (license_status IN ('trial', 'active', 'expired')),
  license_key TEXT UNIQUE,
  storage_total_gb NUMERIC DEFAULT 5.0,
  storage_used_gb NUMERIC DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys table (encrypted)
CREATE TABLE public.user_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'gemini', 'grok', 'claude')),
  api_key_encrypted TEXT NOT NULL,
  is_valid BOOLEAN DEFAULT TRUE,
  last_validated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Documents table
CREATE TABLE public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  thumbnail_url TEXT,
  source_language TEXT,
  target_language TEXT,
  domain TEXT,
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'failed')),
  total_pages INTEGER,
  current_page INTEGER DEFAULT 1,
  reading_progress NUMERIC DEFAULT 0.0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Translations table
CREATE TABLE public.translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES public.documents ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'gemini', 'grok', 'claude')),
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  page_number INTEGER,
  segment_index INTEGER,
  tokens_used INTEGER,
  cost_usd NUMERIC(10, 4),
  translation_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Storage purchases table
CREATE TABLE public.storage_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  gb_purchased NUMERIC NOT NULL,
  amount_paid_usd NUMERIC(10, 2) NOT NULL,
  payment_method TEXT,
  transaction_id TEXT UNIQUE,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- License purchases table
CREATE TABLE public.license_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  license_key TEXT UNIQUE NOT NULL,
  amount_paid_usd NUMERIC(10, 2) NOT NULL,
  payment_method TEXT,
  transaction_id TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'refunded')),
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Bookmarks table
CREATE TABLE public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES public.documents ON DELETE CASCADE NOT NULL,
  page_number INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, document_id, page_number)
);

-- Highlights table
CREATE TABLE public.highlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES public.documents ON DELETE CASCADE NOT NULL,
  page_number INTEGER NOT NULL,
  text_content TEXT NOT NULL,
  color TEXT DEFAULT 'yellow',
  start_offset INTEGER,
  end_offset INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own API keys" ON public.user_api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own API keys" ON public.user_api_keys FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own documents" ON public.documents FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own translations" ON public.translations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create translations" ON public.translations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own storage purchases" ON public.storage_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own license purchases" ON public.license_purchases FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own highlights" ON public.highlights FOR ALL USING (auth.uid() = user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_api_keys_updated_at BEFORE UPDATE ON public.user_api_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Bước 4: Setup Storage Buckets

1. Vào **Storage** trong Supabase
2. Click **"New bucket"**
3. Tạo bucket:
   - **Name:** `documents`
   - **Public:** Bỏ tick (private)
   - Click **"Create bucket"**
4. Click vào bucket `documents`, chọn **Policies**
5. Thêm policy:
   ```sql
   -- Users can upload their own documents
   CREATE POLICY "Users can upload own documents"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

   -- Users can view own documents
   CREATE POLICY "Users can view own documents"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

   -- Users can delete own documents
   CREATE POLICY "Users can delete own documents"
   ON storage.objects FOR DELETE
   USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

---

## 2️⃣ SETUP GOOGLE OAUTH (10 phút)

### Bước 1: Tạo Google Cloud Project

1. Truy cập: https://console.cloud.google.com
2. Click **"Select a project"** > **"New Project"**
3. **Project name:** `Transer`
4. Click **"Create"**

### Bước 2: Tạo OAuth Credentials

1. Vào **APIs & Services** > **Credentials**
2. Click **"Create Credentials"** > **"OAuth client ID"**
3. Nếu chưa có, click **"Configure consent screen"**:
   - **User Type:** External
   - **App name:** Transer
   - **User support email:** Your email
   - **Developer contact:** Your email
   - Click **"Save and Continue"**
   - **Scopes:** Bỏ qua (Next)
   - **Test users:** Bỏ qua (Next)
   - Click **"Back to Dashboard"**
4. Quay lại **Credentials**, click **"Create Credentials"** > **"OAuth client ID"**
5. **Application type:** Web application
6. **Name:** Transer Web
7. **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   https://transer.app
   ```
8. **Authorized redirect URIs:**
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
   (Thay `xxxxx` bằng Project URL từ Supabase)
9. Click **"Create"**
10. Copy **Client ID** và **Client Secret**

### Bước 3: Config Supabase Auth

1. Trong Supabase, vào **Authentication** > **Providers**
2. Enable **Google**
3. Paste **Client ID** và **Client Secret**
4. Click **"Save"**

---

## 3️⃣ SETUP ENVIRONMENT VARIABLES

### Bước 1: Tạo file `.env.local`

Trong thư mục `/Users/dongbo/transor`, tạo file `.env.local`:

```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# App Config
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=Transer

# Features
VITE_ENABLE_GOOGLE_AUTH=true
VITE_ENABLE_STRIPE_PAYMENTS=false
```

### Bước 2: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

---

## 4️⃣ TÍCH HỢP SUPABASE VÀO CODE

Tôi sẽ tạo các file service để kết nối Supabase:

---

## 5️⃣ LLM API KEYS (User tự nhập)

Người dùng sẽ tự nhập API keys của họ trong **Settings** > **API Keys**:

- **OpenAI:** https://platform.openai.com/api-keys
- **Google Gemini:** https://makersuite.google.com/app/apikey
- **Anthropic Claude:** https://console.anthropic.com/
- **xAI Grok:** https://console.x.ai/

---

## 6️⃣ PAYMENT (Optional - Stripe)

Nếu muốn thu phí license:

1. Tạo tài khoản Stripe: https://stripe.com
2. Lấy API keys
3. Tích hợp Stripe Checkout
4. Setup webhooks

---

## 7️⃣ DEPLOY LÊN VERCEL

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

---

## ✅ CHECKLIST

- [ ] Supabase project created
- [ ] Database tables created
- [ ] Storage bucket created
- [ ] Google OAuth configured
- [ ] Environment variables added
- [ ] Supabase client installed
- [ ] Auth context updated
- [ ] Services created
- [ ] Testing on localhost
- [ ] Deploy to Vercel
- [ ] Setup custom domain (transer.app)

---

## 🆘 CẦN GIÚP ĐỠ?

Tôi sẽ hướng dẫn từng bước chi tiết. Bạn muốn bắt đầu từ đâu?

1. **Setup Supabase ngay** (tôi sẽ tạo code kết nối)
2. **Test với mock data trước** (không cần backend)
3. **Deploy ngay với mock data** (backend sau)

Chọn option nào nhé? 😊

