import { IAuthToken } from '@common/models';
import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenDTO implements IAuthToken {
  @ApiProperty()
  accessToken: string;
}
