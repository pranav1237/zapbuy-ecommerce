# Architecture & Technical Design

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    MARKETPLACE PLATFORM                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │  FRONTEND (React)    │      │   BACKEND (NestJS)   │    │
│  │  - Next.js           │      │   - Express           │    │
│  │  - Tailwind CSS      │◄────►│   - Prisma ORM        │    │
│  │  - Zustand (State)   │      │   - PostgreSQL        │    │
│  │  - Stripe.js         │      │   - Stripe Connect    │    │
│  │  - Mapbox GL         │      │   - Redis Cache       │    │
│  └──────────────────────┘      └──────────────────────┘    │
│         │                                    │                │
│         │                                    │                │
│         └────────────────────────────────────┘                │
│                    (REST API)                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT + Passport.js
- **Payments:** Stripe Connect
- **Caching:** Redis (future)
- **File Storage:** AWS S3 / Cloudinary
- **Deployment:** Docker + AWS/Azure

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** Axios + React Query
- **Maps:** Mapbox GL
- **Payments:** Stripe.js
- **Deployment:** Vercel / AWS Amplify

### Infrastructure
- **Containerization:** Docker
- **CI/CD:** GitHub Actions / Azure DevOps
- **Monitoring:** Sentry / New Relic
- **Email:** SendGrid / AWS SES
- **Webhooks:** Stripe Webhooks

---

## API Architecture

### Authentication Flow
```
1. User signup → User + Role-specific record created
2. User login → JWT token issued
3. Token stored in localStorage (frontend) or secure cookie
4. Token included in Authorization header for protected endpoints
5. JWT verified on backend using Passport JWT strategy
6. Role-based access control enforced via RolesGuard
```

### Multi-Vendor Order Flow
```
1. Buyer adds items from multiple vendors to cart
   └─ Items stored with product.vendorId reference

2. Buyer checkout:
   ├─ System groups cart items by vendorId
   ├─ Creates ONE Order record
   ├─ Creates ONE OrderItem per cart item
   ├─ Creates ONE VendorOrder per vendor
   ├─ Reserves stock (Product.reserved += quantity)
   └─ Clears cart

3. Payment selection:
   ├─ User selects payment method (CARD/UPI/etc)
   ├─ If CARD: Create Stripe PaymentIntent
   ├─ Return client_secret for payment popup

4. Payment confirmation:
   ├─ User completes payment in popup
   ├─ Frontend calls confirm-payment endpoint
   ├─ Order status → CONFIRMED
   ├─ All VendorOrders → CONFIRMED
   ├─ Update vendor earnings
   └─ Create separate Payout record for settlement

5. Vendor fulfillment:
   ├─ Vendor sees VendorOrder in their dashboard
   ├─ Vendor updates status: PROCESSING → SHIPPED → DELIVERED
   └─ Customer can review after DELIVERED status
```

### Payment Splitting Logic
```
Platform Fee = 10% (configurable)

Order Subtotal: $100.00
  ├─ Vendor A items: $60.00
  │  ├─ Platform fee: $6.00 (10%)
  │  └─ Vendor earnings: $54.00
  │
  └─ Vendor B items: $40.00
     ├─ Platform fee: $4.00 (10%)
     └─ Vendor earnings: $36.00

Total Platform Fee: $10.00
Total Vendor Earnings: $90.00
Customer Pays: $100.00
```

---

## Security Architecture

### Authentication & Authorization
```
┌─────────────────────────────────┐
│   Protected Endpoint             │
├─────────────────────────────────┤
│                                   │
│  1. Extract token from header    │
│  2. Verify token signature       │
│  3. Check token expiration       │
│  4. Validate user exists         │
│  5. Extract user role            │
│  6. Check @Roles() decorator     │
│  7. Execute endpoint if allowed  │
│                                   │
└─────────────────────────────────┘
```

### Data Privacy
- Passwords hashed with bcryptjs (salt rounds: 10)
- Sensitive data encrypted in transit (HTTPS)
- JWT tokens with 7-day expiration
- Refresh tokens for extended sessions (future)
- CORS configured for frontend domain only
- SQL injection prevented via Prisma parameterized queries

### Payment Security
- Stripe PCI compliance (no card data on backend)
- PaymentIntent stored, not actual card numbers
- Webhook signature verification
- Amount validation server-side
- Order validation before payment processing

---

## Database Design Patterns

### Stock Management
```
Product {
  stock: 50,           // Total available
  reserved: 10         // In-cart / pending orders
}

Available = stock - reserved

Rules:
✓ reserved cannot exceed stock
✓ When order confirmed, reserved → sold
✓ When order cancelled, reserved → released
```

### Polymorphic Reviews
```
One Review can belong to:
├─ Product (via productId)
├─ Vendor (via vendorId)
└─ Buyer (via buyerId)

Constraints:
├─ Only reviewable after order.status = DELIVERED
├─ Max one review per (product, buyer, order)
└─ Rating auto-calculated from reviews
```

### Vendor Order Isolation
```
Order {
  id: "ord-123"
}
├─ OrderItem {product from vendor A}
├─ OrderItem {product from vendor B}
├─ OrderItem {product from vendor B}
│
└─ VendorOrder {vendorId: "vendor-A", subtotal: $50}
   VendorOrder {vendorId: "vendor-B", subtotal: $100}

Benefit: Vendor only sees their own items/earnings
```

---

## Scalability Patterns

### Implemented
- ✅ Indexes on frequently filtered columns
- ✅ Pagination with limit/offset
- ✅ Full-text search on products
- ✅ Lazy loading of relations
- ✅ Role-based query filtering

### Future Optimizations
1. **Caching Layer**
   ```
   Redis cache:
   ├─ User auth tokens
   ├─ Vendor profiles (1 hour TTL)
   ├─ Product listings (30 min TTL)
   ├─ Cart data (session duration)
   └─ Vendor dashboard stats (5 min TTL)
   ```

2. **Search Optimization**
   ```
   Elasticsearch:
   ├─ Product full-text search
   ├─ Vendor search
   ├─ Autocomplete for categories
   └─ Advanced filtering/aggregations
   ```

3. **Geo-Indexing**
   ```
   PostGIS extension:
   ├─ Replace haversine formula with ST_Distance
   ├─ GiST indexes on location columns
   └─ Radius search O(log n) vs current O(n)
   ```

4. **Event Streaming**
   ```
   Kafka/RabbitMQ:
   ├─ Order events → notification service
   ├─ Payment events → analytics
   ├─ Review events → cache invalidation
   └─ Vendor events → email triggers
   ```

5. **Database Partitioning**
   ```
   Strategies:
   ├─ Orders by date (time-series)
   ├─ Products by vendor (sharding)
   ├─ Reviews by product_id
   └─ PaymentIntents by status
   ```

---

## Error Handling Strategy

### HTTP Status Codes
```
200 OK              ✓ Successful request
201 Created         ✓ Resource created
204 No Content      ✓ Successful, no response body
400 Bad Request     ✗ Invalid input
401 Unauthorized    ✗ Missing/invalid token
403 Forbidden       ✗ Insufficient permissions
404 Not Found       ✗ Resource doesn't exist
409 Conflict        ✗ Business logic violation (e.g., duplicate)
422 Unprocessable   ✗ Validation failed
429 Rate Limited    ✗ Too many requests
500 Server Error    ✗ Unexpected error
```

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Insufficient stock for product",
  "error": "Bad Request",
  "timestamp": "2024-01-27T10:30:00Z",
  "path": "/api/cart/items"
}
```

### Validation Strategy
- Class validators on DTOs (frontend + backend)
- Business logic validation in service layer
- Database constraints as last resort
- User-friendly error messages

---

## Testing Strategy

### Backend Unit Tests
```typescript
// Example: ProductService.createProduct()
describe('ProductService', () => {
  it('should create product with valid data', async () => {
    const result = await productService.createProduct(vendorId, dto);
    expect(result.status).toBe('DRAFT');
  });

  it('should reject duplicate slug', async () => {
    await expect(productService.createProduct(vendorId, dto))
      .rejects.toThrow('Product name already exists');
  });
});
```

### Integration Tests
```typescript
// Example: Cart + Checkout flow
describe('Checkout Flow', () => {
  it('should create order with multiple vendors', async () => {
    await cartService.addToCart(buyerId, productFromVendorA);
    await cartService.addToCart(buyerId, productFromVendorB);
    const order = await orderService.createCheckoutSession(buyerId, dto);
    
    expect(order.vendorOrders).toHaveLength(2);
  });
});
```

### E2E Tests
```typescript
// Example: Full checkout
describe('Complete Checkout', () => {
  it('should process payment and confirm order', async () => {
    // 1. Add to cart
    // 2. Checkout
    // 3. Select payment
    // 4. Complete payment
    // 5. Verify order created
    // 6. Verify vendor orders created
    // 7. Verify stock updated
  });
});
```

---

## Deployment Architecture

### Development
```
localhost:3000  → Frontend (Next.js dev server)
localhost:3001  → Backend (NestJS dev server)
localhost:5432 → PostgreSQL
localhost:6379 → Redis (optional)
```

### Production
```
Frontend (Vercel/AWS Amplify):
├─ Next.js Build
├─ Static site generation
├─ CDN distribution
└─ CI/CD auto-deploy on push

Backend (AWS ECS/EKS/AppRunner):
├─ Docker container
├─ Auto-scaling
├─ Health checks
├─ Blue-green deployment
└─ Zero-downtime updates

Database (AWS RDS):
├─ PostgreSQL managed service
├─ Automated backups (daily)
├─ Point-in-time recovery
└─ Multi-AZ redundancy

Storage (AWS S3):
├─ Product images
├─ Vendor uploads
├─ CDN-backed distribution
└─ Versioning enabled
```

---

## Monitoring & Observability

### Metrics to Track
- API response times (percentiles: p50, p95, p99)
- Error rates by endpoint
- Payment success/failure rates
- Vendor order fulfillment times
- User conversion funnel
- Search query patterns

### Logging Strategy
- Request/response logging (middleware)
- Payment transaction logs
- Error stack traces with context
- Audit logs for admin actions
- Retention: 30 days

### Alerting
- Server errors > 5% error rate
- Payment failures > 2% failure rate
- API response time > 1000ms (p95)
- Database connection pool exhausted
- Stripe webhook failures
- Payment intent timeouts

---

## Disaster Recovery

### Backup Strategy
- Daily automated database backups
- Point-in-time recovery capability (7 days)
- S3 bucket versioning enabled
- Cross-region replication (future)

### Failover Plan
1. Detect service degradation
2. Switch to standby database replica
3. Redirect traffic to backup region
4. Notify stakeholders
5. Investigate root cause
6. Manual promotion of replica
7. Full data reconciliation

### RTO/RPO
- RTO (Recovery Time Objective): < 1 hour
- RPO (Recovery Point Objective): < 15 minutes

