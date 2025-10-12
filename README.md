# HomeEase# 🏠 HomeEase - Hệ thống Quản lý Chung cư



Quản lý cư dân & dịch vụ chung cư hiện đại## 📖 Tổng quan dự án



## Giới thiệu**HomeEase** là một hệ thống quản lý chung cư toàn diện, được thiết kế để đơn giản hóa việc quản lý cư dân, yêu cầu dịch vụ, hóa đơn và thông báo trong các tòa nhà chung cư.

HomeEase là hệ thống quản lý cư dân, hóa đơn, thông báo và các yêu cầu dịch vụ dành cho ban quản lý chung cư/căn hộ. Dự án gồm backend (NodeJS, Express, Prisma) và frontend (React, Vite, Ant Design, Bootstrap).

### 🎯 Mục tiêu

## Tính năng chính- Tự động hóa quy trình quản lý chung cư

- Quản lý cư dân: Thêm, sửa, xóa, phân trang, tìm kiếm- Cải thiện trải nghiệm của cư dân và ban quản lý

- Quản lý hóa đơn, thông báo, yêu cầu dịch vụ- Tạo nền tảng giao tiếp hiệu quả giữa cư dân và ban quản lý

- Đăng nhập, quên mật khẩu, phân quyền- Quản lý tài chính và hóa đơn một cách minh bạch

- Giao diện hiện đại, responsive

### 🏗️ Kiến trúc hệ thống

## Công nghệ sử dụng

- Backend: NodeJS, Express, Prisma ORM, JWT```

- Frontend: React, Vite, Ant Design, Bootstrap, Axioshomeease/

- Database: PostgreSQL├── backend-api-homeease/     # Node.js + Express API Server

│   ├── controllers/          # Business Logic Controllers

## Cấu trúc thư mục│   ├── routes/              # API Routes

```│   ├── middleware/          # Authentication & Validation

homeease/│   ├── prisma/             # Database Schema & Migrations

├── backend-api-homeease/│   └── utils/              # Utility Functions

│   ├── app.js│

│   ├── controllers/└── frontend-homeease/       # React + Bootstrap Frontend

│   ├── routes/    ├── src/

│   ├── prisma/    │   ├── components/     # Reusable UI Components

│   └── ...    │   ├── App.jsx        # Main Application

├── frontend-homeease/    │   └── App.css        # Global Styles

│   ├── src/    └── public/            # Static Assets

│   │   ├── components/```

│   │   ├── services/

│   │   └── ...## 🚀 Công nghệ sử dụng

│   └── ...

└── README.md### Backend

```- **Node.js** - JavaScript Runtime

- **Express.js** - Web Application Framework

## Hướng dẫn cài đặt & chạy- **Prisma** - Database ORM

### 1. Backend- **PostgreSQL** - Database

```bash- **JWT** - Authentication

cd backend-api-homeease- **bcryptjs** - Password Hashing

npm install

npm run dev### Frontend

```- **React 18** - UI Library

Cấu hình database trong `prisma/schema.prisma` nếu cần.- **Bootstrap 5** - CSS Framework

- **Vite** - Build Tool

### 2. Frontend- **React Hooks** - State Management

```bash

cd frontend-homeease## 🛠️ Tính năng chính

npm install

npm run dev### ✅ Đã hoàn thành

```- [x] **Thiết lập cơ sở hạ tầng**

  - [x] Backend API với Express.js

Truy cập giao diện tại: [http://localhost:3000](http://localhost:3000)  - [x] Frontend React với Vite

  - [x] Database schema với Prisma

## Tài khoản demo  - [x] Authentication middleware

- Email: admin@homeease.com

- Mật khẩu: password123- [x] **Giao diện người dùng**

  - [x] Header navigation responsive

## Đóng góp  - [x] Dashboard tổng quan với thống kê

Mọi ý kiến đóng góp, báo lỗi hoặc đề xuất tính năng mới vui lòng tạo issue hoặc liên hệ trực tiếp nhóm phát triển.  - [x] Layout system chuẩn hóa

  - [x] Bootstrap integration

---

**HomeEase Team**- [x] **Hệ thống cơ bản**

  - [x] User authentication
  - [x] Database models (Users, Residents, Requests, Invoices, Notifications)
  - [x] API endpoints structure

### 🔄 Đang phát triển
- [x] **Quản lý cư dân**
  - [x] Hiển thị danh sách residents (Read)
  - [ ] Thêm cư dân mới (Create)
  - [ ] Sửa thông tin cư dân (Update)
  - [ ] Xóa cư dân (Delete)
  - [ ] Import/Export data
  - [ ] Search và filter

- [ ] **Quản lý yêu cầu**
  - [ ] Tạo và theo dõi requests
  - [ ] Workflow approval
  - [ ] Status updates

- [ ] **Quản lý hóa đơn**
  - [ ] Generate invoices
  - [ ] Payment tracking
  - [ ] Reports và analytics

### 🎯 Kế hoạch tương lai
- [ ] **Thông báo real-time**
  - [ ] WebSocket integration
  - [ ] Email notifications
  - [ ] Push notifications

- [ ] **Advanced Features**
  - [ ] Reports và analytics
  - [ ] Mobile app
  - [ ] Multi-language support

## 🏃‍♂️ Cách chạy dự án

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm hoặc yarn

### Backend Setup
```bash
cd backend-api-homeease
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Frontend Setup
```bash
cd frontend-homeease
npm install
npm run dev
```

### Environment Variables
Tạo file `.env` trong thư mục `backend-api-homeease`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/homeease"
JWT_SECRET="your-jwt-secret"
PORT=3000
```

## 📊 Tiến độ dự án

### Phase 1: Foundation & Layout ✅ (Hoàn thành)
- [x] Setup project structure
- [x] CSS variables & theme system
- [x] Header component với navigation
- [x] Main App layout với routing
- [x] Dashboard layout structure

### Phase 2: Core Components 🔄 (Đang làm)
- [ ] Reusable UI components (Card, Button, Modal, etc.)
- [ ] Dashboard overview với stats
- [x] Resident management interface: Hiển thị danh sách cư dân
- [ ] Request management system
- [ ] Invoice management interface

### Phase 3: Data Integration
- [ ] API service setup
- [ ] Connect với backend HomeEase API
- [ ] State management (Context/Redux)
- [ ] Real-time updates

### Phase 4: Advanced Features
- [ ] Authentication & Authorization
- [ ] Notification system
- [ ] Charts và analytics
- [ ] Responsive design optimization

### Phase 5: Polish & Deploy
- [ ] UI/UX refinements
- [ ] Testing
- [ ] Build & deployment

## 🎨 UI/UX Standards

### Layout Standards
- **Container**: `container-xl px-4` cho tất cả pages
- **Spacing**: `py-4` vertical, `px-4` horizontal
- **Typography**: `h4.fw-semibold` cho page titles
- **Cards**: `border-0 shadow-sm` cho consistency
- **Max Width**: 1200px, centered layout

### Color Scheme
- **Primary**: #4361ee (Blue)
- **Success**: #198754 (Green)
- **Warning**: #ff9800 (Orange)
- **Danger**: #dc3545 (Red)
- **Background**: #f8f9fa (Light Gray)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Liên hệ

- **Developer**: HomeEase Team
- **Email**: support@homeease.com
- **Repository**: [https://github.com/tynkeyrm0511/homeease](https://github.com/tynkeyrm0511/homeease)

---

**HomeEase** - Making apartment management easier, one feature at a time! 🏠✨