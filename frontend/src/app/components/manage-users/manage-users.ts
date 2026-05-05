import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { UserDetails } from '../../interfaces/user-details';
import { Plan } from '../../interfaces/plan';
import { PlansService } from '../../services/plans-service';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { start } from 'repl';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css',
})
export class ManageUsers implements OnInit {
  users: UserDetails[] = [];
  plans: Plan[] = [];
  isPlanModalOpen: boolean = false;
  planForm: FormGroup;
  selectedUser: UserDetails | null = null;
  filteredUsers: UserDetails[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  calculatedRemainingDays: number | string = 0;
  isSelectOpen = false;
  isAddUserModalOpen = false;
  isAddSelectOpen = false;
  userForm: FormGroup;
  showPassword = false;

  constructor(
    private adminService: AdminService,
    private plansService: PlansService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.planForm = this.formBuilder.group({
      idplan: ['', Validators.required],
      start_date: ['', Validators.required],
      is_active: [true],
    });
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      admin: [false],
      planId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadPlans();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.map((user) => ({
          ...user,
          remaining_days: this.getCalculatedDays(user),
        }));
        this.filteredUsers = this.users;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  loadPlans(): void {
    this.plansService.getPlans().subscribe((data) => (this.plans = data));
  }

  getSelectedPlanName(): string {
    const selectedId = this.planForm.get('idplan')?.value;
    if (!selectedId) return '-- Selecciona un plan disponible --';

    const plan = this.plans.find((p) => p.idplan === selectedId);
    return plan ? `${plan.name} (${plan.type})` : '-- Selecciona un plan disponible --';
  }

  selectPlan(plan: Plan) {
    this.planForm.get('idplan')?.setValue(plan.idplan);
    this.planForm.get('idplan')?.markAsDirty(); // Para que Angular sepa que cambió
    this.isSelectOpen = false;
  }

  openAddUserModal() {
    this.userForm.reset({ admin: false, planId: null });
    this.errorMessage = null;
    this.showPassword = false;
    this.isAddUserModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeAddUserModal() {
    this.isAddUserModalOpen = false;
    this.isAddSelectOpen = false;
    document.body.style.overflow = 'auto';
  }

  selectPlanForAdd(plan: Plan) {
    this.userForm.get('planId')?.setValue(plan.idplan);
    this.isAddSelectOpen = false;
  }

  getSelectedPlanNameForAdd(): string {
    const selectedId = this.userForm.get('planId')?.value;
    const plan = this.plans.find((p) => p.idplan === selectedId);
    return plan ? `${plan.name} (${plan.type})` : '-- Selecciona un plan --';
  }

  submitAddUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    // Mapeamos los datos del formulario a la interfaz User (Partial)
    const newUser: Partial<User> = this.userForm.value;

    this.adminService.addUser(newUser).subscribe({
      next: () => {
        alert('Usuario creado con éxito');
        this.loadUsers(); // Recargamos la lista
        this.closeAddUserModal();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al crear el usuario';
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  openPlanModal(user: UserDetails) {
    this.selectedUser = user;
    this.errorMessage = null;
    this.isPlanModalOpen = true;

    // Pre-configuración de fecha de hoy
    const today = new Date().toISOString().split('T')[0];

    this.planForm.patchValue({
      idplan: user.idplan || '',
      start_date: '',
      is_active: true,
    });

    document.body.style.overflow = 'hidden';
  }

  closePlanModal() {
    this.isPlanModalOpen = false;
    this.isSelectOpen = false; // Resetear estado
    this.selectedUser = null;
    document.body.style.overflow = 'auto';
  }

  submitPlanChange() {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }

    const payload = {
      iduser: this.selectedUser!.iduser,
      ...this.planForm.value,
    };

    this.adminService.setUserPlan(payload).subscribe({
      next: () => {
        alert('Plan actualizado con éxito');
        this.loadUsers();
        this.closePlanModal();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al actualizar el plan';
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  substractDay(user: UserDetails): void {
    if (!confirm(`¿Seguro que quieres canjear un día para ${user.name}?`)) {
      return;
    }

    this.adminService.substractDay(user.iduser).subscribe({
      next: (updatedPlan) => {
        const index = this.users.findIndex((u) => u.iduser === user.iduser);
        if (index !== -1) {
          this.users[index].remaining_days = updatedPlan.remaining_days;
          this.users[index].is_active = updatedPlan.is_active;

          if (!updatedPlan.is_active) {
            alert('El bono se ha agotado y el plan ha sido desactivado automáticamente.');
          }
        }
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error al canjear día:', err);
        alert(err.error?.message || 'No se pudo canjear el día. Verifica que el bono esté activo.');
      },
    });
  }

  deactivatePlan(user: UserDetails): void {
    if (!confirm(`¿Seguro que quieres desactivar el plan de ${user.name}?`)) {
      return;
    }

    this.adminService.deactivatePlan(user.iduser).subscribe({
      next: () => {
        const index = this.users.findIndex((u) => u.iduser === user.iduser);
        if (index !== -1) {
          this.users[index].is_active = false;
          this.users[index].start_date = null;
          this.users[index].end_date = null;
          this.users[index].remaining_days = null;
        }
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error al desactivar plan:', err);
        alert(err.error?.message || 'No se pudo desactivar el plan. Inténtalo de nuevo.');
      },
    });
  }

  onSearchChange(): void {
    const text = this.searchText.toLowerCase().trim();

    if (!text) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter((user) => {
        return user.name.toLowerCase().includes(text) || user.email.toLowerCase().includes(text);
      });
    }
    this.changeDetectorRef.detectChanges();
  }

  private getCalculatedDays(user: UserDetails): number | null {
    if (user.end_date) {
      const endDate = new Date(user.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const timeDiff = endDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff >= 0 ? daysDiff : 0;
    }
    return user.remaining_days;
  }
}
