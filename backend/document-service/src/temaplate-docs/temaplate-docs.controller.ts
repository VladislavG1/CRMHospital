import { Controller, Get, Post, Put, Delete, Param, Body, Logger, HttpCode, BadGatewayException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CreateTempDocumentDto, updateTempDocumetnDto } from './dto/templdto';
import { TemaplateDocsService } from './temaplate-docs.service';

@ApiTags('Document: Template Documents')
@Controller('temaplate-docs')
export class TemaplateDocsController {
    constructor(
        private readonly temaplateDocsService: TemaplateDocsService,
        private readonly logger: Logger

    ) { }

    @Get("findAll")
    @HttpCode(201)
    @ApiOperation({ summary: 'Получить все шаблоны документов' })
    @ApiResponse({ status: 201, description: 'Список успешно получен' })
    async findeAll() {
        try {
            return await this.temaplateDocsService.findAll();
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }

    @Get("fineOne")
    @HttpCode(201)
    @ApiOperation({ summary: 'Получить шаблон по ID' })
    @ApiQuery({ name: 'id', description: 'UUID шаблона' })
    @ApiResponse({ status: 201, description: 'Шаблон найден' })
    async findOne(@Query('id') id: string) {
        try {
            return await this.temaplateDocsService.findOne(id);
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
            // надо подумать как лучше сделать?
            return await this.temaplateDocsService.create(createDocumentDto);
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
    async update(@Body() updateDocumetnDto: updateTempDocumetnDto, @Param('id') id: string) {
        try {
            return await this.temaplateDocsService.update(updateDocumetnDto, id);
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
            return await this.temaplateDocsService.delete(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось удалить шаблон");
        }

    }

}