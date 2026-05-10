import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExerciseTutorial } from '../interfaces/exercise-tutorial';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExerciseTutorialService {
  private apiUrl = `${environment.apiUrl}/exercise-tutorials`;

  constructor(private http: HttpClient) {}

  getAllExerciseTutorials(): Observable<ExerciseTutorial[]> {
    return this.http.get<ExerciseTutorial[]>(`${this.apiUrl}/all-exercise-tutorials`);
  }
}
