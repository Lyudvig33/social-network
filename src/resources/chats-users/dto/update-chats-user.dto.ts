import { PartialType } from '@nestjs/mapped-types';
import { CreateChatsUserDto } from './create-chats-user.dto';

export class UpdateChatsUserDto extends PartialType(CreateChatsUserDto) {}
