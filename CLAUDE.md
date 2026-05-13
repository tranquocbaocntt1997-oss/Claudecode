@AGENTS.md
# MD Industrial Web

## Project Goal

Build a modern B2B website and admin system for an industrial company selling:
- Conveyor belts
- Timing belts
- V-belts
- Bearings
- Industrial chains
- Conveyor accessories

The system includes:
- Public client website
- Admin dashboard
- Authentication
- Product management
- Category management
- Contact management
- Quote request management
- Future CRM and quotation system

---

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- JWT Auth
- bcryptjs
- Zod
- React Hook Form
- Axios or Fetch API

---

## Security Rules

- Never store plain text passwords.
- Always hash passwords with bcryptjs.
- Never hardcode production secrets.
- Use environment variables for secrets.
- Protect all /admin routes.
- Only ADMIN and STAFF can access /admin.
- CUSTOMER cannot access admin pages.
- Validate all form and API inputs with Zod.
- Do not expose JWT secret to client.
- Use httpOnly cookie for auth token.

---

## Default Development Admin

Development seed admin:

username: tranquocbao
password: 12345678
role: ADMIN

Important:
- This account is only for development seed.
- Password must be hashed.
- Do not hardcode password inside runtime auth logic.
- Read admin seed value from environment variables when possible.

---

## UI Direction

Style:
- Industrial Modern B2B
- Clean
- Professional
- Trustworthy
- Mobile friendly

Colors:
- Navy
- White
- Gray
- Orange accent

Avoid:
- Gaming style
- Neon style
- Too many gradients
- Messy layouts

---

## Code Quality Rules

- Use strict TypeScript.
- Avoid any unless truly necessary.
- Keep components reusable.
- Do not duplicate logic.
- Do not refactor unrelated files.
- Do not modify files outside the task scope.
- Keep code readable and maintainable.
- Prefer small modules over giant files.
- Explain changes briefly before editing.

---

## Folder Structure

Use this structure:

src/
  app/
    api/
    admin/
    login/
    register/
    forgot-password/
    products/
    about/
    contact/
  components/
    ui/
    client/
    admin/
    auth/
    forms/
  lib/
    prisma.ts
    auth.ts
    jwt.ts
    utils.ts
  services/
    product.service.ts
    auth.service.ts
    category.service.ts
    contact.service.ts
  validations/
    auth.validation.ts
    product.validation.ts
    category.validation.ts
    contact.validation.ts
  types/
    auth.ts
    product.ts
    common.ts

---

## Route Plan

Public routes:
- /
- /products
- /products/[slug]
- /about
- /contact
- /login
- /register
- /forgot-password

Admin routes:
- /admin
- /admin/products
- /admin/products/create
- /admin/products/[id]/edit
- /admin/categories
- /admin/categories/create
- /admin/categories/[id]/edit
- /admin/contacts
- /admin/quote-requests
- /admin/posts
- /admin/settings

---

## Development Workflow

For every task:
1. Read this CLAUDE.md first.
2. Identify exact files to change.
3. Explain briefly before editing.
4. Implement only the requested scope.
5. Run lint/type checks when possible.
6. Fix errors without unrelated rewrites.

---

## Important Rule

Never build the entire app in one huge step.
Always work in small phases.