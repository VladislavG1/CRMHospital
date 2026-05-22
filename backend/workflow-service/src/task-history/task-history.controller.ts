import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TaskHistoryService } from './task-history.service';

@ApiTags('WorkFlow: Task History')
@Controller('workflow/history')
export class TaskHistoryController {
    constructor(private readonly historyService: TaskHistoryService) { }

    @Get('task/:taskId')
    @ApiOperation({ summary: 'Получить историю изменений по задаче' })
    @ApiResponse({ status: 200, description: 'История успешно получена' })
    @ApiResponse({ status: 404, description: 'Задача не найдена' })
    async getHistory(@Param('taskId', ParseUUIDPipe) taskId: string) {
        return await this.historyService.findByTaskId(taskId);
    }
}