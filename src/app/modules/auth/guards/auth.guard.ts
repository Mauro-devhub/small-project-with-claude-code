// Guard que protege rutas que requieren autenticación
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  // Redirige al login con query param para mostrar el modal
  return router.createUrlTree(['/auth/login'], {
    queryParams: { redirected: true }
  });
};
