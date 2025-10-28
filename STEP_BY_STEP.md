# 📝 Deploy Transor - Từng Bước Chi Tiết

## ✅ Checklist - Check off khi hoàn thành

- [ ] Xcode Command Line Tools đã cài xong
- [ ] Git repository đã khởi tạo
- [ ] Code đã commit
- [ ] Tạo repository trên GitHub
- [ ] Push code lên GitHub
- [ ] Deploy lên Vercel
- [ ] Add domain transer.app
- [ ] Config DNS trên Namecheap
- [ ] Verify domain
- [ ] Website live!

---

## Bước 1️⃣: Kiểm tra Xcode đã cài xong chưa

**Chạy command này:**

```bash
git --version
```

Nếu hiển thị version (vd: `git version 2.39.0`) → ✅ Đã xong!

Nếu báo lỗi → ⏳ Vẫn đang cài, đợi thêm

---

## Bước 2️⃣: Khởi tạo Git & Commit

```bash
cd /Users/dongbo/transor

# Init git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Transor app with auth, pricing, LLM selection"

# Check status
git status
```

✅ Kết quả: `nothing to commit, working tree clean`

---

## Bước 3️⃣: Tạo Repository trên GitHub

**Mở trình duyệt:**

1. Vào: **https://github.com/new**
2. Đăng nhập GitHub (nếu chưa)
3. Repository name: **transor**
4. Description: `AI Document Translator with multiple LLM providers`
5. **Public** (hoặc Private nếu muốn)
6. ⚠️ **KHÔNG** tick:
   - ❌ Add README
   - ❌ Add .gitignore
   - ❌ Choose a license
7. Click **"Create repository"**

✅ GitHub sẽ hiển thị trang với instructions

---

## Bước 4️⃣: Push Code lên GitHub

**Copy commands từ GitHub, hoặc dùng:**

```bash
cd /Users/dongbo/transor

# Add remote (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/transor.git

# Rename branch to main
git branch -M main

# Push
git push -u origin main
```

**Nếu hỏi username/password:**
- Username: GitHub username của bạn
- Password: Dùng **Personal Access Token** (không phải password)
  - Tạo tại: https://github.com/settings/tokens
  - Permissions: `repo` (full control)

✅ Kết quả: Code đã ở trên GitHub!

---

## Bước 5️⃣: Deploy lên Vercel

**Mở trình duyệt:**

1. Vào: **https://vercel.com**
2. Click **"Sign Up"** hoặc **"Log In"**
3. Chọn **"Continue with GitHub"**
4. Authorize Vercel access to GitHub

**Import Project:**

5. Click **"Add New..."** → **"Project"**
6. Tìm repository **transor** → Click **"Import"**

**Configure Project:**

7. **Framework Preset:** Vite
8. **Root Directory:** `./` (leave as is)
9. **Build Command:** `npm run build` (auto-detected)
10. **Output Directory:** `dist` (auto-detected)
11. **Install Command:** `npm install --legacy-peer-deps`

**Environment Variables (Optional - bỏ qua bước này):**
- Chưa cần add gì

12. Click **"Deploy"** 🚀

⏳ Đợi 1-2 phút...

✅ Deploy thành công! Bạn sẽ có URL: `https://transor-xxx.vercel.app`

---

## Bước 6️⃣: Add Custom Domain

**Trong Vercel Dashboard:**

1. Click vào project **transor** vừa deploy
2. Vào tab **"Settings"** (top menu)
3. Sidebar: Click **"Domains"**
4. Input field: Nhập `transer.app`
5. Click **"Add"**

**Vercel sẽ hiển thị:**

```
⚠️ Invalid Configuration

To configure your domain, add the following DNS records:

Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

**⚠️ QUAN TRỌNG:** Copy/chụp màn hình 2 records này!

---

## Bước 7️⃣: Config DNS trên Namecheap

**Mở tab mới:**

1. Vào: **https://www.namecheap.com**
2. Đăng nhập
3. Dashboard → **"Domain List"**
4. Tìm **transer.app** → Click **"Manage"**
5. Chọn tab **"Advanced DNS"**

**Xóa records cũ:**

6. Xóa tất cả records TRỪ:
   - Nameserver (NS) records - GIỮ LẠI!
   - Xóa: Parking page, URL Redirect, A records cũ

**Thêm records mới:**

7. Click **"Add New Record"**

**Record 1:**
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic
```

8. Click **"Add New Record"** lần nữa

**Record 2:**
```
Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

9. Click **"Save All Changes"** (góc phải, nút xanh)

✅ DNS records đã được cập nhật!

---

## Bước 8️⃣: Verify Domain trong Vercel

**Quay lại Vercel:**

1. Ở trang Domains → transer.app
2. Click **"Refresh"** hoặc **"Verify"**
3. Status sẽ chuyển từ `Invalid` → `Pending`

⏳ **Đợi 5-30 phút** để DNS propagate

**Check DNS propagation:**

Vào: https://dnschecker.org
- Nhập: `transer.app`
- Check: Thấy IP `76.76.21.21` ở nhiều locations → ✅ OK

---

## Bước 9️⃣: Enable HTTPS (Tự động)

Vercel tự động issue SSL certificate từ Let's Encrypt.

Sau khi domain verify thành công:
- Status: `Valid`
- Certificate: `Issued`

⏳ **Đợi 30-60 phút** để SSL certificate được issue

---

## Bước 🔟: Test Website

**Mở trình duyệt:**

```
✅ https://transer.app          → Should load website
✅ https://www.transer.app      → Should redirect to transer.app
✅ http://transer.app           → Should redirect to HTTPS
```

**Test features:**
1. ✅ Homepage loads
2. ✅ Click "Sign up"
3. ✅ Create account
4. ✅ Go to Pricing
5. ✅ Upgrade to Pro
6. ✅ Upload documents
7. ✅ See token usage

---

## 🎉 DONE!

Website đã live tại: **https://transer.app**

---

## 📊 Timeline Summary

- **Step 1-2:** Git setup - 2 phút
- **Step 3-4:** GitHub - 3 phút
- **Step 5:** Vercel deploy - 2 phút
- **Step 6-7:** DNS config - 3 phút
- **Step 8:** DNS propagation - 10-30 phút
- **Step 9:** SSL certificate - 30-60 phút

**Total active time:** ~10 phút
**Total wait time:** ~1 giờ

---

## 🆘 Need Help?

- **Build fails:** `npm install --legacy-peer-deps && npm run build`
- **Git errors:** Đọc lại Step 2
- **DNS not working:** Đợi thêm, hoặc đọc `NAMECHEAP_DNS.md`
- **Vercel issues:** Check build logs trong Vercel dashboard

---

**🎯 Current Status:** Đang đợi Xcode Command Line Tools cài xong...

Sau khi cài xong, chạy: `git --version` để kiểm tra!

