import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { RolModel } from '../models/roles.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  SRV : string = environment.SRV;

  httpOptions = {
    headers : new HttpHeaders({
      'Content-Type' : 'application/json'
    })
  }

  constructor(private http : HttpClient) { }

  buscar( idRol : any) : Observable<RolModel>{
    console.log("No busque "+idRol);
    
    return this.http.get<RolModel>(`${this.SRV}/rol/${idRol}`)
    .pipe(retry(1), catchError(this.handleError));
    }

    filtar (parametros : any,pag : number, lim : number): Observable<RolModel[]>{
      let params = new HttpParams;
      for(const prop in parametros){
        if(prop){
          params = params.append(prop,parametros[prop]);
        }
      }
      //this.http.get<ClienteModel>(this.SRV+'/cliente/'+pag+'/'+lim);
     return this.http.get<RolModel[]>(`${this.SRV}/rol/${pag}/${lim}`,{params:params}).pipe(retry(1), catchError(this.handleError));
     console.log("editando")
    }

    guardar(datos : any, idRol? : any): Observable<any>{
      if (idRol) {//modificar
        console.log("editar");
        return this.http.put(`${this.SRV}/rol/${idRol}`,datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
        
  
      } else {//crear
        //console.log("crear nuevo "+`${this.SRV}/rol`,datos, this.httpOptions);
        return this.http.post(`${this.SRV}/rol`,datos, this.httpOptions).pipe(retry(1), catchError(this.handleError));
        
      }
    }


    eliminar(id: any) : Observable<any>{
      return this.http.delete(`${this.SRV}/rol/${id}`).pipe(retry(1), catchError(this.handleError));
    }
      //manejador de error
  private handleError(error: any) {
    return throwError(
      ()=> {
        return error.status;
      }
    );
  }
}
