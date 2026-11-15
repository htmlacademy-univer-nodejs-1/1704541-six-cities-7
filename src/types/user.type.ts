export type UserType = 'ordinary' | 'pro';

export interface User {
  name: string;
  email: string;
  avatarPath?: string;
  password: string;
  type: UserType;
}
