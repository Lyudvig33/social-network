import { IsNotEmpty, IsUUID } from 'class-validator';

export class MessagesParamsDto {
  @IsUUID()
  @IsNotEmpty()
  chatId: string;

  @IsUUID()
  @IsNotEmpty()
  messageId: string;
}