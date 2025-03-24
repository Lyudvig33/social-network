import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthUserGuard } from '@common/guards';
import { AuthUser } from '@common/decorators';
import { ITokenPayload } from '@common/models';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@UseGuards(AuthUserGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async findOne(@AuthUser() user: ITokenPayload) {
    return this.usersService.findOne(user.id);
  }

  @Patch('me')
  async update(
    @AuthUser() user: ITokenPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Delete('me')
  async remove(@AuthUser() user: ITokenPayload) {
    return this.usersService.remove(user.id);
  }
}
