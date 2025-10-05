# HomeEase - Apartment Management System

HomeEase là ứng dụng web quản lý chung cư, hỗ trợ ban quản lý và cư dân thực hiện các nghiệp vụ hàng ngày một cách hiệu quả.

## Chức năng chính
- Quản lý cư dân (Resident): CRUD, xem chi tiết.
- Quản lý hóa đơn (Invoice): CRUD, theo dõi trạng thái thanh toán.
- Quản lý yêu cầu bảo trì (Request): CRUD, theo dõi tiến trình xử lý.
- Thông báo (Notification): CRUD, gửi thông báo đến cư dân.

## Công nghệ sử dụng
- Backend: Node.js, Express.js, Prisma ORM, PostgreSQL  
- Frontend: EJS, TailwindCSS, Vanilla JavaScript  
- Dev tools: Nodemon, dotenv, morgan, helmet, cors

## Cấu trúc dự án
```
homeease/
├── controllers/       # Business logic
├── routes/            # Route definitions
├── views/             # EJS templates
├── public/            # Static assets
├── prisma/            # Prisma schema & seed
├── app.js             # App entry point
└── package.json
```

## Cài đặt & chạy
1. Cài dependencies:
```bash
npm install
```
2. Thiết lập file `.env` (ví dụ):
```
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/homeease
```
3. Migration & generate Prisma client:
```bash
npx prisma migrate dev --name init
npx prisma generate
```
4. Seed dữ liệu (tùy chọn):
```bash
node prisma/seed.js
```
5. Chạy server:
```bash
npm run dev
```
Mở: http://localhost:3000

## API chính (tổng quan)
- Resident: GET /resident, GET /resident/:id, POST /resident/add, PUT /resident/:id, DELETE /resident/:id  
- Invoice: GET /invoice, GET /invoice/:id, POST /invoice/add, PUT /invoice/:id, DELETE /invoice/:id  
- Request: GET /request, GET /request/:id, POST /request/add, PUT /request/:id, DELETE /request/:id  
- Notification: GET /notification, GET /notification/:id, POST /notification/add, PUT /notification/:id, DELETE /notification/:id

> Ghi chú: Dùng Postman/Thunder Client để test; các trường ngày tháng nên là ISO-8601 hoặc truyền về server dưới dạng chuỗi rồi controller chuyển thành `new Date()`.

## Seed dữ liệu
File seed: `prisma/seed.js` — tạo User, Invoice, Request, Notification giả bằng faker. Chạy `node prisma/seed.js` để seed.

## Kiến trúc & quy ước
- Tách rõ Route ↔ Controller ↔ View.  
- Dùng Prisma cho mọi truy vấn DB.  
- Middleware (morgan, cors, helmet, express.json) áp dụng toàn cục trong `app.js`.

## Cập nhật tiến độ (progress)
- ✅ Resident API: CRUD + detail — done, tested  
- ✅ Invoice API: CRUD + detail — done, tested  
- ✅ Request API: CRUD — done, tested  
- ✅ Notification API: CRUD — done, tested  
- ✅ Seed script: tạo dữ liệu cho tất cả bảng — done  
- ✅ README: cập nhật — done  
- 🔲 Frontend (EJS views) cho modules — pending  
- 🔲 Mock payment QR/demo flow — pending  
- 🔲 Tests & CI, deploy — pending  
- 🔲 Đồng bộ Git (resolve divergence, push remote) — pending
