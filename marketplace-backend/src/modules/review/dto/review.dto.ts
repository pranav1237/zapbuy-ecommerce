import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  rating: number; // 1-5

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  productId: string;

  @IsString()
  orderId: string;
}

export class ReviewResponseDto {
  id: string;
  productId: string;
  buyerId: string;
  rating: number;
  title: string;
  content: string;
  createdAt: Date;
}
