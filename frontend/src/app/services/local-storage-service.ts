import { Injectable } from '@angular/core';
import { PlanRequest } from '../interfaces/plan-request';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly PLAN_REQUEST_KEY = 'pending_plan_request';
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  constructor() {}

  savePlanRequest(data: PlanRequest): void {
    localStorage.setItem(this.PLAN_REQUEST_KEY, JSON.stringify(data));
  }

  getPlanRequest(): PlanRequest | null {
    const data = localStorage.getItem(this.PLAN_REQUEST_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearPlanRequest(): void {
    localStorage.removeItem(this.PLAN_REQUEST_KEY);
  }

  setSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  clearSession(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}
