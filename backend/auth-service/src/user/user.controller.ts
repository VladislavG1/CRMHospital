import { Controller, Request, Post, Get, Body, HttpCode, HttpStatus, BadGatewayException, Param, Patch, UseGuards, ParseUUIDPipe, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update_user.dto';
import { UpdateProfileDto } from './dto/update_profile.dto';
import { JwtAuthGuard } from 'src/jwt/guards/jwt-auth.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/Decorator/roles.decorator';
import { FindUsersDto } from './dto/find_users.dto';
import { UserEntity } from './entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Roles('ADMIN')
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('')
    async findAll(@Body() dto: FindUsersDto) {
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
    async toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
        try {
            return new UserEntity(await this.userService.toggleStatus(id));
        } catch (ex) {
            throw new BadGatewayException(`Не удалось переключить статус пользователя. Ошибка: ${ex}`)
        }
    }
    
    
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('me/profile')
    async getMyProfile(@Request() req) {
        try {
            return new UserEntity(await this.userService.findOne(req.user.id));
        } catch (ex) {
            throw new BadGatewayException(`Пользователь не найден. Ошибка: ${ex}`)
        }
    }
    
    @UseInterceptors(ClassSerializerInterceptor)
    @Patch('me/profile')
    async updateMyProfile(@Request() req, @Body() dto: UpdateProfileDto) {
        try {
            return new UserEntity(await this.userService.update(req.user.id, dto));
        } catch (ex) {
            throw new BadGatewayException(`Не удалось обновить пользователя. Ошибка: ${ex}`)
        }
    }
}