# 🌐 Hướng dẫn Config DNS trên Namecheap cho transer.app

## Bước 1: Lấy DNS Records từ Vercel

Sau khi deploy lên Vercel và add domain `transer.app`, Vercel sẽ cung cấp DNS records.

### Thông thường sẽ là:

**Option 1: A Record (Recommended)**
```
Type: A
Host: @
Value: 76.76.21.21
TTL: Automatic
```

**Option 2: CNAME**
```
Type: CNAME  
Host: @
Value: cname.vercel-dns.com
TTL: Automatic
```

**WWW subdomain:**
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

---

## Bước 2: Config trên Namecheap

### 1. Đăng nhập Namecheap

Truy cập: https://www.namecheap.com

### 2. Vào Domain List

1. Click **"Domain List"** ở sidebar
2. Tìm domain **transer.app**
3. Click button **"Manage"**

### 3. Chuyển sang Advanced DNS

1. Click tab **"Advanced DNS"**
2. Bạn sẽ thấy danh sách DNS records hiện tại

### 4. Xóa Records cũ

Xóa các records sau (nếu có):
- URL Redirect Record
- Parking Page records
- Default A records

**Chỉ giữ lại:**
- NS records (nameserver) - ĐỪNG XÓA CÁI NÀY!

### 5. Thêm Records mới

#### Thêm A Record cho Root Domain

Click **"Add New Record"**

```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic (hoặc 1 min)
```

#### Thêm CNAME cho WWW

Click **"Add New Record"**

```
Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

### 6. Save Changes

Click **"Save All Changes"** ở góc phải

---

## Bước 3: Verify

### Trong Vercel Dashboard

1. Quay lại Vercel
2. Vào Project → Settings → Domains
3. Bạn sẽ thấy domain `transer.app` đang "Pending"
4. Click **"Verify"** hoặc **"Refresh"**

**Thời gian:** 5-30 phút (DNS propagation)

### Check DNS Propagation

Vào: https://dnschecker.org

Nhập: `transer.app`

Chờ cho đến khi thấy:
- ✅ Hầu hết locations đều có A record mới
- ✅ IP là 76.76.21.21 (hoặc IP Vercel khác)

---

## Bước 4: Enable HTTPS (Auto)

Vercel tự động issue SSL certificate từ Let's Encrypt.

Sau khi verify thành công:
- `http://transer.app` → Auto redirect sang HTTPS
- `https://transer.app` → ✅ Secure
- `https://www.transer.app` → ✅ Secure

---

## 🎯 Kết quả mong đợi

```
https://transer.app          ✅ Works
https://www.transer.app      ✅ Works  
http://transer.app           → Redirects to HTTPS
http://www.transer.app       → Redirects to HTTPS
```

---

## 🚨 Troubleshooting

### Domain vẫn không work sau 24h

**Check 1: DNS Nameservers**
```
Namecheap Dashboard → Domain List → Manage
Tab "Domain" → Nameservers

Should be:
- dns1.registrar-servers.com
- dns2.registrar-servers.com
```

Nếu sai, chuyển về "Namecheap BasicDNS"

**Check 2: Verify Records**

Trong Namecheap Advanced DNS, records phải giống y hệt:

```
Type        Host    Value                       TTL
A Record    @       76.76.21.21                Automatic
CNAME       www     cname.vercel-dns.com       Automatic
```

**Check 3: Clear DNS Cache**

Mac/Linux:
```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

Windows:
```cmd
ipconfig /flushdns
```

**Check 4: Use Different DNS**

Thử đổi DNS sang:
- Google: 8.8.8.8, 8.8.4.4
- Cloudflare: 1.1.1.1, 1.0.0.1

### SSL Certificate Pending

Vercel cần 30-60 phút để issue certificate.

Nếu lâu hơn:
1. Remove domain trong Vercel
2. Wait 5 minutes
3. Add lại domain
4. Re-verify

### Wrong IP Address

Nếu Vercel cho IP khác (không phải 76.76.21.21):

1. Xem trong Vercel dashboard
2. Settings → Domains → transer.app
3. Copy chính xác DNS records Vercel cung cấp
4. Update trong Namecheap

---

## 📞 Support

Nếu vẫn không work:

**Namecheap Support:**
- Live Chat: https://www.namecheap.com
- Ticket: support@namecheap.com

**Vercel Support:**
- Discord: https://vercel.com/discord
- Support: vercel.com/support

---

## ✅ Final Checklist

- [ ] A Record added with correct IP
- [ ] CNAME for www added
- [ ] Old records removed
- [ ] Changes saved on Namecheap
- [ ] Verified in Vercel dashboard
- [ ] DNS propagation complete (dnschecker.org)
- [ ] HTTPS working
- [ ] Website loads at transer.app
- [ ] www.transer.app redirects properly

---

**Expected Timeline:**
- DNS update: 5-30 minutes
- SSL certificate: 30-60 minutes
- Full propagation: 1-4 hours

**🎉 Sau khi xong, website sẽ live tại https://transer.app!**

