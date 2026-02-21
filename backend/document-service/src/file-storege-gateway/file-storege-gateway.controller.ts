import { Body, Controller, Get, Logger, Param, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileStoregeGatewayService } from './file-storege-gateway.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import type { Response } from 'express';

@Controller('file-storege-gateway')
export class FileStoregeGatewayController {
    constructor(
        private readonly service: FileStoregeGatewayService,
        private readonly logger: Logger
    ) { }

    @Get('/allfiles')
    async getAllFiles() {
        return await this.service.getAllFiles();
    }

    @Get('/file')
    async getFile(@Query('id') id: string, @Res() res: Response) {
        const { stream, metadata } = await this.service.getFile(id);
        res.set({
            'Content-Type': metadata.mimeType,
            'Content-Disposition': `attachment; filename="${metadata.originalName}"`,
            'Content-Length': metadata.size.toString(),
        });

        stream.pipe(res);
        
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const file_stor = await this.service.uploadFile(file);
        return {id: file_stor}
    }
}
