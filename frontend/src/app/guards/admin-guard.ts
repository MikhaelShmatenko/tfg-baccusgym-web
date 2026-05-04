import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      if (user && user.admin === true) {
        return true;
      }
      console.warn('Acceso denegado: Se requieren permisos de administrador');
      return router.createUrlTree(['/baccus-gym/user/login']);
    }),
  );
};
