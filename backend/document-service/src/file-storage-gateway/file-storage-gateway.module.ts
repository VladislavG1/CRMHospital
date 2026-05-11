import { Logger, Module } from '@nestjs/common';
import { FileStorageGatewayController } from './file-storage-gateway.controller';
import { FileStorageGatewayService } from './file-storage-gateway.service';
import { PrismaService } from 'src/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
	controllers: [FileStorageGatewayController],
	providers: [FileStorageGatewayService, Logger, PrismaService]
})
export class FileStoregeGatewayModule { }
