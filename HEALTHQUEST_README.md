# HealthQuest App - Sơ bộ MVP

Ứng dụng HealthQuest là một ứng dụng theo dõi sức khỏe với gamification, được xây dựng dựa trên tài liệu BA Research.

## 🚀 Tính năng đã triển khai

### ✅ Core Features (MVP Phase 1)

1. **Dashboard chính**
   - Health Score với breakdown chi tiết
   - Companion (Pet/Plant) display với health states
   - Daily Quests tracking
   - Today's Progress (Steps, Water, Sleep)
   - Streak counter
   - Points balance

2. **Health Data Tracking**
   - Quick log modal để nhập dữ liệu sức khỏe
   - Hỗ trợ nhiều loại dữ liệu: steps, water, weight, sleep, mood
   - Auto-update health score và quest progress

3. **Gamification System**
   - Points system (earn khi log data, complete quests)
   - Daily Quests (tự động generate mỗi ngày)
   - Streak tracking
   - Basic Achievements system
   - Companion với 5 stages và 5 health states

4. **Stats & Insights Page**
   - Thống kê theo week/month/year
   - Achievement showcase
   - Progress tracking

5. **Data Persistence**
   - Tất cả dữ liệu được lưu vào LocalStorage
   - Auto-initialize với default data khi lần đầu chạy

## 📁 Cấu trúc Files

```
src/
├── types/
│   └── healthquest.ts          # TypeScript types và interfaces
├── services/
│   ├── HealthQuestStorage.ts    # LocalStorage service
│   └── HealthQuestService.ts     # Business logic service
├── contexts/
│   └── HealthQuestContext.tsx   # React Context provider
├── components/
│   └── healthquest/
│       ├── CompanionDisplay.tsx  # Pet/Plant display component
│       ├── HealthScoreCard.tsx   # Health score card
│       ├── QuestList.tsx         # Daily quests list
│       ├── ProgressCards.tsx     # Today's progress cards
│       └── QuickLogModal.tsx      # Quick log modal
└── pages/
    ├── HealthQuestDashboard.tsx  # Main dashboard
    └── HealthQuestStats.tsx      # Stats page
```

## 🎮 Cách sử dụng

1. **Truy cập Dashboard:**
   - Mở browser và điều hướng đến `http://localhost:3000/healthquest`

2. **Log Health Data:**
   - Click nút "+" (FAB) ở góc phải dưới
   - Chọn loại dữ liệu (Steps, Water, Sleep, etc.)
   - Nhập giá trị hoặc dùng Quick Actions
   - Click "Log Entry"

3. **Theo dõi Progress:**
   - Xem Health Score trên dashboard
   - Kiểm tra daily quests và hoàn thành để nhận points
   - Theo dõi streak counter
   - Xem progress của Steps, Water, Sleep trong ngày

4. **Companion Interaction:**
   - Click vào companion để tương tác
   - Companion sẽ tự động update health state dựa trên health score

5. **Xem Stats:**
   - Click nút "Stats" trên dashboard
   - Chọn period (Week/Month/Year)
   - Xem achievements đã unlock

## 📊 Health Score Calculation

Health Score được tính dựa trên 5 thành phần:

- **Activity (30%)**: Dựa trên steps so với daily goal
- **Nutrition (20%)**: Dựa trên water intake so với goal
- **Sleep (20%)**: Dựa trên sleep duration so với goal
- **Vitals (15%)**: Placeholder (simplified for MVP)
- **Consistency (15%)**: Dựa trên số ngày đã log data

## 🎯 Companion System

Companion có 5 health states:
- **Thriving** (90-100): 🌟
- **Healthy** (70-89): 😊
- **Okay** (50-69): 🙂
- **Struggling** (30-49): 😐
- **Unwell** (0-29): 😔

Companion có 5 growth stages:
- **Stage 1**: Days 1-7 (Seedling/Baby)
- **Stage 2**: Days 8-30 (Sprout/Young)
- **Stage 3**: Days 31-90 (Growing/Teen)
- **Stage 4**: Days 91-365 (Mature/Adult)
- **Stage 5**: Days 365+ (Blooming/Evolved)

## 🏆 Achievement System

Một số achievements mặc định:
- **First Steps**: Log data for 1 day (+10 pts)
- **Week Warrior**: Maintain 7-day streak (+100 pts)
- **Walker**: Walk 10,000 steps in a day (+50 pts)

## 🔮 Tính năng chưa triển khai (Future)

Các tính năng từ Phase 2+ chưa được implement:
- Apple Health / Google Fit integration
- Push notifications
- Social features (friends, challenges)
- Advanced analytics với charts
- Shop system
- Multiple companions
- Premium features

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State Management**: React Context API
- **Data Persistence**: LocalStorage
- **Toast Notifications**: react-hot-toast

## 📝 Notes

- Đây là phiên bản MVP sơ bộ, chỉ sử dụng LocalStorage (không có backend)
- Dữ liệu sẽ bị mất nếu clear browser cache
- Chưa có authentication system (dùng default user)
- Một số tính năng đã được simplified so với spec đầy đủ

## 🚧 Next Steps

Để hoàn thiện app theo đúng spec:
1. Thêm backend API integration
2. Implement authentication
3. Thêm Apple Health / Google Fit sync
4. Build shop system với item purchases
5. Implement social features
6. Thêm advanced charts và insights
7. Push notifications
8. Multi-language support

---

**Để chạy app:**
```bash
npm run dev
```

Sau đó truy cập: `http://localhost:3000/healthquest`

