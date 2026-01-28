import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/review.dto';
import { UseJwtAuth, CurrentUser, Roles } from '../auth/decorators/auth.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Reviews')
@Controller('api/reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  @UseJwtAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.BUYER])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product review' })
  async createReview(
    @CurrentUser() user: any,
    @Body() dto: CreateReviewDto,
  ) {
    const buyer = await this.getBuyer(user.userId);
    return this.reviewService.createReview(buyer.id, dto);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get product reviews' })
  async getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.reviewService.getProductReviews(productId, page, limit);
  }

  @Get('vendor/:vendorId')
  @ApiOperation({ summary: 'Get vendor reviews' })
  async getVendorReviews(
    @Param('vendorId') vendorId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.reviewService.getVendorReviews(vendorId, page, limit);
  }

  private async getBuyer(userId: string) {
    return { id: 'buyer-id' };
  }
}
