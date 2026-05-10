import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExerciseTutorial } from '../../interfaces/exercise-tutorial';
import { ExerciseTutorialService } from '../../services/exercise-tutorial-service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './exercises.html',
  styleUrl: './exercises.css',
})
export class Exercises implements OnInit {
  tutorials: ExerciseTutorial[] = [];
  filteredTutorials: ExerciseTutorial[] = [];
  searchText: string = '';
  isVideoModalOpen: boolean = false;
  selectedTutorial: ExerciseTutorial | null = null;

  constructor(
    private exerciseTutorialService: ExerciseTutorialService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.exerciseTutorialService.getAllExerciseTutorials().subscribe({
      next: (data) => {
        this.tutorials = data;
        this.filteredTutorials = data;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        // console.error('Error fetching tutorials:', error);
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  onSearchChange(): void {
    const text = this.searchText.toLowerCase().trim();
    if (!text) {
      this.filteredTutorials = this.tutorials;
    } else {
      this.filteredTutorials = this.tutorials.filter((t) => t.name.toLowerCase().includes(text));
    }
    this.changeDetectorRef.detectChanges();
  }

  openVideoModal(tutorial: ExerciseTutorial): void {
    this.selectedTutorial = tutorial;
    this.isVideoModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeVideoModal(): void {
    this.isVideoModalOpen = false;
    this.selectedTutorial = null;
    document.body.style.overflow = 'auto';
  }

  getVideoUrl(filename: string): string {
    return `${environment.apiUrl}/videos/exercise-tutorials/${filename}`;
  }
}
