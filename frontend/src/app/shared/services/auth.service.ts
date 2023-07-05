import { HttpClient } from '@angular/common/http';
import { Token } from '../models/token';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, retry ,tap} from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  servidor = environment.SRV;
  http = inject(HttpClient);

    //nuevo
  srvToken = inject(TokenService);
  router = inject(Router);
  private usrActualSubject = new BehaviorSubject<User>(new User());
  public usrActual = this.usrActualSubject.asObservable();

  public get valorUserActual(): User {
      return this.usrActualSubject.value;
  }
    //

  constructor() { }

  //iniciar sesion
  public login(user : {idUsuario : '' ,passw : ''}) : Observable<any>{
    console.log(user);
    
    return this.http.patch<Token>(`${this.servidor}/sesion/login/${user.idUsuario}`,{passw:user.passw})
    .pipe(
      retry(1),
      tap(
        tokens => {
          //console.log(tokens);
          //nuevo
          this.doLogin(tokens);
          this.router.navigate(['/home']);//se hace para navegar en la pagina
          //
        }
      ),
      map(()=>true),
      catchError(
        error => { return of (error.status)}
      )
    )
  }

  //nuevo
  public logout(){
    this.http.patch<Token>(`${this.servidor}/sesion/logout/${this.valorUserActual.idUsuario}`,{})
    .subscribe();
    this.doLogout();
  }
  private doLogin(tokens:Token):void{//guardamis tokens
    this.srvToken.setTokens(tokens);
    this.usrActualSubject.next(this.getUserActual());//agrega datos a un observable

  }
  private doLogout(){
    if(this.srvToken.token){
    this.srvToken.eliminarTokens();
    }
    this.usrActualSubject.next(this.getUserActual());//agrega datos a un observable
    this.router.navigate(['/login']);

  }

  private getUserActual():User{
    if (!this.srvToken.token) {
      return new User();
    }
    const tokenD=this.srvToken.decodeToken();
    console.log(tokenD);
    return  {idUsuario: tokenD.sub,nombre: tokenD.nom, rol:tokenD.rol};
  }

  public isloged():boolean{ //verifica si exite el token y que no ha expirado
    return !!this.srvToken && !this.srvToken.jwtTokenExp();
  }

  public verificarRefrescar():boolean{
    if(this.isloged() && this.srvToken.tiempoExpToken()<=20){
      this.srvToken.refreshTokens();
      return true;
    }
      return false;
  }
  //

}
