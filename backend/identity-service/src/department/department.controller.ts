import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseUUIDPipe, 
  Query, 
  ParseBoolPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery 
} from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';

@ApiTags('Identity: Department Management')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новое отделение/департамент' })
  @ApiResponse({ status: 201, description: 'Отделение успешно создано.' })
  @ApiResponse({ status: 409, description: 'Отделение с таким названием уже существует.' })
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return await this.departmentService.create(createDepartmentDto);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Получить полную древовидную структуру клиники' })
  @ApiResponse({ status: 200, description: 'Возвращает иерархический JSON всех отделений.' })
  async getTree() {
    return await this.departmentService.getTree();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить детальную информацию о конкретном отделении' })
  @ApiParam({ name: 'id', description: 'UUID отделения' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.departmentService.findOne(id);
  }

  @Get(':id/subordinates')
  @ApiOperation({ summary: 'Получить плоский список всех дочерних подразделений (рекурсивно)' })
  @ApiParam({ name: 'id', description: 'UUID родительского отделения' })
  async getSubordinates(@Param('id', ParseUUIDPipe) id: string) {
    return await this.departmentService.findAllSubordinates(id);
  }

  @Get(':id/staff')
  @ApiOperation({ summary: 'Получить список сотрудников отделения' })
  @ApiQuery({ 
    name: 'includeSubDepts', 
    required: false, 
    type: Boolean, 
    description: 'Включать ли сотрудников из всех дочерних подразделений' 
  })
  async getStaff(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeSubDepts', new ParseBoolPipe({ optional: true })) includeSubDepts: boolean = false,
  ) {
    return await this.departmentService.getDepartmentStaff(id, includeSubDepts);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные отделения' })
  @ApiParam({ name: 'id', description: 'UUID отделения' })
  @ApiResponse({ status: 200, description: 'Данные обновлены.' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации или циклическая зависимость в иерархии.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateDepartmentDto: UpdateDepartmentDto
  ) {
    return await this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить отделение' })
  @ApiResponse({ status: 204, description: 'Отделение успешно удалено.' })
  @ApiResponse({ status: 400, description: 'Нельзя удалить: есть сотрудники или подотделы.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.departmentService.remove(id);
  }
}