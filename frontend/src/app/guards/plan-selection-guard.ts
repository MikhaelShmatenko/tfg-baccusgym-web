import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { LocalStorageService } from '../services/local-storage-service';

export const planSelectionGuard: CanActivateFn = (route, state) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);

  const pendingPlan = localStorageService.getPlanRequest();

  if (pendingPlan && pendingPlan.planId) {
    return true;
  } else {
    router.navigate(['/baccus-gym']);
    return false;
  }
};
