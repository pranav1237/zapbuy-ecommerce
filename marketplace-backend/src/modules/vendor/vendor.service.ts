import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateVendorDto, UpdateVendorDto, VendorDashboardDto } from './dto/vendor.dto';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async createVendor(userId: string, dto: CreateVendorDto) {
    // Generate shop slug from shop name
    const shopSlug = dto.shopName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

    // Check if slug already exists
    const existingShop = await this.prisma.vendor.findUnique({
      where: { shopSlug },
    });

    if (existingShop) {
      throw new BadRequestException('Shop name already taken');
    }

    const vendor = await this.prisma.vendor.create({
      data: {
        userId,
        shopName: dto.shopName,
        shopSlug,
        description: dto.description,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        zipCode: dto.zipCode,
        country: dto.country,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
    });

    return vendor;
  }

  async getVendor(vendorId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async getVendorBySlug(shopSlug: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { shopSlug },
      include: {
        products: {
          where: { status: 'PUBLISHED' },
          select: {
            id: true,
            name: true,
            price: true,
            rating: true,
            images: { take: 1 },
          },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async updateVendor(vendorId: string, dto: UpdateVendorDto) {
    let shopSlug: string | undefined;

    if (dto.shopName) {
      shopSlug = dto.shopName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

      const existingShop = await this.prisma.vendor.findUnique({
        where: { shopSlug },
      });

      if (existingShop && existingShop.id !== vendorId) {
        throw new BadRequestException('Shop name already taken');
      }
    }

    const vendor = await this.prisma.vendor.update({
      where: { id: vendorId },
      data: {
        ...dto,
        ...(shopSlug && { shopSlug }),
      },
    });

    return vendor;
  }

  async getVendorDashboard(vendorId: string): Promise<VendorDashboardDto> {
    const vendor = await this.getVendor(vendorId);

    // Get total orders and revenue
    const vendorOrders = await this.prisma.vendorOrder.findMany({
      where: { vendorId },
      include: {
        order: {
          select: {
            createdAt: true,
            status: true,
          },
        },
      },
    });

    const totalRevenue = vendorOrders.reduce(
      (sum: number, vo: any) => sum + Number(vo.subtotal),
      0,
    );

    const vendorEarnings = vendorOrders.reduce(
      (sum: number, vo: any) => sum + Number(vo.vendorEarnings),
      0,
    );

    const platformFees = totalRevenue - vendorEarnings;

    // Get recent orders
    const recentOrders = await this.prisma.vendorOrder.findMany({
      where: { vendorId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
            createdAt: true,
            status: true,
          },
        },
      },
    });

    // Get top products
    const topProducts = await this.prisma.product.findMany({
      where: { vendorId },
      take: 5,
      orderBy: { reviewCount: 'desc' },
      select: {
        id: true,
        name: true,
        price: true,
        rating: true,
        reviewCount: true,
      },
    });

    // Get total products
    const totalProducts = await this.prisma.product.count({
      where: { vendorId, status: 'PUBLISHED' },
    });

    return {
      totalRevenue,
      totalOrders: vendorOrders.length,
      totalProducts,
      platformFees,
      vendorEarnings,
      rating: vendor.rating,
      recentOrders: recentOrders.map((vo: any) => ({
        ...vo.order,
        vendorOrderId: vo.id,
        status: vo.status,
      })),
      topProducts,
    };
  }

  async getNearbyVendors(
    latitude: number,
    longitude: number,
    radiusInKm: number = 50,
  ) {
    // Simple distance calculation (rough approximation)
    // In production, use PostGIS for accurate geo queries
    const vendors = await this.prisma.vendor.findMany({
      where: {
        isActive: true,
        isVerified: true,
      },
      include: {
        products: {
          where: { status: 'PUBLISHED' },
          take: 1,
        },
      },
    });

    return vendors.filter((vendor: any) => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        vendor.latitude,
        vendor.longitude,
      );
      return distance <= radiusInKm;
    });
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
