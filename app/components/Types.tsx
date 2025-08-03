export type User = {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  avatar?: File | null;
  avatarVersion?: number; // Optional field to refresh avatar when updated
  roles?: UserRole[];
};

export type UserRole = {
  id: string;
  name: string;
  description?: string;
};

export type RolePermission = {
  id: string;
  name: string;
  description?: string;
};
