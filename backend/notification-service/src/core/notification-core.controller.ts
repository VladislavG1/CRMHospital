import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationCoreService } from './notification-core.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@ApiTags('Notification: Core Queue')
@Controller('notification-core')
export class NotificationCoreController {
    constructor(private readonly coreService: NotificationCoreService) { }

    @Post('dispatch')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Сформировать и отправить уведомление по доступным каналам' })
    @ApiResponse({ status: 200, description: 'Уведомление успешно обработано транспортом' })
    @ApiResponse({ status: 404, description: 'Указанный тип уведомления не найден' })
    async dispatchNotification(@Body() dto: CreateNotificationDto) {
        return await this.coreService.sendNotification(dto);
    }

    @Get('logs')
    @ApiOperation({ summary: 'Получить полную историю отправленных системой уведомлений' })
    @ApiResponse({ status: 200, description: 'Логи успешно получены' })
    async getLogs() {
        return await this.coreService.getHistory();
    }
}