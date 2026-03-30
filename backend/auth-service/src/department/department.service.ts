import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    private prisma: PrismaService
  ) { }

  async create(dto: CreateDepartmentDto) {
    const exists = await this.prisma.departments.findUnique({
      where: { department_name: dto.name }
    });
    if (exists) throw new ConflictException('Отделение с таким названием уже существует');

    return await this.prisma.departments.create({
      data: {
        department_name: dto.name,
        ...(dto.parent_id && {
          parent: { connect: { id: dto.parent_id } }
        }),
        ...(dto.access_attr_id && {
          access_attr: { connect: { id: dto.access_attr_id } }
        })
      },
      include: { parent: true, access_attr: true }
    });
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    if (dto.parent_id) {
      if (dto.parent_id === id) {
        throw new BadRequestException('Отделение не может быть родителем самому себе');
      }
      
      const descendants = await this.findAllSubordinates(id);
      const isDescendant = descendants.some(d => d.id === dto.parent_id);
      if (isDescendant) {
        throw new BadRequestException('Нельзя переместить отделение внутрь собственного подотдела');
      }
    }

    return await this.prisma.departments.update({
      where: { id },
      data: {
        department_name: dto.name,
        parent_id: dto.parent_id,
        access_attr_id: dto.access_attr_id
      },
      include: { parent: true, access_attr: true }
    });
  }

  async remove(id: string) {
    const dept = await this.prisma.departments.findUnique({
      where: { id },
      include: { children: true, users: true }
    });

    if (!dept) throw new NotFoundException('Отделение не найдено');
    if (dept.children.length > 0) {
      throw new BadRequestException('Нельзя удалить отделение, у которого есть подотделы');
    }
    if (dept.users.length > 0) {
      throw new BadRequestException('Нельзя удалить отделение, в котором числятся сотрудники');
    }

    return await this.prisma.departments.delete({ where: { id } });
  }

  async findOne(id: string) {
    const dept = await this.prisma.departments.findUnique({
      where: { id },
      include: {
        parent: true,
        access_attr: { include: { permissions: true } },
        _count: { select: { children: true, users: true } }
      }
    });
    if (!dept) throw new NotFoundException('Отделение не найдено');
    return dept;
  }

  async getTree() {
    const allDepts = await this.prisma.departments.findMany({
      include: {
        access_attr: true,
        _count: { select: { users: true } }
      }
    });

    return await this.buildTree(allDepts, null);
  }

  async findAllSubordinates(root_id: string): Promise<any[]> {
    return await this.prisma.$queryRaw`
      WITH RECURSIVE dept_tree AS (
        SELECT id, department_name, parent_id, 1 as level
        FROM departments 
        WHERE id = ${root_id}::uuid
        
        UNION ALL
        
        SELECT d.id, d.department_name, d.parent_id, dt.level + 1
        FROM departments d
        JOIN dept_tree dt ON d.parent_id = dt.id
      )
      SELECT * FROM dept_tree WHERE id != ${root_id}::uuid;
    `;
  }

  async getDepartmentStaff(dept_id: string, includeSubDepartments = false) {
    if (!includeSubDepartments) {
      return await this.prisma.users.findMany({
        where: { userDepartments: dept_id },
        select: { id: true, username: true, firstName: true, lastName: true, userPosts: true }
      });
    }

    const subDepts = await this.findAllSubordinates(dept_id);
    const dept_ids = [dept_id, ...subDepts.map(d => d.id)];

    return await this.prisma.users.findMany({
      where: { userDepartments: { in: dept_ids } },
      include: { userPosts: true }
    });
  }

  private buildTree(items: any[], parent_id: string | null) {
    return items
      .filter(item => item.parent_id === parent_id)
      .map(item => ({
        ...item,
        children: this.buildTree(items, item.id)
      }));
  }
}