# Setup & Installation Guide

## Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Docker (optional)
- Git

### 1. Clone Repository
```bash
cd d:\Documents\E-Commerce
git clone <repo-url> .
cd marketplace-backend
```

### 2. Backend Setup

**Install dependencies:**
```bash
npm install
```

**Create `.env` file:**
```bash
cp .env.example .env
```

**Update `.env` with your values:**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/marketplace_db
JWT_SECRET=your-super-secret-key-here
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
PLATFORM_FEE_PERCENTAGE=10
NODE_ENV=development
PORT=3001
```

**Setup database:**
```bash
# Install Prisma CLI globally (optional)
npm install -g prisma

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed demo data
npm run seed
```

**Start development server:**
```bash
npm run start:dev
```

Backend will be running on `http://localhost:3001`

---

### 3. Frontend Setup

**Navigate to frontend:**
```bash
cd ../marketplace-frontend
```

**Install dependencies:**
```bash
npm install
```

**Create `.env.local` file:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

**Start development server:**
```bash
npm run dev
```

Frontend will be running on `http://localhost:3000`

---

## Docker Setup (Alternative)

### Using Docker Compose

**1. Create `docker-compose.yml` in root:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: marketplace_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./marketplace-backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/marketplace_db
      JWT_SECRET: super-secret-key
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      NODE_ENV: development
    depends_on:
      - postgres
    command: npm run start:dev

  frontend:
    build: ./marketplace-frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api
      NEXT_PUBLIC_STRIPE_PUBLIC_KEY: ${STRIPE_PUBLIC_KEY}
    depends_on:
      - backend

volumes:
  postgres_data:
```

**2. Create `.env.docker`:**
```env
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLIC_KEY=pk_test_your_key
```

**3. Start everything:**
```bash
docker-compose up
```

---

## Environment Variables

### Backend (.env)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `postgresql://...` | PostgreSQL connection string |
| `JWT_SECRET` | Yes | `super-secret-key` | JWT signing secret |
| `JWT_EXPIRATION` | No | `7d` | Token expiration time |
| `STRIPE_SECRET_KEY` | Yes | `sk_test_...` | Stripe secret API key |
| `STRIPE_PUBLISHABLE_KEY` | Yes | `pk_test_...` | Stripe public key |
| `STRIPE_WEBHOOK_SECRET` | No | `whsec_...` | Stripe webhook secret |
| `PLATFORM_FEE_PERCENTAGE` | No | `10` | Platform fee percentage (0-100) |
| `AWS_ACCESS_KEY_ID` | No | `AKIA...` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | No | `...` | AWS secret key |
| `AWS_S3_BUCKET_NAME` | No | `marketplace-uploads` | S3 bucket name |
| `AWS_REGION` | No | `us-east-1` | AWS region |
| `API_URL` | No | `http://localhost:3001` | Backend API URL |
| `NODE_ENV` | Yes | `development` | Environment (dev/prod) |
| `PORT` | No | `3001` | Server port |

### Frontend (.env.local)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:3001/api` | Backend API endpoint |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Yes | `pk_test_...` | Stripe public key |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | No | `pk.eyJ...` | Mapbox access token |

---

## Database Setup

### Creating Database Manually

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE marketplace_db;

# Connect to new database
\c marketplace_db

# Exit
\q
```

### Prisma Migrations

```bash
# Create new migration
npm run prisma:migrate -- --name add_feature

# Run pending migrations
npm run prisma:migrate deploy

# Revert last migration
npm run prisma:migrate resolve -- <migration-name>

# Inspect schema
npm run prisma:studio
```

---

## Seed Demo Data

**Edit `src/database/seed.ts`:**
```typescript
async function main() {
  // Create demo vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      userId: 'vendor-1-id',
      shopName: 'Artisan Crafts',
      shopSlug: 'artisan-crafts',
      description: 'Handmade jewelry and crafts',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
      latitude: 37.7749,
      longitude: -122.4194,
      isVerified: true,
    },
  });

  // Create demo products, buyers, etc.
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run seed:**
```bash
npm run seed
```

---

## API Testing

### Using Postman

1. **Download Postman** from https://www.postman.com/downloads/
2. **Import collection:** `docs/postman-collection.json` (if provided)
3. **Set variables:** `{{BASE_URL}}`, `{{TOKEN}}`
4. **Test endpoints**

### Using cURL

**Signup:**
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "BUYER"
  }'
```

**Signin:**
```bash
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Get with Auth:**
```bash
curl -X GET http://localhost:3001/api/cart \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/add-reviews
```

### 2. Make Changes
```bash
# Backend
cd marketplace-backend
npm run start:dev

# Frontend (another terminal)
cd marketplace-frontend
npm run dev
```

### 3. Test Changes
```bash
# Backend
npm run test
npm run test:cov

# Frontend
npm run test
```

### 4. Lint & Format
```bash
# Backend
npm run lint

# Frontend
npm run lint
```

### 5. Commit & Push
```bash
git add .
git commit -m "feat: add reviews feature"
git push origin feature/add-reviews
```

### 6. Create Pull Request
- Go to GitHub/Azure DevOps
- Create PR from feature branch
- Add description
- Request reviews
- Merge after approval

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
- Ensure PostgreSQL is running: `pg_isready`
- Check DATABASE_URL is correct
- Verify username/password

### Port Already in Use
```
Error: listen EADDRINUSE :::3001
```

**Solution:**
```bash
# Kill process on port 3001
lsof -ti :3001 | xargs kill -9

# Or use different port
PORT=3002 npm run start:dev
```

### Prisma Migration Conflict
```
Error: Migration history conflict detected
```

**Solution:**
```bash
# Option 1: Reset database (dev only)
npx prisma migrate reset

# Option 2: Resolve manually
npm run prisma:migrate -- resolve --rolled-back <migration-name>
```

### Module Not Found
```
Error: Cannot find module '@/lib/...'
```

**Solution:**
- Check tsconfig paths configuration
- Rebuild project: `npm run build`
- Clear cache: `rm -rf node_modules dist && npm install`

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Check CORS configuration in `main.ts`
- Add frontend URL to allowed origins
- Ensure frontend URL matches exactly

---

## Production Deployment

### Before Deploying

1. **Environment Variables:**
   ```bash
   # Set all required env vars in hosting platform
   # Use secure secret management (AWS Secrets Manager, etc.)
   ```

2. **Database:**
   ```bash
   # Use managed database service
   # Enable automated backups
   # Set up monitoring/alerts
   ```

3. **SSL Certificate:**
   ```bash
   # Get certificate from Let's Encrypt or AWS Certificate Manager
   ```

4. **Build & Test:**
   ```bash
   # Backend
   npm run build
   npm run test

   # Frontend
   npm run build
   npm run test
   ```

### Backend Deployment (AWS ECS/AppRunner)

1. **Create Docker image:**
   ```bash
   cd marketplace-backend
   docker build -t marketplace-backend:1.0.0 .
   docker tag marketplace-backend:1.0.0 <aws-account>.dkr.ecr.<region>.amazonaws.com/marketplace-backend:1.0.0
   docker push <aws-account>.dkr.ecr.<region>.amazonaws.com/marketplace-backend:1.0.0
   ```

2. **Deploy to ECS:**
   - Create ECS task definition
   - Set environment variables
   - Configure load balancer
   - Set health checks
   - Deploy service

### Frontend Deployment (Vercel)

1. **Connect GitHub to Vercel**
2. **Create project from repository**
3. **Set environment variables:**
   - `NEXT_PUBLIC_API_URL` → production backend URL
   - `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
   - `NEXT_PUBLIC_MAPBOX_TOKEN`
4. **Deploy** (auto-deploys on push)

---

## Monitoring Production

### Health Checks
```bash
# Backend health
curl https://api.localmarket.com/api/health

# Frontend health
curl https://localmarket.com/api/health
```

### Logs
```bash
# View logs
docker logs <container-id>
tail -f /var/log/app.log

# Centralized logging (CloudWatch, DataDog, Sentry)
```

### Performance Monitoring
- APM tools: New Relic, DataDog, Sentry
- Frontend metrics: Web Vitals, Lighthouse
- Backend metrics: Request duration, error rates

