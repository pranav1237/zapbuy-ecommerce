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
import { OrderService } from './order.service';
import {
  CreateCheckoutSessionDto,
  PaymentSelectionDto,
} from './dto/order.dto';
import { UseJwtAuth, CurrentUser, Roles } from '../auth/decorators/auth.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Orders')
@Controller('api/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('checkout')
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.BUYER])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create checkout session' })
  async createCheckout(
    @CurrentUser() user: any,
    @Body() dto: CreateCheckoutSessionDto,
  ) {
    const buyer = await this.getBuyer(user.userId);
    return this.orderService.createCheckoutSession(buyer.id, dto);
  }

  @Post(':orderId/select-payment')
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.BUYER])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Select payment method for order' })
  async selectPaymentMethod(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
    @Body() dto: PaymentSelectionDto,
  ) {
    const buyer = await this.getBuyer(user.userId);
    return this.orderService.selectPaymentMethod(orderId, buyer.id, dto);
  }

  @Post(':orderId/confirm-payment')
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.BUYER])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm payment and complete order' })
  async confirmPayment(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
  ) {
    const buyer = await this.getBuyer(user.userId);
    return this.orderService.confirmPayment(orderId, buyer.id);
  }

  @Get(':orderId')
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.BUYER])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order details' })
  async getOrder(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
  ) {
    const buyer = await this.getBuyer(user.userId);
    return this.orderService.getOrder(orderId, buyer.id);
  }

  @Get()
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.BUYER])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get buyer orders' })
  async getBuyerOrders(
    @CurrentUser() user: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const buyer = await this.getBuyer(user.userId);
    return this.orderService.getBuyerOrders(buyer.id, page, limit);
  }

  @Get('vendor/:vendorId')
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.VENDOR])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get vendor orders' })
  async getVendorOrders(
    @Param('vendorId') vendorId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.orderService.getVendorOrders(vendorId, page, limit);
  }

  @Put('vendor-orders/:vendorOrderId/status')
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.VENDOR])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vendor order status' })
  async updateVendorOrderStatus(
    @CurrentUser() user: any,
    @Param('vendorOrderId') vendorOrderId: string,
    @Body('status') status: string,
  ) {
    // Get vendor for current user
    const vendor = await this.getVendor(user.userId);
    return this.orderService.updateVendorOrderStatus(
      vendorOrderId,
      vendor.id,
      status,
    );
  }

  private async getBuyer(userId: string) {
    return { id: 'buyer-id' };
  }

  private async getVendor(userId: string) {
    return { id: 'vendor-id' };
  }
}
