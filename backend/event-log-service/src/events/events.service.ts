import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateUserDocumentSettingsDto } from './dto/update-user-document-settings.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto) {
    return await this.prisma.eventsLog.create({ data: dto });
  }

  async listUserDocSettings(userId: string) {
    return this.prisma.userDocumentPreference.findMany({
      where: { userId },
      orderBy: [{ pinned: 'desc' }, { pinnedOrder: 'asc' }, { updated_at: 'desc' }],
    });
  }

  async upsertUserDocSettings(
    userId: string,
    documentId: string,
    dto: UpdateUserDocumentSettingsDto,
    maxPinned = 5,
  ) {
    if (dto.pinned === true) {
      const pinnedCount = await this.prisma.userDocumentPreference.count({
        where: { userId, pinned: true, documentId: { not: documentId } },
      });
      if (pinnedCount >= maxPinned) {
        throw new BadRequestException(`Pinned documents limit exceeded (${maxPinned})`);
      }
    }

    const data = {
      hidden: dto.hidden,
      pinned: dto.pinned,
      pinnedOrder: dto.pinned === false ? null : dto.pinnedOrder ?? null,
    };

    return this.prisma.userDocumentPreference.upsert({
      where: { userId_documentId: { userId, documentId } },
      update: data,
      create: { userId, documentId, ...data },
    });
  }
}
