import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { AuthUserGuard } from '@common/guards';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthUser } from '@common/decorators';
import { ITokenPayload } from '@common/models';

@ApiBearerAuth()
@UseGuards(AuthUserGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId')
  @ApiOperation({ summary: 'Like a post' })
  async likePost(@Param('postId') postId: string, @AuthUser() user: ITokenPayload) {
    return this.likesService.likePost(postId,user);
  }

  @Get()
  @ApiOperation( {summary: 'get all likes'})
  async findAll() {
    return this.likesService.findAll();
  }

  @Delete(':postId')
  @ApiOperation({summary: 'unlike post'})
  async unLike(@Param('postId') postId: string, @AuthUser() user: ITokenPayload) {
    return this.likesService.unLikePost(postId,user);
  }
}
