import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { VendorService } from './vendor.service';
import {
  CreateVendorDto,
  UpdateVendorDto,
  VendorResponseDto,
} from './dto/vendor.dto';
import { UseJwtAuth, CurrentUser, Roles } from '../auth/decorators/auth.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Vendor')
@Controller('api/vendors')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Post()
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.VENDOR])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create vendor profile' })
  async createVendor(
    @CurrentUser() user: any,
    @Body() dto: CreateVendorDto,
  ): Promise<VendorResponseDto> {
    return this.vendorService.createVendor(user.userId, dto);
  }

  @Get(':vendorId')
  @ApiOperation({ summary: 'Get vendor details' })
  async getVendor(@Param('vendorId') vendorId: string): Promise<VendorResponseDto> {
    return this.vendorService.getVendor(vendorId);
  }

  @Get('slug/:shopSlug')
  @ApiOperation({ summary: 'Get vendor by shop slug' })
  async getVendorBySlug(@Param('shopSlug') shopSlug: string) {
    return this.vendorService.getVendorBySlug(shopSlug);
  }

  @Put(':vendorId')
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.VENDOR])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vendor profile' })
  async updateVendor(
    @Param('vendorId') vendorId: string,
    @Body() dto: UpdateVendorDto,
  ): Promise<VendorResponseDto> {
    return this.vendorService.updateVendor(vendorId, dto);
  }

  @Get(':vendorId/dashboard')
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.VENDOR])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get vendor dashboard' })
  async getDashboard(@Param('vendorId') vendorId: string) {
    return this.vendorService.getVendorDashboard(vendorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get nearby vendors' })
  async getNearbyVendors(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number = 50,
  ) {
    return this.vendorService.getNearbyVendors(+latitude, +longitude, +radius);
  }
}
