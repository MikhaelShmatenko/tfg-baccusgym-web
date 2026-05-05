import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { AdminPanel } from './components/admin-panel/admin-panel';
import { Contact } from './components/contact/contact';
import { DeleteAccount } from './components/delete-account/delete-account';
import { ExerciseTemplates } from './components/exercise-templates/exercise-templates';
import { Exercises } from './components/exercises/exercises';
import { Facilities } from './components/facilities/facilities';
import { ManageUsers } from './components/manage-users/manage-users';
import { PlanForm } from './components/plan-form/plan-form';
import { Register } from './components/register/register';
import { SeePlans } from './components/see-plans/see-plans';
import { WhoWeAre } from './components/who-we-are/who-we-are';
import { RecoverPassword } from './components/recover-password/recover-password';
import { ResetPassword } from './components/reset-password/reset-password';
import { AccountDetails } from './components/account-details/account-details';
import { ChangeName } from './components/change-name/change-name';
import { ChangePassword } from './components/change-password/change-password';
import { ManageTemplates } from './components/manage-templates/manage-templates';
import { authGuard } from './guards/auth-guard';
import { publicGuard } from './guards/public-guard';
import { planSelectionGuard } from './guards/plan-selection-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'baccus-gym', pathMatch: 'full' },
  { path: 'baccus-gym', component: Home },
  { path: 'baccus-gym/user/login', component: Login, canActivate: [publicGuard] },
  {
    path: 'baccus-gym/user/register',
    component: Register,
    canActivate: [publicGuard, planSelectionGuard],
  },
  { path: 'baccus-gym/user/change-password', component: ChangePassword, canActivate: [authGuard] },
  { path: 'baccus-gym/user/change-name', component: ChangeName, canActivate: [authGuard] },
  { path: 'baccus-gym/user/delete-account', component: DeleteAccount, canActivate: [authGuard] },
  {
    path: 'baccus-gym/user/exercise-templates',
    component: ExerciseTemplates,
    canActivate: [authGuard],
  },
  { path: 'baccus-gym/user/account-details', component: AccountDetails, canActivate: [authGuard] },
  { path: 'baccus-gym/facilities', component: Facilities },
  { path: 'baccus-gym/plan-form/:id', component: PlanForm },
  { path: 'baccus-gym/exercises', component: Exercises },
  { path: 'baccus-gym/see-plans', component: SeePlans },
  { path: 'baccus-gym/contact', component: Contact },
  { path: 'baccus-gym/who-we-are', component: WhoWeAre },
  {
    path: 'baccus-gym/admin/admin-panel',
    component: AdminPanel,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: 'manage-users', component: ManageUsers },
      { path: 'manage-templates', component: ManageTemplates },
      { path: '', redirectTo: 'manage-users', pathMatch: 'full' },
    ],
  },
  { path: 'baccus-gym/user/recover-password', component: RecoverPassword },
  { path: 'baccus-gym/user/reset-password', component: ResetPassword },
];
