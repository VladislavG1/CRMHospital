import { Controller, Request, Post, Get, Body, HttpCode, HttpStatus, BadGatewayException, Param, Patch, UseGuards, ParseUUIDPipe, UseInterceptors, ClassSerializerInterceptor, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update_user.dto';
import { UpdateProfileDto } from './dto/update_profile.dto';
import { JwtAuthGuard } from 'src/jwt/guards/jwt-auth.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/Decorator/roles.decorator';
import { FindUsersDto } from './dto/find_users.dto';
import { UserEntity } from './entities/user.entity';

@ApiTags('Identity: User')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Roles('ADMIN')
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('')
    @ApiOperation({ summary: 'Поиск пользователей по фильтрам (Админ)' })
    @ApiResponse({ status: 200, type: [UserEntity], description: 'Список пользователей' })
    async findAll(@Query() dto: FindUsersDto) {
        try {
            const users = await this.userService.findAll(dto);
            return users.map((user) => new UserEntity(user));
        } catch (ex) {
            throw new BadGatewayException(`Ни один пользователь не найден. Ошибка: ${ex}`)
        }
    }

    @Roles('ADMIN')
    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    @ApiOperation({ summary: 'Получить пользователя по ID (Админ)' })
    @ApiParam({ name: 'id', description: 'UUID пользователя' })
    @ApiResponse({ status: 200, type: UserEntity })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        try {
            return new UserEntity(await this.userService.findOne(id));
        } catch (ex) {
            throw new BadGatewayException(`Пользователь не найден. Ошибка: ${ex}`)
        }
    }

    @Roles('ADMIN')
    @UseInterceptors(ClassSerializerInterceptor)
    @Patch(':id')
    @ApiOperation({ summary: 'Полное обновление данных пользователя (Админ)' })
    @ApiResponse({ status: 200, type: UserEntity })
    async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
        try {
            return new UserEntity(await this.userService.update(id, dto));
        } catch (ex) {
            throw new BadGatewayException(`Не удалось обновить пользователя. Ошибка: ${ex}`)
        }
    }

    @Roles('ADMIN')
    @UseInterceptors(ClassSerializerInterceptor)
    @Patch(':id/status')
    @ApiOperation({ summary: 'Активация/Деактивация пользователя (Админ)' })
    @ApiResponse({ status: 200, description: 'Статус изменен' })
    async toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
        try {
            return new UserEntity(await this.userService.toggleStatus(id));
        } catch (ex) {
            throw new BadGatewayException(`Не удалось переключить статус пользователя. Ошибка: ${ex}`)
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('me/profile')
    @ApiOperation({ summary: 'Получить данные своего профиля' })
    @ApiResponse({ status: 200, type: UserEntity })
    async getMyProfile(@Request() req) {
        try {
            return new UserEntity(await this.userService.findOne(req.user.id));
        } catch (ex) {
            throw new BadGatewayException(`Пользователь не найден. Ошибка: ${ex}`)
        }
    }
    
    @UseInterceptors(ClassSerializerInterceptor)
    @Patch('me/profile')
    @ApiOperation({ summary: 'Обновить данные своего профиля' })
    @ApiResponse({ status: 200, type: UserEntity })
    async updateMyProfile(@Request() req, @Body() dto: UpdateProfileDto) {
        try {
            return new UserEntity(await this.userService.update(req.user.id, dto));
        } catch (ex) {
            throw new BadGatewayException(`Не удалось обновить пользователя. Ошибка: ${ex}`)
        }
    }
}