import { BadGatewayException, Body, Controller, Delete, Get, HttpCode, Logger, Param, Post, Put } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { DocumentStatService } from "./document-stat.service";
import { CreateStatusDto, CreateTypeDto, UpdateStatusDto, UpdateTypeDto } from "./dto/create.dto";

@ApiTags('Document: Document Dictionaries (Statuses & Types)')
@Controller('document-stat')
export class DocumentStatController {
    constructor(
        private readonly service: DocumentStatService,
        private readonly logger: Logger
    ) { }

    @Get("findallstatuses")
    @HttpCode(200)
    @ApiOperation({ summary: 'Получить все доступные статусы документов' })
    async getAllStatuses() {
        try {
            return await this.service.findAllStatuses();
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }

    @Get('findonestatus/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Найти конкретный статус по ID' })
    @ApiParam({ name: 'id', description: 'UUID статуса' })
    async findStatus(@Param('id') id: string) {
        try {
            return await this.service.findOneStatus(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }

    @Post("createstatus")
    @HttpCode(201)
    @ApiOperation({ summary: 'Создать новый статус' })
    async createNewStatus(@Body() doc_status: CreateStatusDto) {
        try {
            return await this.service.createNewStatus(doc_status);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось создать статус");
        }
    }

    @Delete("deletestatus/:id")
    @HttpCode(200)
    @ApiOperation({ summary: 'Удалить статус' })
    @ApiParam({ name: 'id', description: 'UUID статуса для удаления' })
    async deleteStatus(@Param('id') id: string) {
        try {
            return await this.service.deleteStatus(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось удалить статус");
        }
    }

    @Put("updatestatus/:id")
    @HttpCode(200)
    @ApiOperation({ summary: 'Обновить данные статуса' })
    async updateStatus(@Param('id') id: string, @Body() data_status: UpdateStatusDto) {
        try {
            return await this.service.updateStatus(data_status, id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось обновить статус");
        }
    }

    @Get("findalltypes")
    @HttpCode(200)
    @ApiOperation({ summary: 'Получить все типы документов' })
    async getAllTypes() {
        try {
            return await this.service.findAllTypes();
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }

    @Get('findonetype/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Найти тип документа по ID' })
    async findType(@Param('id') id: string) {
        try {
            return await this.service.findOneType(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }

    @Post("createtype")
    @HttpCode(201)
    @ApiOperation({ summary: 'Создать новый тип документа' })
    async createNewType(@Body() doc_type: CreateTypeDto) {
        try {
            return await this.service.createNewType(doc_type);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось создать тип");
        }
    }

    @Delete("deletetype/:id")
    @HttpCode(200)
    @ApiOperation({ summary: 'Удалить тип документа' })
    async deleteType(@Param('id') id: string) {
        try {
            return await this.service.deleteType(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось удалить тип");
        }
    }

    @Put("updatetype/:id")
    @HttpCode(200)
    @ApiOperation({ summary: 'Обновить описание типа документа' })
    async updateType(@Param('id') id: string, @Body() data_type: UpdateTypeDto) {
        try {
            return await this.service.updateType(data_type, id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось обновить тип");
        }
    }
}