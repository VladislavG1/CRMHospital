import { Module } from '@nestjs/common';
import { DocumentsModule } from './documents/documents.module';
import { TemaplateDocsModule } from './temaplate-docs/temaplate-docs.module';
import { RedisModule } from './redis/redis.module';
import { CompletedDocumentsModule } from './completed-documents/completed-documents.module';
import { FileStoregeGatewayModule } from './file-storege-gateway/file-storege-gateway.module';

@Module({
  imports: [DocumentsModule, TemaplateDocsModule, RedisModule, CompletedDocumentsModule, FileStoregeGatewayModule]
})
export class AppModule { }