import { Body, Controller, Get, Post, Patch, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateUserDocumentSettingsDto } from './dto/update-user-document-settings.dto';

@ApiTags('EventLog: Audit')
@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) { }

  @Post()
  @ApiOperation({ summary: 'Регистрация нового системного события' })
  @ApiResponse({ status: 201, description: 'Событие успешно сохранено' })
  async create(@Body() dto: CreateEventDto) {
    dto.event_type = dto.event_type.toLowerCase();
    dto.service_name = dto.service_name.toLowerCase();
    dto.entity_type = dto.entity_type.toLowerCase();
    return await this.events.create(dto);
  }

  @Get('health')
  @ApiOperation({ summary: 'Проверка работоспособности сервиса логов' })
  health() { return { ok: true }; }
}

@ApiTags('User Document Settings')
@Controller('users/:userId/documents')
export class UserDocumentsController {
  constructor(private readonly eventsService: EventsService) { }

  @Get('settings')
  @ApiOperation({ summary: 'Получить все настройки документов для конкретного пользователя' })
  @ApiParam({ name: 'userId', description: 'UUID пользователя' })
  listSettings(@Param('userId') userId: string) {
    return this.eventsService.listUserDocSettings(userId);
  }

  @Patch(':documentId/settings')
  @ApiOperation({ summary: 'Обновить или создать настройки для конкретного документа' })
  @ApiParam({ name: 'userId', description: 'UUID пользователя' })
  @ApiParam({ name: 'documentId', description: 'UUID документа' })
  @ApiQuery({ name: 'maxPinned', required: false, description: 'Лимит на количество закрепленных документов' })
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