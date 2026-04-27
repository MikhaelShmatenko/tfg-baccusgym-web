export interface PlanRequest {
  name: string;
  lastName: string;
  email: string;
  dni: string;
  address: string;
  iban: string;
  planId: number;
  acceptTerms: boolean;
}
