# Marketplace Database Schema & ER Diagram

## Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│      USER       │
├─────────────────┤
│ id (PK)         │
│ email (unique)  │
│ passwordHash    │
│ firstName       │
│ lastName        │
│ avatar          │
│ phoneNumber     │
│ role            │ ────────┬─────────────────┬─────────────────┐
│ createdAt       │         │                 │                 │
│ updatedAt       │         │                 │                 │
└─────────────────┘         │                 │                 │
                            │                 │                 │
                    ┌───────▼────────┐   ┌──────▼──────┐   ┌───▼──────────┐
                    │     VENDOR     │   │    BUYER    │   │    (ADMIN)   │
                    ├────────────────┤   ├─────────────┤   │              │
                    │ id (PK)        │   │ id (PK)     │   │ (Future)     │
                    │ userId (FK)    │   │ userId (FK) │   │              │
                    │ shopName       │   │ address     │   │              │
                    │ shopSlug       │   │ addresses[] │   │              │
                    │ description    │   └─────┬───────┘   └──────────────┘
                    │ latitude       │         │
                    │ longitude      │         │
                    │ address        │         │ 1:1
                    │ stripeAccount  │         │
                    │ isVerified     │         │
                    │ totalEarnings  │         ├──────────────┐
                    │ rating         │         │              │
                    └────────┬───────┘         │       ┌──────▼───────────┐
                             │                 │       │      CART        │
                             │ 1:N             │       ├──────────────────┤
                             │                 │       │ id (PK)          │
                    ┌────────▼──────────┐      │       │ buyerId (FK,uniq)│
                    │     PRODUCT       │      │       │ createdAt        │
                    ├───────────────────┤      │       │ updatedAt        │
                    │ id (PK)           │      │       └────────┬─────────┘
                    │ vendorId (FK)     │      │                │
                    │ name              │      │                │ 1:N
                    │ slug (unique)     │      │                │
                    │ description       │      │       ┌────────▼───────────┐
                    │ price             │      │       │    CART_ITEM       │
                    │ compareAtPrice    │      │       ├────────────────────┤
                    │ category          │      │       │ id (PK)            │
                    │ tags[]            │      │       │ cartId (FK)        │
                    │ stock             │      │       │ productId (FK)     │
                    │ reserved          │      │       │ quantity           │
                    │ status            │      │       │ priceAtAdd         │
                    │ rating            │      │       └────────────────────┘
                    │ reviewCount       │      │
                    └────────┬──────────┘      │
                             │                 │
                    ┌────────▼──────────┐      │
                    │  PRODUCT_IMAGE    │      │
                    ├───────────────────┤      │
                    │ id (PK)           │      │
                    │ productId (FK)    │      │
                    │ url               │      │
                    │ altText           │      │
                    │ isThumbnail       │      │
                    │ order             │      │
                    └───────────────────┘      │
                                               │
                    ┌──────────────────────────┘
                    │
        ┌───────────┴──────────┐
        │ 1:1 (via ORDER)       │
        │                       │
    ┌───▼───────────────┐  ┌───▼─────────────────┐
    │      ORDER        │  │     ADDRESS         │
    ├───────────────────┤  ├─────────────────────┤
    │ id (PK)           │  │ id (PK)             │
    │ buyerId (FK)      │  │ buyerId (FK)        │
    │ orderNumber       │  │ fullName            │
    │ status            │  │ phoneNumber         │
    │ shippingAddress   │  │ addressLine1        │
    │ subtotal          │  │ addressLine2        │
    │ platformFee       │  │ city                │
    │ total             │  │ state               │
    │ paymentIntentId   │  │ zipCode             │
    │ paymentStatus     │  │ country             │
    │ notes             │  │ isDefault           │
    │ createdAt         │  └─────────────────────┘
    └───────┬───────────┘
            │
            ├─ 1:N ─────────────┐
            │                   │
    ┌───────▼────────────┐  ┌───▼─────────────────┐
    │   ORDER_ITEM       │  │   VENDOR_ORDER      │
    ├────────────────────┤  ├─────────────────────┤
    │ id (PK)            │  │ id (PK)             │
    │ orderId (FK)       │  │ orderId (FK)        │
    │ productId (FK)     │  │ vendorId (FK)       │
    │ quantity           │  │ status              │
    │ unitPrice          │  │ subtotal            │
    │ subtotal           │  │ vendorEarnings      │
    └────────────────────┘  │ trackingNumber      │
                            └─────────────────────┘
                                    │
                                    │ 1:1
                                    │
                            ┌───────▼──────────┐
                            │     PAYMENT      │
                            ├──────────────────┤
                            │ id (PK)          │
                            │ orderId (FK,uniq)│
                            │ paymentMethod    │
                            │ status           │
                            │ stripePaymentId  │
                            │ amount           │
                            │ currency         │
                            │ failureReason    │
                            │ createdAt        │
                            └──────────────────┘

    ┌──────────────────┐
    │     REVIEW       │
    ├──────────────────┤
    │ id (PK)          │
    │ productId (FK)   │
    │ vendorId (FK)    │
    │ buyerId (FK)     │
    │ orderId          │
    │ rating (1-5)     │
    │ title            │
    │ content          │
    │ isApproved       │
    │ createdAt        │
    └──────────────────┘

    ┌──────────────────┐
    │      PAYOUT      │
    ├──────────────────┤
    │ id (PK)          │
    │ vendorId (FK)    │
    │ amount           │
    │ status           │
    │ periodStart      │
    │ periodEnd        │
    │ stripePayoutId   │
    │ failureReason    │
    │ createdAt        │
    └──────────────────┘
```

---

## Key Relationships

### User ↔ Vendor
- **Type:** 1:1 (User can have one Vendor profile)
- **Cascade:** ON DELETE CASCADE
- Via `User.role = "VENDOR"` and `Vendor.userId = User.id`

### User ↔ Buyer
- **Type:** 1:1
- **Cascade:** ON DELETE CASCADE
- Via `User.role = "BUYER"` and `Buyer.userId = User.id`

### Vendor ↔ Product
- **Type:** 1:N (Vendor has many Products)
- **Cascade:** ON DELETE CASCADE
- Via `Product.vendorId`

### Product ↔ ProductImage
- **Type:** 1:N
- **Cascade:** ON DELETE CASCADE

### Product ↔ Review
- **Type:** 1:N
- **Cascade:** ON DELETE CASCADE
- **Constraint:** `UNIQUE(productId, buyerId, orderId)` - One review per product per order

### Buyer ↔ Cart
- **Type:** 1:1 (Auto-created on first cart access)
- **Cascade:** ON DELETE CASCADE

### Cart ↔ CartItem
- **Type:** 1:N
- **Unique:** `UNIQUE(cartId, productId)` - Can't add same product twice
- **Cascade:** ON DELETE CASCADE

### Cart ↔ Product (via CartItem)
- **Type:** M:N (Many-to-many join table)

### Buyer ↔ Order
- **Type:** 1:N
- **Cascade:** ON DELETE RESTRICT (Don't allow deleting buyers with orders)

### Order ↔ OrderItem
- **Type:** 1:N
- **Cascade:** ON DELETE CASCADE
- One OrderItem per product per order

### Order ↔ VendorOrder
- **Type:** 1:N
- **Unique:** `UNIQUE(orderId, vendorId)` - One VendorOrder per Order per Vendor
- **Cascade:** ON DELETE CASCADE

### Order ↔ Payment
- **Type:** 1:1
- **Unique:** `orderId` - One payment per order
- **Cascade:** ON DELETE CASCADE

### Vendor ↔ Payout
- **Type:** 1:N
- **Cascade:** ON DELETE RESTRICT

---

## Enums

### Role
```
- BUYER
- VENDOR
- ADMIN
```

### ProductStatus
```
- DRAFT (not published)
- PUBLISHED (visible to buyers)
- ARCHIVED (hidden)
```

### OrderStatus
```
- PENDING (awaiting payment)
- CONFIRMED (payment received)
- PROCESSING (vendor preparing)
- SHIPPED (in transit)
- DELIVERED (completed)
- CANCELLED
- RETURNED
```

### PaymentStatus
```
- PENDING (awaiting payment)
- PROCESSING (processing)
- COMPLETED (paid)
- FAILED
- REFUNDED
```

### PaymentMethod
```
- CARD (Stripe)
- UPI (India)
- NETBANKING (India)
- WALLET
```

### VendorOrderStatus
```
- PENDING
- CONFIRMED
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED
- REFUNDED
```

### PayoutStatus
```
- PENDING
- PROCESSING
- PAID
- FAILED
- CANCELLED
```

---

## Indexes

Optimized for common queries:

### Products
- `idx_product_vendorId` - Get vendor products
- `idx_product_slug` - Get product by slug
- `idx_product_status` - Find published products
- `idx_product_fulltext(name, description)` - Search products

### Orders
- `idx_order_buyerId` - Get buyer orders
- `idx_order_status` - Find orders by status
- `idx_order_orderNumber` - Find by order number
- `idx_order_paymentStatus` - Filter by payment status

### Reviews
- `idx_review_productId` - Get product reviews
- `idx_review_vendorId` - Get vendor reviews
- `idx_review_buyerId` - Get buyer reviews

### Vendors
- `idx_vendor_shopSlug` - Get vendor by shop slug
- `idx_vendor_userId` - Get vendor by user

### VendorOrder
- `idx_vendorOrder_vendorId` - Get vendor orders
- `idx_vendorOrder_status` - Filter by status

### Payout
- `idx_payout_vendorId` - Get vendor payouts
- `idx_payout_status` - Filter by status

---

## Data Constraints

### Stock Management
- `Product.stock >= 0` (Cannot have negative stock)
- `Product.reserved >= 0` (Cannot have negative reserved)
- `Product.reserved <= Product.stock` (Reserved cannot exceed total)
- **Check on Cart:** Available = `stock - reserved`

### Payment
- `Payment.amount > 0`
- `Order.total = Order.subtotal + Order.platformFee`
- `VendorOrder.vendorEarnings = VendorOrder.subtotal - (VendorOrder.subtotal * platformFeePercentage / 100)`

### Reviews
- `Review.rating >= 1 AND Review.rating <= 5`
- Only reviewable after order status = `DELIVERED`
- Unique constraint: Can't have multiple reviews for same product from same buyer for same order

### Address
- Buyer can have multiple addresses
- One can be marked as `isDefault = true` for quick checkout

---

## Scalability Considerations

### Current Design Supports:
- ✅ Multiple vendors per platform
- ✅ Multiple products per vendor
- ✅ Orders split across multiple vendors
- ✅ Inventory management
- ✅ Payment tracking per order
- ✅ Earnings tracking per vendor per order

### Future Optimizations:
1. **Caching Layer** (Redis)
   - Cache vendor profiles
   - Cache product listings
   - Cache user cart

2. **Search Optimization** (Elasticsearch)
   - Replace full-text search with ES
   - Support advanced filters

3. **Geo-Indexing** (PostGIS)
   - Replace haversine formula with PostGIS
   - Radius searches become O(1) instead of O(n)

4. **Event Stream** (Kafka/RabbitMQ)
   - Order events → vendor notification system
   - Payment events → analytics
   - Review events → cache invalidation

5. **Database Partitioning**
   - Partition orders table by date
   - Partition products by vendor_id (sharding)
   - Partition reviews by product_id

6. **Materialized Views**
   - Vendor sales statistics (refreshed hourly)
   - Top products (refreshed daily)
   - Category statistics

