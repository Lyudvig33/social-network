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
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { AuthUserGuard } from '@common/guards';

import { AuthUser } from '@common/decorators';
import { ITokenPayload } from '@common/models';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MediaType } from '@common/enums';

@Controller('posts')
@ApiBearerAuth()
@UseGuards(AuthUserGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Created new post' })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 5 },
        { name: 'video', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: 'My New Post' },
        mediaType: {
          type: 'string',
          enum: [...Object.values(MediaType)],
          example: 'text',
        },
        images: { type: 'string', format: 'binary' },
        video: { type: 'string', format: 'binary' },
      },
    },
  })
  async create(
    @AuthUser() user: ITokenPayload,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles()
    files: { images?: Express.Multer.File[]; video?: Express.Multer.File[] },
  ) {

    try {
    const images = files?.images?.map((file) => `/uploads/${file.filename}`) || [];
    const video = files?.video?.[0]? `/uploads/${files.video[0].filename}`: null;

    if (images.length > 0 && video) {
      throw new BadRequestException(
        'You cannot upload photos and videos at the same time.',
      );
    }
    
    return this.postsService.createPost(createPostDto, user.id, images, video);
    }catch(err) {
      throw err;
    }
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
