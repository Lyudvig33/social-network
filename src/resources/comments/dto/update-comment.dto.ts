import { IComments } from '@common/models/comments/comments';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDto implements IComments {
  @ApiProperty({ example: 'update your comment', description: 'Comment Posts' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
