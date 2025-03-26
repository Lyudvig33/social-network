import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@common/database/entities';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({ example: 'Hello world' })
  content: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  url: string;

  @ApiProperty({ enum: MediaType, example: MediaType.photo })
  mediaType?: MediaType;
}
