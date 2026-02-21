import { Body, Controller, Get, Post, Patch, Query, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateUserDocumentSettingsDto } from './dto/update-user-document-settings.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Post()
  async create(@Body() dto: CreateEventDto) {
    dto.event_type = dto.event_type.toLowerCase();
    dto.service_name = dto.service_name.toLowerCase();
    dto.entity_type = dto.entity_type.toLowerCase();
    return await this.events.create(dto);
  }

  @Get('health')
  health() { return { ok: true }; }
}

@Controller('users/:userId/documents')
export class UserDocumentsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('settings')
  listSettings(@Param('userId') userId: string) {
    return this.eventsService.listUserDocSettings(userId);
  }

  @Patch(':documentId/settings')
  updateSettings(
    @Param('userId') userId: string,
    @Param('documentId') documentId: string,
    @Body() body: UpdateUserDocumentSettingsDto,
    @Query('maxPinned') maxPinned?: string,
  ) {
    return this.eventsService.upsertUserDocSettings(
      userId,
      documentId,
      body,
      maxPinned ? Number(maxPinned) : undefined,
    );
  }
}
