import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDocumentDto } from './dto/create.dto';
import { UpdateDocumentDto } from './dto/update.dto';
import { FileStorageGatewayService } from 'src/file-storage-gateway/file-storage-gateway.service';

@Injectable()
export class DocumentsService {
    
    constructor(
        private prisma: PrismaService,
        private readonly file_storage: FileStorageGatewayService,
        private readonly logger: Logger
    ) { }

    async create(createDocumentDto: CreateDocumentDto, file: Express.Multer.File) {
        try {
            const file_storage = await this.file_storage.uploadFile(file);

            this.logger.log(`file_storage ${file_storage.id}`);

            const document = await this.prisma.documents.create({
                data: {
                    name: createDocumentDto.name,
                    description: createDocumentDto.description,
                    creatorId: createDocumentDto.creatorId,
                    templateId: createDocumentDto.templateId,
                    typeId: createDocumentDto.typeId,
                    statusId: createDocumentDto.statusId,

                    fileId: file_storage.id
                }
            }); 

            this.logger.log(`document ${document}`);

            return document;
        } catch (error) {
            this.logger.error(error);
            throw new NotFoundException("Не удалось создать документ");
        }   
    }
    async update(updateDocumentDto: UpdateDocumentDto, file: Express.Multer.File, id: string) {
        try {
            const file_storage = await this.file_storage.uploadFile(file);
            const document = await this.prisma.documents.update({
                where: {id: id},
                data: {
                    name: updateDocumentDto.name,
                    description: updateDocumentDto.description,
                    creatorId: updateDocumentDto.creatorId,
                    templateId: updateDocumentDto.templateId,
                    typeId: updateDocumentDto.typeId,
                    statusId: updateDocumentDto.statusId,
                    fileId: file_storage.id
                }
            })
            return document;

        } catch (error) {
            this.logger.error(error);
            throw new NotFoundException("Не удалось обновить документ");
        }
    }
    async delete(id: string) {
        try {
            const document = await this.prisma.documents.delete({where: {id: id}}); 
            return document;
        } catch (error) {
            this.logger.error(error);
            throw new NotFoundException("Не удалось удалить документ");
        }
    }
    
}
