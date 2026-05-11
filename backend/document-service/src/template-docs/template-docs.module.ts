import { Logger, Module } from '@nestjs/common';
import { TemplateDocsController } from './template-docs.controller';
import { TemplateDocsService } from './template-docs.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TemplateDocsController],
  providers: [TemplateDocsService, Logger, PrismaService],
})
export class TemplateDocsModule {}
