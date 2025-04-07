import { ChatType } from '@common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString, IsUUID, ValidateIf } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    enum: ChatType,
    example: ChatType.Dm,
    description: 'Type of chat DM or Group Chat',
  })
  @IsEnum(ChatType)
  chatType: ChatType;

  @ApiProperty({
    type: [String],
    example: ['d7a7c85b-7a58-4a8a-a6cf-4fbe68e207a7'],
    description:
      'Chat participant ID (UUID). One for DM, minimum two for group chat'
  })
  @IsArray()
  @IsUUID('4', { each: true })
  members: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Write title for gruop chat',description: 'Chat name is required for group chat'})
  @ValidateIf((obj: CreateChatDto) => obj.chatType === ChatType.GroupChat)
  groupChatName?: string;
}
