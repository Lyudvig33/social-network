import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig, databaseConfiguration, jwtConfig } from '@common/configs';
import { ENV_CONST } from '@common/constants';
import { NodeEnv } from '@common/enums';
import validators from '@common/models-interfaces/validators';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AuthModule } from '@resources/auth';
import { UsersModule } from '@resources/users';
import { PostsModule } from '@resources/posts';
import { MessagesModule } from '@resources/messages';
import { ChatsModule } from '@resources/chats';
import { ChatsUsersModule } from '@resources/chats-users';
import { CommentsModule } from '@resources/comments';
import { FriendsModule } from '@resources/friends';
import { LikesModule } from '@resources/likes';
import { addTransactionalDataSource } from 'typeorm-transactional';

const isPorductionMode = process.env.NODE_ENV === NodeEnv.production;

const envFilePath = isPorductionMode
  ? ENV_CONST.ENV_PATH_PROD
  : ENV_CONST.ENV_PATH_DEV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      expandVariables: true,
      validationSchema: validators,
      load: [jwtConfig, appConfig, databaseConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options: DataSourceOptions = {
          type: 'postgres',
          host: configService.get<string>(`DB_CONFIG.host`),
          port: configService.get<number>(`DB_CONFIG.port`),
          username: configService.get<string>(`DB_CONFIG.username`),
          password: configService.get<string>(`DB_CONFIG.password`),
          database: configService.get<string>(`DB_CONFIG.database`),
          synchronize: configService.get<boolean>(`DB_CONFIG.sync`),
          entities: ["dist/**/*.entity.js"],
        };
        return options;
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    MessagesModule,
    ChatsModule,
    ChatsUsersModule,
    CommentsModule,
    FriendsModule,
    LikesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
