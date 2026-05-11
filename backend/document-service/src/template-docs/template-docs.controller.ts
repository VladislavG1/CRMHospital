import { Controller, Get, Post, Put, Delete, Param, Body, Logger, HttpCode, BadGatewayException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CreateTempDocumentDto, UpdateTempDocumentDto } from './dto/template.dto';
import { TemplateDocsService } from './template-docs.service';

@ApiTags('Document: Template Documents')
@Controller('template-docs')
export class TemplateDocsController {
    constructor(
        private readonly templateDocsService: TemplateDocsService,
        private readonly logger: Logger

    ) { }

    @Get("findall")
    @HttpCode(201)
    @ApiOperation({ summary: 'Получить все шаблоны документов' })
    @ApiResponse({ status: 201, description: 'Список успешно получен' })
    async findAll() {
        try {
            return await this.templateDocsService.findAll();
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }

    @Get("findone")
    @HttpCode(201)
    @ApiOperation({ summary: 'Получить шаблон по ID' })
    @ApiQuery({ name: 'id', description: 'UUID шаблона' })
    @ApiResponse({ status: 201, description: 'Шаблон найден' })
    async findOne(@Query('id') id: string) {
        try {
            return await this.templateDocsService.findOne(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }

    }

    @Post("create")
    @HttpCode(201)
    @ApiOperation({ summary: 'Создать новый шаблон документа' })
    @ApiResponse({ status: 201, description: 'Шаблон успешно создан' })
    async create(@Body() createDocumentDto: CreateTempDocumentDto) {
        try {
            return await this.templateDocsService.create(createDocumentDto);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось создать шаблон");
        }

    }

    @Put("update")
    @HttpCode(201)
    @ApiOperation({ summary: 'Обновить существующий шаблон' })
    @ApiParam({ name: 'id', description: 'UUID шаблона для обновления' })
    @ApiResponse({ status: 201, description: 'Шаблон успешно обновлен' })
    async update(@Body() updateDocumentDto: UpdateTempDocumentDto, @Param('id') id: string) {
        try {
            return await this.templateDocsService.update(updateDocumentDto, id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось обновить шаблон");
        }

    }

    @Delete("delete")
    @HttpCode(201)
    @ApiOperation({ summary: 'Удалить шаблон' })
    @ApiQuery({ name: 'id', description: 'UUID шаблона для удаления' })
    @ApiResponse({ status: 201, description: 'Шаблон успешно удален' })
    async delete(@Query('id') id: string) {
        try {
            return await this.templateDocsService.delete(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось удалить шаблон");
        }

    }

}