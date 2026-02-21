import { Logger, Module } from '@nestjs/common';
import { CompletedDocumentsController } from './completed-documents.controller';
import { CompletedDocumentsService } from './completed-documents.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CompletedDocumentsController],
  providers: [CompletedDocumentsService, Logger, PrismaService],
})
export class CompletedDocumentsModule {}
