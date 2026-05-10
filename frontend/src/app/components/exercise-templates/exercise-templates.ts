import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Template } from '../../interfaces/template';
import { TemplatesService } from '../../services/templates-service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-exercise-templates',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './exercise-templates.html',
  styleUrl: './exercise-templates.css',
})
export class ExerciseTemplates implements OnInit {
  templates: Template[] = [];
  filteredTemplates: Template[] = [];
  searchText: string = '';
  isSelectOpen = false;
  searchCriteria: string = 'name';
  selectedTemplate: any = null;
  isModalOpen: boolean = false;

  constructor(
    private templatesService: TemplatesService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.templatesService.getAllTemplates().subscribe({
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
