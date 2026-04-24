import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from '../interfaces/plan';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlansService {
  private apiUrl = `${environment.apiUrl}/plans`;

  constructor(private http: HttpClient) {}

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.apiUrl);
  }
}
