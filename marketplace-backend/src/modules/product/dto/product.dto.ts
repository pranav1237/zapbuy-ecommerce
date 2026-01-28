import { IsString, IsNumber, IsOptional, IsArray, Min, IsEnum } from 'class-validator';

// Define ProductStatus enum values
const ProductStatus = { DRAFT: 'DRAFT', PUBLISHED: 'PUBLISHED', ARCHIVED: 'ARCHIVED' };
type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsNumber()
  compareAtPrice?: number;

  @IsString()
  category!: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}

export class ProductResponseDto {
  id!: string;
  name!: string;
  slug!: string;
  description!: string;
  price!: number;
  compareAtPrice?: number;
  category!: string;
  tags!: string[];
  stock!: number;
  status!: ProductStatus;
  rating!: number;
  reviewCount!: number;
  images!: any[];
}
