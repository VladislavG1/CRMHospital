import { Logger, Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaService } from '../prisma.service';
import { DocumentStatService } from './document-stat.service';
import { DocumentStatController } from './document-stat.controller';
import { FileStoregeGatewayService } from 'src/file-storege-gateway/file-storege-gateway.service';

@Module({
    controllers: [DocumentsController, DocumentStatController],
    providers: [DocumentsService, PrismaService, Logger, DocumentStatService, FileStoregeGatewayService],
})
export class DocumentsModule { }   