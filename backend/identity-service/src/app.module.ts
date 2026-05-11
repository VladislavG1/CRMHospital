import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule,
    AuthModule,
    RedisModule,
    UserModule,
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      ttl: 1800,
    }),
  ]
})
export class AppModule { }
