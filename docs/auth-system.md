# Authentication System

## Tổng quan

Hệ thống auth dùng **JWT (JSON Web Token)** với 2 tokens:

- **Access Token**: 15 phút, lưu trong httpOnly cookie
- **Refresh Token**: 7 ngày, lưu trong httpOnly cookie

## Files

| File | Vai trò |
|------|---------|
| `src/lib/auth.ts` | JWT sign/verify, cookie helpers |
| `src/hooks/useAuth.tsx` | React context cho auth state |
| `src/middleware.ts` | Edge protection cho routes |
| `src/lib/validators/auth.ts` | Zod schemas |
| `src/app/api/auth/login/` | Login endpoint |
| `src/app/api/auth/register/` | Register endpoint |
| `src/app/api/auth/logout/` | Logout endpoint |
| `src/app/api/auth/refresh/` | Token refresh |
| `src/app/api/auth/forgot-password/` | Forgot password |
| `src/app/api/auth/reset-password/` | Reset password |

## JWT Token Structure

### Access Token Payload
```typescript
{
  userId: string;    // User ID from DB
  email: string;     // User email (or "")
  role: UserRole;     // ADMIN | STAFF | CUSTOMER
  name: string;      // Display name
  username: string;   // Login username
  iat: number;       // Issued at
  exp: number;        // Expiry (15 min)
}
```

### Refresh Token Payload
```typescript
{
  userId: string;
  iat: number;
  exp: number;        // Expiry (7 days)
}
```

## Login Flow

```
1. User nhập username/password
   ↓
2. POST /api/auth/login
   ↓
3. Zod validation (loginSchema)
   ↓
4. Tìm user trong DB:
   prisma.user.findUnique({ where: { username } })
   ↓
5a. Không tìm thấy → 401 "Tên đăng nhập hoặc mật khẩu không đúng"
   ↓
5b. Tìm thấy → bcrypt.compare(inputPassword, storedHash)
      Sai → 401 "Tên đăng nhập hoặc mật khẩu không đúng"
      Đúng → check user.status
         user.status !== "ACTIVE" → 403 "Tài khoản đã bị vô hiệu hóa"
         ACTIVE → sign tokens
   ↓
6. sign tokens:
   - signAccessToken(payload)  → JWT string
   - signRefreshToken({userId}) → JWT string
   ↓
7. Set 2 httpOnly cookies vào response
   ↓
8. Return user info (không gửi token về client)
   ↓
9. Client: lưu user vào localStorage qua useAuth.login()
   ↓
10. Redirect: ADMIN/STAFF → /admin, CUSTOMER → /
```

## Registration Flow

```
1. User nhập form (username, name, email?, phone?, password)
   ↓
2. Zod validation (registerSchema)
   ↓
3. Check username đã tồn tại
   ↓
4. Check email đã tồn tại (nếu có)
   ↓
5. bcrypt.hash(password, 12) → hash
   ↓
6. prisma.user.create({
     username, name, email, password: hash,
     phone, role: CUSTOMER, status: ACTIVE
   })
   ↓
7. Sign tokens + set cookies + return user
   ↓
8. Redirect → /
```

## Middleware Protection

Middleware chạy ở **edge** trước khi request đến server.

```typescript
// src/middleware.ts

// 1. Đọc cookies
const token = request.cookies.get("access_token")?.value

// 2. Verify token (nếu có)
const payload = jwtVerify(token, JWT_SECRET) ?? null

// 3. Check route patterns
if (isAdminPath && !payload) redirect("/login")
if (isAdminPath && payload.role === "CUSTOMER") redirect("/")
```

### Route Protection Matrix

| Route | ADMIN | STAFF | CUSTOMER | Chưa login |
|-------|-------|-------|----------|-----------|
| `/` | ✅ | ✅ | ✅ | ✅ |
| `/products` | ✅ | ✅ | ✅ | ✅ |
| `/login` | ✅ | ✅ | ✅ | ✅ |
| `/register` | ✅ | ✅ | ✅ | ✅ |
| `/dashboard/*` | ✅ | ✅ | ❌ → `/` | ❌ → `/login` |
| `/admin/*` | ✅ | ✅ | ❌ → `/` | ❌ → `/login` |

`/login` và `/register` luôn hiển thị trang login/register — không redirect khi đã login. Cho phép user đăng xuất và đăng nhập tài khoản khác.

## Role-Based Access trong API

Mỗi API route tự kiểm tra role:

```typescript
// Protected: chỉ ADMIN
if (payload.role !== "ADMIN")
  return 403

// Protected: ADMIN hoặc STAFF
if (payload.role !== "ADMIN" && payload.role !== "STAFF")
  return 403

// Public with auth info
const isAdmin = payload.role === "ADMIN" || payload.role === "STAFF"
```

## Password Security

```
Hash algorithm:  bcrypt, cost factor 12
Storage:         Chỉ hash, không plaintext
Comparison:      bcrypt.compare(input, hash) → boolean
Token storage:   httpOnly cookie (không localStorage)
```

**Không bao giờ** gửi password hash về client.

## Forgot Password Flow

```
1. User nhập email
   ↓
2. Tìm user theo email
   ↓
3a. Không tìm thấy → vẫn return success (prevent email enumeration)
   ↓
3b. Tìm thấy:
   - Xóa token cũ của user đó
   - Tạo crypto.randomBytes(32) → token
   - Lưu vào ForgotPasswordToken table (expires 1 giờ)
   - Console.log reset URL (mock mode)
   ↓
4. User click link trong email → /reset-password?token=xxx
   ↓
5. User nhập password mới
   ↓
6. Verify token: exists, not used, not expired
   ↓
7. bcrypt.hash(newPassword, 12)
   ↓
8. Update user password + mark token as used
```

## Client-Side Auth (useAuth hook)

```typescript
// AuthProvider wraps the app
<AuthProvider>
  <App />
</AuthProvider>

// Dùng trong component
const { user, isLoading, isAdmin, isStaff, login, logout } = useAuth()

// Auto-refresh mỗi 13 phút (token 15 phút)
useEffect(() => {
  const interval = setInterval(() => {
    fetch("/api/auth/refresh", { method: "POST" })
  }, 13 * 60 * 1000)
  return () => clearInterval(interval)
}, [user])
```

## Session Storage

| Storage | Nội dung | Mục đích |
|---------|----------|---------|
| `httpOnly cookie` | access_token, refresh_token | Authenticated requests |
| `localStorage` | AuthUser object | Client-side session display |

LocalStorage chỉ lưu thông tin user (không phải token) để hiển thị UI. Token luôn ở trong httpOnly cookie.

## Environment Variables

```bash
JWT_SECRET="..."          # Sign access token (min 32 chars)
JWT_REFRESH_SECRET="..."  # Sign refresh token
```

Cả hai đều dùng thuật toán **HS256** (HMAC-SHA256) — symmetric key.
