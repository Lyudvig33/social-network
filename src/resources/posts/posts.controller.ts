import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthUserGuard } from '@common/guards';

import { AuthUser } from '@common/decorators';
import { ITokenPayload } from '@common/models';

@Controller('posts')
@ApiBearerAuth()
@UseGuards(AuthUserGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Created new post' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @AuthUser() user: ITokenPayload,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.createPost(createPostDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get All posts' })
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.postsService.findAllPosts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get One Post By ID' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.postsService.findOnePost(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updated Post By ID' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Post By ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.postsService.removePost(id);
  }
}
