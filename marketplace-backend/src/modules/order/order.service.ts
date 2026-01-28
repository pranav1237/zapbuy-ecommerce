import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCheckoutSessionDto, PaymentSelectionDto } from './dto/order.dto';
import { OrderStatus, PaymentStatus, VendorOrderStatus } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(
    buyerId: string,
    dto: CreateCheckoutSessionDto,
  ) {
    // Get buyer's cart
    const buyer = await this.prisma.buyer.findUnique({
      where: { id: buyerId },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!buyer?.cart?.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    // Verify shipping address
    const address = await this.prisma.address.findUnique({
      where: { id: dto.shippingAddressId },
    });

    if (!address || address.buyerId !== buyerId) {
      throw new NotFoundException('Address not found');
    }

    // Calculate totals per vendor
    const vendorBreakdown: any = {};
    let totalAmount = 0;
    const platformFeePercentage = parseFloat(
      process.env.PLATFORM_FEE_PERCENTAGE || '10',
    );

    for (const item of buyer.cart.items) {
      const itemTotal = Number(item.product.price) * item.quantity;
      const vendorId = item.product.vendorId;

      if (!vendorBreakdown[vendorId]) {
        vendorBreakdown[vendorId] = {
          vendorId,
          subtotal: 0,
          platformFee: 0,
          items: [],
        };
      }

      vendorBreakdown[vendorId].subtotal += itemTotal;
      vendorBreakdown[vendorId].items.push(item);
      totalAmount += itemTotal;
    }

    // Calculate platform fees
    let totalPlatformFee = 0;
    for (const vendorId in vendorBreakdown) {
      const breakdown = vendorBreakdown[vendorId];
      const fee = (breakdown.subtotal * platformFeePercentage) / 100;
      breakdown.platformFee = fee;
      totalPlatformFee += fee;
    }

    // Create Order
    const order = await this.prisma.order.create({
      data: {
        buyerId,
        shippingAddress: JSON.stringify({
          fullName: address.fullName,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
        }),
        subtotal: totalAmount,
        platformFee: totalPlatformFee,
        total: totalAmount + totalPlatformFee,
        notes: dto.notes,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      },
      include: {
        vendorOrders: true,
      },
    });

    // Create OrderItems
    for (const item of buyer.cart.items) {
      await this.prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product.price,
          subtotal: Number(item.product.price) * item.quantity,
        },
      });

      // Reserve stock
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          reserved: {
            increment: item.quantity,
          },
        },
      });
    }

    // Create VendorOrders (one per vendor)
    for (const vendorId in vendorBreakdown) {
      const breakdown = vendorBreakdown[vendorId];
      await this.prisma.vendorOrder.create({
        data: {
          orderId: order.id,
          vendorId,
          status: VendorOrderStatus.PENDING,
          subtotal: breakdown.subtotal,
          vendorEarnings: breakdown.subtotal - breakdown.platformFee,
        },
      });
    }

    // Clear cart
    await this.prisma.cartItem.deleteMany({
      where: { cartId: buyer.cart.id },
    });

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      vendorBreakdown,
    };
  }

  async selectPaymentMethod(
    orderId: string,
    buyerId: string,
    dto: PaymentSelectionDto,
  ) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, buyerId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Create Payment record
    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        paymentMethod: dto.paymentMethod,
        status: PaymentStatus.PENDING,
        amount: order.total,
        currency: 'USD',
      },
    });

    // Create Stripe PaymentIntent for card payments
    let paymentIntentSecret: string | null = null;

    if (dto.paymentMethod === 'CARD') {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(Number(order.total) * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId,
          buyerId,
        },
      });

      paymentIntentSecret = paymentIntent.client_secret;

      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          stripePaymentIntentId: paymentIntent.id,
        },
      });

      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          stripePaymentIntentId: paymentIntent.id,
        },
      });
    }

    return {
      paymentId: payment.id,
      paymentMethod: payment.paymentMethod,
      paymentIntentSecret, // Return secret only for CARD payments
      amount: payment.amount,
    };
  }

  async confirmPayment(orderId: string, buyerId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, buyerId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    // Update order status
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.COMPLETED,
        status: OrderStatus.CONFIRMED,
      },
    });

    // Update all vendor orders
    await this.prisma.vendorOrder.updateMany({
      where: { orderId },
      data: {
        status: VendorOrderStatus.CONFIRMED,
      },
    });

    // Update payment status
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.COMPLETED,
      },
    });

    // Update vendor earnings
    const vendorOrders = await this.prisma.vendorOrder.findMany({
      where: { orderId },
    });

    for (const vendorOrder of vendorOrders) {
      await this.prisma.vendor.update({
        where: { id: vendorOrder.vendorId },
        data: {
          totalSales: {
            increment: vendorOrder.subtotal,
          },
          totalEarnings: {
            increment: vendorOrder.vendorEarnings,
          },
        },
      });
    }

    return this.getOrder(orderId, buyerId);
  }

  async getOrder(orderId: string, buyerId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, buyerId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        vendorOrders: {
          include: {
            vendor: {
              select: {
                id: true,
                shopName: true,
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getBuyerOrders(buyerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { buyerId },
        include: {
          vendorOrders: {
            include: {
              vendor: {
                select: {
                  id: true,
                  shopName: true,
                },
              },
            },
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { buyerId } }),
    ]);

    return {
      data: orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getVendorOrders(vendorId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [vendorOrders, total] = await Promise.all([
      this.prisma.vendorOrder.findMany({
        where: { vendorId },
        include: {
          order: {
            include: {
              items: {
                where: {
                  product: { vendorId },
                },
                include: {
                  product: true,
                },
              },
              buyer: {
                select: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vendorOrder.count({ where: { vendorId } }),
    ]);

    return {
      data: vendorOrders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateVendorOrderStatus(
    vendorOrderId: string,
    vendorId: string,
    status: string,
  ) {
    const vendorOrder = await this.prisma.vendorOrder.findFirst({
      where: { id: vendorOrderId, vendorId },
    });

    if (!vendorOrder) {
      throw new NotFoundException('Vendor order not found');
    }

    return this.prisma.vendorOrder.update({
      where: { id: vendorOrderId },
      data: { status: status as any },
      include: {
        order: true,
      },
    });
  }
}
