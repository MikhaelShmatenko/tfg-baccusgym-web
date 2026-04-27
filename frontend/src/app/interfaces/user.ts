export interface User {
  token?: string;
  idUser: number | null;
  name: string;
  email: string;
  password: string | null;
  admin: boolean;
  planId: number | null;
}
