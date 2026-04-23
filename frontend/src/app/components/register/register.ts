// Importaciones de módulos y servicios necesarios
import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  // Agregamos ReactiveFormsModule a los imports para usar formularios reactivos
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  // Declaramos las variables necesarias para el formulario, la gestión de errores y la visibilidad de la contraseña
  showPassword = false;
  registerForm: FormGroup;
  errorMessage: string | null = null;

  // Inyectamos los servicios necesarios en el constructor y configuramos el formulario reactivo
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      admin: [false],
      planStatus: [false],
      idPlan: [null],
    });
  }

  // Método para manejar el envío del formulario de registro
  onSubmit() {
    // Si el formulario tiene errores, los mostramos todos y paramos
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.changeDetectorRef.detectChanges();
      return;
    }

    // Si llegamos aquí, el formulario es válido. Procedemos al registro.
    // Limpiamos cualquier mensaje de error previo
    this.errorMessage = null;

    // Llamamos al servicio de autenticación para registrar al usuario con los datos del formulario
    this.authService.register(this.registerForm.value).subscribe({
      // Si el registro es exitoso, mostramos un mensaje de éxito y redirigimos al usuario a la página de inicio
      next: (response) => {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        this.router.navigate(['/baccus-gym']);
        // console.log('User registered successfully', response);
      },
      // Si ocurre un error durante el registro, lo capturamos y mostramos un mensaje de error específico
      error: (error) => {
        // console.error('Error registering user', error);
        this.errorMessage = error.error?.message || 'Error al registrar el usuario.';
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
