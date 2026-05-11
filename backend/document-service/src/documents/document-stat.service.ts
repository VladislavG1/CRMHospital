import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateStatusDto, CreateTypeDto, UpdateStatusDto, UpdateTypeDto } from "./dto/create.dto";


@Injectable()
export class DocumentStatService {
    

    constructor (
        private readonly prisma: PrismaService,
        private readonly logger: Logger
    ) {}
    async findAllStatuses() {
        try {
            return await this.prisma.documentStatus.findMany();
        } catch (error) {
            this.logger.error(error);
        }
    }
    async findAllTypes() {
        try {
            return await this.prisma.documentsTypes.findMany();
        } catch (error) {
            this.logger.error(error);
        }
    }
    async findOneStatus(id: string) {
        try {
            return await this.prisma.documentStatus.findUnique({ where: { id } });
        } catch (error) {
            this.logger.error(error);
        }
    }
    async findOneType(id: string) {
        try {
            return await this.prisma.documentsTypes.findUnique({ where: { id } });
        } catch (error) {
            this.logger.error(error);
        }
    }
    async createNewStatus(doc_status: CreateStatusDto) {
        try {
            return await this.prisma.documentStatus.create({ data: doc_status});
        } catch (error) {
            this.logger.error(error);
        }
    }
    async createNewType(doc_type: CreateTypeDto) {
        try {
            return await this.prisma.documentsTypes.create({ data: doc_type});
        } catch (error) {
            this.logger.error(error);
        }
    }
    async deleteStatus(id: string) {
        try {
            return await this.prisma.documentStatus.delete({ where: { id } });
        } catch (error) {
            this.logger.error(error);
        }
        
    }
    async deleteType(id: string) {
        try {
            return await this.prisma.documentsTypes.delete({ where: { id } });
        } catch (error) {
            this.logger.error(error);
        }
    }
    async updateStatus(data_status: UpdateStatusDto, id: string) {
        try {
            return await this.prisma.documentStatus.update({ 
                where: { id: id },
                data: data_status
            });
        } catch (error) {
            this.logger.error(error);
        }
    }
    async updateType(data_type: UpdateTypeDto, id: string) {
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