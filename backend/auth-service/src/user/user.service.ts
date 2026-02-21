import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { FindUsersDto } from './dto/find_users.dto';
import { UpdateProfileDto } from './dto/update_profile.dto';
import Redis from 'ioredis';
import { UpdateUserDto } from './dto/update_user.dto';


@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        @Inject('REDIS_CLIENT') private readonly redis: Redis
    ) { }

    async findOne(id: string) {
        try {
            const user = await this.prisma.mainUser.findUnique({
                where: { id: id },
                include: {
                    userRoles: true,
                    userPosts: true,
                    userDepartments: true,
                },
            })
            return user;
        } catch (ex) {
            throw new NotFoundException(`Пользователя не существует. Ошибка: ${ex}`)
        }
    }

    async findAll(findUsersDto: FindUsersDto) {
        try {
            const users = await this.prisma.mainUser.findMany({
                where: {
                    username: findUsersDto.username,
                    email: findUsersDto.email,
                    firstName: findUsersDto.firstName,
                    lastName: findUsersDto.lastName,
                    phone_number: findUsersDto.phone_number,
                    birth_date: findUsersDto.birth_date,
                    is_active: findUsersDto.is_active,
                    sex: findUsersDto.sex,

                    userRoles: {
                        role_name: findUsersDto.role_name
                    },
                    userPosts: {
                        post_name: findUsersDto.post_name
                    },
                    userDepartments: {
                        department_name: findUsersDto.department_name
                    }
                },
                include: {
                    userRoles: true,
                    userPosts: true,
                    userDepartments: true
                }
            });
            return users;
        } catch (ex) {
            throw new NotFoundException(`Ни один пользователь не найден. Ошибка: ${ex}`)
        }
    }

    async update(id: string, dto: UpdateUserDto) {
        try {
            const user = await this.prisma.mainUser.update({
                where: { id: id },
                data: {
                    ...dto
                }
            });

            if (dto.role_id) {
                await this.redis.set(`blacklist:${id}`, Date.now().toString(), 'EX', 900);
            }

            return user;
        } catch (ex) {
            if (ex instanceof Prisma.PrismaClientKnownRequestError) {
                if (ex.code === 'P2002') {
                    throw new ConflictException('Пользователь с такими данными (Email, Username или Телефон) уже существует');
                }
            } else {
                throw new NotFoundException(`Не удалось обновить пользователя. Ошибка: ${ex}`)
            }
        }
    }

    async toggleStatus(id: string) {
        try {
            return this.prisma.$transaction(async (prisma) => {
                const user = await prisma.mainUser.findUnique({
                    where: { id: id }
                });

                return prisma.mainUser.update({
                    where: { id: id },
                    data: {
                        is_active: !user.is_active
                    }
                });
            });

        } catch (ex) {
            throw new NotFoundException(`Не удалось переключить статус пользователя. Ошибка: ${ex}`)
        }
    }
}