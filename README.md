# HomeEase - Hệ thống Quản lý Chung cư

<p align="center">
  <img src="https://via.placeholder.com/150?text=HomeEase" alt="HomeEase Logo" width="150" height="150">
</p>

HomeEase là một ứng dụng web quản lý chung cư được xây dựng bằng Node.js, giúp đơn giản hóa các quy trình quản lý chung cư và cải thiện trải nghiệm cho cư dân.

## Tính năng

- **Quản lý Cư dân**: Thêm, sửa, xóa, tra cứu thông tin cư dân
- **Quản lý Hóa đơn**: Tạo, theo dõi và quản lý hóa đơn hàng tháng
- **Yêu cầu Bảo trì**: Cho phép cư dân gửi yêu cầu bảo trì và theo dõi trạng thái
- **Thông báo**: Gửi thông báo đến cư dân
- **Xác thực & Phân quyền**: Hệ thống đăng nhập với JWT và phân quyền admin/resident

## Công nghệ sử dụng

### Backend
- **Express.js**: Framework web
- **Prisma ORM**: Tương tác với database
- **PostgreSQL**: Cơ sở dữ liệu
- **JWT**: Xác thực người dùng
- **Bcrypt**: Mã hóa mật khẩu
- **Joi**: Validation dữ liệu

### Frontend
- **EJS**: Template engine
- **TailwindCSS**: Framework CSS
- **Vanilla JavaScript**: Xử lý tương tác người dùng

### Development Tools
- **Nodemon**: Tự động restart server khi có thay đổi
- **dotenv**: Quản lý biến môi trường
- **Morgan**: HTTP request logger
- **Helmet**: Bảo mật HTTP headers
- **Cors**: Cross-Origin Resource Sharing

## Cấu trúc dự án

```
homeease/
├── controllers/       # Xử lý logic nghiệp vụ
├── middleware/        # Middleware ứng dụng
├── prisma/            # Schema và migrations Prisma
├── public/            # Static assets (CSS, JS, images)
├── routes/            # Định nghĩa routes
├── utils/             # Tiện ích (validators, helpers)
├── views/             # EJS templates
├── .env               # Biến môi trường
├── .gitignore         # Git ignore file
├── app.js             # Entry point
├── package.json       # Project metadata
└── README.md          # Thông tin dự án
```

## Cài đặt và chạy dự án

### Yêu cầu
- Node.js (>= 14.x)
- PostgreSQL
- npm hoặc yarn

### Các bước cài đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/tynkeyrm0511/homeease.git
   cd homeease
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường**
   - Copy `.env.example` thành `.env`
   - Cập nhật biến DATABASE_URL và JWT_SECRET
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/homeease
   JWT_SECRET=your_secret_key
   ```

4. **Khởi tạo database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Chạy ứng dụng**
   ```bash
   npm run dev
   ```

6. **Truy cập ứng dụng**
   ```
   http://localhost:3000
   ```

## API Endpoints

### Auth
- `POST /auth/register` - Đăng ký người dùng mới
- `POST /auth/login` - Đăng nhập và nhận JWT token

### Resident
- `GET /resident` - Lấy danh sách cư dân (Admin only)
- `GET /resident/:id` - Lấy thông tin cư dân (Admin/Self only)
- `POST /resident/add` - Thêm cư dân mới (Admin only)
- `PUT /resident/:id` - Cập nhật thông tin cư dân (Admin only)
- `DELETE /resident/:id` - Xóa cư dân (Admin only)

### Invoice
- `GET /invoice` - Lấy danh sách hóa đơn (Admin only)
- `GET /invoice/:id` - Lấy chi tiết hóa đơn (Admin/Self only)
- `POST /invoice/add` - Thêm hóa đơn mới (Admin only)
- `PUT /invoice/:id` - Cập nhật hóa đơn (Admin only)
- `DELETE /invoice/:id` - Xóa hóa đơn (Admin only)

### Request
- `GET /request` - Lấy danh sách yêu cầu bảo trì (Admin only)
- `GET /request/:id` - Lấy chi tiết yêu cầu (Admin/Self only)
- `POST /request/add` - Thêm yêu cầu mới (Admin only)
- `PUT /request/:id` - Cập nhật yêu cầu (Admin only)
- `DELETE /request/:id` - Xóa yêu cầu (Admin only)

### Notification
- `GET /notification` - Lấy danh sách thông báo (Admin only)
- `GET /notification/:id` - Lấy chi tiết thông báo (Admin only)
- `POST /notification/add` - Thêm thông báo mới (Admin only)
- `PUT /notification/:id` - Cập nhật thông báo (Admin only)
- `DELETE /notification/:id` - Xóa thông báo (Admin only)

## Tính năng đã triển khai
- ✅ Database schema với Prisma ORM
- ✅ API CRUD cho tất cả modules
- ✅ Validation với Joi
- ✅ Authentication với JWT
- ✅ Authorization (phân quyền admin/resident)

## Tính năng đang phát triển
- ⬜ Frontend với EJS & TailwindCSS
- ⬜ Mock Payment QR system
- ⬜ Unit Tests
- ⬜ Email notifications