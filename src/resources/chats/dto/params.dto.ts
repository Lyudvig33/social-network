import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddMembersParamsDTO {
  @IsUUID()
  @IsNotEmpty()
  chatId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}