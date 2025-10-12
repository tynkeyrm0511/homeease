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

## 📮 Liên hệ

- Email: hoangnguyen.dev2003@gmail.com
- GitHub: [https://github.com/tynkeyrm0511/homeease](https://github.com/tynkeyrm0511/homeease)

---

HomeEase Team © 2025