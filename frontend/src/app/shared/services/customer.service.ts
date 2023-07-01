import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, retry, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CustomerModel } from '../models/customer.model';
//import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  SRV : string = environment.SRV;

   httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
   }

  constructor(private http: HttpClient) { }

  buscar( id : any) : Observable<CustomerModel> {
    return this.http.get<CustomerModel>(`${this.SRV}/customer/${id}`).pipe(retry(1),
    catchError(this.handleError));
    }

  filtar (parametros : any,pag : number, lim : number): Observable<CustomerModel[]>{
    let params = new HttpParams;
    for(const prop in parametros){
      if(prop){
        params = params.append(prop,parametros[prop]);
      }
    }
    //this.http.get<CustomerModel>(this.SRV+'/customer/'+pag+'/'+lim);
   return this.http.get<CustomerModel[]>(`${this.SRV}/customer/${pag}/${lim}`,{params:params}).pipe(retry(1), catchError(this.handleError));
   console.log("editando")
  }

  guardar(datos : any, id? : any): Observable<any>{
    //AL RECIBIR UN STRING INDICA QUE EL USUARIO INGRESÓ UN ID PARA CREAR
    //AL RECIBIR UN INT INDICA QUE EL USUARIO MODIFICARÁ UN ID ESPECÍFICO
    //POR ESTO VERIFICO CON TYPEOF EL TIPO DE DATO DEL ID
    if(typeof(id) !== 'string' ){
      delete datos.idCustomer;
      delete datos.admissionDate;
      console.log("EDITANDO ",id, datos);
      return this.http.put(`${this.SRV}/customer/${id}`,datos,this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
    }
    console.log("CREANDO NUEVO", datos);
    return this.http.post(`${this.SRV}/customer`,datos, this.httpOptions).pipe(retry(1), catchError(this.handleError));

  }


  eliminar(id: any) : Observable<any>{
    return this.http.delete(`${this.SRV}/customer/${id}`).pipe(retry(1), catchError(this.handleError));
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
