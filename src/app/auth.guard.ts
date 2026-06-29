import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DataService } from './data.service';

/** Protege paginas internas que requieren una sesion iniciada. */
export const authGuard: CanActivateFn = () => {
  const data = inject(DataService);
  const router = inject(Router);
  if (data.session) return true;
  return router.createUrlTree(['/login']);
};

/** Limita los mantenedores al rol administrador. */
export const adminGuard: CanActivateFn = () => {
  const data = inject(DataService);
  const router = inject(Router);
  if (data.session?.role === 'admin') return true;
  return router.createUrlTree(['/login']);
};
