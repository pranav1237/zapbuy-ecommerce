import { SetMetadata, UseGuards, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';

// Decorator for role-based access
export const Roles = (roles: Role[]) => SetMetadata('roles', roles);

// Get current user from request
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// JWT Guard
export const UseJwtAuth = () => UseGuards(AuthGuard('jwt'));
