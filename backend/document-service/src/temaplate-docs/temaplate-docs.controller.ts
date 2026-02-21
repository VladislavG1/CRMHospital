import { Controller, Get, Post, Put, Delete, Param, Body, Logger, HttpCode, BadGatewayException, Query } from '@nestjs/common';
import { CreateTempDocumentDto, updateTempDocumetnDto } from './dto/templdto';
import { TemaplateDocsService } from './temaplate-docs.service';

@Controller('temaplate-docs')
export class TemaplateDocsController {
    constructor(
        private readonly temaplateDocsService: TemaplateDocsService,
        private readonly logger: Logger

    ) { }

    @Get("findAll")
    @HttpCode(201)
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
    async delete(@Query('id') id: string) {
        try {
            return await this.temaplateDocsService.delete(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось удалить шаблон");
        }

    }

}
