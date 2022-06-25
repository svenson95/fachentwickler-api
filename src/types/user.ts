export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  TEACHER = 'TEACHER',
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  password: string;
  progress: string[];
  active: boolean;
  role: UserRole;
  theme: Theme;
}

export interface AuthUser {
  username: string;
  password: string;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  theme: Theme;
}

interface EditUserBase {
  _id: string;
}

export interface EditNameBody extends EditUserBase {
  newName: string;
}

export interface EditEmailBody extends EditUserBase {
  email: string;
}

export interface EditPasswordBody extends EditUserBase {
  password: string;
}

export interface EditThemeBody extends EditUserBase {
  theme: Theme;
}

export interface AddProgressBody {
  userId: string;
  postId: string;
}

export type EditBodyTypes = EditNameBody | EditEmailBody | EditPasswordBody | EditThemeBody;
