import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';

import { Logger } from '@nestjs/common';
import { builderRedisMicroserviceOptions } from './redis/redis.transport-options';

async function bootstrap() {
  const logger = new Logger(bootstrap.name, { timestamp: true });

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

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