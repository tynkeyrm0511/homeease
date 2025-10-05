# HomeEase - Apartment Management System

HomeEase là ứng dụng web quản lý chung cư, giúp ban quản lý và cư dân thực hiện các nghiệp vụ hàng ngày một cách dễ dàng và hiệu quả.

## Chức năng chính
- **Quản lý cư dân:** Thêm, sửa, xóa, xem thông tin cư dân.
- **Quản lý hóa đơn:** Tạo, cập nhật, theo dõi trạng thái thanh toán hóa đơn hàng tháng cho từng căn hộ.
- **Quản lý yêu cầu bảo trì:** Cư dân gửi yêu cầu bảo trì, ban quản lý tiếp nhận và xử lý.
- **Thông báo:** Ban quản lý gửi thông báo, tin tức đến cư dân.

## Công nghệ sử dụng
- **Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL
- **Frontend:** EJS (template engine), TailwindCSS, Vanilla JavaScript
- **Dev Tools:** Nodemon, dotenv, morgan, helmet, cors

## Kiến trúc dự án
```
homeease/
├── controllers/       # Business logic for routes
├── routes/            # Route definitions
├── views/             # EJS templates for frontend
├── public/            # Static assets (CSS, JS, images)
├── prisma/            # Prisma schema and migrations
├── .env               # Environment variables
├── app.js             # Main entry point
└── package.json       # Project metadata and dependencies
```

- **`app.js`**: Khởi tạo ứng dụng Express, áp dụng middleware, thiết lập routes.
- **`routes/`**: Định nghĩa các route (home, resident, invoice...).
- **`controllers/`**: Xử lý logic cho từng route.
- **`prisma/schema.prisma`**: Định nghĩa cấu trúc cơ sở dữ liệu.

## Hướng dẫn cài đặt & vận hành

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy ứng dụng ở chế độ phát triển
```bash
npm run dev
```
Truy cập tại địa chỉ: [http://localhost:3000](http://localhost:3000)

### 3. Quản lý database với Prisma
- Chỉnh sửa schema tại `prisma/schema.prisma`.
- Chạy migration:
  ```bash
  npx prisma migrate dev --name <migration_name>
  ```
- Sinh Prisma client:
  ```bash
  npx prisma generate
  ```

## Biến môi trường mẫu (.env)
```plaintext
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/homeease
```

## Lưu ý phát triển
- Sử dụng Prisma cho mọi thao tác với database.
- Middleware được áp dụng toàn cục trong `app.js`.
- Tách biệt rõ ràng controller, route, view, public, prisma để dễ mở rộng và bảo trì.

---

Nếu bạn có thắc mắc hoặc cần hướng dẫn chi tiết, hãy liên hệ hoặc xem thêm tài liệu trong repo!
