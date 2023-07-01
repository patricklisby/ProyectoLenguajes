import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, retry, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { SupplierModel } from '../models/supplier.model';
//import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  SRV : string = environment.SRV;

   httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
   }

  constructor(private http: HttpClient) { }
  
  buscar( id : any) : Observable<SupplierModel> {
    return this.http.get<SupplierModel>(`${this.SRV}/supplier/${id}`).pipe(retry(1), 
    catchError(this.handleError));
    }

  filtar (parametros : any,pag : number, lim : number): Observable<SupplierModel[]>{
    let params = new HttpParams;
    for(const prop in parametros){
      if(prop){
        params = params.append(prop,parametros[prop]);
      }
    }
    //this.http.get<SupplierModel>(this.SRV+'/supplier/'+pag+'/'+lim);
   return this.http.get<SupplierModel[]>(`${this.SRV}/supplier/${pag}/${lim}`,{params:params}).pipe(retry(1), catchError(this.handleError));
   console.log("editando")
  }

  guardar(datos : any, id? : any): Observable<any>{
    //AL RECIBIR UN STRING INDICA QUE EL USUARIO INGRESÓ UN ID PARA CREAR
    //AL RECIBIR UN INT INDICA QUE EL USUARIO MODIFICARÁ UN ID ESPECÍFICO
    //POR ESTO VERIFICO CON TYPEOF EL TIPO DE DATO DEL ID
    if(typeof(id) !== 'string' ){
    //BORRAMOS EL ID PARA ENVIAR AL SERVIDOR SOLO LOS DATOS DEL ID QUE MODIFICAREMOS
      delete datos.idSupplier;
      return this.http.put(`${this.SRV}/supplier/${id}`,datos,this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
    }
    console.log("CREANDO NUEVO", datos);
    return this.http.post(`${this.SRV}/supplier`,datos, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  eliminar(id: any) : Observable<any>{
    return this.http.delete(`${this.SRV}/supplier/${id}`).pipe(retry(1), catchError(this.handleError));
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
