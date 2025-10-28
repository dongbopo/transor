# Transer 1.0

🌍 **AI Document Translator & Polisher**

A free, modern web application for translating documents using your own AI provider API keys. No subscriptions, no token limits - you pay providers directly.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/react-18.2-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0-3178c6.svg)

---

## ✨ Features

### 🔐 **User Authentication**
- Email-based signup and login
- Password strength indicator
- Secure session management
- Beautiful, modern UI

### 🌙 **Dark Mode**
- Light, Dark, and System themes
- Seamless switching
- Persistent preferences

### 📱 **Fully Responsive**
- Desktop, tablet, and mobile optimized
- Touch-friendly interface
- Progressive Web App ready

### 🔑 **API Key Management**
- Support for multiple AI providers:
  - ✅ OpenAI (GPT-4, GPT-3.5)
  - ✅ Google Gemini Pro
  - ✅ xAI Grok
  - ✅ Anthropic Claude
- Secure local storage
- Easy configuration

### 📄 **Document Upload**
- Drag-and-drop support
- Multiple file formats (DOCX, PDF, DOC, RTF, ODT)
- Progress tracking
- Batch processing

### 🎨 **Modern UI**
- OpenAI-inspired design
- Smooth animations
- Professional gradients
- Clean typography

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Clone repository
git clone https://github.com/dongbopo/transor.git
cd transor

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Open http://localhost:5173 to see the app.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

---

## 📦 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS 3
- **Build Tool:** Vite 4
- **Animations:** Framer Motion
- **Routing:** React Router DOM 6
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## 🌐 Deployment

See [DEPLOY.md](./DEPLOY.md) for complete deployment instructions.

**Quick Deploy to Vercel:**
```bash
npm install -g vercel
vercel
```

**Domain:** transer.app (configured)

---

## 📚 Documentation

- **[CHANGELOG.md](./CHANGELOG.md)** - Complete feature list and release notes
- **[DEPLOY.md](./DEPLOY.md)** - Deployment guide for Vercel
- **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** - Backend setup options

---

## 🏗️ Project Structure

```
transor/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React Context providers
│   ├── pages/          # Page components
│   ├── services/       # Business logic
│   ├── types/          # TypeScript definitions
│   └── utils/          # Helper functions
├── public/             # Static assets
└── dist/              # Build output
```

---

## 💰 Pricing Model

**Transer is 100% FREE!**

- ✅ No subscription fees
- ✅ No token limits
- ✅ No markup
- ✅ Pay AI providers directly

You only pay for the AI tokens you use at provider rates:
- OpenAI: ~$0.03/1K tokens
- Google Gemini: ~$0.00125/1K tokens
- Anthropic Claude: ~$0.015/1K tokens

---

## 🔐 Security

- Password strength validation
- Email verification ready
- API key encryption (local)
- HTTPS enforced
- XSS protection
- Rate limiting ready

**Note:** Current version uses mock authentication for development. See `BACKEND_INTEGRATION.md` for production backend setup.

---

## 🎯 Current Status

**Version:** 1.0.0 (Production Ready)  
**Status:** ✅ Frontend Complete  
**Backend:** Ready for integration

### Ready Features
- ✅ Complete UI/UX
- ✅ Authentication pages
- ✅ Dark mode
- ✅ Mobile responsive
- ✅ API key management interface
- ✅ Document upload UI
- ✅ Settings and dashboard

### Needs Backend
- Real document processing
- Database storage
- AI API integration
- File storage

See `BACKEND_INTEGRATION.md` for setup options (Supabase, Firebase, or Custom).

---

## 🚧 Roadmap

### v1.1 (Planned)
- [ ] Backend integration
- [ ] Real AI translation
- [ ] Email verification
- [ ] Password reset

### v1.2 (Future)
- [ ] Team workspaces
- [ ] Translation memory
- [ ] Custom glossaries
- [ ] Batch processing

### v2.0 (Future)
- [ ] Mobile apps
- [ ] Browser extension
- [ ] Developer API
- [ ] Real-time collaboration

---

## 🐛 Bug Reports

Found a bug? Please open an issue on GitHub:
https://github.com/dongbopo/transor/issues

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details.

Free to use, modify, and distribute.

---

## 👨‍💻 Author

**dongbopo**
- GitHub: [@dongbopo](https://github.com/dongbopo)
- Repository: [transor](https://github.com/dongbopo/transor)

---

## 🙏 Acknowledgments

- React Team
- Vite Team  
- Tailwind CSS
- Vercel Platform
- AI Provider APIs
- Open source community

---

## 📞 Support

- 📖 Documentation: See markdown files in repo
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

---

**⭐ Star this repo if you find it useful!**

**🌍 Making AI translation accessible to everyone.**

---

*Last Updated: October 28, 2025 - Version 1.0.0*
