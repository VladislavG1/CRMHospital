import { BadGatewayException, Body, Controller, Get, Logger, Param, Post, Put, Query } from '@nestjs/common';
import { CompletedDocumentsService } from './completed-documents.service';
import { ComplitedDocumentsDTO, ComplitedDocumentsUpdateDTO } from './dto/create.dto';

@Controller('completed-documents')
export class CompletedDocumentsController {
    constructor (
        private readonly service: CompletedDocumentsService,
        private readonly logger: Logger

    ) { }
    @Get("findeAll")
    async findeAll() {
        try { return await this.service.findAll();} catch (error) { this.logger.error(error); }
    }
    @Get("findOne")
    async findOne(@Query('id') id: string) {
        try {
            return await this.service.findOne(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
        
    }
    @Post("create")
    async create(@Body() document: ComplitedDocumentsDTO) {
        try {
            return await this.service.create(document);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось создать");
        }
    }
    @Put("update")
    async update(@Body() document: ComplitedDocumentsUpdateDTO, @Query('id') id: string) {
        try {
            return await this.service.update(document, id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось обновить данные");
        }   
    }
    @Put("delete")
    async delete(@Query('id') id: string) {
        try {
            return await this.service.delete(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось удалить данные");
        }
    }
    @Get("download")
    async download(@Query('id') id: string) {
        try {
            return await this.service.DownloadDocs(id);
        } catch (error) {
            this.logger.error(error);
           throw new BadGatewayException("Не удалось загрузить данные");
        }
    }

}
