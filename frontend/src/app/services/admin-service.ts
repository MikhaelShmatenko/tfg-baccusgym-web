import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetails } from '../interfaces/user-details';
import { User } from '../interfaces/user';
import { Template } from '../interfaces/template';
import { TemplateExercises } from '../interfaces/template-exercises';
import { ExerciseTutorial } from '../interfaces/exercise-tutorial';
import { LocalStorageService } from './local-storage-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) {}

  getAllUsers(): Observable<UserDetails[]> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UserDetails[]>(`${this.apiUrl}/all-users-details`, { headers });
  }

  getAllTemplates(): Observable<Template[]> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Template[]>(`${this.apiUrl}/all-templates`, { headers });
  }

  addTemplate(templateData: {
    name: string;
    description: string;
    type: string;
  }): Observable<Template> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Template>(`${this.apiUrl}/add-template`, templateData, { headers });
  }

  deleteTemplate(templateId: number): Observable<any> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/delete-template/${templateId}`, { headers });
  }

  addExerciseToTemplate(
    exerciseData: TemplateExercises & { idtemplate: number },
  ): Observable<TemplateExercises> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<TemplateExercises>(`${this.apiUrl}/add-exercise-template`, exerciseData, {
      headers,
    });
  }

  substractDay(iduser: number): Observable<any> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/substract-day/${iduser}`, null, { headers });
  }

  deactivatePlan(iduser: number): Observable<any> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/deactivate-plan/${iduser}`, null, { headers });
  }

  setUserPlan(planData: {
    iduser: number;
    idplan: number;
    start_date: string;
    is_active: boolean;
  }): Observable<any> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/set-user-plan`, planData, { headers });
  }

  addUser(userData: Partial<User>): Observable<User> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<User>(`${this.apiUrl}/add-user`, userData, { headers });
  }

  getAllExerciseTutorials(): Observable<ExerciseTutorial[]> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ExerciseTutorial[]>(`${this.apiUrl}/all-exercise-tutorials`, { headers });
  }

  addExerciseTutorial(data: {
    name: string;
    description: string;
    videoFile: File;
  }): Observable<ExerciseTutorial> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('video', data.videoFile);
    return this.http.post<ExerciseTutorial>(`${this.apiUrl}/add-exercise-tutorial`, formData, {
      headers,
    });
  }

  deleteExerciseTutorial(id: number): Observable<any> {
    const token = this.localStorageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/delete-exercise-tutorial/${id}`, { headers });
  }
}
