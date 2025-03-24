import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { ITokenPayload } from '@common/models';
import { ERROR_MESSAGES } from '@common/erorr-mesagges';

@Injectable()
export class AuthUserGuard implements CanActivate {
  constructor(private readonly _jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers?.authorization
      ?.replace('Bearer', '')
      ?.trim();

    if (!accessToken) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_UNAUTHORIZED);
    }

    try {
      await this._jwtService.verify(accessToken);
      const payload = this._jwtService.decode(accessToken) as ITokenPayload;

      request.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_UNAUTHORIZED);
    }
  }
}
