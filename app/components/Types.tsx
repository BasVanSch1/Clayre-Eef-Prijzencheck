export type User = {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  avatar?: File | null;
  avatarVersion?: number; // Optional field to refresh avatar when updated
  roles?: UserRole[];
  permissions?: RolePermission[]; // Optional field so that I don't need to loop through roles to check permissions.
};

export type Product = {
  productCode: string;
  eanCode: string;
  description: string;
  price: number;
  imageUrl: string;
};

export type UserRole = {
  id?: string;
  name: string;
  description?: string;
  permissions?: RolePermission[];
};

export type RolePermission = {
  id: string;
  name: string;
  description: string;
};

export type Statistics = {
  id: string;
  name: string;
  lookupsByEAN: number;
  lookupsByCode: number;
  totalLookups: number;
  totalProducts: number;
  totalUsers: number;
};
