import { Module } from '@nestjs/common';
import { DocumentsModule } from './documents/documents.module';
import { TemplateDocsModule } from './template-docs/template-docs.module';
import { RedisModule } from './redis/redis.module';
import { CompletedDocumentsModule } from './completed-documents/completed-documents.module';
import { FileStoregeGatewayModule } from './file-storage-gateway/file-storage-gateway.module';

@Module({
  imports: [DocumentsModule, TemplateDocsModule, RedisModule, CompletedDocumentsModule, FileStoregeGatewayModule]
})
export class AppModule { }