import { Logger, Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaService } from '../prisma.service';
import { DocumentStatService } from './document-stat.service';
import { DocumentStatController } from './document-stat.controller';
import { FileStorageGatewayService } from 'src/file-storage-gateway/file-storage-gateway.service';

@Module({
    controllers: [DocumentsController, DocumentStatController],
    providers: [DocumentsService, PrismaService, Logger, DocumentStatService, FileStorageGatewayService],
})
export class DocumentsModule { }   