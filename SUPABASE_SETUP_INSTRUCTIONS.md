# 🚀 Hướng Dẫn Lấy Supabase API Keys

## BƯỚC 1: Tạo Project (đang làm)

1. ✅ Truy cập https://supabase.com
2. ✅ Click **"Start your project"**
3. ✅ Sign up/Login
4. ✅ Click **"New Project"**
5. ✅ Điền thông tin:
   - **Name:** `transor`
   - **Database Password:** `Transer@2024!` (hoặc password bạn chọn - **LƯU LẠI**)
   - **Region:** `Southeast Asia (Singapore)`
   - **Pricing Plan:** **Free**
6. ✅ Click **"Create new project"**
7. ⏳ **Đợi 2-3 phút để Supabase tạo project...**

---

## BƯỚC 2: Lấy API Keys

Sau khi project được tạo xong:

1. Trong Supabase Dashboard, vào **Settings** (⚙️ bên trái)
2. Click **API** trong menu Settings
3. Bạn sẽ thấy 2 thông tin quan trọng:

### 📋 Copy 2 giá trị này:

#### 1. Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

#### 2. anon public key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## BƯỚC 3: Tạo File Environment

### Option A: Tạo thủ công (Dễ nhất)

1. Mở **Terminal** mới
2. Chạy lệnh:
```bash
cd /Users/dongbo/transor
touch .env.local
open -e .env.local
```

3. Paste nội dung này vào file `.env.local`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyxxxxxx

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=Transer

# Feature Flags
VITE_ENABLE_GOOGLE_AUTH=true
VITE_ENABLE_STRIPE_PAYMENTS=false
```

4. **Thay thế** `https://xxxxxxxxxxxxx.supabase.co` và `eyJhbGciOiJI...` bằng giá trị thật từ Supabase
5. **Save** file (Cmd + S)

### Option B: Copy từ terminal (Nhanh)

```bash
cd /Users/dongbo/transor

cat > .env.local << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=Transer

# Feature Flags
VITE_ENABLE_GOOGLE_AUTH=true
VITE_ENABLE_STRIPE_PAYMENTS=false
EOF

# Sau đó edit file:
open -e .env.local
```

---

## BƯỚC 4: Setup Database

1. Trong Supabase Dashboard, vào **SQL Editor** (bên trái)
2. Click **"New query"**
3. Paste toàn bộ SQL từ file `SETUP_GUIDE.md` (section "Setup Database Tables")
4. Click **"Run"** hoặc nhấn **Cmd/Ctrl + Enter**
5. Đợi vài giây, bạn sẽ thấy thông báo **"Success"**

---

## BƯỚC 5: Setup Storage

1. Vào **Storage** trong Supabase Dashboard
2. Click **"New bucket"**
3. Điền:
   - **Name:** `documents`
   - **Public:** **BỎ TICK** (private)
4. Click **"Create bucket"**
5. Click vào bucket `documents` vừa tạo
6. Chọn tab **Policies**
7. Click **"New policy"**
8. Chọn **"For full customization"**
9. Paste 3 policies từ file `SETUP_GUIDE.md` (section "Setup Storage Buckets")
10. Click **"Review"** → **"Save policy"**

---

## ✅ KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành:

1. ✅ Project Supabase đã được tạo
2. ✅ File `.env.local` đã có API keys
3. ✅ Database tables đã được tạo (profiles, documents, translations, etc.)
4. ✅ Storage bucket `documents` đã được tạo với policies

---

## 🎯 BƯỚC TIẾP THEO

Sau khi bạn hoàn thành tất cả, báo cho tôi biết bằng cách gõ:

**"Xong rồi"** hoặc **"Done"**

Tôi sẽ tiếp tục:
1. ✅ Update AuthContext để dùng Supabase Auth
2. ✅ Update DocumentContext để dùng Supabase Storage
3. ✅ Test login/signup
4. ✅ Test upload documents
5. ✅ Deploy lên production

---

## 🆘 GẶP LỖI?

### Lỗi: "Project URL không tìm thấy"
→ Đợi thêm 1-2 phút, refresh page

### Lỗi: "Cannot create bucket"
→ Check xem bucket `documents` đã tồn tại chưa

### Lỗi: ".env.local không được load"
→ Restart dev server: `npm run dev`

---

## 📞 LIÊN HỆ

Nếu gặp khó khăn, paste screenshot hoặc mô tả lỗi, tôi sẽ giúp bạn! 😊

