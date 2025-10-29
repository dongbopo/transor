# 🔐 Backend Integration Guide

## Overview

Transer is currently using a **mock authentication system** that stores data in localStorage. To make it production-ready, you need to integrate with a real backend.

## Quick Start Options

### Option 1: Supabase (Recommended - Fastest) ⚡

Supabase provides authentication, database, and storage out of the box.

**Setup (5 minutes):**

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Install Supabase client:
```bash
npm install @supabase/supabase-js
```

4. Create `/src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

5. Update `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

6. Update `AuthContext.tsx` to use Supabase:
```typescript
import { supabase } from '../lib/supabase';

// In login function:
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// In signup function:
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { name }
  }
});
```

**Database Schema:**
```sql
-- Users table (Supabase creates this automatically)

-- API Keys table
create table api_keys (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  provider text not null,
  encrypted_key text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table api_keys enable row level security;

-- Create policies
create policy "Users can only see their own keys"
  on api_keys for select
  using (auth.uid() = user_id);

create policy "Users can insert their own keys"
  on api_keys for insert
  with check (auth.uid() = user_id);
```

---

### Option 2: Firebase 🔥

Firebase is Google's backend platform with excellent authentication.

**Setup:**

1. Create project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Install Firebase:
```bash
npm install firebase
```

4. Create `/src/lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

### Option 3: Custom Backend 🛠️

Build your own Node.js/Express backend.

**Tech Stack:**
- Node.js + Express
- PostgreSQL or MongoDB
- JWT for authentication
- bcrypt for password hashing

**API Endpoints Needed:**

```
POST   /api/auth/signup      - Register new user
POST   /api/auth/login       - Login user
POST   /api/auth/logout      - Logout user
GET    /api/auth/me          - Get current user
POST   /api/auth/refresh     - Refresh JWT token

POST   /api/api-keys         - Save API key
GET    /api/api-keys         - Get user's API keys
DELETE /api/api-keys/:id     - Delete API key

POST   /api/documents/upload - Upload document
GET    /api/documents        - Get user's documents
GET    /api/documents/:id    - Get specific document
```

**Example Express Server:**

```typescript
// server.ts
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  
  // Generate JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '7d',
  });
  
  res.json({ user, token });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Check password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generate JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '7d',
  });
  
  res.json({ user, token });
});
```

---

## Security Best Practices

### 1. API Key Encryption

**Frontend (before sending to backend):**
```typescript
// Don't store raw API keys!
import CryptoJS from 'crypto-js';

const encryptAPIKey = (key: string, userSecret: string) => {
  return CryptoJS.AES.encrypt(key, userSecret).toString();
};
```

**Backend:**
```typescript
// Encrypt before storing in database
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const ALGORITHM = 'aes-256-gcm';

function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
    tag: authTag.toString('hex')
  };
}
```

### 2. Environment Variables

Never commit API keys or secrets! Use `.env` files:

```env
# .env.local (Never commit this!)
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_API_URL=http://localhost:3000/api
```

### 3. HTTPS Only

Always use HTTPS in production. Vercel does this automatically.

### 4. Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
});

app.post('/api/auth/login', authLimiter, loginHandler);
```

---

## Current Mock Auth System

The current system in `src/contexts/AuthContext.tsx`:
- Stores users in `localStorage.transor_users`
- Stores current session in `localStorage.transor_user`
- **NOT suitable for production**
- **Replace with one of the options above**

---

## Migration Checklist

- [ ] Choose backend option (Supabase/Firebase/Custom)
- [ ] Set up backend project
- [ ] Create database tables/collections
- [ ] Implement authentication endpoints
- [ ] Update `AuthContext.tsx` to use real API
- [ ] Implement API key encryption
- [ ] Add environment variables
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test API key storage
- [ ] Deploy backend
- [ ] Update frontend environment variables
- [ ] Test in production

---

## Support

For questions about backend integration:
- Supabase: [docs.supabase.com](https://docs.supabase.com)
- Firebase: [firebase.google.com/docs](https://firebase.google.com/docs)
- Custom: Check Express.js and Prisma documentation

---

**Current Status:** ⚠️ Mock authentication (dev only)  
**Target:** ✅ Production-ready authentication with encrypted API keys

