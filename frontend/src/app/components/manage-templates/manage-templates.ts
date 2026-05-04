import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Template } from '../../interfaces/template';
import { TemplateExercises } from '../../interfaces/template-exercises';
import { AdminService } from '../../services/admin-service';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-manage-templates',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
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
  }

  ngOnInit(): void {
    this.adminService.getAllTemplates().subscribe({
      next: (data) => {
        this.templates = data;
        this.filteredTemplates = data;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching templates:', error);
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
    this.onSearchChange(); // Tu función de búsqueda
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
    this.addTemplateForm.reset({ type: '' }); // Limpia el formulario
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
        alert('Ejercicio añadido con éxito');
        const template = this.templates.find((t) => t.idtemplate === exercisePayload.idtemplate);
        if (template) {
          if (!template.exercises) {
            template.exercises = [];
          }
          template.exercises.push(newExercise);
        }

        this.closeAddExerciseModal();
        this.onSearchChange();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = err.error?.message || 'Error al añadir el ejercicio';
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  submitTemplate() {
    if (this.addTemplateForm.invalid) {
      this.addTemplateForm.markAllAsTouched(); // Activa todos los mensajes de error
      this.changeDetectorRef.detectChanges();
      return;
    }
    const newTemplate = this.addTemplateForm.value;
    this.errorMessage = null;
    this.adminService.addTemplate(newTemplate).subscribe({
      next: (createdTemplate) => {
        alert('Plantilla creada correctamente');
        this.templates = [...this.templates, createdTemplate];
        this.onSearchChange();
        this.closeAddModal();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error(err);
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
          alert('Plantilla eliminada correctamente');
          // Filtramos localmente para actualizar la UI sin recargar toda la página
          this.templates = this.templates.filter((t) => t.idtemplate !== templateId);
          this.onSearchChange(); // Actualiza la lista filtrada
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          alert(error.error?.message || 'No se pudo eliminar la plantilla');
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
}
