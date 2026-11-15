import type { UserType } from '../../../types/index.js';

export interface CreateUserDto {
  name: string;
  email: string;
  avatarPath?: string;
  password: string;
  type: UserType;
}
