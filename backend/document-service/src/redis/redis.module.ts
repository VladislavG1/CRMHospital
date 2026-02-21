import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxyFactory, ClientsModule} from "@nestjs/microservices";
import { redisOptionsClient } from './redis.transport-options';


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
})
export class RedisModule {}
