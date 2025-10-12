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

### Backend ✅ (Hoàn thành)
- [x] API cho quản lý cư dân
- [x] API cho quản lý yêu cầu dịch vụ
- [x] API cho quản lý hóa đơn
- [x] API cho quản lý thông báo
- [x] Authentication & Authorization
- [x] Validation middleware
- [x] Database schema & migrations
- [x] Error handling

### Frontend 🔄 (Đang làm)

#### Phase 1: Nền tảng & Layout ✅ (Hoàn thành)
- [x] Thiết lập cấu trúc dự án
- [x] Hệ thống CSS & theme
- [x] Header component với navigation
- [x] App layout với routing
- [x] Dashboard layout

#### Phase 2: Core Components 🔄 (Đang làm)
- [x] Quản lý cư dân: CRUD, phân trang
- [ ] Quản lý yêu cầu dịch vụ
- [x] Quản lý hóa đơn: CRUD, phân trang, trạng thái, toast, liên kết popup cư dân
- [ ] Thông báo

#### Phase 3: Tích hợp dữ liệu
- [x] Thiết lập API service
- [x] Kết nối với backend API
- [x] Quản lý trạng thái (Context API)
- [x] Tích hợp lưu hóa đơn vào CSDL qua API
- [ ] Cập nhật real-time

#### Phase 4: Tính năng nâng cao
- [x] Xác thực & Phân quyền
- [ ] Hệ thống thông báo
- [ ] Biểu đồ & thống kê
- [ ] Tối ưu responsive

#### Phase 5: Hoàn thiện & Triển khai
- [ ] Cải thiện UI/UX
- [ ] Kiểm thử
- [ ] Build & deploy

## 📮 Liên hệ

- Email: hoangnguyen.dev2003@gmail.com
- GitHub: [https://github.com/tynkeyrm0511/homeease](https://github.com/tynkeyrm0511/homeease)

---

HomeEase Team © 2025

