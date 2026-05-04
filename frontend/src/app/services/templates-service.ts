import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template } from '../interfaces/template';
import { LocalStorageService } from './local-storage-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TemplatesService {
  private apiUrl = `${environment.apiUrl}/users`;
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);

  getAllTemplates(): Observable<Template[]> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Template[]>(`${this.apiUrl}/all-templates`, { headers });
  }
}
