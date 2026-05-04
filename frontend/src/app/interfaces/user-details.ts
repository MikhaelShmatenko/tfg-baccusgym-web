export interface UserDetails {
  iduser: number;
  idplan: number | null;
  name: string;
  email: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean | null;
  remaining_days: number | null;
  plan_name: string | null;
  plan_type: string;
}
