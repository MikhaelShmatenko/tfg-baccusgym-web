import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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
      // Si el registro es exitoso, mostramos un mensaje de éxito y redirigimos al usuario a la página de inicio
      next: (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
        }
        console.log('User logged in successfully', response);
        alert('Sesion iniciada exitosamente.');
        this.router.navigate(['/baccus-gym']);
        // console.log('User registered successfully', response);
      },
      // Si ocurre un error durante el registro, lo capturamos y mostramos un mensaje de error específico
      error: (error) => {
        // console.error('Error registering user', error);
        this.errorMessage =
          error.error?.message ||
          'Error al inciaer sesión. Por favor, verifica tus credenciales e inténtalo de nuevo.';
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
