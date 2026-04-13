import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseUUIDPipe,
    HttpStatus,
    HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto } from './dto';

@ApiTags('WorkFlow: Task Management')
@Controller('workflow/tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Post()
    @ApiOperation({ summary: 'Создать новую задачу' })
    @ApiResponse({ status: 201, description: 'Задача успешно создана' })
    async create(@Body() dto: CreateTaskDto) {
        return await this.taskService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить список задач с фильтрацией' })
    @ApiQuery({ name: 'parent_id', required: false, description: 'Фильтр по родительской задаче (null для топ-уровня)' })
    @ApiQuery({ name: 'status_id', required: false, description: 'Фильтр по статусу' })
    async findAll(@Query('parent_id') parent_id?: string, @Query('status_id') status_id?: string) {
        return await this.taskService.findAll(parent_id, status_id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить детальную информацию о задаче' })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return await this.taskService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Обновить данные задачи (имя, описание)' })
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTaskDto) {
        return await this.taskService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Удалить задачу' })
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        return await this.taskService.remove(id);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Сменить статус задачи (с валидацией перехода)' })
    @ApiResponse({ status: 200, description: 'Статус обновлен' })
    @ApiResponse({ status: 400, description: 'Недопустимый переход статуса' })
    async updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTaskStatusDto) {
        return await this.taskService.updateStatus(id, dto.status_id);
    }

    @Get('meta/types')
    @ApiOperation({ summary: 'Получить все доступные типы задач' })
    async getTypes() {
        return await this.taskService.getTaskTypes();
    }

    @Get('meta/statuses')
    @ApiOperation({ summary: 'Получить все доступные статусы' })
    async getStatuses() {
        return await this.taskService.getTaskStatuses();
    }
}