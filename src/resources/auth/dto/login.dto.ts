import { IsEmail } from '@common/decorators';
import { ILogin } from '@common/models';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto implements ILogin {
  @IsEmail({
    message: 'err_email',
  })
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@gmail.com',
  })
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(60)
  @ApiProperty({
    example: 'password1!',
  })
  password: string;
}
