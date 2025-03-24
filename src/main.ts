import { ResponseManager } from '@common/helpers';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

import { IValidationErrors } from '@common/models/response';
import { NestExpressApplication } from '@nestjs/platform-express';
import { initializeTransactionalContext } from 'typeorm-transactional';

const PORT = process.env.PORT || 5000;
process.env.TZ = 'Etc/UTC';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors();
  app.disable('x-powered-by');
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: false,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorResponse: IValidationErrors[] = [];
        errors.forEach((e) => {
          if (e.constraints) {
            errorResponse.push(...ResponseManager.validationHandler([e]));
          }
          if (e.children) {
            errorResponse.push(
              ...ResponseManager.validationHandler(
                e.children,
                e.property?.toLowerCase(),
              ),
            );
          }
        });
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Social-Network')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => console.log('Server Started On Port', PORT));
}
bootstrap();
