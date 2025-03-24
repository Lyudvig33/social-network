import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { AuthTokenDTO } from './dto/auth-token.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'registered a new user and returns an authentication token',
  })
  async create(@Body() body: RegistrationDto) {
    return this.authService.registration(body);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticates a user and returns an authentication token',
  })
  async login(@Body() body: LoginDto): Promise<AuthTokenDTO> {
    return this.authService.login(body);
  }
}
