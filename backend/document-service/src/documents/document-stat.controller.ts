import { BadGatewayException, Body, Controller, Delete, Get, HttpCode, Logger, Param, Post, Put } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { DocumentStatService } from "./document-stat.service";
import { createStatusDto, createTypeDto, updateStatusDto, updateTypeDto } from "./dto/create.dto";

@ApiTags('Document: Document Dictionaries (Statuses & Types)')
@Controller('document-stat')
export class DocumentStatController {
    constructor(
        private readonly service: DocumentStatService,
        private readonly logger: Logger
    ) { }

    @Get("findAllstatus")
    @HttpCode(200)
    @ApiOperation({ summary: 'Получить все доступные статусы документов' })
    async getallstatus() {
        try {
            return await this.service.findAllstatus();
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }

    @Get('findonestatus/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Найти конкретный статус по ID' })
    @ApiParam({ name: 'id', description: 'UUID статуса' })
    async findstatus(@Param('id') id: string) {
        try {
            return await this.service.findonestatus(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }

    @Post("createstatus")
    @HttpCode(201)
    @ApiOperation({ summary: 'Создать новый статус' })
    async createnewstatus(@Body() dock_status: createStatusDto) {
        try {
            return await this.service.createnewstatus(dock_status);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось создать статус");
        }
    }

    @Delete("deletestatus/:id")
    @HttpCode(200)
    @ApiOperation({ summary: 'Удалить статус' })
    @ApiParam({ name: 'id', description: 'UUID статуса для удаления' })
    async deletestatus(@Param('id') id: string) {
        try {
            return await this.service.deletestatus(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось удалить статус");
        }
    }

    @Put("updatestatus/:id")
    @HttpCode(200)
    @ApiOperation({ summary: 'Обновить данные статуса' })
    async updatestatus(@Param('id') id: string, @Body() data_status: updateStatusDto) {
        try {
            return await this.service.updatestatus(data_status, id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось обновить статус");
        }
    }

    @Get("findAlltype")
    @HttpCode(200)
    @ApiOperation({ summary: 'Получить все типы документов' })
    async getalltypes() {
        try {
            return await this.service.findAlltypes();
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }

    @Get('findonetype/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Найти тип документа по ID' })
    async findtype(@Param('id') id: string) {
        try {
            return await this.service.findonetype(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }

    @Post("createtype")
    @HttpCode(201)
    @ApiOperation({ summary: 'Создать новый тип документа' })
    async createnewtype(@Body() dokc_tyepe: createTypeDto) {
        try {
            return await this.service.createnewtype(dokc_tyepe);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось создать тип");
        }
    }

    @Delete("deletetype/:id")
    @HttpCode(200)
    @ApiOperation({ summary: 'Удалить тип документа' })
    async deletetype(@Param('id') id: string) {
        try {
            return await this.service.deletetype(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось удалить тип");
        }
    }

    @Put("updatetype/:id")
    @HttpCode(200)
    @ApiOperation({ summary: 'Обновить описание типа документа' })
    async updatetype(@Param('id') id: string, @Body() data_type: updateTypeDto) {
        try {
            return await this.service.updatetype(data_type, id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось обновить тип");
        }
    }
}