import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule } from "@nestjs/microservices";
import { builderRedisOptions, redisOptionsClient } from './redis.transport-options';
import Redis from 'ioredis';

@Global()
@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                name: 'memory_redis',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => redisOptionsClient(config),
                    
            },
        ])
    ],
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: (config: ConfigService) => {
                const options = builderRedisOptions(config);
                return new  Redis({
                    host: options.host,
                    port: options.port,
                    username: options.username,
                    password: options.password
                });
            },
            inject: [ConfigService],
        },
    ],
    exports: ['REDIS_CLIENT', ClientsModule]
})
export class RedisModule {}
