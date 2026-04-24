import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/user`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  private router = inject(Router);

  constructor(private http: HttpClient) {}

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
    this.currentUserSubject.next(this.getUserFromLocalStorage());
  }

  private getUserFromLocalStorage(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
}
