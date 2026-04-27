// Importaciones de módulos y servicios necesarios
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { User } from '../../interfaces/user';
import { PlanRequest } from '../../interfaces/plan-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  showPassword = false;
  registerForm: FormGroup;
  errorMessage: string | null = null;
  pendingPlanData: PlanRequest | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.pendingPlanData = this.localStorageService.getPlanRequest();

    if (this.pendingPlanData?.email) {
      const emailControl = this.registerForm.get('email');

      emailControl?.setValidators([
        Validators.required,
        Validators.email,
        this.emailMatchValidator(this.pendingPlanData.email),
      ]);

      emailControl?.updateValueAndValidity();
    }
  }

  emailMatchValidator(storedEmail: string) {
    return (control: any) => {
      const inputEmail = control.value;
      return inputEmail === storedEmail ? null : { emailMismatch: true };
    };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.errorMessage = null;

    const userData: User = {
      idUser: null,
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      admin: false,
      planId: this.pendingPlanData?.planId ?? null,
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.localStorageService.clearPlanRequest();
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        this.router.navigate(['/baccus-gym']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al registrar el usuario.';
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
