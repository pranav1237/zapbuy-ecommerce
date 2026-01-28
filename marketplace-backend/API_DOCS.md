# Marketplace API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### 1. User Sign Up
**POST** `/auth/signup`

Create a new user account (Buyer, Vendor, or Admin).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "BUYER"
}
```

**Roles:**
- `BUYER`: Can purchase products
- `VENDOR`: Can sell products
- `ADMIN`: Platform administrator

**Response (201):**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "BUYER",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. User Sign In
**POST** `/auth/signin`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "BUYER",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Vendor Endpoints

### 1. Create Vendor Profile
**POST** `/vendors`
**Auth Required:** Yes (Role: VENDOR)

Create a vendor shop profile with location details.

**Request Body:**
```json
{
  "shopName": "Artisan Crafts",
  "description": "Handmade jewelry and crafts",
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94105",
  "country": "USA",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

**Response (201):**
```json
{
  "id": "vendor-id",
  "userId": "user-id",
  "shopName": "Artisan Crafts",
  "shopSlug": "artisan-crafts",
  "description": "Handmade jewelry and crafts",
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "isVerified": false,
  "isActive": true,
  "totalSales": 0,
  "totalEarnings": 0,
  "rating": 0,
  "reviewCount": 0
}
```

---

### 2. Get Vendor Profile
**GET** `/vendors/:vendorId`

Get detailed vendor information.

**Response (200):**
```json
{
  "id": "vendor-id",
  "shopName": "Artisan Crafts",
  "shopSlug": "artisan-crafts",
  "description": "Handmade jewelry and crafts",
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "isVerified": true,
  "isActive": true,
  "totalSales": 5000,
  "totalEarnings": 4500,
  "rating": 4.8,
  "reviewCount": 25,
  "user": {
    "email": "vendor@example.com",
    "firstName": "Jane",
    "lastName": "Smith"
  }
}
```

---

### 3. Get Vendor Dashboard
**GET** `/vendors/:vendorId/dashboard`
**Auth Required:** Yes (Role: VENDOR)

Get comprehensive vendor analytics and metrics.

**Response (200):**
```json
{
  "totalRevenue": 5000,
  "totalOrders": 15,
  "totalProducts": 24,
  "platformFees": 500,
  "vendorEarnings": 4500,
  "rating": 4.8,
  "recentOrders": [
    {
      "orderNumber": "ORD-123456",
      "total": 150.00,
      "createdAt": "2024-01-27T10:30:00Z",
      "status": "CONFIRMED",
      "vendorOrderId": "vo-id"
    }
  ],
  "topProducts": [
    {
      "id": "product-id",
      "name": "Handmade Necklace",
      "price": 45.99,
      "rating": 5,
      "reviewCount": 12
    }
  ]
}
```

---

### 4. Get Nearby Vendors
**GET** `/vendors?latitude=37.7749&longitude=-122.4194&radius=50`

Get vendors near a location within specified radius (km).

**Query Parameters:**
- `latitude` (number): Latitude coordinate
- `longitude` (number): Longitude coordinate
- `radius` (number, optional): Search radius in km (default: 50)

**Response (200):**
```json
[
  {
    "id": "vendor-id-1",
    "shopName": "Artisan Crafts",
    "shopSlug": "artisan-crafts",
    "address": "123 Main St",
    "city": "San Francisco",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "rating": 4.8,
    "products": [
      {
        "id": "product-id",
        "name": "Handmade Necklace",
        "price": 45.99,
        "rating": 4.8
      }
    ]
  }
]
```

---

## Product Endpoints

### 1. Create Product
**POST** `/products`
**Auth Required:** Yes (Role: VENDOR)

Create a new product listing.

**Request Body:**
```json
{
  "name": "Handmade Ceramic Mug",
  "description": "Beautiful handcrafted ceramic mug with natural glaze",
  "price": 24.99,
  "compareAtPrice": 34.99,
  "category": "Home & Kitchen",
  "tags": ["ceramic", "handmade", "eco-friendly"],
  "stock": 50,
  "seoTitle": "Handmade Ceramic Mug | Artisan Crafts",
  "seoDescription": "Shop unique handmade ceramic mugs..."
}
```

**Response (201):**
```json
{
  "id": "product-id",
  "name": "Handmade Ceramic Mug",
  "slug": "handmade-ceramic-mug",
  "description": "Beautiful handcrafted ceramic mug...",
  "price": 24.99,
  "compareAtPrice": 34.99,
  "category": "Home & Kitchen",
  "tags": ["ceramic", "handmade", "eco-friendly"],
  "stock": 50,
  "status": "DRAFT",
  "rating": 0,
  "reviewCount": 0,
  "images": []
}
```

---

### 2. Search Products
**GET** `/products/search?q=ceramic&category=Home&minPrice=10&maxPrice=50&page=1`

Search and filter products.

**Query Parameters:**
- `q` (string, required): Search query
- `category` (string, optional): Filter by category
- `minPrice` (number, optional): Minimum price
- `maxPrice` (number, optional): Maximum price
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)

**Response (200):**
```json
{
  "data": [
    {
      "id": "product-id",
      "name": "Handmade Ceramic Mug",
      "slug": "handmade-ceramic-mug",
      "price": 24.99,
      "rating": 4.5,
      "reviewCount": 8,
      "images": [
        {
          "url": "https://example.com/image.jpg",
          "altText": "Ceramic mug"
        }
      ],
      "vendor": {
        "id": "vendor-id",
        "shopName": "Artisan Crafts",
        "shopSlug": "artisan-crafts"
      }
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 3
}
```

---

### 3. Get Product Details
**GET** `/products/:productId`

Get complete product information.

**Response (200):**
```json
{
  "id": "product-id",
  "name": "Handmade Ceramic Mug",
  "slug": "handmade-ceramic-mug",
  "description": "Beautiful handcrafted ceramic mug...",
  "price": 24.99,
  "stock": 45,
  "rating": 4.5,
  "reviewCount": 8,
  "category": "Home & Kitchen",
  "tags": ["ceramic", "handmade"],
  "images": [
    {
      "id": "image-id",
      "url": "https://example.com/image.jpg",
      "altText": "Ceramic mug",
      "isThumbnail": true
    }
  ],
  "vendor": {
    "id": "vendor-id",
    "shopName": "Artisan Crafts",
    "shopSlug": "artisan-crafts",
    "rating": 4.8
  }
}
```

---

### 4. Publish Product
**POST** `/products/:productId/publish`
**Auth Required:** Yes (Role: VENDOR)

Make product visible to buyers (change status from DRAFT to PUBLISHED).

**Response (200):**
```json
{
  "id": "product-id",
  "name": "Handmade Ceramic Mug",
  "status": "PUBLISHED",
  "...": "..."
}
```

---

### 5. Update Product
**PUT** `/products/:productId`
**Auth Required:** Yes (Role: VENDOR)

Update product details.

**Request Body:**
```json
{
  "name": "Premium Handmade Ceramic Mug",
  "price": 29.99,
  "stock": 40
}
```

**Response (200):**
Updated product object.

---

## Cart Endpoints

### 1. Get Cart
**GET** `/cart`
**Auth Required:** Yes (Role: BUYER)

Get current user's shopping cart.

**Response (200):**
```json
{
  "id": "cart-id",
  "items": [
    {
      "id": "cart-item-id",
      "productId": "product-id",
      "quantity": 2,
      "priceAtAdd": 24.99,
      "product": {
        "id": "product-id",
        "name": "Handmade Ceramic Mug",
        "price": 24.99,
        "images": [
          {
            "url": "https://example.com/image.jpg"
          }
        ]
      }
    }
  ]
}
```

---

### 2. Add to Cart
**POST** `/cart/items`
**Auth Required:** Yes (Role: BUYER)

Add product to cart.

**Request Body:**
```json
{
  "productId": "product-id",
  "quantity": 2
}
```

**Response (201):**
Complete cart object with new item added.

---

### 3. Update Cart Item
**PUT** `/cart/items/:itemId`
**Auth Required:** Yes (Role: BUYER)

Update quantity of cart item.

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
Updated cart object.

---

### 4. Remove from Cart
**DELETE** `/cart/items/:itemId`
**Auth Required:** Yes (Role: BUYER)

Remove item from cart.

**Response (200):**
Updated cart object.

---

### 5. Get Cart Summary
**GET** `/cart/summary`
**Auth Required:** Yes (Role: BUYER)

Get cart totals breakdown by vendor.

**Response (200):**
```json
{
  "cartId": "cart-id",
  "itemCount": 3,
  "subtotal": 74.97,
  "vendorBreakdown": [
    {
      "vendor": {
        "id": "vendor-id",
        "shopName": "Artisan Crafts"
      },
      "items": [...],
      "subtotal": 74.97
    }
  ]
}
```

---

## Order & Checkout Endpoints

### 1. Create Checkout Session
**POST** `/orders/checkout`
**Auth Required:** Yes (Role: BUYER)

Convert cart to order and create checkout session.

**Request Body:**
```json
{
  "shippingAddressId": "address-id",
  "notes": "Please wrap as gift"
}
```

**Response (201):**
```json
{
  "orderId": "order-id",
  "orderNumber": "ORD-123456",
  "total": 82.47,
  "vendorBreakdown": [
    {
      "vendorId": "vendor-id",
      "subtotal": 74.97,
      "platformFee": 7.50,
      "items": [...]
    }
  ]
}
```

---

### 2. Select Payment Method
**POST** `/orders/:orderId/select-payment`
**Auth Required:** Yes (Role: BUYER)

Select payment method for order. Returns Stripe client secret for card payments.

**Request Body:**
```json
{
  "paymentMethod": "CARD"
}
```

**Payment Methods:**
- `CARD`: Credit/debit card (Stripe)
- `UPI`: India UPI
- `NETBANKING`: India Net Banking
- `WALLET`: Digital wallet

**Response (200) - CARD Payment:**
```json
{
  "paymentId": "payment-id",
  "paymentMethod": "CARD",
  "paymentIntentSecret": "pi_1ABC123_secret_XYZ789",
  "amount": 82.47
}
```

**Response (200) - Other Methods:**
```json
{
  "paymentId": "payment-id",
  "paymentMethod": "UPI",
  "amount": 82.47
}
```

---

### 3. Confirm Payment
**POST** `/orders/:orderId/confirm-payment`
**Auth Required:** Yes (Role: BUYER)

Confirm payment and complete order (call after payment popup closes).

**Response (200):**
```json
{
  "id": "order-id",
  "orderNumber": "ORD-123456",
  "status": "CONFIRMED",
  "paymentStatus": "COMPLETED",
  "subtotal": 74.97,
  "platformFee": 7.50,
  "total": 82.47,
  "createdAt": "2024-01-27T10:30:00Z",
  "items": [...],
  "vendorOrders": [
    {
      "id": "vendor-order-id",
      "vendorId": "vendor-id",
      "status": "CONFIRMED",
      "subtotal": 74.97,
      "vendorEarnings": 67.47
    }
  ]
}
```

---

### 4. Get Order Details
**GET** `/orders/:orderId`
**Auth Required:** Yes (Role: BUYER)

Retrieve full order information.

**Response (200):**
Complete order object with all details.

---

### 5. Get Buyer Orders
**GET** `/orders?page=1&limit=10`
**Auth Required:** Yes (Role: BUYER)

List all orders for current buyer.

**Query Parameters:**
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page

**Response (200):**
```json
{
  "data": [
    {
      "id": "order-id",
      "orderNumber": "ORD-123456",
      "status": "DELIVERED",
      "paymentStatus": "COMPLETED",
      "total": 82.47,
      "createdAt": "2024-01-27T10:30:00Z",
      "vendorOrders": [...]
    }
  ],
  "total": 5,
  "page": 1,
  "totalPages": 1
}
```

---

### 6. Get Vendor Orders
**GET** `/orders/vendor/:vendorId?page=1&limit=10`
**Auth Required:** Yes (Role: VENDOR)

List orders for a vendor.

**Response (200):**
```json
{
  "data": [
    {
      "id": "vendor-order-id",
      "vendorId": "vendor-id",
      "status": "PROCESSING",
      "subtotal": 74.97,
      "vendorEarnings": 67.47,
      "order": {
        "orderNumber": "ORD-123456",
        "total": 82.47,
        "createdAt": "2024-01-27T10:30:00Z",
        "buyer": {
          "user": {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com"
          }
        },
        "items": [...]
      }
    }
  ],
  "total": 12,
  "page": 1,
  "totalPages": 2
}
```

---

### 7. Update Vendor Order Status
**PUT** `/orders/vendor-orders/:vendorOrderId/status`
**Auth Required:** Yes (Role: VENDOR)

Update status of vendor's order.

**Request Body:**
```json
{
  "status": "SHIPPED"
}
```

**Valid Statuses:**
- `PENDING`
- `CONFIRMED`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`
- `REFUNDED`

**Response (200):**
Updated vendor order object.

---

## Review Endpoints

### 1. Create Review
**POST** `/reviews`
**Auth Required:** Yes (Role: BUYER)

Leave a review for a delivered product.

**Request Body:**
```json
{
  "productId": "product-id",
  "orderId": "order-id",
  "rating": 5,
  "title": "Excellent quality!",
  "content": "The mug is beautifully crafted and arrived in perfect condition. Highly recommend!"
}
```

**Notes:**
- Can only review products from DELIVERED orders
- Rating must be 1-5
- One review per product per order

**Response (201):**
```json
{
  "id": "review-id",
  "productId": "product-id",
  "buyerId": "buyer-id",
  "rating": 5,
  "title": "Excellent quality!",
  "content": "The mug is beautifully crafted...",
  "createdAt": "2024-01-27T10:30:00Z"
}
```

---

### 2. Get Product Reviews
**GET** `/reviews/product/:productId?page=1&limit=10`

Get all approved reviews for a product.

**Response (200):**
```json
{
  "data": [
    {
      "id": "review-id",
      "rating": 5,
      "title": "Excellent quality!",
      "content": "The mug is beautifully crafted...",
      "createdAt": "2024-01-27T10:30:00Z",
      "buyer": {
        "user": {
          "firstName": "John",
          "lastName": "Doe",
          "avatar": "https://example.com/avatar.jpg"
        }
      }
    }
  ],
  "total": 12,
  "page": 1,
  "totalPages": 2
}
```

---

### 3. Get Vendor Reviews
**GET** `/reviews/vendor/:vendorId?page=1&limit=10`

Get all reviews for a vendor's products.

**Response (200):**
```json
{
  "data": [
    {
      "id": "review-id",
      "rating": 4,
      "title": "Great seller",
      "content": "Fast shipping and great communication",
      "product": {
        "name": "Handmade Ceramic Mug"
      },
      "buyer": {
        "user": {
          "firstName": "Jane",
          "lastName": "Smith"
        }
      }
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Insufficient stock",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Access denied",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Product not found",
  "error": "Not Found"
}
```

---

## Payment Flow Diagram

```
1. User adds items to cart
   ↓
2. Click "Checkout" → Create checkout session
   ↓
3. Enter shipping address → Create Order with PENDING status
   ↓
4. Select Payment Method (CARD/UPI/etc) → Create Payment record
   ↓
5. If CARD payment:
   - Get Stripe PaymentIntent client secret
   - Show Stripe payment popup to user
   - User completes payment in popup
   ↓
6. After payment popup closes:
   - Call Confirm Payment endpoint
   - Order status → CONFIRMED
   - VendorOrders created with CONFIRMED status
   - Vendor earnings calculated and recorded
```

---

## Platform Fee Structure

Default platform fee: **10%**

Example:
- Product subtotal: $100.00
- Platform fee (10%): $10.00
- Vendor earnings: $90.00
- Total order amount: $100.00 (customer pays this)

---

## Rate Limiting
- 100 requests per minute per IP address

---

## Webhook Events (Stripe)
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

