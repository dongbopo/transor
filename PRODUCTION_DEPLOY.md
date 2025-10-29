# 🚀 DEPLOY TRANSER LÊN PRODUCTION - HƯỚNG DẪN CHI TIẾT

## 📋 CHECKLIST TRƯỚC KHI DEPLOY

✅ **Đã hoàn thành:**
- [x] Supabase project đã tạo
- [x] Database tables đã setup
- [x] Storage bucket `documents` đã tạo
- [x] Google OAuth credentials đã có
- [x] Code đã kết nối Supabase
- [x] Environment variables đã config (`.env.local`)

---

## 1️⃣ DEPLOY LÊN VERCEL (10 phút)

### Bước 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Bước 2: Login Vercel

```bash
vercel login
```

### Bước 3: Deploy

Trong thư mục project:
```bash
cd /Users/dongbo/transor
vercel
```

**Trả lời các câu hỏi:**
- Set up and deploy? **Y**
- Which scope? **Chọn account của bạn**
- Link to existing project? **N** (lần đầu)
- Project name? **transer** hoặc để mặc định
- Directory? **./** (để trống, Enter)
- Override settings? **N**

### Bước 4: Thêm Environment Variables trong Vercel

1. Vào https://vercel.com/dashboard
2. Click vào project **transer**
3. Vào **Settings** → **Environment Variables**
4. Thêm các biến sau:

```
VITE_SUPABASE_URL
https://zwnlxsqptrtksqwjagui.supabase.co

VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bmx4c3FwdHJ0a3Nxd2phZ3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDkwMzksImV4cCI6MjA3NzIyNTAzOX0.i5NYtctcElcFTtD2sldSO2xmoOqACqXD2kNafnX2lDo

VITE_APP_URL
https://transer.app

VITE_APP_NAME
Transer

VITE_ENABLE_GOOGLE_AUTH
true

VITE_ENABLE_STRIPE_PAYMENTS
false
```

5. **Apply to:** Chọn **Production, Preview, Development**
6. Click **Save**

### Bước 5: Redeploy sau khi thêm env vars

```bash
vercel --prod
```

Hoặc trong Vercel Dashboard:
1. Vào **Deployments**
2. Click **⋯** trên deployment mới nhất
3. Chọn **Redeploy**

---

## 2️⃣ SETUP DOMAIN TRANSER.APP (15 phút)

### Bước 1: Thêm Domain trong Vercel

1. Vào project **transer** trong Vercel Dashboard
2. **Settings** → **Domains**
3. Thêm domain: **transer.app**
4. Click **Add**
5. Vercel sẽ hiện thị **DNS records cần thêm**

### Bước 2: Cấu hình DNS trong Namecheap

1. Login Namecheap: https://ap.www.namecheap.com/
2. Vào **Domain List**
3. Click **Manage** bên cạnh **transer.app**
4. Vào tab **Advanced DNS**

**Thêm các records:**

#### Record 1: CNAME cho www
- **Type:** CNAME Record
- **Host:** `www`
- **Value:** `cname.vercel-dns.com`
- **TTL:** Automatic

#### Record 2: A Record cho root domain
- **Type:** A Record
- **Host:** `@`
- **Value:** `76.76.21.21` (hoặc IP mà Vercel cung cấp)
- **TTL:** Automatic

**HOẶC** dùng CNAME (nếu Namecheap hỗ trợ):
- **Type:** CNAME Record
- **Host:** `@`
- **Value:** `cname.vercel-dns.com`
- **TTL:** Automatic

5. **Save** tất cả changes
6. Đợi **5-30 phút** để DNS propagate

### Bước 3: Verify Domain trong Vercel

1. Quay lại Vercel Dashboard
2. Kiểm tra domain status → Should show **"Valid Configuration"**
3. Nếu chưa, đợi thêm 5 phút và refresh

---

## 3️⃣ CẬP NHẬT GOOGLE OAUTH (5 phút)

### Update Authorized JavaScript Origins

1. Vào Google Cloud Console: https://console.cloud.google.com/apis/credentials
2. Click vào OAuth 2.0 Client ID của bạn
3. **Authorized JavaScript origins**: Thêm:
   ```
   https://transer.app
   https://www.transer.app
   ```
4. **Authorized redirect URIs**: Đảm bảo có:
   ```
   https://zwnlxsqptrtksqwjagui.supabase.co/auth/v1/callback
   ```
5. Click **SAVE**

---

## 4️⃣ CẬP NHẬT SUPABASE (5 phút)

### Thêm Site URL

1. Vào Supabase Dashboard: https://supabase.com/dashboard/project/zwnlxsqptrtksqwjagui
2. **Settings** → **Authentication** → **URL Configuration**
3. **Site URL**: `https://transer.app`
4. **Redirect URLs**: Thêm:
   ```
   https://transer.app/**
   https://www.transer.app/**
   http://localhost:5174/**
   ```
5. Click **Save**

---

## 5️⃣ TEST PRODUCTION (10 phút)

### Test Checklist:

- [ ] **Homepage loads:** https://transer.app
- [ ] **Signup works:** Email + Password
- [ ] **Google Login works:** Click "Continue with Google"
- [ ] **User profile created:** Check trong Supabase → Auth → Users
- [ ] **Storage works:** Upload document test
- [ ] **API Keys save:** Add API key trong Settings
- [ ] **Navigation works:** Click through all pages
- [ ] **Dark mode works:** Toggle theme
- [ ] **Mobile responsive:** Check trên mobile

---

## 6️⃣ FINAL STEPS

### Enable Auto-Deploy từ GitHub

1. Vào Vercel Dashboard → Project → **Settings** → **Git**
2. Connect GitHub repository
3. Enable **Auto Deploy** cho branch `main`

**Giờ mỗi khi bạn push code:**
```bash
git add .
git commit -m "Your message"
git push origin main
```
→ Vercel sẽ tự động deploy! 🚀

---

## 📊 MONITORING

### Vercel Analytics (Optional)

1. Vercel Dashboard → Project → **Analytics**
2. Enable **Web Analytics** (miễn phí)
3. Xem stats: visitors, page views, performance

---

## 🆘 TROUBLESHOOTING

### Lỗi: "Invalid redirect URI"
→ Check Google Cloud Console → Authorized redirect URIs

### Lỗi: "Environment variable not found"
→ Check Vercel Dashboard → Settings → Environment Variables

### Lỗi: "Domain not resolving"
→ Đợi 30 phút, check DNS với: https://dnschecker.org

### Lỗi: "Supabase connection failed"
→ Check VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trong Vercel

---

## ✅ DEPLOYMENT COMPLETE!

Sau khi hoàn thành, app sẽ có:

🌐 **Production URL:** https://transer.app  
🔐 **Google OAuth:** ✅ Hoạt động  
💾 **Database:** ✅ Supabase  
☁️ **Storage:** ✅ Supabase Storage  
🔑 **API Keys:** ✅ User tự quản lý  
📱 **Responsive:** ✅ Mobile/Tablet/Desktop  

**Người dùng có thể:**
- ✅ Đăng ký/Đăng nhập (Email hoặc Google)
- ✅ Upload documents
- ✅ Lưu API keys
- ✅ Sử dụng translation features
- ✅ Quản lý storage
- ✅ Dark mode

---

## 🎉 XIN CHÚC MỪNG!

App của bạn đã sẵn sàng cho production! 🚀

Vào **https://transer.app** để test ngay!

