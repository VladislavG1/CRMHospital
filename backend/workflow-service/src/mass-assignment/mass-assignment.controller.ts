import { Controller, Post, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MassAssignmentService } from './mass-assignment.service';
import { MassAssignDto } from './dto/mass-assign.dto';

@ApiTags('WorkFlow: Mass Assignment')
@Controller('workflow/mass-assign')
export class MassAssignmentController {
    constructor(private readonly massService: MassAssignmentService) { }

    @Post()
    @ApiOperation({ summary: 'Массовая постановка задачи на список исполнителей' })
    async createMassTask(@Body() dto: MassAssignDto, @Req() req) {
        const creatorId = req.user.id;
        return await this.massService.createMassTask(dto, creatorId);
    }
}