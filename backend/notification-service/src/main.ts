import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';

import { Logger, ValidationPipe } from '@nestjs/common';
import { builderRedisMicroserviceOptions } from './redis/redis.transport-options';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger(bootstrap.name, { timestamp: true });

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NotificationMicroService')
    .setDescription('Микросервис уведомлений. Включает управление очередью уведомлений, формирование текста уведомления и отправку уведомлений (внутри CRM, на почту и внешние интеграции).')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.connectMicroservice(builderRedisMicroserviceOptions(config));

  app.enableCors(
    {
      origin: '*',
      credentials: true
    }
  );

  await app.startAllMicroservices()
  await app.listen(
    Number(config.get('PORT')),
    String(config.get('NULL_HOST')),
    () => logger.debug(`Сервер запущен на порту ${config.get<number>('PORT')} с хостом ${config.get<string>('NULL_HOST')}`),
  );

}
bootstrap();