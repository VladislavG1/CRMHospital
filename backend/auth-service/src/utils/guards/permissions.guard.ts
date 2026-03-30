import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../Decorator/permissions.decorator';
import { PermissionService } from 'src/permission/permission.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService
) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('Пользователь не авторизован');

    const userRights = await this.permissionService.getEffectiveRights(user.id);

    const hasPermission = requiredPermissions.every(
      (permission) => userRights.effectivePermissions[permission] === true
    );

    if (!hasPermission) {
      throw new ForbiddenException('У вас недостаточно прав для этого действия');
    }

    return true;
  }
}