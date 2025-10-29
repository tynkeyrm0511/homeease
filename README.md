<div align="center">
  
  # 🏠 HomeEase
  
  ### Hệ thống Quản lý Chung cư Thông minh
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
  [![React Version](https://img.shields.io/badge/react-18.3.1-blue)](https://reactjs.org/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  
  [Tính năng](#-tính-năng) • [Demo](#-demo--screenshots) • [Cài đặt](#-cài-đặt) • [Công nghệ](#️-công-nghệ) • [API](#-api-documentation)
  
</div>

---

## 📑 Giới thiệu

**HomeEase** là giải pháp quản lý chung cư toàn diện, được xây dựng với công nghệ hiện đại nhằm đơn giản hóa và tự động hóa các quy trình quản lý trong khu chung cư. Hệ thống cung cấp giao diện thân thiện cho cả quản trị viên và cư dân, giúp tối ưu hóa việc quản lý thông tin, dịch vụ, hóa đơn và thông báo.

### 🎯 Mục tiêu dự án
- ✅ Số hóa quy trình quản lý chung cư
- ✅ Tăng cường trải nghiệm người dùng với giao diện hiện đại
- ✅ Tự động hóa thanh toán và thông báo real-time
- ✅ Quản lý yêu cầu dịch vụ hiệu quả
- ✅ Bảo mật thông tin với JWT và mã hóa bcrypt

## ✨ Tính năng

### 🔐 Dành cho Admin
- **Quản lý cư dân**: Thêm, sửa, xóa thông tin cư dân với đầy đủ chi tiết (họ tên, email, SĐT, căn hộ, ngày chuyển đến...)
- **Quản lý hóa đơn**: Tạo, theo dõi và xác nhận thanh toán các loại hóa đơn (điện, nước, dịch vụ, parking...)
- **Quản lý yêu cầu**: Tiếp nhận và xử lý yêu cầu dịch vụ/bảo trì từ cư dân với phân loại ưu tiên
- **Thông báo**: Gửi thông báo đến toàn bộ hoặc nhóm cư dân cụ thể
- **Dashboard thống kê**: Biểu đồ và số liệu tổng quan về tình hình chung cư
- **Real-time updates**: Nhận thông báo thanh toán ngay lập tức qua Socket.IO

### 👥 Dành cho Cư dân
- **Thông tin cá nhân**: Xem và cập nhật thông tin hồ sơ
- **Hóa đơn**: Xem danh sách hóa đơn và thanh toán qua QR code
- **Yêu cầu dịch vụ**: Gửi yêu cầu bảo trì/sửa chữa và theo dõi tiến độ
- **Thông báo**: Nhận thông báo từ ban quản lý
- **Thống kê cá nhân**: Xem lịch sử thanh toán và yêu cầu

### 🛡️ Bảo mật
- Xác thực JWT (JSON Web Token)
- Mã hóa mật khẩu với bcrypt
- Phân quyền theo vai trò (Admin/Resident)
- Reset mật khẩu qua email với token có thời hạn
- CORS protection và Helmet security headers

## 📸 Demo & Screenshots

> **📝 Hướng dẫn chụp screenshots:**
> 1. Khởi động app: `npm run dev` (frontend) và `npm run dev` (backend)
> 2. Đăng nhập với tài khoản admin: `admin@homeease.com` / `password123`
> 3. Chụp màn hình các trang chính và lưu vào thư mục `docs/screenshots/`
> 4. Đặt tên file theo format: `01-login.png`, `02-dashboard.png`, ...

### 🖥️ Desktop View

<table>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/Login_Page.png" alt="Login Page"/>
      <p align="center"><b>Trang đăng nhập</b></p>
    </td>
    <td width="50%">
      <img src="docs/screenshots/Admin_Dashboard.png" alt="Admin Dashboard"/>
      <p align="center"><b>Dashboard Admin</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/Residents_Management.png" alt="Residents Management"/>
      <p align="center"><b>Quản lý cư dân</b></p>
    </td>
    <td width="50%">
      <img src="docs/screenshots/Residents_Detail.png" alt="Resident Detail"/>
      <p align="center"><b>Chi tiết cư dân</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/Invoices_Management.png" alt="Invoice Management"/>
      <p align="center"><b>Quản lý hóa đơn</b></p>
    </td>
    <td width="50%">
      <img src="docs/screenshots/Payment_QR.png" alt="Payment QR"/>
      <p align="center"><b>Thanh toán QR Code</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/Service_Requests.png" alt="Service Requests"/>
      <p align="center"><b>Quản lý yêu cầu dịch vụ</b></p>
    </td>
    <td width="50%">
      <img src="docs/screenshots/Notifications.png" alt="Notifications"/>
      <p align="center"><b>Hệ thống thông báo</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/User_Profile.png" alt="User Profile"/>
      <p align="center"><b>Thông tin cá nhân</b></p>
    </td>
    <td width="50%">
      <img src="docs/screenshots/Statistics.png" alt="Statistics"/>
      <p align="center"><b>Thống kê</b></p>
    </td>
  </tr>
</table>

### 📱 Mobile View

<table>
  <tr>
    <td width="33%">
      <img src="docs/screenshots/Mobile_Login.png" alt="Mobile Login"/>
      <p align="center"><b>Mobile Login</b></p>
    </td>
    <td width="33%">
      <img src="docs/screenshots/Mobile_Menu.png" alt="Mobile Menu"/>
      <p align="center"><b>Mobile Menu</b></p>
    </td>
    <td width="33%">
      <img src="docs/screenshots/Mobile_Dashboard.png" alt="Mobile Dashboard"/>
      <p align="center"><b>Mobile Dashboard</b></p>
    </td>
  </tr>
</table>

## 🛠️ Công nghệ

<table>
  <tr>
    <td align="center" width="50%">
      <h3>🔙 Backend</h3>
    </td>
    <td align="center" width="50%">
      <h3>🎨 Frontend</h3>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <ul>
        <li><b>Runtime:</b> Node.js 18+ (LTS)</li>
        <li><b>Framework:</b> Express.js 5.1.0</li>
        <li><b>Database:</b> PostgreSQL 14+</li>
        <li><b>ORM:</b> Prisma 6.17.0</li>
        <li><b>Authentication:</b> JWT (jsonwebtoken)</li>
        <li><b>Password Hashing:</b> bcryptjs</li>
        <li><b>Validation:</b> Joi 18.0.1</li>
        <li><b>Real-time:</b> Socket.IO 4.8.1</li>
        <li><b>Security:</b> Helmet, CORS</li>
        <li><b>Logging:</b> Morgan</li>
        <li><b>Development:</b> Nodemon</li>
      </ul>
    </td>
    <td valign="top">
      <ul>
        <li><b>Library:</b> React 18.3.1</li>
        <li><b>Build Tool:</b> Vite 5.4.8</li>
        <li><b>UI Framework:</b> Ant Design 5.21.6</li>
        <li><b>Styling:</b> Tailwind CSS 3.4.14</li>
        <li><b>HTTP Client:</b> Axios 1.7.7</li>
        <li><b>Routing:</b> React Router DOM 6.27.0</li>
        <li><b>Real-time:</b> Socket.IO Client 4.8.1</li>
        <li><b>Charts:</b> Recharts 2.13.3</li>
        <li><b>Icons:</b> Ant Design Icons</li>
        <li><b>State:</b> React Context API</li>
      </ul>
    </td>
  </tr>
</table>

### 📊 Architecture

```
┌─────────────────┐      HTTPS/WSS      ┌──────────────────┐
│                 │ ◄──────────────────► │                  │
│  React Frontend │                      │  Express Backend │
│  (Vite + Antd)  │                      │  (REST + WS)     │
│                 │                      │                  │
└─────────────────┘                      └────────┬─────────┘
                                                  │
                                                  │ Prisma ORM
                                                  │
                                         ┌────────▼─────────┐
                                         │                  │
                                         │   PostgreSQL     │
                                         │    Database      │
                                         │                  │
                                         └──────────────────┘
```

## 📦 Cài đặt

### ⚙️ Yêu cầu hệ thống

| Công nghệ | Phiên bản tối thiểu | Khuyến nghị |
|-----------|-------------------|-------------|
| Node.js | 18.0.0 | 18.x LTS hoặc 20.x LTS |
| PostgreSQL | 14.0 | 14.x hoặc 15.x |
| npm | 8.0 | 9.x hoặc 10.x |
| RAM | 4GB | 8GB+ |
| Ổ cứng | 1GB trống | 5GB+ |

### 🚀 Quick Start

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/tynkeyrm0511/homeease.git
cd homeease
```

#### 2️⃣ Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend-api-homeease

# Cài đặt dependencies
npm install

# Tạo file .env từ template
cp .env.example .env

# ⚠️ QUAN TRỌNG: Chỉnh sửa file .env với thông tin database của bạn
# Mở file .env và cập nhật DATABASE_URL, JWT_SECRET, etc.

# Generate Prisma Client
npx prisma generate

# Đồng bộ database schema
npx prisma db push

# Seed dữ liệu mẫu (100 records)
node prisma/seed.js

# Khởi động backend server
npm run dev
```

✅ Backend sẽ chạy tại `http://localhost:3000`

#### 3️⃣ Cài đặt Frontend (Terminal mới)

```bash
# Di chuyển vào thư mục frontend
cd frontend-homeease

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env

# ⚠️ Kiểm tra VITE_API_URL trong .env trỏ đến backend
# Mặc định: VITE_API_URL="http://localhost:3000"

# Khởi động frontend server
npm run dev
```

✅ Frontend sẽ chạy tại `http://localhost:5173`

### 🔧 Cấu hình chi tiết

#### Backend Environment Variables (`.env`)

```bash
# ===== DATABASE =====
DATABASE_URL="postgresql://username:password@localhost:5432/homeease"
# Thay username, password, và homeease bằng thông tin PostgreSQL của bạn

# ===== AUTHENTICATION =====
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"

# ===== SERVER =====
PORT=3000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"

# ===== EMAIL (Optional - cho tính năng reset password) =====
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"  # Không phải mật khẩu Gmail thông thường!
# Xem hướng dẫn tạo App Password: https://support.google.com/accounts/answer/185833

# ===== FEATURE FLAGS =====
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SOCKET_IO=true
```

#### Frontend Environment Variables (`.env`)

```bash
# ===== API ENDPOINTS =====
VITE_API_URL="http://localhost:3000"
VITE_SOCKET_URL="http://localhost:3000"

# ===== ENVIRONMENT =====
VITE_ENV="development"

# ===== OPTIONAL =====
VITE_APP_NAME="HomeEase"
VITE_APP_VERSION="1.0.0"
```

### 🎯 Tài khoản Demo

Sau khi seed database, bạn có thể đăng nhập với:

| Vai trò | Email | Mật khẩu | Mô tả |
|---------|-------|----------|-------|
| **Admin** | admin@homeease.com | password123 | Quản trị viên - full quyền |
| **Resident** | (xem console sau khi seed) | password123 | Cư dân - quyền hạn chế |

> 💡 **Lưu ý**: Danh sách email của 100 cư dân sẽ được hiển thị trong console sau khi chạy `node prisma/seed.js`

### 📂 Cấu trúc Dự án

```
homeease/
├── 📁 backend-api-homeease/          # Backend Node.js + Express
│   ├── 📁 controllers/               # Business logic
│   │   ├── authController.js         # Login, register, reset password
│   │   ├── invoiceController.js      # Invoice CRUD + payment
│   │   ├── requestController.js      # Service request management
│   │   ├── residentController.js     # Resident CRUD
│   │   ├── notificationController.js # Notification system
│   │   └── profileController.js      # User profile & stats
│   ├── 📁 routes/                    # API routes
│   │   ├── auth.js                   # /api/auth/*
│   │   ├── invoice.js                # /api/invoices/*
│   │   ├── request.js                # /api/requests/*
│   │   ├── resident.js               # /api/residents/*
│   │   ├── notification.js           # /api/notifications/*
│   │   └── profile.js                # /api/profile/*
│   ├── 📁 middleware/                # Express middleware
│   │   ├── authMiddleware.js         # JWT verification & authorization
│   │   └── middleware.js             # Morgan, CORS, Helmet
│   ├── 📁 prisma/                    # Database ORM
│   │   ├── schema.prisma             # Database models
│   │   ├── seed.js                   # Seed 100 records
│   │   └── 📁 migrations/            # Database migrations
│   ├── 📁 utils/                     # Utilities
│   │   └── validators.js             # Joi validation schemas
│   ├── 📁 scripts/                   # Helper scripts
│   ├── app.js                        # Express app setup
│   ├── prismaClient.js               # Prisma singleton
│   └── package.json                  # Dependencies
│
├── 📁 frontend-homeease/             # Frontend React + Vite
│   ├── 📁 src/
│   │   ├── 📁 components/            # React components
│   │   │   ├── 📁 Auth/              # Login, ForgotPassword, ResetPassword
│   │   │   ├── 📁 Invoices/          # Invoice management UI
│   │   │   ├── 📁 Requests/          # Service request UI
│   │   │   ├── 📁 Residents/         # Resident management UI
│   │   │   ├── 📁 Notifications/     # Notification UI
│   │   │   ├── 📁 Profile/           # User profile UI
│   │   │   ├── 📁 common/            # Shared components (DataTable, Modal, etc.)
│   │   │   ├── Header.jsx            # Top navigation
│   │   │   ├── Dashboard.jsx         # Resident dashboard
│   │   │   └── AdminDashboard.jsx    # Admin dashboard with charts
│   │   ├── 📁 services/              # API services
│   │   │   ├── api.js                # Axios instance + API calls
│   │   │   └── profileApi.js         # Profile-specific APIs
│   │   ├── 📁 contexts/              # React Context
│   │   │   └── AuthContext.jsx       # Authentication state
│   │   ├── 📁 assets/                # Images, icons
│   │   ├── App.jsx                   # Main app component
│   │   ├── AppLayout.jsx             # Layout wrapper
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles + Tailwind
│   ├── 📁 public/                    # Static assets
│   ├── index.html                    # HTML template
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind configuration
│   └── package.json                  # Dependencies
│
├── 📁 docs/                          # Documentation
│   └── 📁 screenshots/               # App screenshots (để vào đây!)
│
├── README.md                         # This file
└── .gitignore                        # Git ignore rules
```

##   API Documentation

### 🔗 Base URL
```
http://localhost:3000/api
```

### 🔑 Authentication
Tất cả các endpoint (trừ `/auth/login` và `/auth/register`) yêu cầu JWT token trong header:
```
Authorization: Bearer <your_jwt_token>
```

### 📋 API Endpoints

<details>
<summary><b>🔐 Authentication APIs</b></summary>

#### POST `/api/auth/register`
Đăng ký tài khoản mới
```json
Request Body:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nguyen Van A",
  "role": "resident"
}
```

#### POST `/api/auth/login`
Đăng nhập
```json
Request Body:
{
  "email": "admin@homeease.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@homeease.com",
    "name": "Administrator",
    "role": "admin"
  }
}
```

#### POST `/api/auth/forgot-password`
Yêu cầu reset mật khẩu

#### POST `/api/auth/reset-password`
Reset mật khẩu với token

#### GET `/api/auth/verify`
Xác thực token hiện tại

</details>

<details>
<summary><b>👥 Resident APIs</b></summary>

#### GET `/api/residents`
Lấy danh sách cư dân (Admin only)
- Query params: `page`, `limit`, `search`

#### GET `/api/residents/:id`
Lấy thông tin chi tiết cư dân

#### POST `/api/residents`
Tạo cư dân mới (Admin only)

#### PUT `/api/residents/:id`
Cập nhật thông tin cư dân

#### DELETE `/api/residents/:id`
Xóa cư dân (Admin only)

</details>

<details>
<summary><b>💰 Invoice APIs</b></summary>

#### GET `/api/invoices`
Lấy danh sách hóa đơn
- Admin: xem tất cả
- Resident: chỉ xem của mình
- Query params: `page`, `limit`, `status`, `type`

#### GET `/api/invoices/:id`
Lấy chi tiết hóa đơn

#### POST `/api/invoices`
Tạo hóa đơn mới (Admin only)
```json
{
  "userId": 2,
  "amount": 1500000,
  "type": "service",
  "dueDate": "2025-11-30"
}
```

#### PUT `/api/invoices/:id`
Cập nhật hóa đơn (Admin only)

#### DELETE `/api/invoices/:id`
Xóa hóa đơn (Admin only)

#### POST `/api/invoices/:id/payment-session`
Tạo phiên thanh toán QR (Resident)

#### GET `/api/invoices/payment/:sessionId/status`
Kiểm tra trạng thái thanh toán

#### POST `/api/invoices/payment/:sessionId/confirm`
Xác nhận thanh toán (Mock payment)

</details>

<details>
<summary><b>🔧 Request APIs</b></summary>

#### GET `/api/requests`
Lấy danh sách yêu cầu
- Admin: xem tất cả
- Resident: chỉ xem của mình
- Query params: `page`, `limit`, `status`, `category`, `priority`

#### GET `/api/requests/:id`
Lấy chi tiết yêu cầu

#### POST `/api/requests`
Tạo yêu cầu mới
```json
{
  "description": "Vòi nước bị rò rỉ cần sửa chữa",
  "category": "water",
  "priority": "high"
}
```

#### PUT `/api/requests/:id`
Cập nhật yêu cầu

#### PATCH `/api/requests/:id/status`
Cập nhật trạng thái yêu cầu (Admin)
```json
{
  "status": "in_progress"
}
```

#### DELETE `/api/requests/:id`
Xóa yêu cầu

</details>

<details>
<summary><b>📢 Notification APIs</b></summary>

#### GET `/api/notifications`
Lấy danh sách thông báo
- Query params: `page`, `limit`, `target`

#### GET `/api/notifications/:id`
Lấy chi tiết thông báo

#### POST `/api/notifications`
Tạo thông báo mới (Admin only)
```json
{
  "title": "Thông báo bảo trì",
  "content": "Sẽ cắt điện vào ngày 30/10",
  "target": "all"
}
```

#### DELETE `/api/notifications/:id`
Xóa thông báo (Admin only)

</details>

<details>
<summary><b>👤 Profile APIs</b></summary>

#### GET `/api/profile`
Lấy thông tin profile của user đang đăng nhập

#### PUT `/api/profile`
Cập nhật thông tin profile
```json
{
  "name": "Nguyen Van A",
  "phone": "0901234567",
  "gender": "male",
  "dateOfBirth": "1990-01-15",
  "apartmentNumber": "A101",
  "houseNumber": "25"
}
```

#### GET `/api/profile/stats`
Lấy thống kê cá nhân (số hóa đơn, yêu cầu, tỷ lệ thanh toán...)

#### PUT `/api/profile/password`
Đổi mật khẩu
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

</details>

### 🔌 WebSocket Events (Socket.IO)

```javascript
// Client kết nối
const socket = io('http://localhost:3000');

// Lắng nghe sự kiện thanh toán thành công
socket.on('invoice:paid', (data) => {
  console.log('Invoice paid:', data);
  // { invoiceId: 123, userId: 456, amount: 1500000 }
});

// Lắng nghe thông báo mới
socket.on('notification:new', (notification) => {
  console.log('New notification:', notification);
});
```

### 📊 Response Format

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### 🧪 Testing APIs

Sử dụng Thunder Client, Postman, hoặc curl:

```bash
# Login và lấy token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@homeease.com","password":"password123"}'

# Sử dụng token để gọi API
curl -X GET http://localhost:3000/api/residents \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📊 Tiến độ Dự án

### 🎯 Overall Progress: **95%** ✅

```
████████████████████████████████████████████░░░░░ 95%
```

<details open>
<summary><b>✅ Backend (100% Complete)</b></summary>

- [x] Database Schema Design với Prisma
  - [x] User model với phân quyền
  - [x] Invoice model với payment fields
  - [x] Request model với status/priority
  - [x] Notification model với targeting
- [x] Authentication & Authorization
  - [x] JWT token generation & verification
  - [x] Password hashing với bcrypt
  - [x] Reset password với crypto tokens
  - [x] Role-based access control (Admin/Resident)
  - [x] Ownership validation middleware
- [x] RESTful API Endpoints
  - [x] Auth APIs (login, register, forgot/reset password)
  - [x] Resident CRUD với pagination
  - [x] Invoice CRUD + payment flow
  - [x] Request CRUD với filtering
  - [x] Notification CRUD với targeting
  - [x] Profile APIs với stats
- [x] Real-time Features
  - [x] Socket.IO integration
  - [x] Payment notification broadcasts
  - [x] Real-time invoice updates
- [x] Validation & Error Handling
  - [x] Joi schemas cho tất cả inputs
  - [x] Centralized error handling
  - [x] Input sanitization
- [x] Security Best Practices
  - [x] Helmet security headers
  - [x] CORS configuration
  - [x] Rate limiting (ready)
  - [x] SQL injection protection (Prisma)
- [x] Database Seeding
  - [x] 100 realistic residents
  - [x] 100 invoices với các loại khác nhau
  - [x] 100 service requests
  - [x] 100 notifications tiếng Việt

</details>

<details open>
<summary><b>✅ Frontend (95% Complete)</b></summary>

**Phase 1: Foundation ✅**
- [x] Project setup với Vite
- [x] React Router configuration
- [x] Ant Design + Tailwind integration
- [x] Responsive layout system
- [x] Authentication flow

**Phase 2: Core Features ✅**
- [x] Login/Register pages
- [x] Forgot/Reset Password
- [x] Admin Dashboard với charts
- [x] Resident Dashboard
- [x] Resident Management (CRUD + pagination)
- [x] Invoice Management
  - [x] List view với filtering
  - [x] Create/Edit forms
  - [x] Payment QR flow
  - [x] Real-time payment status
- [x] Service Request Management
  - [x] CRUD operations
  - [x] Status updates
  - [x] Priority filtering
  - [x] Category filtering
- [x] Notification System
  - [x] List view
  - [x] Create/Edit forms
  - [x] Target selection (all/group/individual)
  - [x] Real-time notifications

**Phase 3: Profile & Settings ✅**
- [x] Profile page với tabs
- [x] Basic Info form (redesigned)
- [x] Security Settings
- [x] Profile Statistics với animations
- [x] Change password
- [x] Mobile-optimized forms

**Phase 4: UI/UX Polish (90%) 🔄**
- [x] Header responsive design
- [x] Mobile menu với scroll-lock
- [x] Gradient animations
- [x] Loading states
- [x] Error boundaries
- [~] Form validations (90%)
- [~] Toast notifications (95%)
- [ ] Empty states illustrations (70%)
- [ ] Skeleton loading screens (80%)

**Phase 5: Performance & Optimization (85%) 🔄**
- [x] Code splitting
- [x] Lazy loading routes
- [x] React.memo optimizations
- [~] Image optimization (pending)
- [~] Bundle size optimization (in progress)

</details>

<details>
<summary><b>🔄 Testing & Quality (70% In Progress)</b></summary>

- [x] Manual testing
- [x] API integration testing
- [~] Unit tests setup
- [ ] Component tests (React Testing Library)
- [ ] E2E tests (Cypress/Playwright)
- [ ] Performance testing
- [ ] Security audit
- [ ] Accessibility audit (WCAG)

</details>

<details>
<summary><b>📝 Documentation (80% In Progress)</b></summary>

- [x] README.md
- [x] API documentation (inline)
- [x] Code comments
- [x] Setup instructions
- [~] Screenshots (pending)
- [ ] Video demo
- [ ] User guide
- [ ] Admin guide
- [ ] API reference (Swagger/OpenAPI)

</details>

<details>
<summary><b>🚀 Deployment (60% Ready)</b></summary>

- [x] Environment configurations
- [x] Build scripts
- [x] Production optimizations
- [ ] Docker containerization
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Cloud deployment (Vercel/Railway/AWS)
- [ ] Domain & SSL setup
- [ ] Monitoring & logging (Sentry)
- [ ] Backup strategy

</details>

### 🎯 Next Steps (Priority Order)

1. **📸 Chụp Screenshots** - Ngay bây giờ!
   - Khởi động app và chụp tất cả các trang chính
   - Lưu vào `docs/screenshots/` theo naming convention
   - Bao gồm cả desktop và mobile views

2. **🧹 Code Cleanup** (1-2 hours)
   - Xóa các file `.temp.jsx`, `.new.jsx`
   - Fix lint warnings
   - Remove development bypasses (`SKIP_OWNER_CHECK`)
   - Clean up console.logs

3. **🔒 Security Review** (1 hour)
   - Remove hardcoded secrets
   - Audit authentication flows
   - Check for XSS vulnerabilities
   - Verify CORS settings

4. **🧪 Testing** (2-3 hours)
   - Write E2E tests cho critical flows
   - Component tests cho forms
   - API integration tests

5. **🚀 Deployment Prep** (2-3 hours)
   - Create Docker files
   - Setup CI/CD
   - Deploy to staging
   - Production deployment
## 🚀 Deployment

### 🐳 Docker Deployment (Recommended)

```bash
# Coming soon - Docker Compose setup
docker-compose up -d
```

### ☁️ Cloud Deployment Options

#### Option 1: Vercel (Frontend) + Railway (Backend)
- **Frontend**: Deploy trên Vercel
- **Backend**: Deploy trên Railway với PostgreSQL
- **Ưu điểm**: Free tier, CI/CD tự động, dễ setup

#### Option 2: AWS
- **EC2**: Backend Node.js
- **RDS**: PostgreSQL
- **S3**: Static assets
- **CloudFront**: CDN

#### Option 3: DigitalOcean
- **Droplet**: Full-stack app
- **Managed Database**: PostgreSQL
- **Ưu điểm**: Giá rẻ, stable

### 📋 Pre-deployment Checklist

- [ ] Update `.env` với production values
- [ ] Đổi `JWT_SECRET` thành random string mạnh
- [ ] Setup production database
- [ ] Configure CORS cho production domain
- [ ] Remove debug logs
- [ ] Enable rate limiting
- [ ] Setup SSL certificates
- [ ] Configure monitoring (Sentry, LogRocket)
- [ ] Setup backup strategy
- [ ] Test production build locally

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📝 Coding Standards
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 🐛 Known Issues & Limitations

- [ ] **Development bypass**: `SKIP_OWNER_CHECK` cần remove trước production
- [ ] **Mock payment**: Chưa tích hợp gateway thật (VNPay, MoMo)
- [ ] **Email**: Reset password cần SMTP configuration
- [ ] **File upload**: Chưa support upload avatar/attachments
- [ ] **Multi-language**: Chỉ support tiếng Việt
- [ ] **Dark mode**: Chưa implement

## 📝 Changelog

### Version 1.0.0 (2025-10-29)
- ✨ Initial release
- ✅ Full CRUD operations for all entities
- ✅ JWT authentication & authorization
- ✅ Real-time payment notifications
- ✅ Mock QR payment flow
- ✅ Responsive design
- ✅ 100 seeded records

### Version 0.9.0 (2025-10-23)
- 🎨 Profile page redesign với Ant Design
- 📱 Mobile optimization
- ✨ ProfileStats với animations
- 🔧 Header layout fixes
- 🐛 Bug fixes và performance improvements

## 📚 Resources & Learning

### Backend Learning
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Introduction](https://jwt.io/introduction)

### Frontend Learning
- [React Documentation](https://react.dev)
- [Ant Design Components](https://ant.design/components/overview)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/en/main)

## ❓ FAQ

<details>
<summary><b>Q: Làm sao để reset database?</b></summary>

```bash
cd backend-api-homeease
npx prisma migrate reset
node prisma/seed.js
```
</details>

<details>
<summary><b>Q: Port 3000 hoặc 5173 đã được sử dụng?</b></summary>

Thay đổi port trong file `.env`:
```bash
# Backend
PORT=3001

# Frontend (vite.config.js)
server: { port: 5174 }
```
</details>

<details>
<summary><b>Q: Database connection failed?</b></summary>

Kiểm tra:
1. PostgreSQL đã chạy chưa
2. DATABASE_URL trong `.env` đúng chưa
3. Database `homeease` đã tạo chưa: `createdb homeease`
</details>

<details>
<summary><b>Q: Làm sao để chạy production build?</b></summary>

```bash
# Backend
cd backend-api-homeease
npm run start

# Frontend
cd frontend-homeease
npm run build
npm run preview
```
</details>

## 🙏 Acknowledgments

- [Ant Design](https://ant.design/) - UI Component Library
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Faker.js](https://fakerjs.dev/) - Fake data generator
- [Socket.IO](https://socket.io/) - Real-time engine
- [Recharts](https://recharts.org/) - Chart library

##   Contact & Support

- **Email**: hoangnguyen.dev2003@gmail.com
- **GitHub**: [@tynkeyrm0511](https://github.com/tynkeyrm0511)
- **Issues**: [GitHub Issues](https://github.com/tynkeyrm0511/homeease/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tynkeyrm0511/homeease/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  
### ⭐ Nếu project này hữu ích, hãy cho 1 star nhé! ⭐

**Made with ❤️ by Syntax Ngo**

© 2025 HomeEase - All Rights Reserved

[⬆ Back to Top](#-homeease)

</div>