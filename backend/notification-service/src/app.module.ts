import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { RedisModule } from './redis/redis.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { NotificationCoreModule } from './core/notification-core.module';
import { TemplateEngineModule } from './template-engine/template-engine.module';
import { TransportModule } from './transport/transport.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    NotificationCoreModule,
    TemplateEngineModule,
    TransportModule,
    RedisModule,
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      ttl: 1800,
    }),
  ]
})
export class AppModule { }
