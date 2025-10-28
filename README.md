# Transor - AI Document Translator & Polisher

> Professional AI-powered document translation with support for multiple LLM providers

🌐 **Live at:** [transer.app](https://transer.app)

## ✨ Features

### 🔐 Authentication
- Email/password registration and login
- Social login ready (Google, GitHub)
- Session management

### 💰 Subscription Plans
- **Free** - Demo access, view features
- **Pro ($15/mo)** - 100K tokens, all AI models
- **Enterprise ($45/mo)** - 1M tokens, premium features

### 🤖 AI Models Supported
- OpenAI GPT-4
- Google Gemini Pro
- Grok-1
- Anthropic Claude 3

### 📄 Document Processing
- Upload DOCX, PDF, DOC, RTF, ODT
- Bilingual view
- Source text cleaning
- Word-by-word tooltips
- Export to DOCX/PDF

### 📊 Token Management
- Real-time usage tracking
- Usage statistics
- Low balance warnings
- Auto-renewal

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev

# Open http://localhost:3001
```

### Build for Production

```bash
# Build
npm run build

# Preview build
npm run preview
```

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to **transer.app**

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Then configure custom domain in Vercel dashboard.

## 📁 Project Structure

```
transor/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── LLMProviderSelector.tsx
│   │   └── TokenUsageDisplay.tsx
│   ├── contexts/         # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── DocumentContext.tsx
│   │   └── SettingsContext.tsx
│   ├── pages/           # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── PricingPage.tsx
│   │   └── JobsPage.tsx
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   └── utils/           # Utilities
├── public/              # Static assets
└── index.html          # Entry point
```

## 🔑 Environment Variables

Create `.env` file:

```env
VITE_API_URL=https://api.transer.app
VITE_OPENAI_KEY=your_openai_key
VITE_GEMINI_KEY=your_gemini_key
VITE_GROK_KEY=your_grok_key
VITE_CLAUDE_KEY=your_claude_key
VITE_STRIPE_KEY=your_stripe_key
```

## 🛠 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build:** Vite 4
- **Styling:** Tailwind CSS 3
- **Routing:** React Router 6
- **Animation:** Framer Motion
- **State:** React Context
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## 📝 Key Features Documentation

See [FEATURES.md](./FEATURES.md) for detailed feature documentation.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

- Email: support@transer.app
- Documentation: [docs.transer.app](https://docs.transer.app)
- Issues: [GitHub Issues](https://github.com/yourusername/transor/issues)

## 🚀 Roadmap

- [ ] Backend API integration
- [ ] Real payment processing (Stripe)
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile apps (iOS/Android)
- [ ] API for developers
- [ ] Webhooks
- [ ] Custom AI model training

---

Built with ❤️ by the Transor Team

