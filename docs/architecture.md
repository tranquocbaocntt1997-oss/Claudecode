# Architecture

## Tổng quan kiến trúc

MD Industrial Web dùng kiến trúc **monolithic Next.js** với tất cả logic trong một project:

```
Browser → Next.js App Router (SSR + API Routes) → PostgreSQL
                    ↑
              Prisma ORM (PrismaPg adapter)
```

## Request Lifecycle

### Public Page (SSR)
```
Browser → Middleware → Page Component → Prisma → PostgreSQL → HTML → Browser
```

### API Request
```
Browser → Next.js API Route → Prisma → PostgreSQL → JSON → Browser
```

### Authenticated Request
```
Browser (with cookie)
  → Middleware (verify JWT in httpOnly cookie)
  → API Route (verifyAccessToken)
  → Prisma
  → PostgreSQL
  → Response
```

## Next.js App Router Structure

```
src/app/
├── (auth routes)
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── api/
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   ├── logout/
│   │   ├── refresh/
│   │   └── forgot-password/
│   ├── products/
│   ├── categories/
│   ├── orders/
│   └── users/
├── login/          ← rendered pages
├── register/
└── dashboard/      ← future: admin pages
```

**Route Groups** `(auth)` và `(client)` dùng để chia nhóm routes nhưng **không tạo URL segment**. Chúng chỉ chia sẻ layout.

## Authentication Architecture

### JWT Token Flow

```
┌─ Login ─────────────────────────────────────────────────────┐
│                                                             │
│  POST /api/auth/login                                      │
│    ↓                                                        │
│  bcrypt.compare(password, hashed)                           │
│    ↓ (success)                                              │
│  signAccessToken({userId, role, email, name, username})   │
│  signRefreshToken({userId})                                │
│    ↓                                                        │
│  Response + 2 httpOnly cookies:                            │
│    • access_token  (15 phút)                                │
│    • refresh_token (7 ngày)                                 │
│    ↓                                                        │
│  localStorage: md_auth_user (client session)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─ Authenticated Request ────────────────────────────────────┐
│                                                             │
│  Request includes httpOnly cookie: access_token             │
│    ↓                                                        │
│  Middleware: jwtVerify(access_token) → payload             │
│    ↓ (valid)                                                │
│  API Route: verifyAccessToken() → TokenPayload              │
│    ↓ (payload.role)                                         │
│  Authorization check                                        │
│    ↓ (pass)                                                 │
│  Process request                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─ Token Refresh ───────────────────────────────────────────┐
│                                                             │
│  access_token expires after 15 minutes                      │
│    ↓                                                        │
│  useEffect in AuthProvider: auto-fetch /api/auth/refresh   │
│  every 13 minutes                                          │
│    ↓                                                        │
│  API verifies refresh_token cookie (7 days)                 │
│    ↓ (valid)                                                │
│  Issues new access_token + refresh_token                    │
│    ↓                                                        │
│  Cookies updated automatically                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Password Hashing

```
User registers:   plaintext → bcrypt.hash(password, 12) → stored in DB
User logs in:     plaintext → bcrypt.compare(input, hash) → true/false
```

Mật khẩu **không bao giờ** được lưu dưới dạng plaintext.

### Cookie Security

| Cookie | httpOnly | sameSite | secure | maxAge |
|--------|----------|----------|--------|--------|
| `access_token` | ✅ | lax | ✅ (prod) | 15 min |
| `refresh_token` | ✅ | lax | ✅ (prod) | 7 days |

- `httpOnly: true` → JavaScript không đọc được → chống XSS
- `sameSite: lax` → Chống CSRF
- `secure: true` → Chỉ gửi qua HTTPS (production)

## Database Architecture (Prisma)

### Prisma 7 với pg adapter

```typescript
// src/lib/db.ts
const pool = new Pool({ connectionString: DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
```

Thay vì kết nối trực tiếp qua `DATABASE_URL` trong schema, Prisma 7 dùng adapter pattern cho PostgreSQL.

### Why PostgreSQL

- **Relational**: Dữ liệu nghiệp vụ có quan hệ rõ ràng (User → Order → OrderItem → Product)
- **ACID**: Đảm bảo tính nhất quán cho đơn hàng, tồn kho
- **JSON**: Hỗ trợ `specifications Json?` trong Product model
- **Mature**: Ổn định, miễn phí, deploy được ở mọi nơi

### Schema Design

```
User (1) ──── (N) Order
  │               │
  │               └── (N) OrderItem
  │                          │
  │                          └── (1) Product (N) ──── (1) Category

User (1) ──── (N) QuoteRequest
User (1) ──── (N) ForgotPasswordToken
```

## Role-Based Access Control

```
┌─────────────┐    ┌──────────────────────┐
│   PUBLIC    │    │       /dashboard/*    │
│   Routes    │    │                      │
│             │    │  ADMIN ✅  → full     │
│  /          │    │  STAFF ✅  → limited │
│  /products  │    │  CUSTOMER ❌ → /    │
│  /about     │    └──────────────────────┘
│  /contact   │
└─────────────┘
```

Middleware xử lý redirect ở edge — trước khi request đến server.

## Module Separation

| Module | Trách nhiệm | Nằm ở đâu |
|--------|-------------|-----------|
| Auth | Login, register, JWT, session | `src/lib/auth.ts`, `src/hooks/useAuth.tsx` |
| Validation | Zod schemas, form validation | `src/lib/validators/` |
| Database | Prisma client, queries | `src/lib/db.ts` |
| UI Components | Button, Input, Card, Alert | `src/components/ui/` |
| Auth Pages | Login, register, forgot-password | `src/app/login/`, `src/app/register/` |
| API Routes | REST endpoints | `src/app/api/` |
| Database Schema | Tables, relations, enums | `prisma/schema.prisma` |
