# API Integration Reference

Complete guide for integrating the Marketplace API with frontend or third-party applications.

## Base URLs

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:3001` |
| Staging | `https://api-staging.marketplace.com` |
| Production | `https://api.marketplace.com` |

## Authentication

### Getting a Token

All authenticated endpoints require a Bearer token in the `Authorization` header.

#### 1. Signup

**Request:**
```http
POST /auth/signup HTTP/1.1
Content-Type: application/json

{
  "email": "vendor@example.com",
  "password": "SecurePassword123!",
  "role": "VENDOR"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "vendor@example.com",
    "role": "VENDOR",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 2. Signin

**Request:**
```http
POST /auth/signin HTTP/1.1
Content-Type: application/json

{
  "email": "vendor@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "vendor@example.com",
    "role": "VENDOR"
  }
}
```

#### 3. Using Token

Store token in localStorage and include in all subsequent requests:

```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

fetch('http://localhost:3001/vendors/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

Token expires after 24 hours. Get a new token by signing in again.

## Vendor Management

### Create Vendor Profile

**Endpoint:** `POST /vendors`

**Required Role:** VENDOR

**Request:**
```http
POST /vendors HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Fresh Groceries Store",
  "description": "Organic vegetables and fruits",
  "address": "123 Market Street, City",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "zipCode": "94102",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "phone": "+1-555-0123",
  "website": "https://freshgroceries.example.com",
  "logo": "https://cdn.example.com/logo.jpg"
}
```

**Response (201 Created):**
```json
{
  "id": "vendor-123",
  "userId": "user-123",
  "slug": "fresh-groceries-store",
  "name": "Fresh Groceries Store",
  "description": "Organic vegetables and fruits",
  "address": "123 Market Street, City",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "phone": "+1-555-0123",
  "website": "https://freshgroceries.example.com",
  "logo": "https://cdn.example.com/logo.jpg",
  "totalSales": 0,
  "totalEarnings": 0,
  "rating": 0,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Get Vendor Dashboard

**Endpoint:** `GET /vendors/:id/dashboard`

**Required Role:** VENDOR (can only view own dashboard)

**Request:**
```http
GET /vendors/vendor-123/dashboard HTTP/1.1
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "vendor": {
    "id": "vendor-123",
    "name": "Fresh Groceries Store",
    "rating": 4.5
  },
  "analytics": {
    "totalRevenue": 15000.00,
    "totalOrders": 245,
    "totalProducts": 42,
    "platformFees": 1500.00,
    "vendorEarnings": 13500.00,
    "conversionRate": 3.5
  },
  "recentOrders": [
    {
      "id": "order-456",
      "buyerEmail": "buyer@example.com",
      "totalAmount": 89.99,
      "status": "CONFIRMED",
      "createdAt": "2024-01-15T14:22:00Z"
    }
  ],
  "topProducts": [
    {
      "id": "product-789",
      "name": "Organic Tomatoes",
      "sales": 125,
      "revenue": 1250.00
    }
  ]
}
```

### Get Nearby Vendors

**Endpoint:** `GET /vendors`

**Query Parameters:**
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| `latitude` | number | Yes | `37.7749` |
| `longitude` | number | Yes | `-122.4194` |
| `radius` | number | No | `5` (in kilometers, default: 10) |

**Request:**
```http
GET /vendors?latitude=37.7749&longitude=-122.4194&radius=5 HTTP/1.1
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "vendor-123",
      "name": "Fresh Groceries Store",
      "description": "Organic vegetables and fruits",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "logo": "https://cdn.example.com/logo.jpg",
      "rating": 4.5,
      "distance": 0.2
    },
    {
      "id": "vendor-456",
      "name": "Local Bakery",
      "description": "Fresh bread and pastries",
      "latitude": 37.7761,
      "longitude": -122.4191,
      "logo": "https://cdn.example.com/bakery.jpg",
      "rating": 4.8,
      "distance": 1.5
    }
  ],
  "total": 2
}
```

## Product Management

### Create Product

**Endpoint:** `POST /products`

**Required Role:** VENDOR (must own the vendor)

**Request:**
```http
POST /products HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "vendorId": "vendor-123",
  "name": "Organic Tomatoes",
  "description": "Fresh organic tomatoes from local farms",
  "category": "VEGETABLES",
  "price": 10.99,
  "stock": 100,
  "tags": ["organic", "fresh", "local"]
}
```

**Response (201 Created):**
```json
{
  "id": "product-789",
  "vendorId": "vendor-123",
  "slug": "organic-tomatoes",
  "name": "Organic Tomatoes",
  "description": "Fresh organic tomatoes from local farms",
  "category": "VEGETABLES",
  "price": 10.99,
  "stock": 100,
  "reserved": 0,
  "status": "DRAFT",
  "rating": 0,
  "tags": ["organic", "fresh", "local"],
  "images": [],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Search Products

**Endpoint:** `GET /products/search`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search term (searches name, description) |
| `category` | string | Filter by category (VEGETABLES, FRUITS, DAIRY, etc.) |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |
| `sortBy` | string | Sort by: `createdAt`, `price`, `rating` (default: `createdAt`) |
| `order` | string | `asc` or `desc` (default: `desc`) |

**Request:**
```http
GET /products/search?q=tomatoes&category=VEGETABLES&maxPrice=15&page=1&limit=20 HTTP/1.1
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "product-789",
      "vendorId": "vendor-123",
      "name": "Organic Tomatoes",
      "price": 10.99,
      "category": "VEGETABLES",
      "rating": 4.7,
      "images": [
        {
          "id": "image-1",
          "url": "https://cdn.example.com/tomatoes-1.jpg"
        }
      ],
      "vendor": {
        "id": "vendor-123",
        "name": "Fresh Groceries Store",
        "rating": 4.5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### Publish Product

**Endpoint:** `POST /products/:id/publish`

**Required Role:** VENDOR (must own the product)

**Request:**
```http
POST /products/product-789/publish HTTP/1.1
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "product-789",
  "name": "Organic Tomatoes",
  "status": "PUBLISHED",
  "message": "Product published successfully"
}
```

## Shopping Cart

### Add to Cart

**Endpoint:** `POST /cart/items`

**Request:**
```http
POST /cart/items HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "product-789",
  "quantity": 2
}
```

**Response (200 OK):**
```json
{
  "id": "cart-123",
  "userId": "user-456",
  "items": [
    {
      "id": "cart-item-1",
      "productId": "product-789",
      "quantity": 2,
      "product": {
        "id": "product-789",
        "name": "Organic Tomatoes",
        "price": 10.99
      }
    }
  ]
}
```

### Get Cart Summary

**Endpoint:** `GET /cart/summary`

**Request:**
```http
GET /cart/summary HTTP/1.1
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "cart-item-1",
      "productId": "product-789",
      "quantity": 2,
      "product": {
        "id": "product-789",
        "name": "Organic Tomatoes",
        "price": 10.99
      }
    }
  ],
  "vendors": [
    {
      "vendorId": "vendor-123",
      "vendorName": "Fresh Groceries Store",
      "items": [
        {
          "id": "cart-item-1",
          "productId": "product-789",
          "quantity": 2,
          "subtotal": 21.98
        }
      ],
      "subtotal": 21.98,
      "platformFee": 2.20,
      "total": 24.18
    }
  ],
  "grandTotal": 24.18,
  "platformFeeTotal": 2.20,
  "itemCount": 2
}
```

### Remove from Cart

**Endpoint:** `DELETE /cart/items/:id`

**Request:**
```http
DELETE /cart/items/cart-item-1 HTTP/1.1
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Item removed from cart"
}
```

## Orders & Checkout

### Create Checkout Session

**Endpoint:** `POST /orders/checkout`

**Request:**
```http
POST /orders/checkout HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "shippingAddress": "123 Oak Street, San Francisco, CA 94102",
  "shippingCity": "San Francisco",
  "shippingState": "CA",
  "shippingZipCode": "94102",
  "notes": "Please deliver between 9 AM and 5 PM"
}
```

**Response (201 Created):**
```json
{
  "orderId": "order-456",
  "buyerId": "user-456",
  "status": "PENDING",
  "totalAmount": 24.18,
  "vendorOrders": [
    {
      "id": "vendor-order-1",
      "vendorId": "vendor-123",
      "vendorName": "Fresh Groceries Store",
      "subtotal": 21.98,
      "platformFee": 2.20,
      "vendorEarnings": 19.78,
      "status": "PENDING",
      "items": [
        {
          "productId": "product-789",
          "productName": "Organic Tomatoes",
          "quantity": 2,
          "price": 10.99
        }
      ]
    }
  ],
  "createdAt": "2024-01-15T14:30:00Z"
}
```

### Select Payment Method

**Endpoint:** `POST /orders/:id/select-payment`

**Request:**
```http
POST /orders/order-456/select-payment HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentMethod": "CARD"
}
```

**For CARD Payment (Stripe):**

**Response (200 OK):**
```json
{
  "paymentMethodId": "pm-card",
  "clientSecret": "pi_1234567890_secret_key",
  "publishableKey": "pk_test_...",
  "amount": 2418,
  "currency": "usd",
  "message": "Use clientSecret with Stripe to complete payment"
}
```

**For Other Payment Methods (UPI, NETBANKING, WALLET):**

**Response (200 OK):**
```json
{
  "paymentMethodId": "pm-upi",
  "message": "Payment method selected. Complete payment on provider's platform."
}
```

### Confirm Payment

**Endpoint:** `POST /orders/:id/confirm-payment`

**Request (for CARD):**
```http
POST /orders/order-456/confirm-payment HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "stripePaymentIntentId": "pi_1234567890"
}
```

**Request (for UPI):**
```http
POST /orders/order-456/confirm-payment HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "transactionId": "UPI_TRANSACTION_ID_FROM_PROVIDER"
}
```

**Response (200 OK):**
```json
{
  "orderId": "order-456",
  "status": "CONFIRMED",
  "paymentStatus": "COMPLETED",
  "message": "Payment confirmed. Vendors have been notified.",
  "vendorOrders": [
    {
      "id": "vendor-order-1",
      "status": "CONFIRMED",
      "vendorEarnings": 19.78
    }
  ]
}
```

### Get Order Details

**Endpoint:** `GET /orders/:id`

**Request:**
```http
GET /orders/order-456 HTTP/1.1
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "order-456",
  "buyerId": "user-456",
  "status": "CONFIRMED",
  "totalAmount": 24.18,
  "paymentStatus": "COMPLETED",
  "shippingAddress": "123 Oak Street, San Francisco, CA 94102",
  "items": [
    {
      "productId": "product-789",
      "productName": "Organic Tomatoes",
      "vendorId": "vendor-123",
      "quantity": 2,
      "price": 10.99
    }
  ],
  "vendorOrders": [
    {
      "id": "vendor-order-1",
      "vendorId": "vendor-123",
      "vendorName": "Fresh Groceries Store",
      "status": "CONFIRMED",
      "subtotal": 21.98,
      "platformFee": 2.20,
      "vendorEarnings": 19.78
    }
  ],
  "createdAt": "2024-01-15T14:30:00Z",
  "updatedAt": "2024-01-15T14:35:00Z"
}
```

### List Buyer Orders

**Endpoint:** `GET /orders`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `status` | string | Filter by status: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED |

**Request:**
```http
GET /orders?page=1&limit=10&status=CONFIRMED HTTP/1.1
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "order-456",
      "status": "CONFIRMED",
      "totalAmount": 24.18,
      "itemCount": 2,
      "createdAt": "2024-01-15T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### List Vendor Orders

**Endpoint:** `GET /orders/vendor/:vendorId`

**Required Role:** VENDOR (can only view own orders)

**Request:**
```http
GET /orders/vendor/vendor-123?page=1&limit=10 HTTP/1.1
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "vendor-order-1",
      "orderId": "order-456",
      "buyerEmail": "buyer@example.com",
      "status": "CONFIRMED",
      "subtotal": 21.98,
      "platformFee": 2.20,
      "vendorEarnings": 19.78,
      "items": [
        {
          "productId": "product-789",
          "productName": "Organic Tomatoes",
          "quantity": 2,
          "price": 10.99
        }
      ],
      "createdAt": "2024-01-15T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

### Update Vendor Order Status

**Endpoint:** `PUT /orders/vendor-orders/:id/status`

**Required Role:** VENDOR

**Request:**
```http
PUT /orders/vendor-orders/vendor-order-1/status HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "SHIPPED",
  "trackingNumber": "TRACK123456"
}
```

**Response (200 OK):**
```json
{
  "id": "vendor-order-1",
  "status": "SHIPPED",
  "trackingNumber": "TRACK123456",
  "message": "Order status updated. Buyer has been notified."
}
```

## Reviews & Ratings

### Create Review

**Endpoint:** `POST /reviews`

**Requirements:** User must have completed the order (status: DELIVERED)

**Request:**
```http
POST /reviews HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "product-789",
  "orderId": "order-456",
  "rating": 5,
  "title": "Excellent quality!",
  "comment": "The tomatoes were fresh and delicious. Highly recommended!"
}
```

**Response (201 Created):**
```json
{
  "id": "review-789",
  "productId": "product-789",
  "buyerId": "user-456",
  "buyerEmail": "buyer@example.com",
  "rating": 5,
  "title": "Excellent quality!",
  "comment": "The tomatoes were fresh and delicious. Highly recommended!",
  "createdAt": "2024-01-15T16:00:00Z"
}
```

### Get Product Reviews

**Endpoint:** `GET /reviews/product/:productId`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `sortBy` | string | `createdAt` or `rating` (default: `createdAt`) |

**Request:**
```http
GET /reviews/product/product-789?page=1&limit=10&sortBy=rating HTTP/1.1
```

**Response (200 OK):**
```json
{
  "productId": "product-789",
  "productName": "Organic Tomatoes",
  "averageRating": 4.7,
  "totalReviews": 15,
  "data": [
    {
      "id": "review-789",
      "buyerEmail": "buyer@example.com",
      "rating": 5,
      "title": "Excellent quality!",
      "comment": "The tomatoes were fresh and delicious.",
      "createdAt": "2024-01-15T16:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

## Error Handling

### Error Response Format

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message description",
  "error": "BadRequest",
  "timestamp": "2024-01-15T16:00:00Z"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate email, product exists, etc.) |
| 422 | Unprocessable Entity (business logic violation) |
| 500 | Internal Server Error |

### Common Error Scenarios

**Unauthorized - Missing Token:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**Forbidden - Insufficient Role:**
```json
{
  "statusCode": 403,
  "message": "Forbidden - Requires VENDOR role",
  "error": "Forbidden"
}
```

**Not Found:**
```json
{
  "statusCode": 404,
  "message": "Product not found",
  "error": "NotFound"
}
```

**Validation Error:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "price",
      "message": "Price must be positive"
    }
  ]
}
```

## Rate Limiting

All endpoints are rate limited to **100 requests per minute** per IP address.

**Rate Limit Headers** in response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705341660
```

When limit exceeded:
```json
{
  "statusCode": 429,
  "message": "Too Many Requests - Limit: 100 per minute",
  "error": "TooManyRequests",
  "retryAfter": 30
}
```

## Pagination

List endpoints support pagination with consistent format:

**Request Parameters:**
```
page=1&limit=20
```

**Response Structure:**
```json
{
  "data": [/* array of items */],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## Webhooks (Phase 2)

Webhooks will be available for:
- `payment.completed` - Payment successfully processed
- `order.shipped` - Vendor shipped order
- `order.delivered` - Order delivered
- `review.created` - New review added

Implement webhook receiver:
```javascript
app.post('/webhooks/marketplace', (req, res) => {
  const signature = req.headers['x-marketplace-signature'];
  const body = req.rawBody;
  
  // Verify signature
  const hmac = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  
  if (hmac !== signature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const event = req.body;
  
  switch(event.type) {
    case 'payment.completed':
      // Handle payment completion
      break;
    case 'order.shipped':
      // Handle order shipped
      break;
  }
  
  res.json({ received: true });
});
```

## SDK/Client Libraries

### JavaScript/TypeScript

```bash
npm install @marketplace/sdk
```

```javascript
import { MarketplaceClient } from '@marketplace/sdk';

const client = new MarketplaceClient({
  apiUrl: 'https://api.marketplace.com',
  token: 'your-token'
});

// Usage
const products = await client.products.search({
  query: 'tomatoes',
  category: 'VEGETABLES'
});

const order = await client.orders.createCheckout({
  shippingAddress: '123 Main St'
});
```

### Python

```bash
pip install marketplace-sdk
```

```python
from marketplace import Client

client = Client(
    api_url='https://api.marketplace.com',
    token='your-token'
)

# Usage
products = client.products.search(
    query='tomatoes',
    category='VEGETABLES'
)

order = client.orders.create_checkout(
    shipping_address='123 Main St'
)
```

## Testing API

### Using Thunder Client (VS Code)

Import collection:
```json
{
  "clientName": "Thunder Client",
  "dateExport": "2024-01-15T10:30:00.000Z",
  "version": "1.1",
  "folders": [],
  "requests": [
    {
      "name": "Signin",
      "request": {
        "url": "http://localhost:3001/auth/signin",
        "method": "POST",
        "headers": [{"name": "Content-Type", "value": "application/json"}],
        "body": {
          "json": {
            "email": "vendor@example.com",
            "password": "SecurePassword123!"
          }
        }
      }
    }
  ]
}
```

### Using cURL

```bash
# Signin
curl -X POST http://localhost:3001/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@example.com","password":"SecurePassword123!"}'

# Use returned token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get vendor dashboard
curl -X GET http://localhost:3001/vendors/vendor-123/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

## Rate Limit Strategy

To handle rate limits gracefully:

```javascript
async function apiCall(url, options = {}) {
  let retries = 0;
  const maxRetries = 3;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || 60;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        retries++;
        continue;
      }
      
      return response;
    } catch (error) {
      if (retries < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
        retries++;
      } else {
        throw error;
      }
    }
  }
}
```

## API Versioning

Current API version: **v1**

Future versions will be available at:
- `https://api.marketplace.com/v2/...`

Current version endpoints remain available for backward compatibility.
