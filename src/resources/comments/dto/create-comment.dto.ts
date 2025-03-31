import { IComments } from '@common/models/comments/comments';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto implements IComments {
    @ApiProperty({ example: 'this is a comment',description: 'Comment for Posts'})
    @IsString()
    @IsNotEmpty()
    content: string;
}
