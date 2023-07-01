import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, retry, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { DetailModel } from '../models/detail.model';
//import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  SRV : string = environment.SRV;

   httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
   }

  constructor(private http: HttpClient) { }
  
  buscar( id : any) : Observable<DetailModel> {
    return this.http.get<DetailModel>(`${this.SRV}/detail/${id}`).pipe(retry(1), 
    catchError(this.handleError));
    }

  filtar (parametros : any,pag : number, lim : number): Observable<DetailModel[]>{
    let params = new HttpParams;
    for(const prop in parametros){
      if(prop){
        params = params.append(prop,parametros[prop]);
      }
    }
    //this.http.get<DetailModel>(this.SRV+'/detail/'+pag+'/'+lim);
   return this.http.get<DetailModel[]>(`${this.SRV}/detail/${pag}/${lim}`,{params:params}).pipe(retry(1), catchError(this.handleError));
   console.log("editando")
  }
  filtro (): Observable<DetailModel[]>{
    //this.http.get<ProductModel>(this.SRV+'/product/'+pag+'/'+lim);
   return this.http.get<DetailModel[]>(`${this.SRV}/detail/data`).pipe(retry(1), catchError(this.handleError));
   console.log("editando")
  }

  guardar(datos : any, id? : any): Observable<any>{
    //AL RECIBIR UN STRING INDICA QUE EL USUARIO INGRESÓ UN ID PARA CREAR
    //AL RECIBIR UN INT INDICA QUE EL USUARIO MODIFICARÁ UN ID ESPECÍFICO
    //POR ESTO VERIFICO CON TYPEOF EL TIPO DE DATO DEL ID
    if(typeof(id) !== 'string' ){
    //BORRAMOS EL ID PARA ENVIAR AL SERVIDOR SOLO LOS DATOS DEL ID QUE MODIFICAREMOS
      delete datos.idDetails;
      return this.http.put(`${this.SRV}/details/${id}`,datos,this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
    }
    console.log("CREANDO NUEVO", datos);
    return this.http.post(`${this.SRV}/details`,datos, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  eliminar(id: any) : Observable<any>{
    return this.http.delete(`${this.SRV}/detail/${id}`).pipe(retry(1), catchError(this.handleError));
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
