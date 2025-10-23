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

### Yêu cầu
- Node.js 18+
- PostgreSQL
- npm hoặc yarn

### Backend
```bash
cd backend-api-homeease
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Frontend
```bash
cd frontend-homeease
npm install
npm run dev
```

### Cấu hình
Tạo file `.env` trong thư mục backend-api-homeease:
```
DATABASE_URL="postgresql://username:password@localhost:5432/homeease"
JWT_SECRET="your-jwt-secret"
PORT=3000
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

-
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

#### Phase 4: Tính năng nâng cao (Đang tiến hành) 🔄
- [x] Xác thực & Phân quyền
- [x] Hệ thống thông báo
- [~] Biểu đồ & thống kê
- [ ] Tối ưu responsive
- [~] UI polish: header/layout fixes and mobile menu behavior (in progress)

#### Phase 5: Hoàn thiện & Triển khai 🔄
- [ ] Cải thiện UI/UX
- [ ] Kiểm thử
- [ ] Build & deploy
- [ ] Remove dev-only bypasses and debug logs

## 📮 Liên hệ

- Email: hoangnguyen.dev2003@gmail.com
- GitHub: [https://github.com/tynkeyrm0511/homeease](https://github.com/tynkeyrm0511/homeease)

---

HomeEase Team © 2025