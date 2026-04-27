import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PlanRequest } from '../interfaces/plan-request';

@Injectable({
  providedIn: 'root',
})
export class PlansRequestService {
  private apiUrl = `${environment.apiUrl}/plans-request`;
  constructor(private http: HttpClient) {}

  sendPlanRequest(requestData: PlanRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/plans-request`, requestData);
  }
}
