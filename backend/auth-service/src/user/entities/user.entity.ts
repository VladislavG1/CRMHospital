import { Exclude } from 'class-transformer';
import { Sex } from '@prisma/client';


export class UserEntity {
  id: string;
  username: string;
  email: string;
  email_verified?: boolean;

  firstName: string;
  lastName: string;
  phone_number?: string;
  birth_date?: Date;
  is_active?: boolean;

  sex?: Sex;

  role_id?: string;
  post_id?: string;
  department_id?: string;

  userRoles?: any; 
  userPosts?: any;
  userDepartments?: any;

  @Exclude()
  password_hash: string;

  @Exclude()
  password_salt: string;

  @Exclude()
  password_changed_at: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}