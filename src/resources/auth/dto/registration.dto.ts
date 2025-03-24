import { VALIDATION_PATTERNS } from '@common/constants';
import { IRegistration } from '@common/models';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegistrationDto implements IRegistration {
  @Matches(VALIDATION_PATTERNS.NAME)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Joe',
  })
  name: string;

  @Matches(VALIDATION_PATTERNS.LAST_NAME)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Doe',
  })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'joe@gmail.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: 'Im a Programmer',
  })
  bio?: string;

  @Matches(VALIDATION_PATTERNS.PASSWORD)
  @MinLength(8)
  @MaxLength(60)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'password1!' })
  password: string;
}
