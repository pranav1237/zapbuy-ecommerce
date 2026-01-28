# Payment Flow & Integration Guide

## Overview

The marketplace uses **Stripe Connect** for payment splitting between the platform and vendors. This enables:
- Secure payment processing without handling sensitive card data
- Automatic fund splitting between vendors and platform
- Compliance with financial regulations
- Vendor account verification and payouts

---

## Payment Methods Available

Users can choose from multiple payment methods:

1. **CARD** - Credit/Debit Card (via Stripe)
2. **UPI** - India UPI (future integration)
3. **NETBANKING** - India Net Banking (future integration)
4. **WALLET** - Digital wallet (future integration)

---

## Detailed Payment Flow

### Phase 1: Checkout & Order Creation

```
User adds items to cart
    ↓
User clicks "Checkout"
    ↓
System validates:
  ├─ Cart not empty
  ├─ All items in stock
  ├─ Shipping address valid
    ↓
System groups items by vendor:
  ├─ Vendor A: Items 1,2,3 = $60
  ├─ Vendor B: Items 4,5 = $40
  └─ Total: $100

Calculate fees:
  ├─ Platform fee (10%): $10
  ├─ Vendor A earnings: $54 (after 10% fee)
  ├─ Vendor B earnings: $36 (after 10% fee)
    ↓
Create database records:
  ├─ Order (status: PENDING, paymentStatus: PENDING)
  ├─ OrderItems (one per cart item)
  ├─ VendorOrder (one per vendor)
  ├─ Reserve stock for each product
    ↓
Return to frontend:
  ├─ orderId
  ├─ orderNumber
  ├─ total: $100
  └─ vendorBreakdown (for display)
```

### Phase 2: Payment Method Selection

```
User sees payment method options:
  ├─ CARD (Stripe)
  ├─ UPI
  ├─ Netbanking
  └─ Wallet

User selects payment method
    ↓
Frontend calls: POST /orders/:orderId/select-payment
    ↓
Backend creates Payment record:
  ├─ orderId
  ├─ paymentMethod: "CARD"
  ├─ status: "PENDING"
  ├─ amount: $100

If CARD payment:
  ├─ Create Stripe PaymentIntent
  │  ├─ amount: 10000 (cents)
  │  ├─ currency: "usd"
  │  └─ metadata: {orderId, buyerId}
  ├─ Return client_secret to frontend
    ↓
Frontend receives:
  ├─ paymentIntentSecret (for Stripe.js)
  ├─ amount
  └─ paymentId
    ↓
Frontend shows payment popup
```

### Phase 3: Payment Execution

```
User enters card details in Stripe popup
    ↓
Frontend submits to Stripe.js (NOT your backend)
    ↓
Stripe processes payment:
  ├─ Validates card
  ├─ Charges $100
  ├─ Sends webhook to backend
  └─ Returns result to frontend
    ↓
Popup closes
    ↓
Frontend calls: POST /orders/:orderId/confirm-payment
    ↓
Backend verifies payment with Stripe:
  ├─ Check PaymentIntent status
  ├─ Verify amount matches
  ├─ Update Order status: CONFIRMED
  ├─ Update all VendorOrders: CONFIRMED
  ├─ Update Vendor earnings records
  ├─ Create Payout records (future settlement)
    ↓
Return confirmed order details to frontend
    ↓
Show success message
Redirect to order details page
```

---

## Implementation Details

### Frontend: Stripe Payment Integration

```typescript
// 1. Import Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
);

// 2. Create checkout form component
const PaymentForm = ({ orderId, amount, paymentIntentSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Confirm payment with Stripe
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        paymentIntentSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: { name: 'John Doe' },
          },
        }
      );

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Payment successful - confirm with backend
        await apiClient.confirmPayment(orderId);
        toast.success('Payment successful!');
        router.push(`/orders/${orderId}`);
      }
    } catch (err) {
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={!stripe || loading} type="submit">
        {loading ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

// 3. Wrap with Elements provider
export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}
```

### Backend: Order & Payment Processing

```typescript
// 1. Create Checkout Session
async createCheckoutSession(buyerId: string, dto: CreateCheckoutSessionDto) {
  const cart = await this.getCart(buyerId);
  
  // Group items by vendor
  const vendorBreakdown = this.groupItemsByVendor(cart.items);
  
  // Calculate totals with platform fee
  const subtotal = this.calculateSubtotal(vendorBreakdown);
  const platformFee = (subtotal * 10) / 100;
  const total = subtotal + platformFee;

  // Create Order
  const order = await this.prisma.order.create({
    data: {
      buyerId,
      subtotal,
      platformFee,
      total,
      status: 'PENDING',
      paymentStatus: 'PENDING',
    },
  });

  // Create OrderItems
  for (const item of cart.items) {
    await this.prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.priceAtAdd,
        subtotal: item.priceAtAdd * item.quantity,
      },
    });
    
    // Reserve stock
    await this.prisma.product.update({
      where: { id: item.productId },
      data: { reserved: { increment: item.quantity } },
    });
  }

  // Create VendorOrders
  for (const [vendorId, breakdown] of Object.entries(vendorBreakdown)) {
    const platformFeeForVendor = (breakdown.subtotal * 10) / 100;
    await this.prisma.vendorOrder.create({
      data: {
        orderId: order.id,
        vendorId,
        subtotal: breakdown.subtotal,
        vendorEarnings: breakdown.subtotal - platformFeeForVendor,
        status: 'PENDING',
      },
    });
  }

  return { orderId: order.id, total, vendorBreakdown };
}

// 2. Select Payment Method
async selectPaymentMethod(orderId: string, paymentMethod: string) {
  const order = await this.prisma.order.findUnique({
    where: { id: orderId },
  });

  if (paymentMethod === 'CARD') {
    // Create Stripe PaymentIntent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: 'usd',
      metadata: { orderId, buyerId: order.buyerId },
    });

    // Save payment intent ID
    await this.prisma.order.update({
      where: { id: orderId },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    // Create Payment record
    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        paymentMethod: 'CARD',
        status: 'PENDING',
        amount: order.total,
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    return {
      paymentIntentSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    };
  }

  // For other payment methods
  const payment = await this.prisma.payment.create({
    data: {
      orderId,
      paymentMethod,
      status: 'PENDING',
      amount: order.total,
    },
  });

  return { paymentId: payment.id, paymentMethod };
}

// 3. Confirm Payment
async confirmPayment(orderId: string) {
  const order = await this.prisma.order.findUnique({
    where: { id: orderId },
  });

  // For CARD payments, verify with Stripe
  if (order.stripePaymentIntentId) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      order.stripePaymentIntentId
    );

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Payment not completed');
    }
  }

  // Update order status
  await this.prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'CONFIRMED',
      paymentStatus: 'COMPLETED',
    },
  });

  // Update vendor orders and record earnings
  const vendorOrders = await this.prisma.vendorOrder.findMany({
    where: { orderId },
  });

  for (const vendorOrder of vendorOrders) {
    await this.prisma.vendorOrder.update({
      where: { id: vendorOrder.id },
      data: { status: 'CONFIRMED' },
    });

    // Record vendor earnings
    await this.prisma.vendor.update({
      where: { id: vendorOrder.vendorId },
      data: {
        totalSales: { increment: vendorOrder.subtotal },
        totalEarnings: { increment: vendorOrder.vendorEarnings },
      },
    });

    // Create payout record for settlement
    await this.prisma.payout.create({
      data: {
        vendorId: vendorOrder.vendorId,
        amount: vendorOrder.vendorEarnings,
        status: 'PENDING',
        periodStart: new Date(),
        periodEnd: new Date(),
      },
    });
  }

  return this.getOrder(orderId);
}
```

---

## Webhook Handling (Stripe)

### Why Webhooks?
Webhooks ensure payment status is updated even if frontend doesn't confirm:
- User closes browser after payment
- Network disconnection
- Race conditions

### Implementation

```typescript
// webhook.controller.ts
import { Stripe } from 'stripe';

@Post('webhooks/stripe')
async handleStripeWebhook(@Body() body: any, @Headers('stripe-signature') sig: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event: Stripe.Event;
  
  try {
    event = this.stripe.webhooks.constructEvent(
      JSON.stringify(body),
      sig,
      secret
    );
  } catch (err) {
    throw new BadRequestException(`Webhook error: ${err.message}`);
  }

  // Handle payment success
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;
    
    // Update order in database
    await this.orderService.confirmPayment(orderId, 'WEBHOOK');
    
    // Send confirmation email to customer
    await this.emailService.sendOrderConfirmation(orderId);
    
    // Notify vendors
    await this.notificationService.notifyVendors(orderId);
  }

  // Handle payment failure
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;
    
    // Release reserved stock
    await this.orderService.cancelOrder(orderId);
    
    // Send failure notification
    await this.emailService.sendPaymentFailureNotification(orderId);
  }

  return { received: true };
}
```

---

## Stripe Connect for Vendor Payouts (Phase 2)

### Setup Vendor Stripe Account

```typescript
// Vendor onboarding
async connectVendorToStripe(vendorId: string) {
  const vendor = await this.prisma.vendor.findUnique({
    where: { id: vendorId },
  });

  // Create Stripe account for vendor
  const account = await this.stripe.accounts.create({
    type: 'express',
    country: 'US',
    email: vendor.user.email,
    business_profile: {
      name: vendor.shopName,
      url: `https://localmarket.com/vendors/${vendor.shopSlug}`,
    },
    settings: {
      payouts: {
        schedule: {
          interval: 'weekly', // Weekly payouts
          weekly_anchor: 'friday',
        },
      },
    },
  });

  // Create onboarding link
  const link = await this.stripe.accountLinks.create({
    account: account.id,
    type: 'account_onboarding',
    refresh_url: `https://localmarket.com/vendors/${vendorId}/stripe/refresh`,
    return_url: `https://localmarket.com/vendors/${vendorId}/stripe/return`,
  });

  // Save account ID
  await this.prisma.vendor.update({
    where: { id: vendorId },
    data: { stripeAccountId: account.id },
  });

  return { onboarding_url: link.url };
}
```

### Handle Vendor Payouts

```typescript
// Automatic payout settlement (runs daily)
async settlePendingPayouts() {
  const pendingPayouts = await this.prisma.payout.findMany({
    where: { status: 'PENDING' },
    include: { vendor: true },
  });

  for (const payout of pendingPayouts) {
    try {
      // Create Stripe payout to vendor's account
      const stripePayout = await this.stripe.payouts.create(
        {
          amount: Math.round(payout.amount * 100), // Convert to cents
          currency: 'usd',
          method: 'instant', // Instant payout
        },
        { stripeAccount: payout.vendor.stripeAccountId }
      );

      // Update payout record
      await this.prisma.payout.update({
        where: { id: payout.id },
        data: {
          status: 'PROCESSING',
          stripePayoutId: stripePayout.id,
        },
      });

      // Listen for webhook to mark as PAID
    } catch (error) {
      // Log error, try again later
      console.error(`Payout ${payout.id} failed:`, error);
    }
  }
}
```

---

## Fee Structure

```
Transaction: $100.00
├─ Platform Fee (10%): $10.00
│  └─ Platform Revenue
│
└─ Vendor Earnings: $90.00
   └─ Available for Payout (after Stripe fee ~2.9%)
      ├─ Stripe Fee: ~$2.61
      └─ Vendor Receives: ~$87.39
```

### Fee Breakdown by Payment Method (Future)

| Method | Platform Fee | Stripe Fee | Vendor Receives |
|--------|-------------|-----------|-----------------|
| Card | 10% | 2.9% + $0.30 | 87.1% |
| UPI | 10% | ~2% | 88% |
| Netbanking | 10% | ~1.5% | 88.5% |
| Wallet | 10% | 2% | 88% |

---

## Error Handling

### Common Payment Errors

```
card_declined - Card was declined
insufficient_funds - Insufficient balance
lost_card - Card was reported lost
stolen_card - Card was reported stolen
expired_card - Card has expired
processing_error - Processing error
rate_limit - Rate limit exceeded
```

### Recovery Strategy

```
Payment fails
    ↓
Save error in Payment record
    ↓
Release reserved stock
    ↓
Send email to customer with:
  ├─ Error reason
  ├─ Action required (update card, etc.)
  └─ Link to retry payment
    ↓
Vendor NOT notified until payment confirmed
    ↓
Order expires after 24 hours if unpaid
    ├─ Stock returned to inventory
    └─ Order marked as CANCELLED
```

---

## Testing Stripe Payments

### Test Card Numbers

```
Success:         4242 4242 4242 4242
Decline:         4000 0000 0000 0002
Insufficient:    4000 0000 0000 9995
Lost Card:       4000 0000 0000 0069
Stolen Card:     4000 0000 0000 0010
CVC Error:       4000 0000 0000 0127
```

### Test Expiration
- Use any future date (e.g., 12/25)

### Test CVC
- Use any 3-4 digit number

---

## PCI Compliance

✅ **Compliant because:**
- No sensitive card data stored on server
- No card data sent through your API
- Stripe handles all card processing
- Client-side card element only
- Stripe is PCI Level 1 certified

❌ **Never do:**
- Store card numbers in database
- Send card data through your API
- Use card data outside Stripe

---

## Troubleshooting

### Payment Intent Not Found
```
Ensure order.stripePaymentIntentId matches actual PaymentIntent ID in Stripe
Check webhook logs in Stripe Dashboard
```

### Webhook Not Received
```
Verify webhook secret is correct
Check endpoint URL is publicly accessible
Review Stripe webhook logs
Manually retry failed webhooks in dashboard
```

### Payout Failed
```
Verify vendor's Stripe account is connected
Check vendor has sufficient earnings
Review payout attempt logs
Contact vendor to update banking info
```

