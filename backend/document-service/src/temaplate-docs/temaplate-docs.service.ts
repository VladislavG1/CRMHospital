import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTempDocumentDto, updateTempDocumetnDto } from './dto/templdto';

@Injectable()
export class TemaplateDocsService {
    
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: Logger
    ) {}

    async findAll() {
        try {
            return await this.prisma.templateDocuments.findMany();
        } catch (error) {
            this.logger.error(error);
        }
    }
    async findOne(id: string) {
        try {
            return await this.prisma.templateDocuments.findUnique({ where: { id } });
        } catch (error) {
            this.logger.error(error);
        }
    }
    async create(createDocumentDto: CreateTempDocumentDto) {
        
        try {
            return await this.prisma.templateDocuments.create({ 
                data: createDocumentDto 
            });
        } catch (error) {
            this.logger.error(error);
        }
    }

    async update(updateDocumetnDto: updateTempDocumetnDto, id: string) {
        try {
            return await this.prisma.templateDocuments.update({ 
                where: { id: id },
                data: updateDocumetnDto
            });
        } catch (error) {
            this.logger.error(error);
        }
    }
    async delete(id: string) {
        try {
            return await this.prisma.templateDocuments.delete({ where: { id } });
        } catch (error) {
            this.logger.error(error);
        }
        
    }
    
    
}
