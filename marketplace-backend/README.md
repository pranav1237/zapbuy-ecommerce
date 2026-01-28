# Marketplace Backend

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/marketplace_db

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PLATFORM_FEE_PERCENTAGE=10

# File Upload
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET_NAME=marketplace-uploads
AWS_REGION=us-east-1

# API
API_URL=http://localhost:3001
NODE_ENV=development
PORT=3001
```

## Installation & Setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run start:dev
```

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for complete endpoint documentation.
