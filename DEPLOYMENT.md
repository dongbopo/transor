# 🚀 Hướng dẫn Deploy Transer lên transer.app

## Phương án 1: Vercel (Khuyên dùng - Dễ nhất)

### Bước 1: Push code lên GitHub

```bash
# Khởi tạo Git repository (nếu chưa có)
cd /Users/dongbo/transor
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit - Transer with auth, pricing, and LLM selection"

# Tạo repository trên GitHub (https://github.com/new)
# Sau đó link và push:
git remote add origin https://github.com/YOUR_USERNAME/transor.git
git branch -M main
git push -u origin main
```

### Bước 2: Deploy lên Vercel

1. Truy cập: **https://vercel.com**
2. Đăng nhập bằng GitHub
3. Click **"New Project"**
4. Import repository `transor`
5. Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps`
6. Click **"Deploy"**

### Bước 3: Add Custom Domain (transer.app)

**Trong Vercel Dashboard:**

1. Vào project Transer
2. Click **"Settings"** → **"Domains"**
3. Add domain: `transer.app`
4. Add domain: `www.transer.app` (optional)

Vercel sẽ cung cấp DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Bước 4: Config DNS trên Namecheap

1. Đăng nhập **Namecheap.com**
2. Vào **Domain List** → Click **Manage** bên cạnh `transer.app`
3. Chọn tab **"Advanced DNS"**
4. Xóa các records cũ (nếu có)
5. Thêm records từ Vercel:

```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic

Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

6. Click **"Save"**

### Bước 5: Verify trong Vercel

Quay lại Vercel → Click **"Verify"**

✅ **Xong!** Sau 5-10 phút, website sẽ live tại:
- `https://transer.app`
- `https://www.transer.app`

---

## Phương án 2: Netlify

### Deploy bằng Netlify CLI

```bash
# Cài Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod

# Add custom domain trong Netlify Dashboard
# Rồi config DNS giống như Vercel
```

---

## Phương án 3: Manual Deploy (Shared Hosting)

Nếu bạn có shared hosting:

```bash
# Build production
npm run build

# Upload folder 'dist/' lên hosting qua FTP
# Point domain đến folder đó
```

### Config .htaccess (cho Apache)

Tạo file `.htaccess` trong folder `dist/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🔧 Build Commands

### Local build test

```bash
# Build
npm run build

# Preview
npm run preview
```

### Environment Variables

Nếu cần API keys, tạo file `.env`:

```env
VITE_API_URL=https://api.transer.app
VITE_OPENAI_KEY=your_key
VITE_STRIPE_KEY=your_key
```

Trong Vercel: **Settings** → **Environment Variables**

---

## 📊 Post-Deployment Checklist

- [ ] Website load được tại transer.app
- [ ] HTTPS hoạt động
- [ ] Login/Signup works
- [ ] Pricing page hiển thị đúng
- [ ] Upload documents works
- [ ] Responsive trên mobile

---

## 🚨 Troubleshooting

### Domain chưa work sau 24h
- Check DNS propagation: https://dnschecker.org
- Verify DNS records đúng
- Clear browser cache

### Build errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### 404 errors khi reload page
- Check vercel.json có đúng
- Hoặc thêm routing config

---

## 🎯 Recommended: Vercel + GitHub

**Lý do:**
- ✅ Auto deploy khi push code
- ✅ Preview deployments cho mỗi PR
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ Zero config
- ✅ Easy rollback

**Workflow:**
```
Push to GitHub → Auto build → Auto deploy → Live in 30s
```

---

Need help? Contact: support@transer.app 😊

