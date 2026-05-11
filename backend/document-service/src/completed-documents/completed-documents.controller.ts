import { BadGatewayException, Body, Controller, Get, Logger, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CompletedDocumentsService } from './completed-documents.service';
import { CompletedDocumentsDTO, CompletedDocumentsUpdateDTO } from './dto/create.dto';

@ApiTags('Document: Completed Documents')
@Controller('completed-documents')
export class CompletedDocumentsController {
    constructor(
        private readonly service: CompletedDocumentsService,
        private readonly logger: Logger
    ) { }

    @Get("findAll")
    @ApiOperation({ summary: 'Получить список всех документов' })
    @ApiResponse({ status: 200, description: 'Успешный возврат списка' })
    async findAll() {
        try {
            return await this.service.findAll();
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Ошибка при получении списка документов");
        }
    }

    @Get("findOne")
    @ApiOperation({ summary: 'Найти документ по ID' })
    @ApiQuery({ name: 'id', description: 'UUID документа', example: '550e8400-e29b-41d4-a716-446655440000' })
    async findOne(@Query('id') id: string) {
        try {
            return await this.service.findOne(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }

    @Post("create")
    @ApiOperation({ summary: 'Создать новый документ' })
    @ApiResponse({ status: 201, description: 'Документ успешно создан' })
    async create(@Body() document: CompletedDocumentsDTO) {
        try {
            return await this.service.create(document);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось создать");
        }
    }

    @Put("update")
    @ApiOperation({ summary: 'Обновить данные документа' })
    @ApiQuery({ name: 'id', description: 'UUID документа для обновления' })
    async update(@Body() document: CompletedDocumentsUpdateDTO, @Query('id') id: string) {
        try {
            return await this.service.update(document, id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось обновить данные");
        }
    }

    @Put("delete")
    @ApiOperation({ summary: 'Удалить документ (логическое или физическое удаление)' })
    @ApiQuery({ name: 'id', description: 'UUID документа для удаления' })
    async delete(@Query('id') id: string) {
        try {
            return await this.service.delete(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось удалить данные");
        }
    }

    @Get("download")
    @ApiOperation({ summary: 'Получить ссылку или поток для скачивания файла документа' })
    @ApiQuery({ name: 'id', description: 'UUID документа' })
    async download(@Query('id') id: string) {
        try {
            return await this.service.DownloadDocs(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось загрузить данные");
        }
    }
}