# ⚡ Quick Deploy Guide - 5 phút lên transer.app

## 📋 Checklist Nhanh

### 1️⃣ Push code lên GitHub (2 phút)

```bash
cd /Users/dongbo/transor

# Init git
git init
git add .
git commit -m "Ready for deploy"

# Tạo repo mới trên GitHub: https://github.com/new
# Repo name: transor

# Push
git remote add origin https://github.com/YOUR_USERNAME/transor.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy lên Vercel (1 phút)

1. Vào: **https://vercel.com**
2. **"Sign Up with GitHub"**
3. Click **"New Project"**
4. Chọn repository **transor**
5. Settings:
   - Framework: **Vite**
   - Build: `npm run build`
   - Output: `dist`
   - Install: `npm install --legacy-peer-deps`
6. Click **"Deploy"** 🚀

**Đợi 1-2 phút → Deploy xong!**

### 3️⃣ Add Domain transer.app (1 phút)

Trong Vercel:

1. Settings → **Domains**
2. Nhập: `transer.app`
3. Click **"Add"**

Vercel hiển thị DNS records cần config:

```
A Record:
@ → 76.76.21.21

CNAME:
www → cname.vercel-dns.com
```

### 4️⃣ Config Namecheap DNS (1 phút)

1. Đăng nhập **Namecheap.com**
2. Domain List → **transer.app** → **Manage**
3. Tab **"Advanced DNS"**
4. **Xóa** records cũ
5. **Thêm** 2 records:

```
A Record
Host: @
Value: 76.76.21.21

CNAME Record  
Host: www
Value: cname.vercel-dns.com
```

6. **Save All Changes**

### 5️⃣ Verify & Done! ✅

Trong Vercel → Domains → Click **"Verify"**

**Đợi 5-10 phút** → Xong!

---

## 🎉 Kết quả

```
✅ https://transer.app          - Working!
✅ https://www.transer.app      - Working!
✅ SSL Certificate              - Automatic!
✅ Auto Deploy on Git Push      - Enabled!
```

---

## 🚀 Hoặc dùng Script Auto

```bash
# Make script executable
chmod +x deploy.sh

# Run
./deploy.sh
```

Script sẽ tự động:
- ✅ Build production
- ✅ Commit changes
- ✅ Deploy to Vercel

---

## 📊 Sau khi Deploy

### Update on every push

```bash
git add .
git commit -m "Update features"
git push
```

Vercel tự động build & deploy! 🎉

### Check deployment

Vào Vercel dashboard xem:
- Build logs
- Deployment status
- Analytics
- Domain settings

---

## ❓ Nếu có lỗi

**Build Failed:**
```bash
npm install --legacy-peer-deps
npm run build
```

**Domain không work:**
- Check [NAMECHEAP_DNS.md](./NAMECHEAP_DNS.md)
- Đợi 10-30 phút DNS propagation

**Need help:**
- Chi tiết: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Namecheap DNS: [NAMECHEAP_DNS.md](./NAMECHEAP_DNS.md)

---

## 🎯 Total Time: ~5-10 minutes

**Plus DNS propagation: 10-30 minutes**

Sau đó website live tại: **https://transer.app** 🚀

