import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, retry, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { PersonModel } from '../models/person.model';
//import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  SRV : string = environment.SRV;

   httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
   }

  constructor(private http: HttpClient) { }
  
  buscar( id : any) : Observable<PersonModel> {
    return this.http.get<PersonModel>(`${this.SRV}/person/${id}`).pipe(retry(1), 
    catchError(this.handleError));
    }

  filtar (parametros : any,pag : number, lim : number): Observable<PersonModel[]>{
    let params = new HttpParams;
    for(const prop in parametros){
      if(prop){
        params = params.append(prop,parametros[prop]);
      }
    }
    //this.http.get<PersonModel>(this.SRV+'/person/'+pag+'/'+lim);
   return this.http.get<PersonModel[]>(`${this.SRV}/person/${pag}/${lim}`,{params:params}).pipe(retry(1), catchError(this.handleError));
   console.log("editando")
  }

  guardar(datos : any, id? : any): Observable<any>{
    if (id) {//modificar
      return this.http.put(`${this.SRV}/person/${id}`,datos, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
      console.log("editando")

    } else {//crear
      return this.http.post(`${this.SRV}/person`,datos, this.httpOptions).pipe(retry(1), catchError(this.handleError));
      console.log("crear nuevo")
    }
  }

  eliminar(id: any) : Observable<any>{
    return this.http.delete(`${this.SRV}/person/${id}`).pipe(retry(1), catchError(this.handleError));
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
