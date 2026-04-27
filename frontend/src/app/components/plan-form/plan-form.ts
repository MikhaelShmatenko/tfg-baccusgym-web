import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PlansRequestService } from '../../services/plans-request-service';
import { PlanRequest } from '../../interfaces/plan-request';
import { PlansService } from '../../services/plans-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { Plan } from '../../interfaces/plan';

@Component({
  selector: 'app-plan-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './plan-form.html',
  styleUrl: './plan-form.css',
})
export class PlanForm implements OnInit {
  planForm: FormGroup;
  selectedPlan: Plan | null = null;
  errorMessage: string | null = null;
  showTerms: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private plansService: PlansService,
    private plansRequestService: PlansRequestService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.planForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}[A-Z]$')]],
      address: ['', [Validators.required]],
      iban: ['', [Validators.required, Validators.pattern('^ES[0-9]{22}$')]],
      acceptTerms: [false, [Validators.requiredTrue]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.plansService.getPlanById(id).subscribe({
        next: (plan) => {
          this.selectedPlan = plan;
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          this.errorMessage = 'No se pudo cargar la información del plan seleccionado';
          this.changeDetectorRef.detectChanges();
        },
      });
    }
  }

  onIbanInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleanValue = input.value.replace(/\s+/g, '').toUpperCase();
    this.planForm.get('iban')?.setValue(cleanValue, { emitEvent: false });
  }

  toggleTerms(): void {
    this.showTerms = !this.showTerms;
  }

  onSubmit() {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.errorMessage = null;

    const requestData: PlanRequest = {
      name: this.planForm.value.name,
      lastName: this.planForm.value.lastName,
      email: this.planForm.value.email,
      dni: this.planForm.value.dni,
      address: this.planForm.value.address,
      iban: this.planForm.value.iban,
      planId: this.selectedPlan?.idplan || 0,
      acceptTerms: this.planForm.value.acceptTerms,
    };

    this.plansRequestService.sendPlanRequest(requestData).subscribe({
      next: (response) => {
        this.localStorageService.savePlanRequest(requestData);
        alert('Solicitud de plan enviada correctamente');
        this.router.navigate(['/baccus-gym/user/register']);
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Hubo un error al procesar tu solicitud. Intentelo mas tarde';
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
