import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateAttributeDto, UpdateAttributeDto } from "./dto/attribute.dto";
import { CreateEntityDto, UpdateEntityDto } from "./dto/entity.dto";
import { CreatePermissionDto, UpdatePermissionDto } from "./dto/permission.dto";
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PermissionService {
    constructor(
        private prisma: PrismaService
    ) { }

    async findAllPermissions() {
        try {
            const permissions = await this.prisma.permissions.findMany();
            return permissions;
        } catch (ex) {
            throw new NotFoundException(`Ни одно разрешение не найдено. Ошибка: ${ex}`)
        }
    }

    async findOnePermission(id: string) {
        try {
            const permission = await this.prisma.permissions.findUnique({
                where: { id }
            });
            return permission;
        } catch (ex) {
            throw new NotFoundException(`Разрешение не найдено. Ошибка: ${ex}`)
        }
    }

    async createPermission(dto: CreatePermissionDto) {
        try {
            const permission = await this.prisma.permissions.create({
                data: { dto }
            });
            return permission;
        } catch (ex) {
            throw new ConflictException(`Не удалось добавить разрешение. Ошибка: ${ex}`)
        }
    }

    async updatePermission(id: string, dto: UpdatePermissionDto) {
        try {
            const permission = await this.prisma.permissions.update({ 
                where: { id },
                data: { dto }
            });
            return permission;
        } catch (ex) {
            throw new ConflictException(`Не удалось обновить разрешение. Ошибка: ${ex}`)
        }
    }

    async deletePermission(id: string) {
        try {
            const permission = await this.prisma.permissions.delete({ 
                where: { id }
            });
            return permission;
        } catch (ex) {
            throw new ConflictException(`Не удалось удалить разрешение. Ошибка: ${ex}`)
        }
    }


    async findAllAttributes() {
        try {
            const attributes = await this.prisma.attributes_Access.findMany({
                include: {
                    permissions: true
                }
            });
            return attributes;
        } catch (ex) {
            throw new NotFoundException(`Ни один атрибут не найден. Ошибка: ${ex}`)
        }
    }

    async createAttribute(dto: CreateAttributeDto) {
        try {
            const attribute = await this.prisma.attributes_Access.create({
                data: {
                    attr_name: dto.attr_name,
                    description: dto.description,
                    ...(dto.permission_id && { permissions: { connect: { id: dto.permission_id } } })
                }
            });
            return attribute;
        } catch (ex) {
            throw new ConflictException(`Не удалось добавить атрибут. Ошибка: ${ex}`)
        }
    }

    async linkPermissionToAttribute(attrId: string, permId: string) {
        try {
            const attribute = await this.prisma.attributes_Access.update({
                where: { id: attrId },
                data: {
                    permissions: {
                        connect: { id: permId }
                    }
                }
            });
            return attribute;
        } catch (ex) {
            throw new ConflictException(`Не удалось привязать разрешение к атрибуту. Ошибка: ${ex}`)
        }
    }

    async bindAttributeToEntity(type: 'role' | 'post' | 'dept', entityId: string, attrId: string) {
        try {
            const updateData = {
                access_attr: {
                    connect: { id: attrId }
                }
            };
            if (type === 'role')
                return await this.prisma.roles.update({
                    where: { id: entityId },
                    data: updateData
            });
            if (type === 'post')
                return await this.prisma.userPost.update({
                    where: { id: entityId },
                    data: updateData
            });
            if (type === 'dept')
                return await this.prisma.departments.update({
                    where: { id: entityId },
                    data: updateData
            });
        } catch (ex) {
            throw new ConflictException(`Не удалось привязать атрибут. Ошибка: ${ex}`)
        }
    }

    async createRole(dto: CreateEntityDto) {
        try {
            const role = await this.prisma.roles.create({
                data: {
                    role_name: dto.name, ...(dto.access_attr_id && {
                        access_attr: {
                            connect: { id: dto.access_attr_id }
                        }
                    })
                }
            });
            return role;
        } catch (ex) {
            throw new ConflictException(`Не удалось добавить роль. Ошибка: ${ex}`)
        }
    }

    async createPost(dto: CreateEntityDto) {
        try {
            const role = await this.prisma.userPost.create({
                data: {
                    post_name: dto.name, ...(dto.access_attr_id && {
                        access_attr: {
                            connect: { id: dto.access_attr_id }
                        }
                    })
                }
            });
            return role;
        } catch (ex) {
            throw new ConflictException(`Не удалось добавить пост. Ошибка: ${ex}`)
        }
    }

    async calculateUserRights(userId: string) {
        try {
            const user = await this.prisma.mainUser.findUnique({
                where: { id: userId },
                include: {
                    userRoles: {
                        include: {
                            access_attr: {
                                include: { permissions: true }
                            }
                        }
                    },
                    userPosts: {
                        include: {
                            access_attr: {
                                include: { permissions: true }
                            }
                        }
                    },
                    userDepartments: {
                        include: {
                            access_attr: {
                                include: { permissions: true }
                            }
                        }
                    }
                }
            });

            const sources = [
                user.userRoles?.access_attr?.permissions,
                user.userPosts?.access_attr?.permissions,
                user.userDepartments?.access_attr?.permissions
            ].filter(Boolean);

            const result = {
                can_view_a: false,
                can_view_b: false,
                can_view_c: false,
                other_perm: {} as Record<string, any>
            };

            sources.forEach(p => {
                if (p.can_view_a) result.can_view_a = true;
                if (p.can_view_b) result.can_view_b = true;
                if (p.can_view_c) result.can_view_c = true;
                if (p.other_perm) result.other_perm = { ...result.other_perm, ...(p.other_perm as object) };
            });

            return result;
        } catch (ex) {
            throw new NotFoundException(`Пользователь не найден. Ошибка: ${ex}`)
        }
    }

    // TO-DO
    // Role: update, delete
    // Post: update, delete
}