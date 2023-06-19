import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authsrv = inject(AuthService);
  const router = inject(Router);
  if(authsrv.isloged()){
    router.navigate(['/home']);

  }
  return !authsrv.isloged();
};
