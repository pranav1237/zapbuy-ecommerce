import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(buyerId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { buyerId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { take: 1 } },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { buyerId },
        include: {
          items: {
            include: {
              product: {
                include: { images: true },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async addToCart(buyerId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock - product.reserved < dto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    let cart = await this.getOrCreateCart(buyerId);

    const existingItem = cart.items.find(
      (item) => item.productId === dto.productId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      if (product.stock - product.reserved < newQuantity) {
        throw new BadRequestException('Insufficient stock');
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
          priceAtAdd: product.price,
        },
      });
    }

    return this.getOrCreateCart(buyerId);
  }

  async removeFromCart(buyerId: string, cartItemId: string) {
    const cart = await this.getOrCreateCart(buyerId);

    const item = cart.items.find((i: any) => i.id === cartItemId);
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return this.getOrCreateCart(buyerId);
  }

  async updateCartItem(
    buyerId: string,
    cartItemId: string,
    dto: UpdateCartItemDto,
  ) {
    const cart = await this.getOrCreateCart(buyerId);
    const item = cart.items.find((i: any) => i.id === cartItemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (product.stock - product.reserved < dto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: dto.quantity },
    });

    return this.getOrCreateCart(buyerId);
  }

  async clearCart(buyerId: string) {
    const cart = await this.getOrCreateCart(buyerId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getOrCreateCart(buyerId);
  }

  async getCartSummary(buyerId: string) {
    const cart = await this.getOrCreateCart(buyerId);

    let subtotal = 0;
    const vendorBreakdown: any = {};

    for (const item of cart.items) {
      const itemTotal = Number(item.priceAtAdd) * item.quantity;
      subtotal += itemTotal;

      const vendorId = item.product.vendorId;
      if (!vendorBreakdown[vendorId]) {
        vendorBreakdown[vendorId] = {
          vendor: item.product.vendor,
          items: [],
          subtotal: 0,
        };
      }

      vendorBreakdown[vendorId].items.push(item);
      vendorBreakdown[vendorId].subtotal += itemTotal;
    }

    return {
      cartId: cart.id,
      itemCount: cart.items.length,
      subtotal,
      vendorBreakdown: Object.values(vendorBreakdown),
    };
  }
}
