# Database

## PostgreSQL

Database server chạy trên port `5433`. Tên database: `md_industrial_web`.

## Schema Overview

```
users ─── orders ─── order_items ─── products ─── categories
  │
  ├── quote_requests
  ├── forgot_password_tokens
  └── created_products (FK)

categories ─── products
  │
  └── self-reference (parent/child categories)
```

## Enums

### UserRole
Phân quyền hệ thống.

| Value | Mô tả |
|-------|--------|
| `ADMIN` | Quản trị viên — full access |
| `STAFF` | Nhân viên — quản lý sản phẩm, đơn hàng |
| `CUSTOMER` | Khách hàng — chỉ xem và đặt hàng |

### UserStatus
Trạng thái tài khoản.

| Value | Mô tả |
|-------|--------|
| `ACTIVE` | Tài khoản đang hoạt động |
| `INACTIVE` | Tài khoản bị khóa |

### ContentStatus
Trạng thái nội dung có thể công khai.

| Value | Mô tả |
|-------|--------|
| `ACTIVE` | Hiển thị công khai |
| `INACTIVE` | Ẩn khỏi người dùng |
| `DRAFT` | Chưa xuất bản (chỉ admin thấy) |

### RequestStatus
Trạng thái xử lý yêu cầu.

| Value | Mô tả |
|-------|--------|
| `NEW` | Mới tiếp nhận, chưa xử lý |
| `PROCESSING` | Đang xử lý |
| `DONE` | Đã hoàn thành |
| `CANCELLED` | Đã hủy |

## Models chi tiết

### User
Người dùng hệ thống.

| Field | Type | Constraints | Mô tả |
|-------|------|------------|--------|
| `id` | String | PK, cuid | Định danh |
| `username` | String | unique, not null | Tên đăng nhập |
| `email` | String? | unique | Email (tùy chọn) |
| `password` | String | not null | bcrypt hash |
| `name` | String | not null | Tên hiển thị |
| `phone` | String? | | SĐT liên hệ |
| `role` | UserRole | default CUSTOMER | Phân quyền |
| `status` | UserStatus | default ACTIVE | Trạng thái |
| `createdAt` | DateTime | auto | Thời điểm tạo |
| `updatedAt` | DateTime | auto | Thời điểm cập nhật |

### Category
Danh mục sản phẩm. Hỗ trợ đa cấp qua `parentId`.

| Field | Type | Constraints | Mô tả |
|-------|------|------------|--------|
| `id` | String | PK | |
| `name` | String | not null | Tên danh mục |
| `slug` | String | unique | URL-friendly key |
| `description` | String? | | Mô tả |
| `image` | String? | | URL ảnh |
| `status` | ContentStatus | default ACTIVE | |
| `parentId` | String? | FK → Category | Danh mục cha |

### Product
Sản phẩm trong catalog.

| Field | Type | Constraints | Mô tả |
|-------|------|------------|--------|
| `id` | String | PK | |
| `name` | String | not null | Tên sản phẩm |
| `slug` | String | unique | URL-friendly key |
| `description` | String? | | Mô tả ngắn |
| `content` | String? | | HTML chi tiết sản phẩm |
| `price` | Float | not null | Giá bán (VND) |
| `originalPrice` | Float? | | Giá gốc (so sánh) |
| `stock` | Int | default 0 | Số lượng tồn kho |
| `sku` | String? | unique | Mã kho |
| `image` | String? | | URL ảnh chính |
| `images` | String[] | default [] | Danh sách ảnh |
| `specifications` | Json? | | Thông số kỹ thuật |
| `featured` | Boolean | default false | Sản phẩm nổi bật |
| `status` | ContentStatus | default ACTIVE | |
| `categoryId` | String? | FK → Category | Danh mục |
| `createdById` | String? | FK → User | Người tạo |

### Order
Đơn hàng của khách.

| Field | Type | Constraints | Mô tả |
|-------|------|------------|--------|
| `id` | String | PK | |
| `orderNumber` | String | unique | Mã đơn hàng (MD-xxx) |
| `userId` | String | FK → User | Người đặt |
| `totalAmount` | Float | not null | Tổng tiền |
| `shippingName` | String | not null | Tên người nhận |
| `shippingPhone` | String | not null | SĐT người nhận |
| `shippingAddress` | String | not null | Địa chỉ giao hàng |
| `note` | String? | | Ghi chú đơn hàng |
| `status` | RequestStatus | default NEW | Trạng thái |
| `createdAt` | DateTime | auto | |
| `updatedAt` | DateTime | auto | |

### OrderItem
Chi tiết sản phẩm trong đơn hàng.

| Field | Type | Constraints | Mô tả |
|-------|------|------------|--------|
| `id` | String | PK | |
| `orderId` | String | FK → Order, cascade | Đơn hàng cha |
| `productId` | String | FK → Product | Sản phẩm |
| `quantity` | Int | not null | Số lượng |
| `price` | Float | not null | Giá tại thời điểm đặt |

### Contact
Yêu cầu liên hệ từ khách.

| Field | Type | Constraints | Mô tả |
|-------|------|------------|--------|
| `id` | String | PK | |
| `name` | String | not null | Người liên hệ |
| `email` | String | not null | Email |
| `phone` | String? | | SĐT |
| `company` | String? | | Công ty |
| `subject` | String? | | Tiêu đề |
| `message` | String | not null | Nội dung |
| `status` | RequestStatus | default NEW | |
| `note` | String? | | Ghi chú nội bộ |

### QuoteRequest
Yêu cầu báo giá.

| Field | Type | Constraints | Mô tả |
|-------|------|------------|--------|
| `id` | String | PK | |
| `requestNumber` | String | unique | Mã yêu cầu |
| `userId` | String | FK → User | Người gửi |
| `customerName` | String | not null | |
| `customerEmail` | String | not null | |
| `customerPhone` | String | not null | |
| `company` | String? | | |
| `products` | Json | not null | Array of {productId, quantity, note} |
| `message` | String? | | Lời nhắn |
| `status` | RequestStatus | default NEW | |
| `adminNote` | String? | | Ghi chú admin |

### Post
Bài viết / tin tức.

| Field | Type | Constraints | Mô tả |
|-------|------|------------|--------|
| `id` | String | PK | |
| `title` | String | not null | Tiêu đề |
| `slug` | String | unique | |
| `excerpt` | String? | | Mô tả ngắn |
| `content` | String | not null | HTML content |
| `image` | String? | | Ảnh bài viết |
| `author` | String? | | Tác giả |
| `status` | ContentStatus | default DRAFT | |
| `publishedAt` | DateTime? | | Thời điểm xuất bản |

### ForgotPasswordToken
Token đặt lại mật khẩu.

| Field | Type | Constraints | Mô tả |
|-------|------|------------|--------|
| `id` | String | PK | |
| `userId` | String | FK → User | Người dùng |
| `token` | String | unique | Token reset |
| `expiresAt` | DateTime | not null | Hết hạn sau 1 giờ |
| `used` | Boolean | default false | Đã sử dụng chưa |

## Migrations

```bash
# Tạo migration mới
npm run db:migrate

# Push schema thẳng (không tạo migration file)
npm run db:push

# Seed dữ liệu
npm run db:seed
```

## Seed Data

Seed script tạo:

- **1 Admin**: `tranquocbao` / password từ env
- **4 Categories**: Băng Tải, Bạc Đạn, Dây Curoa, Phụ Tùng Máy
- **6 Products**: mẫu cho mỗi danh mục
- **1 Post**: bài giới thiệu MD Industrial

Admin credentials đọc từ `.env`:
```
ADMIN_USERNAME=tranquocbao
ADMIN_PASSWORD=12345678
ADMIN_NAME=Trần Quốc Bảo
ADMIN_EMAIL=admin@mdindustrial.local
```
