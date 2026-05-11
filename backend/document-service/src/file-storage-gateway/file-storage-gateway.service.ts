import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';


import { createReadStream, existsSync } from 'fs';
import { extname, join } from 'path';
import { promises as fs} from 'fs'


@Injectable()
export class FileStorageGatewayService {
    constructor(
        private readonly logger: Logger,
        private readonly prisma: PrismaService  
    ) {}


    async getAllFiles(): Promise<any> {
        try {
            return await this.prisma.fileStorageDocs.findMany({
                select: {
                    id: true,
                    originalName: true,
                    mimeType: true
                }
            });
        } catch (e) {
            this.logger.error(e);
            throw new NotFoundException('File not found');
        }
    }
    
    async getFile(id: string): Promise<{stream: NodeJS.ReadableStream, metadata: any}> {
        try {
            this.logger.log(id);
            const file = await this.prisma.fileStorageDocs.findUnique({
                where: {
                    id: id
                }
            })

            if (!file) {
                throw new Error('File not found');  
            }
            const filename = `${id}${extname(file.originalName) || '.bin'}`;
            const filePath = join('/app/storage', filename);

            if (!existsSync(filePath)) {
                throw new NotFoundException('File not found on storage');
            }

            return {
                stream : createReadStream(filePath),
                metadata: file
            }

        } catch (e) {
            this.logger.error(e);
            throw new NotFoundException('File not found');
        }                
    }

    async uploadFile(file: Express.Multer.File): Promise<{id: string}> {
        try { 
            const files = await this.prisma.fileStorageDocs.create({
                data: {

                    originalName: file.originalname,
                    storageName: 'storage',
                    mimeType: file.mimetype,
                    size: file.size
                    
                },
                select: {
                    id: true
                }
            });

            const ext = extname(file.originalname) || '.bin';
            const filename = `${files.id}${ext}`;
            const storagePath = join('/app/storage', filename);
            await fs.writeFile(storagePath, file.buffer);

            return files
           
        } catch (e) {
            this.logger.error(e);
        }
    }
}
