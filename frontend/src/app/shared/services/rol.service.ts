import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, retry, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { RolModel } from '../models/roles.model';
//import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  SRV : string = environment.SRV;

   httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
   }

  constructor(private http: HttpClient) { }

  extraerRol() : Observable<RolModel> {
    return this.http.get<RolModel>(`${this.SRV}/rol/data`).pipe(retry(1), 
    catchError(this.handleError));
    }
  
  buscar( id : any) : Observable<RolModel> {
    return this.http.get<RolModel>(`${this.SRV}/rol/${id}`).pipe(retry(1), 
    catchError(this.handleError));
    }

  filtar (parametros : any,pag : number, lim : number): Observable<RolModel[]>{
    let params = new HttpParams;
    for(const prop in parametros){
      if(prop){
        params = params.append(prop,parametros[prop]);
      }
    }
    //this.http.get<RolModel>(this.SRV+'/rol/'+pag+'/'+lim);
   return this.http.get<RolModel[]>(`${this.SRV}/rol/${pag}/${lim}`,{params:params}).pipe(retry(1), catchError(this.handleError));
   console.log("editando")
  }

  guardar(datos : any, id? : any): Observable<any>{
    console.log("Soy ID");
    console.log(id);
    
    if (id) {//modificar
      console.log("Modificar");
      
      console.log(id);
      
      return this.http.put(`${this.SRV}/rol/${id}`,datos, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
      console.log("editando")

    } else {//crear
      return this.http.post(`${this.SRV}/rol`,datos, this.httpOptions).pipe(retry(1), catchError(this.handleError));
      console.log("crear nuevo")
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
