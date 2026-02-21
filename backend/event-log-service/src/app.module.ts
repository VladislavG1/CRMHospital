import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EventsController, UserDocumentsController } from './events/events.controller';
import { EventsService } from './events/events.service';

@Module({
  controllers: [EventsController, UserDocumentsController],
  providers: [PrismaService, EventsService],
})
export class AppModule {}
