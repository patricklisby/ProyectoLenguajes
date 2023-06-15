import { HttpClient } from '@angular/common/http';
import { Token } from '../models/token';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  retry,
  tap,
} from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  SRV = 'http://tallerBD';
  http = inject(HttpClient);
  srvToken = inject(TokenService);
  router = inject(Router);

  private usrActualSubject = new BehaviorSubject<User>(new User());
  private usrActual = this.usrActualSubject.asObservable();
  //ID usuario, nombre, rol separados del reto de datos
  public get valorUserActual(): User {
    return this.usrActualSubject.value;
  }

  public login(user: { idUsuario: ''; passw: '' }): Observable<any> {
    return this.http
      .patch<Token>(`${this.SRV}/sesion/iniciar/${user.idUsuario}`, {
        passw: user.passw,
      })
      .pipe(
        retry(1),
        tap((tokens) => {
          this.doLogin(tokens);
          this.router.navigate(['/home']);
        }),
        map(() => true),
        catchError((error) => {
          return of(error.status);
        })
      );
  }

  public logout() {
    this.http
      .patch(`${this.SRV}/sesion/cerrar/${this.valorUserActual.idUsuario}`, {})
      .subscribe();
    this.doLogout();
  }
  private doLogin(tokens: Token): void {
    this.srvToken.setTokens(tokens);
    this.usrActualSubject.next(this.getUserActual());
  }
  private doLogout() {
    if (this.srvToken.token) {
      this.srvToken.eliminarTokens();
    }
    this.usrActualSubject.next(this.getUserActual());
  }

  private getUserActual(): User {
    if (!this.srvToken.token) {
      return new User();
    }
    const tokenD = this.srvToken.decodeToken();
    console.log(tokenD);

    return { idUsuario: tokenD.sub, nombre: tokenD.nombre, rol: tokenD.rol };
  }

  public isLogged(): boolean {
    return !!this.srvToken.token && !this.srvToken.jwtTokenExp();
  }

  public verificarRefrescar(): boolean {
    if (this.isLogged() && this.srvToken.tiempoExpToken()<= 20) {
      this.srvToken.refreshTokens();
      return true;
    }else {
      return false;
    }
  }
}
