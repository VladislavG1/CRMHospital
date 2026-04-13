import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { Logger } from '@nestjs/common';
import { builderRedisMicroserviceOptions } from './redis/redis.transport-options';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const logger = new Logger(bootstrap.name, { timestamp: true });

    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);

    const swaggerConfig = new DocumentBuilder()
        .setTitle('DocumentMicroService')
        .setDescription('Микросервис управления документами. Включает документы, их статусы и прикрепленные файлы.')
        .setVersion('1.0')
        .addBearerAuth(
            { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            'access-token',
        )
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);

    app.connectMicroservice(builderRedisMicroserviceOptions(config));

    app.enableCors(
        {
            origin: '*',
            credentials: true
        }
    );
    await app.startAllMicroservices()
    await app.listen(
        config.get<number>('PORT'),
        config.get<string>('NULL_HOST'),
        () => logger.debug(`Сервер запущен на порту ${config.get<number>('PORT')} с хостом ${config.get<string>('NULL_HOST')}`),
    );

}
bootstrap();