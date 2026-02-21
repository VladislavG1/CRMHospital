import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { createStatusDto, createTypeDto, updateStatusDto, updateTypeDto } from "./dto/create.dto";


@Injectable()
export class DocumentStatService {
    

    constructor (
        private readonly prisma: PrismaService,
        private readonly logger: Logger
    ) {}
    async findAllstatus() {
        try {
            return await this.prisma.documentStatus.findMany();
        } catch (error) {
            this.logger.error(error);
        }
    }
    async findAlltypes() {
        try {
            return await this.prisma.documentsTypes.findMany();
        } catch (error) {
            this.logger.error(error);
        }
    }
    async findonestatus(id: string) {
        try {
            return await this.prisma.documentStatus.findUnique({ where: { id } });
        } catch (error) {
            this.logger.error(error);
        }
    }
    async findonetype(id: string) {
        try {
            return await this.prisma.documentsTypes.findUnique({ where: { id } });
        } catch (error) {
            this.logger.error(error);
        }
    }
    async createnewstatus(dock_status: createStatusDto) {
        try {
            return await this.prisma.documentStatus.create({ data: dock_status});
        } catch (error) {
            this.logger.error(error);
        }
    }
    async createnewtype(dokc_tyepe: createTypeDto) {
        try {
            return await this.prisma.documentsTypes.create({ data: dokc_tyepe});
        } catch (error) {
            this.logger.error(error);
        }
    }
    async deletestatus(id: string) {
        try {
            return await this.prisma.documentStatus.delete({ where: { id } });
        } catch (error) {
            this.logger.error(error);
        }
        
    }
    async deletetype(id: string) {
        try {
            return await this.prisma.documentsTypes.delete({ where: { id } });
        } catch (error) {
            this.logger.error(error);
        }
    }
    async updatestatus(data_status: updateStatusDto, id: string) {
        try {
            return await this.prisma.documentStatus.update({ 
                where: { id: id },
                data: data_status
            });
        } catch (error) {
            this.logger.error(error);
        }
    }
    async updatetype(data_type : updateTypeDto, id: string) {
        try {
            return await this.prisma.documentsTypes.update({ 
                where: { id: id },
                data: data_type
            });
        } catch (error) {
            this.logger.error(error);
        }
    }

}