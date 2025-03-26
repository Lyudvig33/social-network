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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(AuthUserGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'get all users' })
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'get me' })
  @HttpCode(HttpStatus.OK)
  async findOne(@AuthUser() user: ITokenPayload) {
    return this.usersService.findOne(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'update current user' })
  @ApiResponse({ status: 201, description: 'user successfully updated' })
  async update(
    @AuthUser() user: ITokenPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'delete current user' })
  @ApiResponse({ status: 204, description: 'user successfully deleted' })
  async remove(@AuthUser() user: ITokenPayload) {
    return this.usersService.remove(user.id);
  }
}
