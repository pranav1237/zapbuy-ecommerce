import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async createReview(buyerId: string, dto: CreateReviewDto) {
    // Verify buyer completed the order
    const orderItem = await this.prisma.orderItem.findFirst({
      where: {
        orderId: dto.orderId,
        productId: dto.productId,
        order: {
          buyerId,
          status: 'DELIVERED',
        },
      },
      include: {
        product: {
          select: {
            vendorId: true,
          },
        },
      },
    });

    if (!orderItem) {
      throw new BadRequestException(
        'Can only review products from completed orders',
      );
    }

    // Check if review already exists
    const existingReview = await this.prisma.review.findUnique({
      where: {
        productId_buyerId_orderId: {
          productId: dto.productId,
          buyerId,
          orderId: dto.orderId,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException('Review already exists for this product');
    }

    const review = await this.prisma.review.create({
      data: {
        productId: dto.productId,
        buyerId,
        vendorId: orderItem.product.vendorId,
        orderId: dto.orderId,
        rating: dto.rating,
        title: dto.title,
        content: dto.content,
      },
    });

    // Update product rating
    await this.updateProductRating(dto.productId);

    // Update vendor rating
    await this.updateVendorRating(orderItem.product.vendorId);

    return review;
  }

  async getProductReviews(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId, isApproved: true },
        include: {
          buyer: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({
        where: { productId, isApproved: true },
      }),
    ]);

    return {
      data: reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getVendorReviews(vendorId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { vendorId, isApproved: true },
        include: {
          buyer: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          product: {
            select: {
              name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({
        where: { vendorId, isApproved: true },
      }),
    ]);

    return {
      data: reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  private async updateProductRating(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId, isApproved: true },
    });

    if (reviews.length === 0) {
      return;
    }

    const averageRating =
      reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: parseFloat(averageRating.toFixed(2)),
        reviewCount: reviews.length,
      },
    });
  }

  private async updateVendorRating(vendorId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { vendorId, isApproved: true },
    });

    if (reviews.length === 0) {
      return;
    }

    const averageRating =
      reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;

    await this.prisma.vendor.update({
      where: { id: vendorId },
      data: {
        rating: parseFloat(averageRating.toFixed(2)),
        reviewCount: reviews.length,
      },
    });
  }
}
