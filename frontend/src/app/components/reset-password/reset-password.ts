import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  resetPassForm: FormGroup;
  errorMessage: string | null = null;
  token: string | null = null;
  showPasswordOg = false;
  showPasswordConf = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    this.resetPassForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator },
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage = 'Token de recuperación no proporcionado.';
    }
  }

  passwordsMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsNotMatch: true };
  }

  onSubmit() {
    if (this.resetPassForm.invalid) {
      this.resetPassForm.markAllAsTouched();
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.errorMessage = null;

    if (this.token) {
      this.authService.resetPassword(this.token, this.resetPassForm.value.password).subscribe({
        next: () => {
          alert(
            'Contraseña restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.',
          );
          this.router.navigate(['/baccus-gym/user/login']);
        },
        error: (error) => {
          this.errorMessage = 'Error al restablecer la contraseña.';
          this.changeDetectorRef.detectChanges();
        },
      });
    } else {
      this.errorMessage = 'Token de recuperación no válido.';
      this.changeDetectorRef.detectChanges();
    }
  }
}
