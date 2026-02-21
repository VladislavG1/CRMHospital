import { ClientOptions, ClientProviderOptions, MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export function builderRedisOptions(config: ConfigService) {
    return {
        host: String(config.get('REDIS_HOST')),
        port: Number(config.get('REDIS_PORT')),
        username: String(config.get('REDIS_USER')),
        password: String(config.get('REDIS_USER_PASSWORD')),
    };
}

export function builderRedisMicroserviceOptions(config: ConfigService): MicroserviceOptions {
    return {
        transport: Transport.REDIS,
        options: builderRedisOptions(config),
    };
}

export function redisOptionsClient(config: ConfigService): ClientOptions {
    return {
        transport: Transport.REDIS,
        options: builderRedisOptions(config),
    };
}