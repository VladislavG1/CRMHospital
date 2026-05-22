import { Module } from '@nestjs/common';
import { NotificationCoreService } from './notification-core.service';
import { NotificationCoreController } from './notification-core.controller';
import { TemplateEngineModule } from '../template-engine/template-engine.module';
import { TransportModule } from '../transport/transport.module';
import { PrismaService } from '../prisma.service';

@Module({
    imports: [TemplateEngineModule, TransportModule],
    controllers: [NotificationCoreController],
    providers: [NotificationCoreService, PrismaService],
    exports: [NotificationCoreService], 
})
export class NotificationCoreModule { }