import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IMessages } from '@common/models/messages';

export class UpdateMessageDto implements IMessages {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'hello dear' })
  content: string;
}
