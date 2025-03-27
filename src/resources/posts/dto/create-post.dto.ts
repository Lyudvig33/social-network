import { MediaType } from '@common/enums';
import { ICreatePost } from '@common/models/posts/create.post';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum,IsOptional, IsString } from 'class-validator';

export class CreatePostDto implements ICreatePost {
  @ApiProperty({ example: 'Hello world', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  images?: string[];

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  video?: string;

  @ApiProperty({ enum: MediaType, example: MediaType.text })
  @IsEnum(MediaType, { message: 'mediaType must be Text Photo or Video' })
  mediaType: MediaType;
}
