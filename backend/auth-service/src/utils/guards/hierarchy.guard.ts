import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { DepartmentService } from 'src/department/department.service';

@Injectable()
export class HierarchyGuard implements CanActivate {
  constructor(private departmentService: DepartmentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    const targetDeptId = request.params.deptId || request.body.deptId;

    if (!user.deptId || !targetDeptId) return false;

    if (user.deptId === targetDeptId) return true;

    const subordinates = await this.departmentService.findAllSubordinates(user.deptId);
    const hasAccess = subordinates.some(dept => dept.id === targetDeptId);

    if (!hasAccess) {
      throw new ForbiddenException('Вы не имеете доступа к данным этого подразделения');
    }

    return true;
  }
}