import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

// Import enum constants from Prisma Client
const ProductStatus = { DRAFT: 'DRAFT', PUBLISHED: 'PUBLISHED', ARCHIVED: 'ARCHIVED' };

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(vendorId: string, dto: CreateProductDto) {
    // Generate slug from product name
    const slug = dto.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .slice(0, 50);

    // Check if slug already exists for this vendor
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      throw new BadRequestException('Product name already exists');
    }

    const product = await this.prisma.product.create({
      data: {
        vendorId,
        name: dto.name,
        slug,
        description: dto.description,
        price: dto.price,
        compareAtPrice: dto.compareAtPrice,
        category: dto.category,
        tags: dto.tags || [],
        stock: dto.stock,
        status: ProductStatus.DRAFT,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
      },
      include: { images: true },
    });

    return product;
  }

  async getProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        vendor: {
          select: {
            id: true,
            shopName: true,
            shopSlug: true,
            rating: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        vendor: {
          select: {
            id: true,
            shopName: true,
            shopSlug: true,
            rating: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(productId: string, vendorId: string, dto: UpdateProductDto) {
    // Verify vendor owns this product
    const product = await this.prisma.product.findFirst({
      where: { id: productId, vendorId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: dto,
      include: { images: true },
    });

    return updated;
  }

  async publishProduct(productId: string, vendorId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, vendorId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: { status: ProductStatus.PUBLISHED },
      include: { images: true },
    });
  }

  async getVendorProducts(vendorId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { vendorId },
        include: { images: { take: 1 } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where: { vendorId } }),
    ]);

    return {
      data: products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchProducts(
    query: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    page = 1,
    limit = 20,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      status: ProductStatus.PUBLISHED,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query] } },
      ],
    };

    if (category) {
      where.category = category;
    }

    if (minPrice !== undefined) {
      where.price = { ...where.price, gte: minPrice };
    }

    if (maxPrice !== undefined) {
      where.price = { ...where.price, lte: maxPrice };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images: { take: 1 },
          vendor: {
            select: {
              id: true,
              shopName: true,
              shopSlug: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async addProductImage(productId: string, vendorId: string, url: string, altText?: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, vendorId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const imageCount = await this.prisma.productImage.count({
      where: { productId },
    });

    const image = await this.prisma.productImage.create({
      data: {
        productId,
        url,
        altText,
        isThumbnail: imageCount === 0, // First image is thumbnail
        order: imageCount,
      },
    });

    return image;
  }

  async deleteProduct(productId: string, vendorId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, vendorId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.delete({
      where: { id: productId },
    });
  }
}
