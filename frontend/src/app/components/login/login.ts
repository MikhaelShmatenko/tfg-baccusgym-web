import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.token) {
          const userData: User = {
            idUser: response.idUser,
            name: response.name,
            email: response.email,
            password: null,
            admin: response.admin,
            planId: null,
          };
          this.localStorageService.setSession(response.token, userData);
          this.authService.updateAuthState();
          alert('Sesion iniciada exitosamente.');
          this.router.navigate(['/baccus-gym']);
        }
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message ||
          'Error al inciar sesión. Por favor, verifica tus credenciales e inténtalo de nuevo.';
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
