export interface Plan {
  idplan: number;
  type: string;
  duration_days: number;
  price: number;
  name: string;
  image_url: string | null;
}
