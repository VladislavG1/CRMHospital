import { Injectable, Logger } from '@nestjs/common';
import { ComplitedDocumentsDTO, ComplitedDocumentsUpdateDTO } from './dto/create.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CompletedDocumentsService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: Logger
    ) { }


    async findOne(id: string) {
        try {
            return await this.prisma.filledTemplateDocuments.findUnique({ where: { id } });
        } catch (error) {
            this.logger.error(error);
        }
    }
    async findAll() {
        try {
            return await this.prisma.filledTemplateDocuments.findMany();
        } catch (error) {
            this.logger.error(error);
        }
    }

    async create(document: ComplitedDocumentsDTO) {
        try {
            return await this.prisma.filledTemplateDocuments.create({ data: document });
        } catch (error) {
            this.logger.error(error);
        }
    }
    
    async update(document: ComplitedDocumentsUpdateDTO, id: string) {
        try {
            return await this.prisma.filledTemplateDocuments.update({ where: { id }, data: document });
        } catch (error) {
            this.logger.error(error);
        }
    }

    async delete(id: string) {
        try {
            return await this.prisma.filledTemplateDocuments.delete({ where: { id } });
        } catch (error) {
            this.logger.error(error);
        }
    }
    
    
    async DownloadDocs(id: string) {
        try {
            // логика создания из json в файл 
            return []
        } catch (error) {
            this.logger.error(error);
        }
        
    }
}
