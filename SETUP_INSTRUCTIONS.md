# E-Commerce Project - Setup Instructions

## Fixing TypeScript Errors

The errors shown in the problem tab are mostly due to missing installations and configurations. Follow these steps:

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd marketplace-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```
   OR
   ```bash
   npx prisma generate
   ```

4. **Setup Database** (if not already done):
   ```bash
   npm run prisma:migrate
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd marketplace-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Why These Errors Occur

### Backend Errors
- **"Cannot find module '@nestjs/common'**, etc.: Dependencies not installed
- **"Property 'user' does not exist on type 'PrismaService'"**: Prisma Client not generated
- **Decorators are not valid here**: Usually fixed by restarting TypeScript server after installing dependencies

### Frontend Errors  
- **"Cannot find module 'react'"**: Dependencies not installed
- **moduleResolution error**: Fixed by setting `"moduleResolution": "nodenext"` in tsconfig.json (✅ Already fixed)
- **"Cannot find type definition file for 'react/next'"**: Removed from types in tsconfig.json (✅ Already fixed)
- **CSS warnings (@tailwind, @apply)**: These are expected and harmless - Tailwind CSS directives are properly configured

## After Setup

1. Restart your TypeScript server (Ctrl+Shift+P → "TypeScript: Restart TS Server")
2. All errors should be resolved

## Project Structure

```
E-Commerce/
├── marketplace-backend/      # NestJS API server
│   ├── src/
│   ├── prisma/              # Database schema
│   └── package.json
├── marketplace-frontend/     # Next.js frontend
│   ├── src/
│   └── package.json
└── docker-compose.yml       # Docker configuration
```

## Key Technologies

**Backend:**
- NestJS 10
- Prisma (ORM)
- PostgreSQL
- Stripe Integration
- JWT Authentication

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- Zustand (State Management)
- Axios (HTTP Client)

## Environment Variables

Create `.env` files in both backend and frontend following `.env.example` files provided.

### Backend (.env)
- DATABASE_URL
- JWT_SECRET
- STRIPE_SECRET_KEY
- NODE_ENV

### Frontend (.env.local)
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
