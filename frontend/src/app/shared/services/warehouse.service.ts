import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, retry, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { WarehouseModel } from '../models/warehouse.model';
//import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  SRV : string = environment.SRV;

   httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
   }

  constructor(private http: HttpClient) { }

  buscar( id : any) : Observable<WarehouseModel> {
    return this.http.get<WarehouseModel>(`${this.SRV}/warehouse/${id}`).pipe(retry(1),
    catchError(this.handleError));
    }

    filtrar (parametros : any,pag : number, lim : number): Observable<WarehouseModel[]>{
      let params = new HttpParams;
      for(const prop in parametros){
        if(prop){
          params = params.append(prop,parametros[prop]);
        }
      }
      //this.http.get<ClassificationModel>(this.SRV+'/classification/'+pag+'/'+lim);
      console.log("filtrando")
     return this.http.get<WarehouseModel[]>(`${this.SRV}/warehouse/${pag}/${lim}`,{params:params}).pipe(retry(1), catchError(this.handleError));
  
    }

    filtro (): Observable<WarehouseModel[]>{
      //this.http.get<ProductModel>(this.SRV+'/product/'+pag+'/'+lim);
     return this.http.get<WarehouseModel[]>(`${this.SRV}/warehouse/data`).pipe(retry(1), catchError(this.handleError));
     console.log("editando")
    }

    guardar(datos : any, id? : any): Observable<any>{
      //AL RECIBIR UN STRING INDICA QUE EL USUARIO INGRESÓ UN ID PARA CREAR
      //AL RECIBIR UN INT INDICA QUE EL USUARIO MODIFICARÁ UN ID ESPECÍFICO
      //POR ESTO VERIFICO CON TYPEOF EL TIPO DE DATO DEL ID
      if(typeof(id) !== 'string' ){
      //BORRAMOS EL ID PARA ENVIAR AL SERVIDOR SOLO LOS DATOS DEL ID QUE MODIFICAREMOS
        delete datos.idWareHouse;
        return this.http.put(`${this.SRV}/warehouse/${id}`,datos,this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
      }
      console.log("CREANDO NUEVO", datos);
      return this.http.post(`${this.SRV}/warehouse`,datos, this.httpOptions).pipe(retry(1), catchError(this.handleError));
    }

  eliminar(id: any) : Observable<any>{
    return this.http.delete(`${this.SRV}/warehouse/${id}`).pipe(retry(1), catchError(this.handleError));
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
