import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateCheckoutSessionDto {
  @IsString()
  shippingAddressId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class PaymentSelectionDto {
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}

export class OrderResponseDto {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  platformFee: number;
  total: number;
  createdAt: Date;
  vendorOrders: any[];
}
