import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ICreatePost } from '@common/models/posts/create.post';
import { MediaType } from '@common/enums';

export class UpdatePostDto implements ICreatePost {
  @ApiProperty({ example: 'Hello world' })
  content: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  images?: any;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  video?: any;

  @ApiProperty({ enum: MediaType, example: MediaType.text })
  @IsEnum(MediaType, { message: 'mediaType must be Text Photo or Video' })
  mediaType: MediaType;
}
