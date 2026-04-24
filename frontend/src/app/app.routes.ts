import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { ActualPlan } from './components/actual-plan/actual-plan';
import { AdminPanel } from './components/admin-panel/admin-panel';
import { Calendar } from './components/calendar/calendar';
import { Contact } from './components/contact/contact';
import { DeleteAccount } from './components/delete-account/delete-account';
import { ExerciseTemplates } from './components/exercise-templates/exercise-templates';
import { Exercises } from './components/exercises/exercises';
import { Facilities } from './components/facilities/facilities';
import { ManageUsers } from './components/manage-users/manage-users';
import { ModifyAccount } from './components/modify-account/modify-account';
import { PlanForm } from './components/plan-form/plan-form';
import { Register } from './components/register/register';
import { SeePlans } from './components/see-plans/see-plans';
import { WhoWeAre } from './components/who-we-are/who-we-are';
import { RecoverPassword } from './components/recover-password/recover-password';
import { ResetPassword } from './components/reset-password/reset-password';
import { authGuard } from './guards/auth-guard';
import { publicGuard } from './guards/public-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'baccus-gym', pathMatch: 'full' },
  { path: 'baccus-gym', component: Home },
  { path: 'baccus-gym/user/login', component: Login, canActivate: [publicGuard] },
  { path: 'baccus-gym/user/register', component: Register, canActivate: [publicGuard] },
  { path: 'baccus-gym/user/modify', component: ModifyAccount, canActivate: [authGuard] },
  { path: 'baccus-gym/user/delete', component: DeleteAccount, canActivate: [authGuard] },
  { path: 'baccus-gym/user/actual-plan', component: ActualPlan, canActivate: [authGuard] },
  { path: 'baccus-gym/user/calendar', component: Calendar, canActivate: [authGuard] },
  {
    path: 'baccus-gym/user/exercise-templates',
    component: ExerciseTemplates,
    canActivate: [authGuard],
  },
  { path: 'baccus-gym/facilities', component: Facilities },
  { path: 'baccus-gym/plan-form', component: PlanForm },
  { path: 'baccus-gym/exercises', component: Exercises },
  { path: 'baccus-gym/see-plans', component: SeePlans },
  { path: 'baccus-gym/contact', component: Contact },
  { path: 'baccus-gym/who-we-are', component: WhoWeAre },
  { path: 'baccus-gym/admin/manage-users', component: ManageUsers, canActivate: [authGuard] },
  { path: 'baccus-gym/admin/admin-panel', component: AdminPanel, canActivate: [authGuard] },
  { path: 'baccus-gym/user/recover-password', component: RecoverPassword },
  { path: 'baccus-gym/user/reset-password', component: ResetPassword },
];
