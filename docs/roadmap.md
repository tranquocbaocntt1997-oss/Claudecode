# Roadmap

## Đã hoàn thành

### ✅ Phase 1: Setup & Configuration
- [x] Next.js 16 App Router + TypeScript strict
- [x] Tailwind CSS v4
- [x] Prisma 7 + PostgreSQL adapter
- [x] Project structure setup
- [x] Base UI components (Button, Input, Card, Badge, etc.)
- [x] `.env` configuration

### ✅ Phase 2: Authentication
- [x] JWT auth (access token 15min, refresh token 7days)
- [x] bcryptjs password hashing
- [x] httpOnly cookie storage
- [x] Login by username
- [x] Register with validation
- [x] Forgot password (mock email)
- [x] Middleware protection
- [x] Role-based access (ADMIN, STAFF, CUSTOMER)
- [x] useAuth React context hook
- [x] Seed admin account

### ✅ Phase 3: Database & API Core
- [x] Full Prisma schema (User, Category, Product, Order, Contact, QuoteRequest, Post, ForgotPasswordToken)
- [x] Products API (CRUD)
- [x] Categories API (CRUD)
- [x] Orders API (CRUD)
- [x] Users API (list, update, delete — admin only)
- [x] Stats API (dashboard overview)
- [x] Zod validators

### ✅ Phase 4: Client Website
- [x] Homepage với hero, categories, highlights
- [x] Client layout (header, footer)
- [x] Login/Register/Forgot Password pages (Industrial B2B UI)

### ✅ Documentation
- [x] Project overview
- [x] Architecture
- [x] Database schema
- [x] Auth system
- [x] Folder structure

---

## Tiếp theo

### Phase 5: Admin Dashboard

- [ ] Dashboard overview page với stats cards
- [ ] Admin layout (sidebar navigation)
- [ ] Products management
  - [ ] List với filter/pagination
  - [ ] Create/Edit form với image upload
  - [ ] Delete confirmation
- [ ] Categories management
  - [ ] CRUD operations
- [ ] Orders management
  - [ ] List với filter by status
  - [ ] Update order status (NEW → PROCESSING → DONE / CANCELLED)
  - [ ] Order detail view
- [ ] Customers list (ADMIN only)
- [ ] Staff management (ADMIN only)

### Phase 6: Client Website (đầy đủ)

- [ ] Products listing page (`/products`)
  - [ ] Filter by category
  - [ ] Search
  - [ ] Pagination
  - [ ] Sort by price/name/date
- [ ] Product detail page (`/products/[slug]`)
- [ ] Cart functionality (localStorage)
- [ ] Checkout flow (tạo Order)
- [ ] Order history page
- [ ] About page
- [ ] Contact page

### Phase 7: Contact & Quote System

- [ ] Contact API endpoint
- [ ] Contact form page
- [ ] Admin contact management
- [ ] Quote request API
- [ ] Quote request management

### Phase 8: Post / CMS

- [ ] Post API (CRUD)
- [ ] Blog listing page
- [ ] Post detail page
- [ ] Admin post editor

### Phase 9: Production Readiness

- [ ] Cloudinary image upload integration
- [ ] Email service (thật thay vì mock)
- [ ] Error monitoring
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Deployment setup

---

## Thứ tự ưu tiên gợi ý

```
1. Admin Dashboard (Products CRUD)  ← Ca○ nhất
2. Admin Dashboard (Orders)
3. Client Products Listing + Detail
4. Cart + Checkout
5. Contact + Quote
6. Posts/CMS
7. Production deployment
```
