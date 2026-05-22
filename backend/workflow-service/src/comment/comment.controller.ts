import { Controller, Post, Get, Delete, Body, Param, Req, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('WorkFlow: Task Comments')
@Controller('workflow/comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post()
    @ApiOperation({ summary: 'Добавить комментарий к задаче' })
    @ApiResponse({ status: 201, description: 'Комментарий успешно добавлен' })
    @ApiResponse({ status: 404, description: 'Задача не найдена' })
    async create(@Body() dto: CreateCommentDto, @Req() req) {
        const userId = req.user.id;
        return await this.commentService.create(dto, userId);
    }

    @Get('task/:taskId')
    @ApiOperation({ summary: 'Получить все комментарии к задаче' })
    @ApiResponse({ status: 200, description: 'Список комментариев получен' })
    async findByTask(@Param('taskId', ParseUUIDPipe) taskId: string) {
        return await this.commentService.findByTaskId(taskId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Удалить свой комментарий' })
    @ApiResponse({ status: 24, description: 'Комментарий успешно удален' })
    @ApiResponse({ status: 403, description: 'Попытка удалить чужой комментарий' })
    async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
        const userId = req.user.id;
        return await this.commentService.remove(id, userId);
    }
}