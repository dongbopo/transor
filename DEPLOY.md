# 🚀 Deploy Transer to Production

## Quick Deploy Guide (5 minutes)

### Prerequisites
- ✅ GitHub account (đã có: dongbopo/transor)
- ✅ Domain đã mua: transer.app
- ✅ Code đã push lên GitHub

---

## Step 1: Deploy to Vercel

### Option A: Deploy qua Web (Dễ nhất - Recommended)

1. **Truy cập Vercel**
   ```
   https://vercel.com/signup
   ```

2. **Sign up/Login với GitHub**
   - Click "Continue with GitHub"
   - Authorize Vercel

3. **Import Project**
   - Click "Add New" → "Project"
   - Select repository: `dongbopo/transor`
   - Click "Import"

4. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install --legacy-peer-deps
   ```

5. **Environment Variables** (Thêm sau khi deploy xong)
   - Bỏ qua bước này lúc đầu
   - Sẽ add sau

6. **Deploy!**
   - Click "Deploy"
   - Đợi 2-3 phút
   - ✅ Done! Bạn sẽ có URL: `https://transor-xxx.vercel.app`

### Option B: Deploy qua CLI (Nhanh hơn)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd /Users/dongbo/transor
   vercel
   ```

4. **Follow prompts:**
   ```
   ? Set up and deploy? Yes
   ? Which scope? Your account
   ? Link to existing project? No
   ? What's your project's name? transor
   ? In which directory is your code? ./
   ? Want to override settings? No
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## Step 2: Add Custom Domain (transer.app)

### A. In Vercel Dashboard

1. Go to your project: https://vercel.com/[your-username]/transor
2. Click "Settings" → "Domains"
3. Add domain: `transer.app`
4. Add domain: `www.transer.app`
5. Vercel sẽ show DNS records cần config

### B. Configure Namecheap DNS

1. **Login to Namecheap**
   ```
   https://namecheap.com
   ```

2. **Go to Domain List**
   - Click "Manage" bên cạnh `transer.app`

3. **Advanced DNS Settings**
   - Click tab "Advanced DNS"

4. **Add Records:**

   **For root domain (transer.app):**
   ```
   Type: A Record
   Host: @
   Value: 76.76.21.21
   TTL: Automatic
   ```

   **For www subdomain:**
   ```
   Type: CNAME Record
   Host: www
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```

5. **Save Changes**
   - Wait 5-10 minutes for DNS propagation

### C. Verify in Vercel

1. Return to Vercel Dashboard
2. Wait for green checkmark next to domain
3. SSL certificate will be issued automatically (2-5 minutes)

---

## Step 3: Environment Variables (Optional for now)

Hiện tại app chạy với localStorage, không cần env vars.

Khi bạn integrate backend (Supabase/Firebase), add these:

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

**To add in Vercel:**
1. Project Settings → Environment Variables
2. Add key-value pairs
3. Redeploy

---

## Step 4: Test Deployment

1. **Visit your site:**
   ```
   https://transer.app
   ```

2. **Test features:**
   - ✅ Sign up new account
   - ✅ Login
   - ✅ Toggle dark mode
   - ✅ Navigate pages
   - ✅ Upload documents (mock)
   - ✅ Add API keys in Settings
   - ✅ Mobile responsive
   - ✅ Try on phone

3. **Check SSL:**
   - Look for 🔒 padlock in browser
   - Certificate should be valid

---

## Automatic Deployments

Vercel tự động deploy mỗi khi bạn push code:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys! 🚀
```

**Production URL:** https://transer.app
**Preview URLs:** Mỗi branch/PR gets unique URL

---

## Monitoring & Analytics

### Vercel Dashboard provides:
- 📊 Page views
- ⚡ Performance metrics
- 🐛 Error logs
- 🌍 Geographic traffic
- 📈 Bandwidth usage

Access at: https://vercel.com/[username]/transor/analytics

---

## Common Issues & Solutions

### Issue 1: 404 on page refresh
**Solution:** ✅ Already fixed with `vercel.json` rewrites

### Issue 2: Build fails
**Solution:** Use `npm install --legacy-peer-deps` in build command

### Issue 3: Domain not working
**Solution:** 
- Wait 10-15 minutes for DNS propagation
- Clear browser cache
- Try incognito mode
- Check DNS with: `dig transer.app`

### Issue 4: SSL certificate pending
**Solution:** 
- Usually takes 2-5 minutes
- If > 30 minutes, remove domain and re-add

---

## Performance Optimization

### Already Optimized:
- ✅ Vite build optimization
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Image optimization
- ✅ Minification

### Vercel provides:
- ✅ Global CDN
- ✅ HTTP/2
- ✅ Gzip compression
- ✅ Caching

Expected load time: **< 1 second** ⚡

---

## Support

**Vercel Documentation:** https://vercel.com/docs
**Namecheap DNS:** https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/

---

## Checklist

- [ ] Deploy to Vercel
- [ ] Get deployment URL
- [ ] Add transer.app domain in Vercel
- [ ] Configure Namecheap DNS
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate
- [ ] Test all features
- [ ] Share with users! 🎉

---

**Current Status:** Ready to deploy! 🚀
**Estimated Time:** 10-15 minutes total

