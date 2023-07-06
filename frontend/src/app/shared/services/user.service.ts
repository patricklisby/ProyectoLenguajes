import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  SRV = environment.SRV;
  constructor() {}

  changePassw(id: any, datos: {}): Observable<any> {
    return this.http
      .patch(`${this.SRV}/user/passw/change/${id}`, datos)
      .pipe(retry(1), catchError(this.handleError));
  }
  resetPassw(id: any): Observable<any> {
    return this.http
      .patch(`${this.SRV}/user/passw/reset/${id}`, {
        passwN: id,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  //manejador de error
  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    });
  }
}
