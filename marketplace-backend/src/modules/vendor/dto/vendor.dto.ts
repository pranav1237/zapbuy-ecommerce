import { IsString, IsNumber, IsOptional, IsEmail, MinLength } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateVendorDto {
  @IsString()
  shopName!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  address!: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;

  @IsString()
  zipCode!: string;

  @IsString()
  country!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;
}

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  shopName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;
}

export class VendorResponseDto {
  id!: string;
  userId!: string;
  shopName!: string;
  shopSlug!: string;
  description?: string | null;
  address!: string;
  city!: string;
  state!: string;
  latitude!: number;
  longitude!: number;
  isVerified!: boolean;
  isActive!: boolean;
  totalSales!: Decimal | number;
  totalEarnings!: Decimal | number;
  rating!: Decimal | number;
  reviewCount!: number;
}

export class VendorDashboardDto {
  totalRevenue!: number;
  totalOrders!: number;
  totalProducts!: number;
  platformFees!: number;
  vendorEarnings!: number;
  rating!: number;
  recentOrders!: any[];
  topProducts!: any[];
}
