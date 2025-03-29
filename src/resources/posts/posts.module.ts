import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsEntity, UsersEntity } from '@common/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

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
    TypeOrmModule.forFeature([PostsEntity,UsersEntity]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
