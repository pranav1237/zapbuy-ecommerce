# Development Workflow Guide

## Local Development Setup

### Prerequisites

- Node.js 18+ ([download](https://nodejs.org))
- PostgreSQL 13+ ([download](https://www.postgresql.org/download))
- Git ([download](https://git-scm.com))
- VS Code ([download](https://code.visualstudio.com))

### VS Code Extensions

Install these extensions for optimal development experience:

- **Prisma** (`prisma.prisma`) - Prisma schema syntax highlighting
- **ESLint** (`dbaeumer.vscode-eslint`) - JavaScript/TypeScript linting
- **Prettier** (`esbenp.prettier-vscode`) - Code formatting
- **Thunder Client** (`rangav.vscode-thunder-client`) or **REST Client** (`humao.rest-client`) - API testing
- **PostgreSQL** (`ckolkman.vscode-postgres`) - Database management
- **Docker** (`ms-azuretools.vscode-docker`) - Docker integration
- **TypeScript Vue Plugin** (`Vue.vscode-typescript-vue-plugin`) - For frontend (optional)

### Initial Setup (5 minutes)

```bash
# Clone repository
git clone <repository-url>
cd E-Commerce

# Backend setup
cd marketplace-backend
cp .env.example .env

# Edit .env with your local database credentials
# DATABASE_URL=postgresql://username:password@localhost:5432/marketplace_dev
# JWT_SECRET=your-local-secret-key-change-in-production

npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Frontend setup
cd ../marketplace-frontend
cp .env.example .env.local

# Edit .env.local with API endpoint
# NEXT_PUBLIC_API_URL=http://localhost:3001

npm install
```

## Development Workflow

### Feature Development

#### 1. Create Feature Branch

```bash
git checkout -b feature/vendor-analytics-dashboard

# Or using git-flow (if installed)
git flow feature start vendor-analytics-dashboard
```

Branch naming convention:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `chore/` - Documentation, dependencies, etc.
- `refactor/` - Code refactoring without feature changes

#### 2. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd marketplace-backend
npm run start:dev
# Listens on http://localhost:3001
# Auto-reloads on file changes
```

**Terminal 2 - Frontend:**
```bash
cd marketplace-frontend
npm run dev
# Listens on http://localhost:3000
# Supports hot module replacement
```

**Terminal 3 - Prisma Studio (optional):**
```bash
cd marketplace-backend
npm run prisma:studio
# Opens http://localhost:5555 for database visualization
```

#### 3. Implement Feature

**Backend Example - Add New Endpoint:**

```typescript
// 1. Define DTO (marketplace-backend/src/modules/analytics/dto/analytics.dto.ts)
export class DashboardMetricsDto {
  totalRevenue: number;
  totalOrders: number;
  conversionRate: number;
  averageOrderValue: number;
}

// 2. Implement Service Method (marketplace-backend/src/modules/analytics/analytics.service.ts)
async getDashboardMetrics(vendorId: string): Promise<DashboardMetricsDto> {
  // Implementation
}

// 3. Create API Endpoint (marketplace-backend/src/modules/analytics/analytics.controller.ts)
@Get('dashboard/metrics')
@UseGuards(RolesGuard)
@Roles('VENDOR', 'ADMIN')
async getDashboardMetrics(@CurrentUser() user) {
  return this.analyticsService.getDashboardMetrics(user.vendorId);
}

// 4. Test with API client
// Use Thunder Client or REST Client to test
GET http://localhost:3001/analytics/dashboard/metrics
Authorization: Bearer {{your-token}}
```

**Frontend Example - Create Component:**

```typescript
// 1. Create Component (src/components/AnalyticsDashboard.tsx)
'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await apiClient.analytics.getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="card">
        <h3>Total Revenue</h3>
        <p className="text-2xl font-bold">${metrics.totalRevenue}</p>
      </div>
      {/* More metrics */}
    </div>
  );
}

// 2. Add to Page (src/app/dashboard/page.tsx)
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <AnalyticsDashboard />
    </div>
  );
}

// 3. Test in browser http://localhost:3000/dashboard
```

#### 4. Database Migrations

When modifying schema:

```bash
cd marketplace-backend

# Update schema.prisma with your changes

# Create migration
npm run prisma:migrate -- --name "add-analytics-table"

# This will:
# 1. Create SQL migration file in prisma/migrations/
# 2. Apply migration to local database
# 3. Regenerate prisma client

# Push to production (after review)
npm run prisma:migrate deploy
```

#### 5. Commit Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat(analytics): add dashboard metrics endpoint

- Implement getDashboardMetrics service method
- Create AnalyticsDashboard React component
- Add metrics aggregation calculation
- Update API documentation"

# Push to remote
git push origin feature/vendor-analytics-dashboard
```

Commit message format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

#### 6. Code Quality Checks

```bash
# Backend linting
cd marketplace-backend
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Type checking
npm run type-check

# Frontend linting
cd ../marketplace-frontend
npm run lint
npm run lint:fix
```

#### 7. Write Tests

```typescript
// Backend Test (marketplace-backend/src/modules/analytics/analytics.service.spec.ts)
describe('AnalyticsService', () => {
  describe('getDashboardMetrics', () => {
    it('should return aggregated metrics for vendor', async () => {
      // Test implementation
    });
  });
});

// Frontend Test (marketplace-frontend/src/components/__tests__/AnalyticsDashboard.spec.tsx)
describe('AnalyticsDashboard', () => {
  it('should display metrics after loading', async () => {
    // Test implementation
  });
});
```

Run tests:
```bash
# Backend
npm run test

# Frontend
npm run test

# With coverage
npm run test:cov
```

#### 8. Create Pull Request

```bash
# After pushing feature branch to remote
git push origin feature/vendor-analytics-dashboard
```

Then on GitHub/GitLab:

1. Click "New Pull Request" / "Create Merge Request"
2. Set base branch: `main`
3. Add title: `feat(analytics): add dashboard metrics endpoint`
4. Add description:
```markdown
## Description
Implements analytics dashboard metrics for vendors to track sales performance.

## Changes
- New endpoint: GET /analytics/dashboard/metrics
- New component: AnalyticsDashboard
- Database migration for analytics tables

## How to Test
1. Start development servers
2. Login as vendor
3. Navigate to /dashboard
4. Verify metrics load correctly

## Checklist
- [x] Tests written and passing
- [x] Code follows style guide
- [x] Documentation updated
- [x] No breaking changes
```

5. Request code review
6. Address feedback
7. Squash and merge once approved

## Testing During Development

### API Testing

**Using Thunder Client (VS Code Extension):**

1. Create collection "Marketplace"
2. Create requests:

```
GET http://localhost:3001/health

POST http://localhost:3001/auth/signin
{
  "email": "vendor@example.com",
  "password": "password123"
}

GET http://localhost:3001/analytics/dashboard/metrics
Authorization: Bearer {{token}}
```

**Using cURL:**

```bash
# Login and get token
curl -X POST http://localhost:3001/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@example.com","password":"password123"}'

# Use token in next request
curl -X GET http://localhost:3001/analytics/dashboard/metrics \
  -H "Authorization: Bearer eyJhbGc..."
```

### Browser DevTools Testing

1. Open http://localhost:3000
2. Open DevTools (F12)
3. Go to Network tab
4. Interact with app and monitor requests
5. Check Console tab for errors
6. Use Storage tab to inspect localStorage for auth token

### Database Testing

**Prisma Studio:**
```bash
npm run prisma:studio
# Opens http://localhost:5555
# Browse, create, edit, delete data visually
```

**Direct Database Access:**
```bash
# Connect to PostgreSQL
psql postgresql://username:password@localhost:5432/marketplace_dev

# Common queries
\dt                    -- List tables
\d "User"              -- Describe User table
SELECT * FROM "User";  -- View all users
```

## Debugging

### Backend Debugging

```bash
# Start with debugger enabled
node --inspect-brk ./node_modules/.bin/ts-node src/main.ts

# Or use VS Code debug configuration
# .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "NestJS Debug",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

Then press F5 to start debugging.

### Frontend Debugging

```bash
# Next.js includes built-in debugging
# Just run: npm run dev

# Then open Chrome DevTools (F12)
# Breakpoints work automatically
# Or add debugger statement: debugger;
```

### Log Debugging

```typescript
// Backend
import { Logger } from '@nestjs/common';

const logger = new Logger('MyModule');
logger.debug('Debug message:', { data });
logger.warn('Warning message:', error);
logger.error('Error message:', error.stack);

// Frontend
console.log('Debug:', data);
console.warn('Warning:', error);
console.error('Error:', error);

// Stripe debugging
Stripe.setPublishableKey('pk_test_...');
// Check browser console for Stripe errors
```

## Performance Optimization

### Backend Optimization

```typescript
// 1. Add database indexes (in schema.prisma)
model Product {
  @@index([vendorId])
  @@index([categoryId])
  @@fulltext([name, description])  // For search
}

// 2. Implement pagination
async getVendorProducts(vendorId: string, page: number, limit: number) {
  return this.prisma.product.findMany({
    where: { vendorId },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}

// 3. Use select to fetch only needed fields
async getVendorProducts(vendorId: string) {
  return this.prisma.product.findMany({
    where: { vendorId },
    select: {
      id: true,
      name: true,
      price: true,
      images: { select: { url: true } },
    },
  });
}

// 4. Implement caching
import { Cacheable } from '@nestjs/cache-manager';

@Cacheable()
async getPopularProducts() {
  return this.prisma.product.findMany({ ... });
}
```

### Frontend Optimization

```typescript
// 1. Use Image component
import Image from 'next/image';

<Image 
  src="/product.jpg" 
  alt="Product" 
  width={300} 
  height={300}
  placeholder="blur"  // Show blur while loading
  priority           // Load immediately
/>

// 2. Code splitting
const AnalyticsDashboard = dynamic(() => import('@/components/AnalyticsDashboard'), {
  loading: () => <div>Loading...</div>,
});

// 3. Memoization
import { memo } from 'react';

const ProductCard = memo(({ product }) => {
  // Component only re-renders if product prop changes
  return <div>{product.name}</div>;
});

// 4. Query optimization
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['products', vendorId],
  queryFn: () => apiClient.products.getVendorProducts(vendorId),
  staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
});
```

## Useful Commands Reference

### Backend

```bash
cd marketplace-backend

# Development
npm run start:dev        # Start in watch mode
npm run start:debug      # Start with debugger
npm run build            # Compile TypeScript
npm start:prod           # Run compiled code

# Database
npm run prisma:generate  # Regenerate Prisma client
npm run prisma:migrate   # Create and apply migrations
npm run prisma:seed      # Populate seed data
npm run prisma:studio    # Open database UI

# Quality
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:cov         # Run tests with coverage
npm run lint             # Check code style
npm run lint:fix         # Fix code style
npm run type-check       # TypeScript type check
```

### Frontend

```bash
cd marketplace-frontend

npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Check code style
npm run lint:fix         # Fix code style
npm run type-check       # TypeScript type check
```

## Troubleshooting Common Issues

### "Module not found" Error

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or using npm cache
npm cache clean --force
npm install
```

### Port Already in Use

```bash
# Find process using port
# On Windows
netstat -ano | findstr :3001

# On macOS/Linux
lsof -i :3001

# Kill process
# Windows: taskkill /PID 1234 /F
# macOS/Linux: kill -9 1234

# Or change port in code
PORT=3002 npm run start:dev
```

### Prisma Migration Conflicts

```bash
# View migration status
npm run prisma:migrate status

# Reset database (caution: deletes all data)
npm run prisma:migrate reset

# Create recovery migration
npm run prisma:migrate resolve --rolled-back migration_name
```

### JWT Token Errors

```bash
# Verify token in browser console
const token = localStorage.getItem('token');
const decoded = JSON.parse(atob(token.split('.')[1]));
console.log(decoded);

# Check token expiration
console.log(new Date(decoded.exp * 1000));
```

### Stripe Integration Issues

```typescript
// Verify API keys
console.log('Publishable Key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Check Stripe initialization
if (window.Stripe === undefined) {
  console.error('Stripe.js not loaded');
}

// Inspect Stripe errors
.catch(error => {
  console.error('Stripe error:', error.error?.message);
});
```

## Version Control

### Git Workflow

```bash
# Update your feature branch from main
git fetch origin
git rebase origin/main

# OR merge if conflicts exist
git merge origin/main

# Resolve conflicts
git status
# Edit conflicting files
git add .
git commit -m "Merge branch 'main' into feature/xxx"

# Push updated branch
git push origin feature/vendor-analytics-dashboard -f
```

### Keeping Fork Updated

```bash
git remote add upstream https://github.com/original/repo.git
git fetch upstream
git rebase upstream/main
git push origin main -f
```

## Team Collaboration

### Code Review Checklist

Before requesting review, verify:
- [ ] Tests pass: `npm run test`
- [ ] Code follows style: `npm run lint:fix`
- [ ] Types are correct: `npm run type-check`
- [ ] No console errors
- [ ] Feature works locally
- [ ] Documentation updated
- [ ] Migrations tested

### Pair Programming

```bash
# Share VS Code using extension: "Live Share"
# Install: Extension ID: MS-vsliveshare.vsliveshare

# One person shares their VS Code workspace
# Other person can edit code simultaneously
# Cursor positions visible in real-time
```

## Time Estimates

| Task | Time |
|------|------|
| Small bug fix | 15-30 min |
| Component development | 1-2 hours |
| API endpoint | 1-2 hours |
| Feature (component + API) | 2-4 hours |
| Database migration | 1 hour |
| Tests | 30 min - 1 hour |
| Code review | 15-30 min |
| Pull request feedback | 30 min - 1 hour |
