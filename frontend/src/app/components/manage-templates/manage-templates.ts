import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Template } from '../../interfaces/template';
import { TemplateExercises } from '../../interfaces/template-exercises';
import { ExerciseTutorial } from '../../interfaces/exercise-tutorial';
import { AdminService } from '../../services/admin-service';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-templates',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './manage-templates.html',
  styleUrl: './manage-templates.css',
})
export class ManageTemplates implements OnInit {
  templates: Template[] = [];
  filteredTemplates: Template[] = [];
  searchText: string = '';
  isSelectOpen = false;
  searchCriteria: string = 'name';
  selectedTemplate: any = null;
  isModalOpen: boolean = false;
  isAddModalOpen: boolean = false;
  isAddExerciseModalOpen: boolean = false;
  addTemplateForm: FormGroup;
  addExerciseForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  tutorials: ExerciseTutorial[] = [];
  filteredTutorials: ExerciseTutorial[] = [];
  tutorialSearchText: string = '';
  isAddTutorialModalOpen: boolean = false;
  isVideoModalOpen: boolean = false;
  selectedTutorial: ExerciseTutorial | null = null;
  addTutorialForm: FormGroup;
  selectedVideoFile: File | null = null;
  tutorialErrorMessage: string | null = null;
  tutorialSuccessMessage: string | null = null;
  tutorialFormSubmitted: boolean = false;

  constructor(
    private adminService: AdminService,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
  ) {
    this.addTemplateForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
    });

    this.addExerciseForm = this.formBuilder.group({
      idtemplate: [null, [Validators.required]],
      exercise_name: ['', [Validators.required, Validators.minLength(2)]],
      series: [null, [Validators.required, Validators.min(1)]],
      reps: ['', [Validators.required]],
      resting_time: ['', [Validators.required]],
      order_number: [null, [Validators.required, Validators.min(1)]],
    });

    this.addTutorialForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.adminService.getAllTemplates().subscribe({
      next: (data) => {
        this.templates = data;
        this.filteredTemplates = data;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        // console.error('Error fetching templates:', error);
        this.changeDetectorRef.detectChanges();
      },
    });

    this.adminService.getAllExerciseTutorials().subscribe({
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

  toggleSelect(): void {
    this.isSelectOpen = !this.isSelectOpen;
  }

  selectOption(option: string) {
    this.searchCriteria = option;
    this.isSelectOpen = false;
    this.onSearchChange();
  }

  openModal(template: any) {
    this.selectedTemplate = template;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTemplate = null;
    document.body.style.overflow = 'auto';
  }

  openAddModal() {
    this.addTemplateForm.reset({ type: '' });
    this.errorMessage = null;
    this.successMessage = null;
    this.isAddModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeAddModal() {
    this.isAddModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  openAddExerciseModal(event: Event, template: Template) {
    event.stopPropagation();
    this.addExerciseForm.reset({ idtemplate: template.idtemplate });
    this.errorMessage = null;
    this.successMessage = null;
    this.isAddExerciseModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeAddExerciseModal() {
    this.isAddExerciseModalOpen = false;
    this.errorMessage = null;
    document.body.style.overflow = 'auto';
  }

  submitExercise() {
    if (this.addExerciseForm.invalid) {
      this.addExerciseForm.markAllAsTouched();
      return;
    }
    this.errorMessage = null;
    const exercisePayload: TemplateExercises & { idtemplate: number } = this.addExerciseForm.value;
    this.adminService.addExerciseToTemplate(exercisePayload).subscribe({
      next: (newExercise: TemplateExercises) => {
        const template = this.templates.find((t) => t.idtemplate === exercisePayload.idtemplate);
        if (template) {
          if (!template.exercises) {
            template.exercises = [];
          }
          template.exercises.push(newExercise);
        }
        this.addExerciseForm.reset({ idtemplate: exercisePayload.idtemplate });
        this.onSearchChange();
        this.successMessage = 'Ejercicio añadido con éxito.';
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        // console.error('Error:', err);
        this.errorMessage = err.error?.message || 'Error al añadir el ejercicio';
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  submitTemplate() {
    if (this.addTemplateForm.invalid) {
      this.addTemplateForm.markAllAsTouched();
      this.changeDetectorRef.detectChanges();
      return;
    }
    const newTemplate = this.addTemplateForm.value;
    this.errorMessage = null;
    this.adminService.addTemplate(newTemplate).subscribe({
      next: (createdTemplate) => {
        this.templates = [...this.templates, createdTemplate];
        this.onSearchChange();
        this.addTemplateForm.reset({ type: '' });
        this.successMessage = 'Plantilla creada correctamente.';
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        // console.error(err);
        this.errorMessage =
          err.error?.message || 'Error al añadir la plantilla. Por favor, inténtalo de nuevo.';
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  deleteTemplate(event: Event, templateId: number) {
    event.stopPropagation();
    if (
      confirm(
        '¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer.',
      )
    ) {
      this.adminService.deleteTemplate(templateId).subscribe({
        next: () => {
          // alert('Plantilla eliminada correctamente');
          this.templates = this.templates.filter((t) => t.idtemplate !== templateId);
          this.onSearchChange();
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          // console.error('Error al eliminar:', error);
          // alert(error.error?.message || 'No se pudo eliminar la plantilla');
        },
      });
    }
  }

  onSearchChange(): void {
    const text = this.searchText.toLowerCase().trim();
    if (!text) {
      this.filteredTemplates = this.templates;
    } else {
      this.filteredTemplates = this.templates.filter((template) => {
        const valueToSearch = this.searchCriteria === 'name' ? template.name : template.type;
        return valueToSearch.toLowerCase().includes(text);
      });
    }
    this.changeDetectorRef.detectChanges();
  }

  onTutorialSearchChange(): void {
    const text = this.tutorialSearchText.toLowerCase().trim();
    if (!text) {
      this.filteredTutorials = this.tutorials;
    } else {
      this.filteredTutorials = this.tutorials.filter((t) => t.name.toLowerCase().includes(text));
    }
    this.changeDetectorRef.detectChanges();
  }

  openAddTutorialModal() {
    this.addTutorialForm.reset();
    this.selectedVideoFile = null;
    this.tutorialErrorMessage = null;
    this.tutorialSuccessMessage = null;
    this.tutorialFormSubmitted = false;
    this.isAddTutorialModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeAddTutorialModal() {
    this.isAddTutorialModalOpen = false;
    this.tutorialFormSubmitted = false;
    document.body.style.overflow = 'auto';
  }

  onVideoFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('video/')) {
        this.tutorialErrorMessage = 'Solo se permiten archivos de vídeo.';
        input.value = '';
        this.selectedVideoFile = null;
        return;
      }
      this.tutorialErrorMessage = null;
      this.selectedVideoFile = file;
    }
  }

  submitTutorial() {
    this.tutorialFormSubmitted = true;
    if (this.addTutorialForm.invalid) {
      this.addTutorialForm.markAllAsTouched();
      return;
    }
    if (!this.selectedVideoFile) {
      this.tutorialErrorMessage = 'Debes seleccionar un archivo de vídeo.';
      return;
    }
    this.tutorialErrorMessage = null;
    const { name, description } = this.addTutorialForm.value;
    this.adminService
      .addExerciseTutorial({ name, description, videoFile: this.selectedVideoFile })
      .subscribe({
        next: (created) => {
          this.tutorials = [...this.tutorials, created];
          this.onTutorialSearchChange();
          this.tutorialSuccessMessage = 'Tutorial creado correctamente.';
          this.addTutorialForm.reset();
          this.selectedVideoFile = null;
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          // console.error(err);
          this.tutorialErrorMessage =
            err.error?.message || 'Error al crear el tutorial. Inténtalo de nuevo.';
          this.changeDetectorRef.detectChanges();
        },
      });
  }

  deleteTutorial(event: Event, id: number) {
    event.stopPropagation();
    if (
      confirm(
        '¿Estás seguro de que deseas eliminar este tutorial? Esta acción no se puede deshacer.',
      )
    ) {
      this.adminService.deleteExerciseTutorial(id).subscribe({
        next: () => {
          this.tutorials = this.tutorials.filter((t) => t.id !== id);
          this.onTutorialSearchChange();
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          // console.error('Error al eliminar:', error);
          // alert(error.error?.message || 'No se pudo eliminar el tutorial');
        },
      });
    }
  }

  openVideoModal(tutorial: ExerciseTutorial) {
    this.selectedTutorial = tutorial;
    this.isVideoModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeVideoModal() {
    this.isVideoModalOpen = false;
    this.selectedTutorial = null;
    document.body.style.overflow = 'auto';
  }

  getVideoUrl(filename: string): string {
    return `${environment.apiUrl}/videos/exercise-tutorials/${filename}`;
  }
}
