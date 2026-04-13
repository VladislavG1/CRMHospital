import { Controller, Post, Body, Put, Query, Logger, BadGatewayException, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create.dto';
import { UpdateDocumentDto } from './dto/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@ApiTags('Document: Document Management (Files)')
@Controller('documents')
export class DocumentsController {
    constructor(
        private readonly documentsService: DocumentsService,
        private readonly logger: Logger
    ) { }

    @Post('/create')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    @ApiOperation({ summary: 'Создать документ с загрузкой файла' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary', description: 'Бинарный файл документа' },
                name: { type: 'string', example: 'Договор_№1.pdf' },
                description: { type: 'string', example: 'Скан подписанного договора' },
                typeId: { type: 'string', format: 'uuid' },
                statusId: { type: 'string', format: 'uuid' },
                templateId: { type: 'string', format: 'uuid', nullable: true },
            },
            required: ['file', 'name', 'typeId', 'statusId'],
        },
    })
    async create(@Body() createDocumentDto: CreateDocumentDto, @UploadedFile() file: Express.Multer.File) {
        try {
            return await this.documentsService.create(createDocumentDto, file);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось создать документ");
        }
    }

    @Put('/update')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    @ApiOperation({ summary: 'Обновить метаданные или заменить файл документа' })
    @ApiConsumes('multipart/form-data')
    @ApiQuery({ name: 'id', description: 'UUID документа' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary', description: 'Новая версия файла (опционально)' },
                name: { type: 'string' },
                description: { type: 'string' },
                statusId: { type: 'string', format: 'uuid' },
            },
        },
    })
    async update(@Query('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto, @UploadedFile() file: Express.Multer.File) {
        try {
            return await this.documentsService.update(updateDocumentDto, file, id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось обновить документ");
        }
    }

    @Delete('/delete')
    @ApiOperation({ summary: 'Удалить документ и связанный с ним файл' })
    @ApiQuery({ name: 'id', description: 'UUID документа' })
    async delete(@Query('id') id: string) {
        try {
            return await this.documentsService.delete(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось удалить документ");
        }
    }
}