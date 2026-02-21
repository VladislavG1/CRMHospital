import { Logger, Module } from '@nestjs/common';
import { FileStoregeGatewayController } from './file-storege-gateway.controller';
import { FileStoregeGatewayService } from './file-storege-gateway.service';
import { PrismaService } from 'src/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
	// imports: [
	// 	MulterModule.register({
	// 		storage: diskStorage({
	// 			destination: './storage',
	// 		})
	// 	}),
	// ],
	controllers: [FileStoregeGatewayController],
	providers: [FileStoregeGatewayService, Logger, PrismaService]
})
export class FileStoregeGatewayModule { }
