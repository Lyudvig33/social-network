import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthUserGuard } from '@common/guards';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ITokenPayload } from '@common/models';
import { AuthUser } from '@common/decorators';

@ApiBearerAuth()
@UseGuards(AuthUserGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':id')
  @ApiOperation({ summary: 'write new comment' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postID') postId: string,
    @AuthUser() user: ITokenPayload,
  ) {
    return this.commentsService.createComment(createCommentDto, postId, user);
  }

  @Get()
  @ApiOperation({ summary: 'get all comments' })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.commentsService.findAllComments();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update comment' })
  @HttpCode(HttpStatus.CREATED)
  update(
    @Param('id') comentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(comentId, updateCommentDto,);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete comment' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeComment(
    @Param('id') commentId: string,
  ) {
    return this.commentsService.removeComment(commentId);
  }
}
