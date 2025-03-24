import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ITokenPayload } from '@common/models';

export const AuthUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): ITokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
