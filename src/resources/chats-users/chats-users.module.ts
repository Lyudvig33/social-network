import { Module } from '@nestjs/common';
import { ChatsUsersService } from './chats-users.service';
import { ChatsUsersController } from './chats-users.controller';

@Module({
  controllers: [ChatsUsersController],
  providers: [ChatsUsersService],
})
export class ChatsUsersModule {}
