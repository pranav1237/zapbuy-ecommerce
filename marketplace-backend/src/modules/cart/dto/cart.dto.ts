import { IsNumber, IsString } from 'class-validator';

export class AddToCartDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  quantity: number;
}

export class CartResponseDto {
  id: string;
  items: CartItemResponseDto[];
  subtotal: number;
  total: number;
}

export class CartItemResponseDto {
  id: string;
  productId: string;
  quantity: number;
  priceAtAdd: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: any[];
  };
}
