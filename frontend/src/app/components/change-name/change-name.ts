import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-name',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-name.html',
  styleUrl: './change-name.css',
})
export class ChangeName {
  changeNameForm: FormGroup;
  showPassword = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
  ) {
    this.changeNameForm = this.formBuilder.group({
      newName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.changeNameForm.invalid) {
      this.changeNameForm.markAllAsTouched();
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.errorMessage = null;
    const { newName, password } = this.changeNameForm.value;

    this.userService.changeName(password, newName).subscribe({
      next: (res) => {
        this.localStorageService.updateUser({ name: newName });
        this.authService.updateAuthState();
        this.changeDetectorRef.detectChanges();
        this.router.navigate(['/baccus-gym/user/account-details']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al cambiar el nombre';
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
