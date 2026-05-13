# Folder Structure

```
md-industrial-web/
├── prisma/
│   ├── schema.prisma          # Database schema (tables, enums, relations)
│   ├── config.ts              # Prisma 7 config (pg adapter)
│   └── seed.ts                # Seed script (admin + sample data)
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout (AuthProvider wrapper)
│   │   ├── page.tsx           # Homepage (/)
│   │   ├── globals.css         # Tailwind + custom CSS variables
│   │   │
│   │   ├── login/             # /login
│   │   │   └── page.tsx
│   │   ├── register/           # /register
│   │   │   └── page.tsx
│   │   ├── forgot-password/    # /forgot-password
│   │   │   └── page.tsx
│   │   ├── reset-password/      # /reset-password?token=xxx
│   │   │   └── page.tsx
│   │   │
│   │   └── api/               # REST API routes
│   │       └── auth/
│   │           ├── login/route.ts
│   │           ├── register/route.ts
│   │           ├── logout/route.ts
│   │           ├── refresh/route.ts
│   │           ├── forgot-password/route.ts
│   │           └── reset-password/route.ts
│   │       └── products/
│   │       └── categories/
│   │       └── orders/
│   │       └── users/
│   │       └── stats/
│   │
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   │   ├── Button.tsx      # Button với isLoading
│   │   │   ├── Input.tsx      # Input với label + error
│   │   │   ├── Card.tsx       # Card, CardHeader, CardContent
│   │   │   ├── Badge.tsx      # Status badges
│   │   │   ├── Select.tsx      # Select dropdown
│   │   │   ├── Textarea.tsx    # Textarea
│   │   │   ├── Spinner.tsx    # Loading spinner
│   │   │   ├── Alert.tsx       # Info/success/warning/error alerts
│   │   │   └── AuthCard.tsx   # Shared auth page layout
│   │   │
│   │   └── forms/             # Form-specific components
│   │       └── PasswordInput.tsx  # Password với show/hide toggle
│   │
│   ├── lib/                    # Core utilities
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── auth.ts            # JWT sign/verify/cookies
│   │   ├── utils.ts           # cn(), slugify(), formatCurrency()
│   │   ├── cloudinary.ts      # Image upload helper
│   │   │
│   │   └── validators/        # Zod schemas
│   │       ├── auth.ts        # login, register, forgot, reset schemas
│   │       ├── product.ts     # product, category schemas
│   │       └── order.ts      # order, orderStatus schemas
│   │
│   ├── hooks/                 # React hooks
│   │   └── useAuth.tsx        # Auth context + helper hooks
│   │
│   ├── types/                 # TypeScript types
│   │   └── index.ts           # UserSession, ApiResponse, etc.
│   │
│   └── middleware.ts          # Next.js middleware (route protection)
│
├── .env                        # Environment variables (dev)
├── .env.example                # Template cho env vars
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts          # (Tailwind v4: dùng @theme trong CSS)
└── docs/                       # Documentation
```

## Module Roles

### `src/lib/`

| File | Trách nhiệm |
|------|-------------|
| `db.ts` | Khởi tạo Prisma client, export singleton `prisma` |
| `auth.ts` | JWT operations: sign/verify tokens, set cookies |
| `utils.ts` | Helper functions: `cn()`, `slugify()`, `formatCurrency()` |
| `cloudinary.ts` | Upload/delete ảnh qua Cloudinary API |
| `validators/auth.ts` | Zod schemas cho auth forms |
| `validators/product.ts` | Zod schemas cho product/category CRUD |
| `validators/order.ts` | Zod schemas cho order creation |

### `src/components/ui/`

Base components dùng lại ở mọi nơi trong app. Mỗi component nhận props rõ ràng, không có business logic.

### `src/hooks/`

- `useAuth`: Export `AuthProvider`, `useAuth()`, `AuthUser` type

### `src/middleware.ts`

Chạy ở edge trước mọi request. Kiểm tra JWT cookie để protect routes.

## Key Imports Alias

```typescript
// tsconfig.json định nghĩa:
"@/*" → "./src/*"

// Ví dụ:
// @/lib/db         → src/lib/db.ts
// @/components/ui  → src/components/ui
// @/hooks/useAuth  → src/hooks/useAuth.tsx
```

## File naming conventions

| Pattern | Ví dụ | Quy tắc |
|---------|--------|---------|
| Component | `Button.tsx` | PascalCase |
| Hook | `useAuth.tsx` | camelCase, prefix `use` |
| Route | `route.ts` | Route handlers |
| Utils | `utils.ts` | camelCase, suffix `s` |
| Schema | `auth.ts` | camelCase |
| Page | `page.tsx` | Route page component |
| Layout | `layout.tsx` | Route layout |
