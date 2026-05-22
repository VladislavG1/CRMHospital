import { Module } from '@nestjs/common';
import { EventSyncService } from './event-sync.service';
import { PrismaService } from '../prisma.service';

@Module({
    providers: [EventSyncService, PrismaService],
    exports: [EventSyncService]
})
export class EventSyncModule { }