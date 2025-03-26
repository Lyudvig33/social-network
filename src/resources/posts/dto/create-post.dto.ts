import { MediaType } from '@common/database/entities';
import { ICreatePost } from '@common/models/posts/create.post';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto implements ICreatePost {
  @ApiProperty({ example: 'Hello world' })
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  @IsOptional()
  @IsString()
  url: string;

  @ApiProperty({ enum: MediaType, example: MediaType.photo })
  mediaType: MediaType;
}
