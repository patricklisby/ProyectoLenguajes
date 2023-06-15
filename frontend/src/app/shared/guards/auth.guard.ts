import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const srvAuth = inject(AuthService);
  const router = inject(Router);
  if(srvAuth.isLogged()){
    console.log(route.data);
    if(Object.keys(route.data).length!== 0 && route.data['roles'].indexOf(srvAuth.valorUserActual.rol) === -1){
      router.navigate(['/error403']);
      return false;
    }
    return true;
  }
  return false;
};
