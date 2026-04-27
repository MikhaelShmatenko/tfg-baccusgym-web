import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private router = inject(Router);
  private localStorageService = inject(LocalStorageService);

  private currentUserSubject = new BehaviorSubject<User | null>(this.localStorageService.getUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials);
  }

  logout() {
    this.localStorageService.clearSession();
    this.currentUserSubject.next(null);
    this.router.navigate(['/baccus-gym/user/login']);
  }

  sendRecoveryEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recover-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/reset-password`, { token, newPassword });
  }

  updateAuthState() {
    this.currentUserSubject.next(this.localStorageService.getUser());
  }
}
