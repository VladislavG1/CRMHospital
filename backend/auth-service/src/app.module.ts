import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule,
    AuthModule,
    RedisModule,
    UserModule
  ]
})
export class AppModule { }
