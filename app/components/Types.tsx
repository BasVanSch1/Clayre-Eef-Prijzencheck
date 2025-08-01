export type User = {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  avatar?: File | null;
};
