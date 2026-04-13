import { Controller, Get, Post, Body, Param, Query, Res, UploadedFile, UseInterceptors, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiQuery, ApiResponse, ApiProduces } from '@nestjs/swagger';
import { FileStoregeGatewayService } from './file-storege-gateway.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import type { Response } from 'express';

@ApiTags('Document: File storage gateway')
@Controller('file-storege-gateway')
export class FileStoregeGatewayController {
    constructor(
        private readonly service: FileStoregeGatewayService,
        private readonly logger: Logger
    ) { }

    @Get('/allfiles')
    @ApiOperation({ summary: 'Получить список всех файлов' })
    @ApiResponse({ status: 200, description: 'Список успешно получен' })
    async getAllFiles() {
        return await this.service.getAllFiles();
    }

    @Get('/file')
    @ApiOperation({ summary: 'Скачать файл по ID' })
    @ApiQuery({ name: 'id', description: 'UUID файла' })
    @ApiProduces('application/octet-stream')
    @ApiResponse({ status: 200, description: 'Файл успешно отдан' })
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
    @ApiOperation({ summary: 'Загрузить файл в хранилище' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Файл успешно загружен' })
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const file_stor = await this.service.uploadFile(file);
        return {id: file_stor}
    }
}