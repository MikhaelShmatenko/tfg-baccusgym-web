import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage-service';
import { UserDetails } from '../interfaces/user-details';
import { getActionCache } from '@angular/core/primitives/event-dispatch';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);

  getUserDetails(): Observable<UserDetails> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UserDetails>(`${this.apiUrl}/details`, { headers });
  }

  deleteAccount(): Observable<any> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/delete`, { headers });
  }

  changeName(password: string, newName: string): Observable<any> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/change-name`, { password, newName }, { headers });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(
      `${this.apiUrl}/change-password`,
      { currentPassword, newPassword },
      { headers },
    );
  }
}
