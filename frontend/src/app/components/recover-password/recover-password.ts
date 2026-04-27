import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './recover-password.html',
  styleUrl: './recover-password.css',
})
export class RecoverPassword {
  recoverForm: FormGroup;
  errorMessage: string | null = null;
  message: string | null = null;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.recoverForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.recoverForm.invalid) {
      this.recoverForm.markAllAsTouched();
      this.changeDetectorRef.detectChanges();
      return;
    } else if (this.recoverForm.valid) {
      this.loading = true;
    }

    this.errorMessage = null;
    this.message = null;

    this.authService.sendRecoveryEmail(this.recoverForm.value.email).subscribe({
      next: (response) => {
        this.loading = false;
        this.message = 'Correo de recuperación enviado. Revisa tu bandeja de entrada.';
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message ||
          'Error al enviar el correo de recuperación. Por favor, inténtalo de nuevo.';
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
