# Project Overview

## Tổng quan

MD Industrial Web là hệ thống B2B website cho công ty ngành công nghiệp cơ khí, chuyên cung cấp:

- **Băng Tải** — các loại băng tải công nghiệp (PVC, lưới inox, cao su)
- **Bạc Đạn** — SKF, NSK, FAG và các thương hiệu khác
- **Dây Curoa** — Gates, Mitsuboshi, Bando
- **Phụ Tùng Máy** — con lăn, puli, phụ kiện băng tải

## Hệ thống bao gồm

### 1. Client Website (Public)
Trang web công khai cho khách hàng. Không yêu cầu đăng nhập.

| Route | Mô tả |
|-------|--------|
| `/` | Trang chủ |
| `/products` | Danh sách sản phẩm |
| `/products/[slug]` | Chi tiết sản phẩm |
| `/about` | Giới thiệu công ty |
| `/contact` | Liên hệ |

### 2. Admin Dashboard (Protected)
Hệ thống quản trị nội bộ cho ADMIN và STAFF.

| Route | Mô tả |
|-------|--------|
| `/dashboard` | Tổng quan |
| `/dashboard/products` | Quản lý sản phẩm |
| `/dashboard/categories` | Quản lý danh mục |
| `/dashboard/orders` | Quản lý đơn hàng |
| `/dashboard/customers` | Danh sách khách hàng |
| `/dashboard/staff` | Quản lý nhân viên (ADMIN only) |

### 3. Authentication
Hệ thống đăng nhập cho cả khách hàng và admin.

| Route | Mô tả |
|-------|--------|
| `/login` | Đăng nhập |
| `/register` | Đăng ký tài khoản mới |
| `/forgot-password` | Quên mật khẩu |

## Tech Stack

| Layer | Công nghệ | Vai trò |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router) | SSR, routing, API |
| Language | TypeScript (strict) | Type safety |
| Styling | Tailwind CSS v4 | UI design |
| Database | PostgreSQL | Persistent data |
| ORM | Prisma 7 | Database access |
| Auth | JWT (jose) | Stateless authentication |
| Password | bcryptjs | Password hashing |
| Validation | Zod + React Hook Form | Input validation |

## Phân quyền người dùng

| Role | Mô tả | Quyền hạn |
|------|--------|-----------|
| **ADMIN** | Quản trị viên | Toàn quyền hệ thống |
| **STAFF** | Nhân viên | Quản lý sản phẩm, đơn hàng |
| **CUSTOMER** | Khách hàng | Xem sản phẩm, đặt hàng |

## Database Connection

PostgreSQL chạy trên port `5433` (theo `.env` hiện tại):

```
DATABASE_URL="postgresql://md_user:md_password@localhost:5433/md_industrial_web"
```

## Development Setup

```bash
# 1. Cài dependencies
npm install

# 2. Generate Prisma client
npm run db:generate

# 3. Chạy migration (tạo bảng)
npm run db:migrate

# 4. Seed dữ liệu mẫu
npm run db:seed

# 5. Khởi động dev server
npm run dev
```

Admin seed: `tranquocbao` / `12345678`
