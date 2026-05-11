import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { builderRedisMicroserviceOptions } from './redis/redis.transport-options';

async function bootstrap() {
    const logger = new Logger(bootstrap.name, { timestamp: true });

    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);

    const swaggerConfig = new DocumentBuilder()
        .setTitle('IdentityMicroService')
        .setDescription('Микросервис управления "личностью" пользователя. Включает аутентификацию, управление профилем, системой ролей, разрешениями и департаментами.')
        .setVersion('1.0')
        .addTag('Users', 'Управление учетными записями')
        .addTag('Roles', 'Управление ролями')
        .addTag('Permissions', 'Управление правами (RBAC)')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Введите JWT токен',
                in: 'header',
            },
            'access-token',
        )
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);

    app.connectMicroservice(builderRedisMicroserviceOptions(config));

    app.enableCors({
        origin: '*',
        credentials: true
    });

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    
    await app.startAllMicroservices();

    await app.listen(
		config.get<number>('PORT'),
		config.get<string>('NULL_HOST'),
		() => { 
			logger.debug(`Сервер запущен на порту ${config.get<number>('PORT')} с хостом ${config.get<string>('NULL_HOST')}`);
			logger.log(`Swagger UI доступен по адресу: http://localhost:${config.get<number>('PORT')}/api/docs`);
		},
	);
}
bootstrap();