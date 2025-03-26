import { Module } from '@nestjs/common';
import { FriendsService } from './firends.service';
import { FriendsController } from './firends.controller';
import { UsersModule } from '@resources/users';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
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
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
