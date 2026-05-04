import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './delete-account.html',
  styleUrl: './delete-account.css',
})
export class DeleteAccount {
  confirmationText: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  onDelete() {
    if (this.confirmationText !== 'ELIMINAR') {
      this.errorMessage = 'Debes escribir "ELIMINAR" en mayúsculas para continuar.';
      return;
    }

    if (confirm('¿Estás completamente seguro? Esta acción no se puede deshacer.')) {
      this.userService.deleteAccount().subscribe({
        next: (res) => {
          alert(res.message);
          // Limpiamos la sesión y redirigimos
          this.authService.logout();
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Error al intentar eliminar la cuenta';
        },
      });
    }
  }
}
