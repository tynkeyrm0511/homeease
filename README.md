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

#### Phase 4: Tính năng nâng cao 🔄
- [x] Xác thực & Phân quyền
- [x] Hệ thống thông báo
- [ ] Biểu đồ & thống kê
- [ ] Tối ưu responsive

#### Phase 4: Tính năng nâng cao (Đang tiến hành) 🔄
- [x] Xác thực & Phân quyền
- [x] Hệ thống thông báo
- [~] Biểu đồ & thống kê (Đã tích hợp dashboard với dữ liệu thực - đang tinh chỉnh và tối ưu hiển thị)
- [ ] Tối ưu responsive

### Những thay đổi gần đây (Update 2025-10-19)
- Dashboard: Tích hợp dữ liệu thực từ backend (requests, invoices, residents) và chuyển các biểu đồ từ dữ liệu giả sang dữ liệu thật.
- Sửa UX: Dashboard giờ sử dụng thanh cuộn bên ngoài của trình duyệt (loại bỏ scroll nội bộ chỉ riêng cho dashboard).
- Thêm thư viện frontend: recharts (biểu đồ), react-countup (hiệu ứng đếm số), @ant-design/pro-components (một số tiện ích giao diện nếu cần).
- Sửa lỗi và tối ưu: Cập nhật cấu trúc trang để tránh mất phân trang ở một số trang (ví dụ Requests), và chỉnh lại một số component để tuân theo layout "compact".
- Trạng thái: Tiếp tục tinh chỉnh giao diện biểu đồ, xử lý trạng thái trống và quản lý loading/error.

#### Phase 5: Hoàn thiện & Triển khai 🔄
- [ ] Cải thiện UI/UX
- [ ] Kiểm thử
- [ ] Build & deploy

## 📮 Liên hệ

- Email: hoangnguyen.dev2003@gmail.com
- GitHub: [https://github.com/tynkeyrm0511/homeease](https://github.com/tynkeyrm0511/homeease)

---

HomeEase Team © 2025

