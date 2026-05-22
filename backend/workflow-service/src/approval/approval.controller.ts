import { Controller, Post, Param, ParseUUIDPipe, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApprovalService } from './approval.service';

@ApiTags('WorkFlow: Task Approval')
@Controller('workflow/approval')
export class ApprovalController {
    constructor(private readonly approvalService: ApprovalService) {}

    @Post(':id/submit')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Отправить задачу на согласование (доступно исполнителю)' })
    @ApiResponse({ status: 200, description: 'Задача успешно переведена в статус ON_APPROVAL' })
    @ApiResponse({ status: 400, description: 'Недопустимый переход статуса или пользователь не является исполнителем' })
    @ApiResponse({ status: 404, description: 'Задача не найдена' })
    async submit(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
        const userId = req.user.id;
        return await this.approvalService.submitForApproval(id, userId);
    }

    @Post(':id/approve')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Утвердить задачу (перевод в статус COMPLETED)' })
    @ApiResponse({ status: 200, description: 'Задача успешно утверждена и завершена' })
    @ApiResponse({ status: 400, description: 'Задача находится не на этапе согласования' })
    async approve(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
        return await this.approvalService.approve(id, req.user.id);
    }

    @Post(':id/reject')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Отклонить задачу и вернуть на доработку (перевод в статус REJECTED)' })
    @ApiResponse({ status: 200, description: 'Задача отклонена и возвращена исполнителю' })
    @ApiResponse({ status: 400, description: 'Задача находится не на этапе согласования' })
    async reject(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
        return await this.approvalService.reject(id, req.user.id);
    }
}