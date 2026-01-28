import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { UseJwtAuth, CurrentUser, Roles } from '../auth/decorators/auth.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Cart')
@Controller('api/cart')
@UseJwtAuth()
@UseGuards(RolesGuard)
@Roles([Role.BUYER])
@ApiBearerAuth()
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get cart' })
  async getCart(@CurrentUser() user: any) {
    const buyer = await this.getBuyer(user.userId);
    return this.cartService.getOrCreateCart(buyer.id);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get cart summary' })
  async getCartSummary(@CurrentUser() user: any) {
    const buyer = await this.getBuyer(user.userId);
    return this.cartService.getCartSummary(buyer.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  async addToCart(
    @CurrentUser() user: any,
    @Body() dto: AddToCartDto,
  ) {
    const buyer = await this.getBuyer(user.userId);
    return this.cartService.addToCart(buyer.id, dto);
  }

  @Put('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateCartItem(
    @CurrentUser() user: any,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const buyer = await this.getBuyer(user.userId);
    return this.cartService.updateCartItem(buyer.id, itemId, dto);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeFromCart(
    @CurrentUser() user: any,
    @Param('itemId') itemId: string,
  ) {
    const buyer = await this.getBuyer(user.userId);
    return this.cartService.removeFromCart(buyer.id, itemId);
  }

  @Post('clear')
  @ApiOperation({ summary: 'Clear cart' })
  async clearCart(@CurrentUser() user: any) {
    const buyer = await this.getBuyer(user.userId);
    return this.cartService.clearCart(buyer.id);
  }

  private async getBuyer(userId: string) {
    // This should be injected properly
    return { id: 'buyer-id' };
  }
}
