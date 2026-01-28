# LocalMarket - Multi-Vendor Marketplace Platform

A production-ready marketplace platform connecting local artisans with customers worldwide. Built with modern technologies and designed for scalability.

## 🎯 Features

### Multi-Vendor Ecosystem
- ✅ Role-based access control (Buyer, Vendor, Admin)
- ✅ Vendor onboarding with location-based profiles
- ✅ Shop discovery via map-based UI
- ✅ Vendor dashboard with analytics

### Product Management
- ✅ Rich product uploads with multiple images
- ✅ Product categorization and tagging
- ✅ Inventory management with stock tracking
- ✅ Draft vs published product states
- ✅ SEO-friendly slugs and metadata

### Shopping Experience
- ✅ Multi-vendor cart and checkout
- ✅ Real-time product search with filters
- ✅ Customer reviews and ratings
- ✅ Wish lists and favorites (future)
- ✅ Order history and tracking

### Smart Payment Splitting
- ✅ Multi-vendor orders grouped correctly
- ✅ Automatic platform fee calculation (10% configurable)
- ✅ Separate payment processing per vendor
- ✅ Transparent earnings breakdown
- ✅ Stripe Connect integration for vendor payouts

### Secure Payments
- ✅ Multiple payment methods (Card, UPI, Netbanking, Wallet)
- ✅ Stripe PCI compliance (no card data on server)
- ✅ Webhook-based payment verification
- ✅ Payment retry logic with error handling
- ✅ Secure transaction logging

### Ratings & Reviews
- ✅ Only reviewable after order completion
- ✅ Vendor and product aggregate ratings
- ✅ Review moderation support
- ✅ Abuse prevention (one review per product per order)

### Analytics & Reporting
- ✅ Vendor sales analytics dashboard
- ✅ Daily/weekly/monthly revenue metrics
- ✅ Order fulfillment tracking
- ✅ Top products and performance insights

---

## 🛠️ Tech Stack

### Backend
- **Node.js + NestJS** - Scalable TypeScript framework
- **PostgreSQL** - Reliable relational database
- **Prisma** - Type-safe ORM
- **JWT + Passport.js** - Authentication & authorization
- **Stripe Connect** - Payment processing
- **Docker** - Containerization

### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Stripe.js** - Client-side payment UI
- **Mapbox GL** - Location-based features
- **React Query** - Server state management

### Deployment
- **Docker Compose** - Local development
- **AWS/Azure** - Cloud hosting options
- **PostgreSQL RDS** - Managed database
- **AWS S3** - File storage
- **Vercel** - Frontend deployment

---

## 📁 Project Structure

```
marketplace-backend/
├── src/
│   ├── main.ts              # Application entry point
│   ├── app.module.ts        # Root module
│   ├── common/              # Shared utilities
│   │   └── prisma/          # Database service
│   └── modules/
│       ├── auth/            # Authentication & RBAC
│       ├── vendor/          # Vendor management
│       ├── product/         # Product catalog
│       ├── cart/            # Shopping cart
│       ├── order/           # Orders & checkout
│       ├── payment/         # Payment processing
│       ├── review/          # Reviews & ratings
│       └── analytics/       # Analytics engine
├── prisma/
│   └── schema.prisma        # Database schema
└── package.json

marketplace-frontend/
├── src/
│   ├── app/                 # Next.js pages
│   │   ├── page.tsx         # Home page
│   │   ├── shop/            # Shop pages
│   │   ├── vendors/         # Vendor pages
│   │   ├── auth/            # Auth pages
│   │   ├── checkout/        # Checkout flow
│   │   └── dashboard/       # Dashboards
│   ├── components/          # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── lib/                 # Utilities
│   │   ├── api-client.ts    # API wrapper
│   │   └── stores.ts        # Zustand stores
│   ├── styles/              # Global styles
│   └── types/               # TypeScript types
└── package.json

docs/
├── ARCHITECTURE.md          # System design
├── API_DOCS.md             # API reference
├── PAYMENT_FLOW.md         # Payment integration
├── SETUP.md                # Installation guide
└── ER_DIAGRAM.md           # Database schema
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Stripe account (free tier OK)

### Backend Setup

```bash
cd marketplace-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
npm run prisma:generate
npm run prisma:migrate
npm run seed

# Start development server
npm run start:dev
```

Backend runs on `http://localhost:3001`

### Frontend Setup

```bash
cd marketplace-frontend

# Install dependencies
npm install

# Setup environment
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
echo "NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_..." >> .env.local

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

### Using Docker

```bash
# Start all services
docker-compose up

# Services:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:3001
# - Database: postgres:5432
```

---

## 📖 Documentation

Complete documentation is available in the `/docs` directory:

- **[SETUP.md](docs/SETUP.md)** - Installation & configuration
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design & patterns
- **[API_DOCS.md](docs/API_DOCS.md)** - Complete API reference
- **[PAYMENT_FLOW.md](docs/PAYMENT_FLOW.md)** - Payment integration guide
- **[ER_DIAGRAM.md](docs/ER_DIAGRAM.md)** - Database schema design

---

## 🔑 Key Features Deep Dive

### Multi-Vendor Order Management

One order can contain items from multiple vendors. The system automatically:
1. Groups cart items by vendor ID
2. Creates separate VendorOrder records
3. Calculates platform fee per vendor
4. Tracks vendor earnings independently
5. Allows vendors to fulfill orders separately

```
Order (1)
├─ OrderItem (Product from Vendor A)
├─ OrderItem (Product from Vendor A)
├─ OrderItem (Product from Vendor B)
│
└─ VendorOrder (Vendor A) - $60 subtotal, $54 earnings
   VendorOrder (Vendor B) - $40 subtotal, $36 earnings
```

### Role-Based Access Control

Three roles with different permissions:

| Feature | Buyer | Vendor | Admin |
|---------|-------|--------|-------|
| Browse products | ✅ | ✅ | ✅ |
| Add to cart | ✅ | ❌ | ❌ |
| Checkout | ✅ | ❌ | ❌ |
| Create products | ❌ | ✅ | ✅ |
| Manage orders | ✅ Own | ✅ Own | ✅ All |
| View analytics | ❌ | ✅ Own | ✅ All |
| Moderate content | ❌ | ❌ | ✅ |

### Payment Processing Flow

```
1. User selects payment method
   ↓
2. System creates Stripe PaymentIntent
   ↓
3. Frontend shows Stripe payment popup
   ↓
4. User completes payment (in popup, not your server)
   ↓
5. Stripe returns result to frontend
   ↓
6. Frontend confirms payment with backend
   ↓
7. Backend verifies with Stripe webhook
   ↓
8. Order confirmed, vendors notified
   ↓
9. Earnings recorded for vendor payout settlement
```

Key benefit: **Card data never touches your server** - PCI compliant!

### Location-Based Vendor Discovery

```typescript
// Find vendors within 50km
GET /vendors?latitude=37.7749&longitude=-122.4194&radius=50

Response includes:
- Vendor profile
- Shop rating
- Top products
- Distance from user
```

Uses Haversine formula for distance calculation. Future: PostGIS for better performance.

---

## 🔐 Security

- ✅ JWT authentication with expiration
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcryptjs
- ✅ SQL injection prevention via Prisma ORM
- ✅ CORS configured for frontend domain
- ✅ Rate limiting (100 req/min)
- ✅ PCI compliant payment processing
- ✅ Webhook signature verification
- ✅ Environment variables for secrets

---

## 📊 Database Schema Highlights

### User Management
- Users table with roles (BUYER, VENDOR, ADMIN)
- Vendor profile with location & shop details
- Buyer profile with shipping addresses

### Product Catalog
- Products with vendor ownership
- ProductImages for multiple photos
- Stock management with reservation tracking
- Draft/Published/Archived states

### Orders & Payments
- One Order per checkout (can contain multiple vendors)
- VendorOrder for vendor-specific handling
- OrderItem for line items
- Payment record with Stripe integration

### Reviews & Ratings
- Reviews linked to Product, Vendor, and Buyer
- Aggregate ratings calculated from reviews
- Moderation status for spam prevention
- Unique constraint: one review per (product, buyer, order)

See [ER_DIAGRAM.md](docs/ER_DIAGRAM.md) for complete schema.

---

## 🧪 Testing

### Backend

```bash
cd marketplace-backend

# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

### Frontend

```bash
cd marketplace-frontend

# Run tests
npm run test

# Coverage
npm run test:cov
```

---

## 🚢 Production Deployment

### Backend Deployment (AWS ECS)

```bash
# Build Docker image
docker build -t marketplace-backend:1.0.0 .

# Push to ECR
docker push <aws-account>.dkr.ecr.<region>.amazonaws.com/marketplace-backend:1.0.0

# Deploy to ECS with RDS PostgreSQL
```

### Frontend Deployment (Vercel)

```bash
# Connect GitHub repo to Vercel
# Set environment variables
# Auto-deploys on push
```

See [SETUP.md - Production Deployment](docs/SETUP.md#production-deployment) for details.

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push branch: `git push origin feature/amazing-feature`
4. Open Pull Request

---

## 📝 API Examples

### Create Vendor Profile

```bash
POST /api/vendors
Authorization: Bearer <token>

{
  "shopName": "Artisan Crafts",
  "description": "Handmade jewelry",
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94105",
  "country": "USA",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

### Add Product

```bash
POST /api/products
Authorization: Bearer <token>

{
  "name": "Handmade Ceramic Mug",
  "description": "Beautiful handcrafted mug",
  "price": 24.99,
  "category": "Home & Kitchen",
  "stock": 50
}
```

### Checkout

```bash
POST /api/orders/checkout
Authorization: Bearer <token>

{
  "shippingAddressId": "addr-123",
  "notes": "Please wrap as gift"
}
```

### Select Payment Method

```bash
POST /api/orders/:orderId/select-payment
Authorization: Bearer <token>

{
  "paymentMethod": "CARD"
}
```

See [API_DOCS.md](docs/API_DOCS.md) for complete API reference.

---

## 🐛 Troubleshooting

### Database Connection Error
```
Check PostgreSQL is running: pg_isready
Verify DATABASE_URL in .env
```

### Port Already in Use
```bash
# Find and kill process on port 3001
lsof -ti :3001 | xargs kill -9
```

### Stripe Keys Invalid
```
Verify keys from Stripe Dashboard
Ensure keys match environment (test/live)
Check keys in .env file
```

See [SETUP.md - Troubleshooting](docs/SETUP.md#troubleshooting) for more.

---

## 📊 Metrics & Monitoring

Track in production:
- API response times (p50, p95, p99)
- Error rates by endpoint
- Payment success/failure rates
- Vendor order fulfillment times
- User conversion funnel
- Search query patterns

Suggested tools: Sentry, DataDog, New Relic

---

## 🎓 Learning Resources

### Architecture Patterns
- [Repository Pattern](docs/ARCHITECTURE.md)
- [RBAC Implementation](docs/ARCHITECTURE.md#authentication--authorization)
- [Payment Splitting Logic](docs/PAYMENT_FLOW.md)

### Payment Integration
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Connect Guide](https://stripe.com/docs/connect)
- [Webhook Handling](docs/PAYMENT_FLOW.md#webhook-handling-stripe)

---

## 📄 License

MIT License - See LICENSE file

---

## 💬 Support

- 📧 Email: support@localmarket.com
- 🐛 Issues: GitHub Issues
- 📚 Documentation: See `/docs` folder

---

## 🙏 Acknowledgments

Built with:
- [NestJS](https://nestjs.com/) - Server framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Stripe](https://stripe.com/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## 🎯 Roadmap

### Phase 1 (MVP) ✅
- [x] Multi-vendor auth system
- [x] Product management
- [x] Cart & checkout
- [x] Basic payment processing
- [x] Reviews & ratings
- [x] Vendor dashboard

### Phase 2 (V1.1)
- [ ] Stripe Connect vendor payouts
- [ ] Advanced search with Elasticsearch
- [ ] Real-time notifications
- [ ] Admin moderation panel
- [ ] Vendor analytics API
- [ ] Refund handling

### Phase 3 (V1.2)
- [ ] Mobile app (React Native)
- [ ] Wishlist & favorites
- [ ] Subscription products
- [ ] Vendor financing
- [ ] Affiliate program
- [ ] API documentation (OpenAPI)

### Phase 4 (V2.0)
- [ ] Marketplace API for third parties
- [ ] Blockchain-based reviews
- [ ] AI-powered recommendations
- [ ] Social features
- [ ] Live shopping features

---

**LocalMarket** - Empowering local artisans, one marketplace at a time. 🎨

Made with ❤️ by the LocalMarket team
