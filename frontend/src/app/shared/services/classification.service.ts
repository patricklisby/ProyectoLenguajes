import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, retry, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ClassificationModel } from '../models/classification.model';
//import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  SRV : string = environment.SRV;

   httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
   }

  constructor(private http: HttpClient) { }

  buscar( id : any) : Observable<ClassificationModel> {
    return this.http.get<ClassificationModel>(`${this.SRV}/classification/${id}`)
    .pipe(retry(1),
    catchError(this.handleError));
    }

  filtar (parametros : any,pag : number, lim : number): Observable<ClassificationModel[]>{
    let params = new HttpParams;
    for(const prop in parametros){
      if(prop){
        params = params.append(prop,parametros[prop]);
      }
    }
    //this.http.get<ClassificationModel>(this.SRV+'/classification/'+pag+'/'+lim);
    console.log("filtrando")
   return this.http.get<ClassificationModel[]>(`${this.SRV}/classification/${pag}/${lim}`,{params:params}).pipe(retry(1), catchError(this.handleError));

  }

  guardar(datos : any, id? : any): Observable<any>{
    if (this.buscar(id)) {//modificar
      console.log("editando",datos)//
      return this.http.put(`${this.SRV}/classification/${id}`,datos, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));

    } else {//crear
      console.log("crear nuevo "+`${this.SRV}/classification`,datos, this.httpOptions);
      return this.http.post(`${this.SRV}/classification`,datos, this.httpOptions).pipe(retry(1), catchError(this.handleError));

    }
  }

  eliminar(id: any) : Observable<any>{
    return this.http.delete(`${this.SRV}/classification/${id}`).pipe(retry(1), catchError(this.handleError));
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
