import { Logger, Module } from '@nestjs/common';
import { TemaplateDocsController } from './temaplate-docs.controller';
import { TemaplateDocsService } from './temaplate-docs.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TemaplateDocsController],
  providers: [TemaplateDocsService, Logger, PrismaService],
})
export class TemaplateDocsModule {}
