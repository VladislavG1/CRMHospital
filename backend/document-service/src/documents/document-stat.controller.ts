import { BadGatewayException, Body, Controller, Delete, Get, HttpCode, Logger, Param, Post, Put } from "@nestjs/common";

import { DocumentStatService } from "./document-stat.service";
import { get } from "http";
import { createStatusDto } from "./dto/create.dto";

@Controller('document-stat')
export class DocumentStatController {
    constructor(
        private readonly service: DocumentStatService,
        private readonly logger: Logger
    ) {}
    
    @Get("findAllstatus")
    @HttpCode(201)
    async getallstatus() {
        try {
            return await this.service.findAllstatus();
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }
    @Get("findAlltype")
    @HttpCode(201)
    async getalltypes() {
        try {
            return await this.service.findAlltypes();
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }

    @Get('findonestatus/:id')
    @HttpCode(201)
    async findstatus(@Param('id') id: string) {
        try {
            return await this.service.findonestatus(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }
    @Get('findonetype/:id')
    @HttpCode(201)
    async findtype(@Param('id') id: string) {
        try {
            return await this.service.findonetype(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось получить данные");
        }
    }

    @Post("createstatus")
    @HttpCode(201)
    async createnewstatus(@Body() dock_status: createStatusDto) {
        try {
            return await this.service.createnewstatus(dock_status);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось создать статус");
        }
    }
    @Post("createtype")
    @HttpCode(201)
    async createnewtype(@Body() dokc_tyepe: createStatusDto) {
        try {
            return await this.service.createnewtype(dokc_tyepe);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось создать тип");
        }
    }

    @Delete("deletestatus")
    @HttpCode(201)
    async deletestatus(@Param('id') id: string) {
        try {
            return await this.service.deletestatus(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось удалить статус");
        }

    }
    @Delete("deletetype")
    @HttpCode(201)
    async deletetype(@Param('id') id: string) {
        try {
            return await this.service.deletetype(id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось удалить тип");
        }

    }

    @Put("updatestatus")
    @HttpCode(201)
    async updatestatus(@Param('id') id: string, @Body() data_status: createStatusDto) {
        try {
            return await this.service.updatestatus(data_status, id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось обновить статус");
        }

    }

    @Put("updatetype")
    @HttpCode(201)
    async updatetype(@Param('id') id: string, @Body() data_type: createStatusDto) {
        try {
            return await this.service.updatetype(data_type, id);
        } catch (error) {
            this.logger.error(error);
            throw new BadGatewayException("Не удалось обновить тип");
        }

    }
}