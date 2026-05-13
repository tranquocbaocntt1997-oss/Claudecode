# Auth Engineer Skill

Focus:
- Secure authentication
- Role based access
- JWT with httpOnly cookie
- bcryptjs password hashing
- Zod validation

Rules:
- Never store plain password.
- Never expose JWT secret.
- Protect admin routes.
- Use clean reusable auth helpers.
- Login supports username or email.
- ADMIN and STAFF can access /admin.
- CUSTOMER cannot access /admin.

Pages:
- /login
- /register
- /forgot-password

API:
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- POST /api/auth/forgot-password