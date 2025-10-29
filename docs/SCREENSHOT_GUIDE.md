# 📸 Hướng dẫn Chụp Screenshots cho HomeEase

## 🎯 Mục tiêu
Tạo bộ screenshots chuyên nghiệp để showcase project HomeEase trong README.md

## 📋 Checklist Screenshots Cần Chụp

### 🖥️ Desktop Screenshots (1920x1080 hoặc 1440x900)

#### Authentication Flow
- [ ] `01-login.png` - Trang đăng nhập
- [ ] `02-register.png` - Trang đăng ký (optional)
- [ ] `03-forgot-password.png` - Quên mật khẩu (optional)

#### Admin Dashboard
- [ ] `02-dashboard-admin.png` - Dashboard admin với charts đầy đủ
  - Đảm bảo có dữ liệu trong biểu đồ
  - Hiển thị statistics cards

#### Resident Management
- [ ] `03-residents-list.png` - Danh sách cư dân
  - Table đầy đủ 10+ records
  - Hiển thị pagination
  - Search bar visible
- [ ] `04-resident-detail.png` - Modal/Page chi tiết cư dân
  - Thông tin đầy đủ: tên, email, phone, apartment, etc.
  - Avatar/icon hiển thị

#### Invoice Management
- [ ] `05-invoices-list.png` - Danh sách hóa đơn
  - Mix các trạng thái: paid/unpaid
  - Các loại hóa đơn khác nhau (electricity, water, service...)
  - Filter options visible
- [ ] `06-invoice-payment.png` - Trang thanh toán QR
  - QR code hiển thị rõ
  - Thông tin hóa đơn
  - Payment status

#### Service Requests
- [ ] `07-requests-admin.png` - Quản lý yêu cầu (admin view)
  - Table với status colors
  - Priority badges
  - Category tags
- [ ] `07b-request-detail.png` - Chi tiết yêu cầu (optional)

#### Notifications
- [ ] `08-notifications.png` - Danh sách thông báo
  - Notification cards
  - Target types hiển thị
  - Create notification button

#### Profile Pages
- [ ] `09-profile.png` - Trang profile với basic info
  - Form đầy đủ fields
  - Responsive layout
- [ ] `09b-profile-security.png` - Security settings tab (optional)
- [ ] `10-stats.png` - Profile statistics
  - Gradient cards với animations
  - Progress circles
  - Statistical numbers

### 📱 Mobile Screenshots (375x812 - iPhone X size)

- [ ] `mobile-01-login.png` - Login mobile
- [ ] `mobile-02-menu.png` - Mobile menu mở ra
  - Sidebar navigation
  - User avatar
  - Menu items
- [ ] `mobile-03-dashboard.png` - Dashboard mobile
- [ ] `mobile-04-invoices.png` - Invoice list mobile (optional)
- [ ] `mobile-05-profile.png` - Profile mobile (optional)

### 🎬 Optional: Video Demo
- [ ] Screen recording 1-2 phút showcase main features
- [ ] Upload lên YouTube
- [ ] Tạo thumbnail từ video

---

## 🛠️ Tools Recommended

### Windows
1. **Snipping Tool** (Built-in)
   - Windows + Shift + S
   - Crop và save

2. **ShareX** (Free)
   - Download: https://getsharex.com/
   - Auto-save, annotations, effects
   - Recommended!

3. **Greenshot** (Free)
   - Download: https://getgreenshot.org/
   - Simple và powerful

### Browser DevTools
- **Chrome DevTools Device Toolbar** (F12)
  - Toggle device toolbar (Ctrl + Shift + M)
  - Select "iPhone X" cho mobile screenshots
  - Screenshot entire page

### Video Recording
- **OBS Studio** (Free)
  - Download: https://obsproject.com/
  - Professional screen recording

- **ScreenToGif** (Free)
  - Download: https://www.screentogif.com/
  - Record as GIF

---

## 📝 Step-by-Step Instructions

### Bước 1: Chuẩn bị môi trường

```bash
# Terminal 1: Backend
cd backend-api-homeease
npm run dev

# Terminal 2: Frontend
cd frontend-homeease
npm run dev
```

✅ Đảm bảo:
- Database đã có 100 records (đã seed)
- Backend chạy ở port 3000
- Frontend chạy ở port 5173
- Không có errors trong console

### Bước 2: Login với tài khoản Admin

```
URL: http://localhost:5173
Email: admin@homeease.com
Password: password123
```

### Bước 3: Chụp Desktop Screenshots

#### Kích thước window
- **Recommended**: 1440x900 hoặc 1920x1080
- Zoom browser: 100%
- Hide bookmarks bar (Ctrl + Shift + B)
- Full screen browser (F11) rồi exit để có clean window

#### Thứ tự chụp

1. **Login Page** (`01-login.png`)
   - Navigate to `/` (logout nếu cần)
   - Chụp full page
   - Lưu vào `docs/screenshots/01-login.png`

2. **Admin Dashboard** (`02-dashboard-admin.png`)
   - Navigate to `/admin`
   - Đợi charts load xong
   - Scroll to top
   - Chụp toàn bộ viewport
   - Lưu vào `docs/screenshots/02-dashboard-admin.png`

3. **Residents List** (`03-residents-list.png`)
   - Navigate to `/admin/residents`
   - Đợi table load
   - Scroll to top để thấy header
   - Lưu vào `docs/screenshots/03-residents-list.png`

4. **Resident Detail** (`04-resident-detail.png`)
   - Click vào 1 resident trong table
   - Modal/Page hiển thị
   - Chụp modal/page với thông tin đầy đủ
   - Lưu vào `docs/screenshots/04-resident-detail.png`

5. **Invoices List** (`05-invoices-list.png`)
   - Navigate to `/admin/invoices`
   - Đảm bảo có mix paid/unpaid
   - Lưu vào `docs/screenshots/05-invoices-list.png`

6. **Invoice Payment QR** (`06-invoice-payment.png`)
   - Logout admin
   - Login với 1 resident account (check console sau seed)
   - Navigate to invoices
   - Click "Thanh toán" trên 1 unpaid invoice
   - Chụp trang QR code
   - Lưu vào `docs/screenshots/06-invoice-payment.png`

7. **Service Requests** (`07-requests-admin.png`)
   - Login lại admin
   - Navigate to `/admin/requests`
   - Lưu vào `docs/screenshots/07-requests-admin.png`

8. **Notifications** (`08-notifications.png`)
   - Navigate to `/admin/notifications`
   - Lưu vào `docs/screenshots/08-notifications.png`

9. **Profile** (`09-profile.png`)
   - Navigate to `/profile`
   - Tab "Thông tin cơ bản" active
   - Lưu vào `docs/screenshots/09-profile.png`

10. **Statistics** (`10-stats.png`)
    - Vẫn ở `/profile`
    - Click tab "Thống kê"
    - Đợi animations chạy xong
    - Lưu vào `docs/screenshots/10-stats.png`

### Bước 4: Chụp Mobile Screenshots

#### Sử dụng Chrome DevTools

1. Mở Chrome DevTools (F12)
2. Click Toggle Device Toolbar (Ctrl + Shift + M)
3. Chọn device: **iPhone X** (375 x 812)
4. Zoom: 100%

#### Chụp từng màn hình

1. **Mobile Login** (`mobile-01-login.png`)
   - Navigate to `/`
   - Capture screenshot trong DevTools
   - Hoặc chụp toàn bộ window
   - Lưu vào `docs/screenshots/mobile-01-login.png`

2. **Mobile Menu** (`mobile-02-menu.png`)
   - Login
   - Click burger menu icon
   - Menu sidebar mở ra
   - Chụp với menu mở
   - Lưu vào `docs/screenshots/mobile-02-menu.png`

3. **Mobile Dashboard** (`mobile-03-dashboard.png`)
   - Close menu
   - Navigate to dashboard
   - Lưu vào `docs/screenshots/mobile-03-dashboard.png`

### Bước 5: Post-processing (Optional)

#### Sử dụng image editor để:
- Crop chính xác
- Add subtle shadows
- Resize về kích thước chuẩn
- Compress để giảm file size (TinyPNG.com)

#### Recommended sizes:
- Desktop: 1440x900 max
- Mobile: 375x812 (iPhone X)
- File size: < 500KB mỗi file

---

## ✅ Verification Checklist

Sau khi chụp xong, kiểm tra:

- [ ] Tất cả files có đúng naming convention
- [ ] Files nằm trong `docs/screenshots/`
- [ ] Không có sensitive data (passwords, real emails)
- [ ] Images rõ nét, không bị blur
- [ ] Aspect ratio đúng
- [ ] File size reasonable (< 500KB/file)
- [ ] Desktop screenshots có 10 files
- [ ] Mobile screenshots có 3 files
- [ ] Tất cả screenshots hiển thị đúng trong README.md

---

## 🖼️ File Naming Convention

```
Desktop:
01-login.png
02-dashboard-admin.png
03-residents-list.png
04-resident-detail.png
05-invoices-list.png
06-invoice-payment.png
07-requests-admin.png
08-notifications.png
09-profile.png
10-stats.png

Mobile:
mobile-01-login.png
mobile-02-menu.png
mobile-03-dashboard.png

Optional:
07b-request-detail.png
09b-profile-security.png
mobile-04-invoices.png
mobile-05-profile.png
video-thumbnail.png
```

---

## 🎨 Tips cho Screenshots Đẹp

1. **Clean UI**
   - Close unnecessary tabs
   - Hide bookmarks bar
   - Use clean browser window
   - No browser extensions visible

2. **Good Data**
   - Use realistic Vietnamese names
   - Mix of statuses (paid/unpaid, pending/completed)
   - Enough records to fill table (10+)
   - Charts có dữ liệu meaningful

3. **Timing**
   - Wait for animations to finish
   - Wait for data to load completely
   - Charts fully rendered
   - No loading spinners

4. **Consistency**
   - Same zoom level (100%)
   - Same browser size
   - Same time of day (for timestamps)
   - Consistent styling

5. **Mobile Screenshots**
   - Use DevTools device mode
   - iPhone X dimensions (375x812)
   - Portrait orientation
   - No browser chrome visible

---

## 🚀 Quick Commands

```bash
# Check if app is running
curl http://localhost:3000/api/auth/verify
curl http://localhost:5173

# Re-seed database if needed
cd backend-api-homeease
node prisma/seed.js

# Open screenshots folder
cd docs/screenshots
explorer .  # Windows
# open .    # macOS
# xdg-open . # Linux
```

---

## 📤 After Screenshots

1. Verify all files in `docs/screenshots/`
2. Test images trong README.md
3. Optimize file sizes nếu cần
4. Commit và push:

```bash
git add docs/screenshots/
git add README.md
git commit -m "docs: add project screenshots"
git push origin main
```

---

## ❓ Troubleshooting

**Q: Screenshots bị blur?**
- Increase browser zoom to 150%, chụp, rồi resize về 100%
- Use higher resolution monitor
- Screenshot tool quality settings

**Q: Mobile screenshots không đúng tỷ lệ?**
- Use Chrome DevTools device mode
- Don't use physical phone (inconsistent)
- Ensure zoom = 100% trong DevTools

**Q: Charts không hiển thị?**
- Check console for errors
- Verify data đã load
- Wait 2-3 seconds after page load
- Try refresh page

**Q: File size quá lớn?**
- Use TinyPNG.com để compress
- Save as PNG (not BMP)
- Crop unnecessary white space
- Reduce resolution nếu > 1920px

---

## 🎯 Expected Result

Sau khi hoàn thành, folder `docs/screenshots/` sẽ có:

```
docs/screenshots/
├── 01-login.png
├── 02-dashboard-admin.png
├── 03-residents-list.png
├── 04-resident-detail.png
├── 05-invoices-list.png
├── 06-invoice-payment.png
├── 07-requests-admin.png
├── 08-notifications.png
├── 09-profile.png
├── 10-stats.png
├── mobile-01-login.png
├── mobile-02-menu.png
└── mobile-03-dashboard.png
```

Và README.md sẽ hiển thị đẹp với tất cả screenshots! 🎉

---

**Happy Screenshot Hunting! 📸✨**
