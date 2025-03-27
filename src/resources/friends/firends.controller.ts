import { FriendsService } from './firends.service';
import { Controller, Get, Post, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthUser } from '@common/decorators';
import { ITokenPayload } from '@common/models';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthUserGuard } from '@common/guards';

@ApiBearerAuth()
@Controller('friends')
@UseGuards(AuthUserGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add New friend' })
  async addFriend(
    @AuthUser() user: ITokenPayload,
    @Param('id') friendId: string,
  ) {
    return this.friendsService.AddFriend(user.id, friendId);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Friend' })
  @HttpCode(HttpStatus.OK)
  getFriends(@AuthUser() user: ITokenPayload) {
    return this.friendsService.getFriends(user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Friend' })
  removeFriend(@AuthUser() user: ITokenPayload, @Param('id') friendId: string) {
    return this.friendsService.removeFriend(user.id, friendId);
  }
}
