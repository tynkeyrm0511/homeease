# 🏠 HomeEase

Hệ thống quản lý chung cư hiện đại

## 📑 Giới thiệu

HomeEase là phần mềm quản lý chung cư toàn diện, giúp đơn giản hóa việc quản lý cư dân, dịch vụ, hóa đơn và thông báo trong các khu chung cư.

## ✨ Tính năng

- Quản lý thông tin cư dân
- Xử lý yêu cầu dịch vụ
- Quản lý hóa đơn
- Hệ thống thông báo
- Phân quyền người dùng

## 🛠️ Công nghệ

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT

### Frontend
- React
- Bootstrap
- Ant Design
- Vite
- Axios

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 18+ (LTS recommended)
- PostgreSQL 14+
- npm 8+ hoặc yarn 1.22+
- RAM: tối thiểu 4GB
- Ổ cứng: tối thiểu 1GB dung lượng trống

### Backend Setup
```bash
# Clone repository
git clone https://github.com/tynkeyrm0511/homeease.git
cd homeease

# Setup backend
cd backend-api-homeease
npm install
cp .env.example .env     # Copy và chỉnh sửa file .env
npx prisma generate      # Generate Prisma Client
npx prisma db push      # Sync database schema
npx prisma db seed      # (Optional) Thêm dữ liệu mẫu
npm run dev             # Start development server

# Kiểm tra backend đã chạy
curl http://localhost:3000/health
```

### Frontend Setup
```bash
# Trong terminal mới
cd frontend-homeease
npm install
cp .env.example .env    # Copy và chỉnh sửa file .env
npm run dev            # Start development server

# Frontend sẽ chạy tại http://localhost:5173
```

### Cấu hình môi trường

#### Backend (.env)
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/homeease"

# Authentication
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="24h"

# Server
PORT=3000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Feature flags
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SOCKET_IO=true
```

#### Frontend (.env)
```bash
VITE_API_URL="http://localhost:3000"
VITE_SOCKET_URL="http://localhost:3000"
VITE_ENV="development"
```

## 👤 Tài khoản demo
- Email: admin@homeease.com
- Mật khẩu: password123

## 📂 Cấu trúc dự án

```
homeease/
├── backend-api-homeease/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── prisma/
│   └── utils/
└── frontend-homeease/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   ├── contexts/
    │   └── App.jsx
    └── public/
```

## 📊 Tiến độ dự án

### Backend (100% ✅)
- API endpoints & Controllers hoàn thiện
- Database schema & migrations hoàn chỉnh
- Authentication & Authorization
- Validation middleware
- Error handling
- Socket.IO cho real-time updates
- API documentation

### Frontend (95% ✅)
- Core features hoàn thiện
- Responsive design (90%)
- UI/UX improvements (đang tiến hành)
- Performance optimization (95%)

### Testing & Deployment (80% ✅)
- Unit tests
- Integration tests
- Production build configuration
- Deployment scripts
## 🔔 Recent updates (2025-10-23)

- Header layout: centered "HomeEase" title and right-aligned burger + avatar. Added body scroll-lock and scrollbar compensation while the mobile menu/popup is open to prevent layout shift across viewports.
- Mock QR payment demo: resident-facing QR flow that creates a mock payment session, displays a QR, polls for payment status and allows a click-to-confirm demo. Backend emits `invoice:paid` via Socket.IO so admins see updates in real-time.
- Admin list: adjusted invoice table to show resident names and hide the Pay action for admin users.
- Dev notes: a development bypass (`SKIP_OWNER_CHECK`) and transient debug logs were used during testing — remove or disable these before production.

### Backend ✅ (Hoàn thành)
- [x] API cho quản lý cư dân
- [x] API cho quản lý yêu cầu dịch vụ (Request): CRUD, phân trang, filter, cập nhật trạng thái, phân quyền
- [x] API cho quản lý hóa đơn
- [x] API cho quản lý thông báo (Notification): CRUD, filter nâng cao
- [x] Authentication & Authorization
- [x] Validation middleware
- [x] Database schema & migrations
- [x] Error handling


### Frontend ✅ (Hoàn thành các tính năng chính)

#### Phase 1: Nền tảng & Layout ✅
- [x] Thiết lập cấu trúc dự án
- [x] Hệ thống CSS & theme
- [x] Header component với navigation
- [x] App layout với routing
- [x] Dashboard layout

#### Phase 2: Core Components ✅
- [x] Quản lý cư dân (Resident): CRUD, phân trang
- [x] Quản lý yêu cầu dịch vụ (Request): CRUD, filter, popup chi tiết, cập nhật trạng thái, toast
- [x] Quản lý hóa đơn (Invoice): CRUD, phân trang, trạng thái, toast, liên kết popup cư dân
- [x] Thông báo (Notification): CRUD, filter nâng cao, popup chi tiết, toast

#### Phase 3: Tích hợp dữ liệu ✅
- [x] Thiết lập API service
- [x] Kết nối với backend API
- [x] Quản lý trạng thái (Context API)
- [x] Tích hợp lưu hóa đơn vào CSDL qua API
- [x] Đồng bộ dữ liệu Request/Notification

#### Phase 4: Tính năng nâng cao (90%) 🔄
- [x] Xác thực & Phân quyền
- [x] Hệ thống thông báo
- [x] Biểu đồ & thống kê dashboard
- [~] Tối ưu responsive (90%)
- [~] UI polish & improvements (in progress)
  - [x] Header layout fixes
  - [x] Mobile menu behavior
  - [x] Notification system redesign
  - [~] General UI/UX improvements

#### Phase 5: Hoàn thiện & Triển khai (80%) 🔄
- [~] Performance optimization
  - [x] Code splitting
  - [x] Lazy loading
  - [~] Image optimization
- [~] Testing & QA
  - [x] Unit tests setup
  - [~] Integration tests
  - [ ] E2E tests
- [~] Production preparation
  - [x] Build configuration
  - [x] Environment setup
  - [ ] Remove development bypasses
  - [ ] Clean up debug logs
- [ ] Deployment
  - [x] CI/CD setup
  - [ ] Production deployment
  - [ ] Monitoring setup

## 📮 Liên hệ

- Email: hoangnguyen.dev2003@gmail.com
- GitHub: [https://github.com/tynkeyrm0511/homeease](https://github.com/tynkeyrm0511/homeease)

---

HomeEase Team © 2025