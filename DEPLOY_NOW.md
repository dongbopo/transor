# 🚀 CÁCH UPDATE LÊN TRANSer.APP NHANH NHẤT

## ✅ BUILD ĐÃ HOÀN THÀNH!

Production build đã được tạo thành công trong folder `dist/`

---

## 🌐 CÁCH 1: DEPLOY QUA VERCEL CLI (Nhanh nhất - 2 phút)

### Bước 1: Login Vercel

Trong Terminal, chạy:
```bash
cd /Users/dongbo/transor
npx vercel login
```

- Chọn option login (browser hoặc email)
- Trình duyệt sẽ mở, login Vercel account
- Quay lại terminal, thấy "Success! Logged in"

### Bước 2: Deploy Production

```bash
npx vercel --prod
```

**Trả lời questions:**
- Set up and deploy? **Y**
- Which scope? **Chọn account của bạn**
- Link to existing project? **Y** (nếu đã có project)
- **Project name:** `transer` hoặc tên project hiện tại
- Directory: **./** (Enter)
- Override settings? **N**

### Bước 3: Đợi deploy xong

Vercel sẽ hiển thị URL: `https://transer.app` ✅

---

## 🌐 CÁCH 2: DEPLOY QUA GITHUB (Tự động - Nếu đã setup)

Nếu bạn đã connect GitHub với Vercel:

```bash
git add .
git commit -m "🚀 Update to latest version - Google OAuth only"
git push origin main
```

→ Vercel sẽ tự động deploy! 🎉

---

## 🌐 CÁCH 3: DEPLOY QUA VERCEL DASHBOARD (Thủ công)

1. Mở: https://vercel.com/dashboard
2. Vào project **transer**
3. Tab **Deployments**
4. Click **⋯** → **Redeploy**
5. Chọn latest commit
6. Click **Redeploy**

---

## ✅ SAU KHI DEPLOY

### Kiểm tra:

1. **Homepage:** https://transer.app
2. **Login:** https://transer.app/login
   - Test Email/Password login
   - Test "Continue with Google" button
3. **Signup:** https://transer.app/signup

### Environment Variables (Kiểm tra lại):

Đảm bảo trong Vercel Dashboard → Settings → Environment Variables có:

```
VITE_SUPABASE_URL = https://zwnlxsqptrtksqwjagui.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_URL = https://transer.app
VITE_APP_NAME = Transer
VITE_ENABLE_GOOGLE_AUTH = true
```

---

## 🎯 KHUYẾN NGHỊ

**Cách nhanh nhất:** Chạy 2 lệnh sau trong Terminal:

```bash
cd /Users/dongbo/transor
npx vercel login    # Lần đầu cần login
npx vercel --prod   # Deploy production
```

Hoặc nếu đã có GitHub connected:
```bash
git push origin main  # Tự động deploy!
```

---

## 📊 DEPLOYMENT STATUS

✅ Build: **Thành công** (dist/ folder ready)
⏳ Deploy: **Đang chờ login Vercel**
🌐 Domain: **transer.app** (đã setup)
🔐 Auth: **Google OAuth ready**

---

## 🆘 TROUBLESHOOTING

**"Token not valid":**
→ Chạy `npx vercel login` lại

**"Project not found":**
→ Chọn "N" khi hỏi "Link to existing project", tạo mới

**"Environment variable missing":**
→ Vào Vercel Dashboard → Settings → Environment Variables → Add

---

Sau khi chạy `npx vercel login`, bạn có thể chạy `npx vercel --prod` để deploy ngay! 🚀
