import { Controller, Get, Post, Body, Param, Put, Query, Logger, BadGatewayException, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create.dto';
import { UpdateDocumentDto } from './dto/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('documents')
export class DocumentsController {
    constructor(
        private readonly documentsService: DocumentsService,
        private readonly logger: Logger
    ) { }
    @Post('/create')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    async create(@Body() createDocumentDto: CreateDocumentDto, @UploadedFile() file: Express.Multer.File) {
        try {
            return await this.documentsService.create(createDocumentDto, file);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось создать документ");
        }
    }
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    @Put('/update')
    async update(@Query('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto, @UploadedFile() file: Express.Multer.File) {
        try {
            return await this.documentsService.update(updateDocumentDto, file, id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось обновить документ");
        }
    } 
    @Delete('/delete')
    async delete(@Query('id') id: string) {
        try {
            return await this.documentsService.delete(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось удалить документ");
        }
    }


}