import { Controller, Get, Post, Body, BadGatewayException, ParseUUIDPipe, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { CreateAttributeDto } from './dto/attribute.dto';
import { CreateEntityDto } from './dto/entity.dto';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/Decorator/roles.decorator';

@UseGuards(RolesGuard)
@Controller('permissions')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Roles('ADMIN')
    @Get('')
    async getAllPermissions() {
        try {
            return await this.permissionService.findAllPermissions();
        } catch (ex) {
            throw new BadGatewayException(`Ни одно разрешение не найдено. Ошибка: ${ex}`)
        }
    }

    @Roles('ADMIN')
    @Post('')
    async createPermission(@Body() dto: CreatePermissionDto) {
        try {
            return await this.permissionService.createPermission(dto);
        } catch (ex) {
            throw new BadGatewayException(`Не удалось добавить разрешение. Ошибка: ${ex}`)
        }
    }

    @Roles('ADMIN')
    @Get(':id')
    async getPermission(@Param('id', ParseUUIDPipe) id: string) {
        try {
            return await this.permissionService.findOnePermission(id);
        } catch (ex) {
            throw new BadGatewayException(`Разрешение ${id} не найдено. Ошибка: ${ex}`)
        }
    }

    @Roles('ADMIN')
    @Patch(':id')
    async updatePermission(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePermissionDto) {
        try {
            return await this.permissionService.updatePermission(id, dto);
        } catch (ex) {
            throw new BadGatewayException(`Не удалось обновить разрешение. Ошибка: ${ex}`)
        }
    }

    @Roles('ADMIN')
    @Delete(':id')
    async deletePermission(@Param('id', ParseUUIDPipe) id: string) {
        try {
            return await this.permissionService.deletePermission(id);
        } catch (ex) {
            throw new BadGatewayException(`Не удалось удалить разрешение. Ошибка: ${ex}`)
        }
    }


    @Roles('ADMIN')
    @Post('attributes')
    async createAttribute(@Body() dto: CreateAttributeDto) {
        try {
            return await this.permissionService.createAttribute(dto);
        } catch (ex) {
            throw new BadGatewayException(`Не удалось добавить атрибут. Ошибка: ${ex}`)
        }
    }

    @Roles('ADMIN')
    @Get('attributes')
    async getAllAttributes() {
        try {
            return await this.permissionService.findAllAttributes();
        } catch (ex) {
            throw new BadGatewayException(`Ни один атрибут не найден. Ошибка: ${ex}`)
        }
    }

    @Roles('ADMIN')
    @Patch('attributes/:id/link-permission/:permId')
    async linkPermissionToAttribute(@Param('id', ParseUUIDPipe) id: string, @Param('permId', ParseUUIDPipe) permId: string) {
        try {
            return await this.permissionService.linkPermissionToAttribute(id, permId);
        } catch (ex) {
            throw new BadGatewayException(`Не удалось привязать разрешение к атрибуту. Ошибка: ${ex}`)
        }
    }


    @Roles('ADMIN')
    @Post('roles')
    async createRole(@Body() dto: CreateEntityDto) {
        try {
            return this.permissionService.createRole(dto);
        } catch (ex) {
            throw new BadGatewayException(`Не удалось добавить роль. Ошибка: ${ex}`)
        }
    }

    @Roles('ADMIN')
    @Patch('roles/:id/bind-attribute/:attrId')
    async bindAttributeToRole(@Param('id', ParseUUIDPipe) id: string, @Param('attrId', ParseUUIDPipe) attrId: string) {
        try {
            return await this.permissionService.bindAttributeToEntity('role', id, attrId);
        } catch (ex) {
            throw new BadGatewayException(`Не удалось привязать атрибут к роли. Ошибка: ${ex}`)
        }
    }


    @Roles('ADMIN')
    @Post('posts')
    async createPost(@Body() dto: CreateEntityDto) {
        try {
            return await this.permissionService.createPost(dto);
        } catch (ex) {
            throw new BadGatewayException(`Не удалось добавить пост. Ошибка: ${ex}`)
        }
    }

    @Roles('ADMIN')
    @Patch('posts/:id/bind-attribute/:attrId')
    async bindAttributeToPost(@Param('id', ParseUUIDPipe) id: string, @Param('attrId', ParseUUIDPipe) attrId: string) {
        try {
            return await this.permissionService.bindAttributeToEntity('post', id, attrId);
        } catch (ex) {
            throw new BadGatewayException(`Не удалось привязать атрибут к посту. Ошибка: ${ex}`)
        }
    }


    @Roles('ADMIN')
    @Get('user/:userId/effective-rights')
    async getEffectiveRights(@Param('userId', ParseUUIDPipe) userId: string) {
        try {
            return await this.permissionService.calculateUserRights(userId);
        } catch (ex) {
            throw new BadGatewayException(`Не удалось получить суммарные права пользователя. Ошибка: ${ex}`)
        }
    }
}