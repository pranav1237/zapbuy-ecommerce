import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { UseJwtAuth, CurrentUser, Roles } from '../auth/decorators/auth.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

// Define Role enum values
const Role = { BUYER: 'BUYER', VENDOR: 'VENDOR', ADMIN: 'ADMIN' };

@ApiTags('Products')
@Controller('api/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.VENDOR])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product' })
  async createProduct(
    @CurrentUser() user: any,
    @Body() dto: CreateProductDto,
  ) {
    // Get vendor for this user
    const vendor = await this.getVendor(user.userId);
    return this.productService.createProduct(vendor.id, dto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products' })
  async searchProducts(
    @Query('q') query: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.productService.searchProducts(
      query,
      category,
      minPrice,
      maxPrice,
      page,
      limit,
    );
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  async getProductBySlug(@Param('slug') slug: string) {
    return this.productService.getProductBySlug(slug);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get product details' })
  async getProduct(@Param('productId') productId: string) {
    return this.productService.getProduct(productId);
  }

  @Put(':productId')
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.VENDOR])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  async updateProduct(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    const vendor = await this.getVendor(user.userId);
    return this.productService.updateProduct(productId, vendor.id, dto);
  }

  @Post(':productId/publish')
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.VENDOR])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish product' })
  async publishProduct(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
  ) {
    const vendor = await this.getVendor(user.userId);
    return this.productService.publishProduct(productId, vendor.id);
  }

  @Delete(':productId')
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.VENDOR])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product' })
  async deleteProduct(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
  ) {
    const vendor = await this.getVendor(user.userId);
    return this.productService.deleteProduct(productId, vendor.id);
  }

  private async getVendor(userId: string) {
    // This should be injected from VendorService
    // For now, this is a placeholder
    return { id: 'vendor-id' };
  }
}
