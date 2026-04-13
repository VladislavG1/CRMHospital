import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('EventLogMicroService')
    .setDescription('Микросервис логирования. Включает запись действий пользователей и сбор ошибок из всех микросервисов.')
    .setVersion('1.0')
    .addTag('Events')
    .addTag('User Documents')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true 
  }));

  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();