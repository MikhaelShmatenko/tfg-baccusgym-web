export interface User {
  token?: string;
  name: string;
  email: string;
  password?: string;
  admin: boolean;
  planStatus: boolean;
  idPlan: number | null;
}
