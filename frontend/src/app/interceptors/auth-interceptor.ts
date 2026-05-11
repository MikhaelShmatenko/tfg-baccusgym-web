import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isTokenError =
        (error.status === 401 || error.status === 403) &&
        error.error?.message === 'Token invalido o expirado';

      if (isTokenError) {
        authService.logout();
      }

      return throwError(() => error);
    }),
  );
};
