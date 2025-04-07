import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsEntity, ChatsUsersEntity } from '@common/database/entities';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_CONFIG.secret'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_CONFIG.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([ChatsEntity, ChatsUsersEntity]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
