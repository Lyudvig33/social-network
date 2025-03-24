import { Module } from '@nestjs/common';
import { FriendsService } from './firends.service';
import { FriendsController } from './firends.controller';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
