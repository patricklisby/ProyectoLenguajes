import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, retry, catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ProductModel } from '../models/product.model';
import { WarehouseModel } from '../models/warehouse.model';

//import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  SRV : string = environment.SRV;

   httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
   }

  constructor(private http: HttpClient) { }

  buscar( id : any) : Observable<ProductModel> {
    return this.http.get<ProductModel>(`${this.SRV}/product/${id}`).pipe(retry(1),
    catchError(this.handleError));
    }

  filtar (): Observable<ProductModel[]>{
    //this.http.get<ProductModel>(this.SRV+'/product/'+pag+'/'+lim);
   return this.http.get<ProductModel[]>(`${this.SRV}/warehouse/alldata`).pipe(retry(1), catchError(this.handleError));
  }
  
  filtrar(parametros: any, pag: number, lim: number): Observable<ProductModel[]> {
    let params = new HttpParams();
  
    for (const prop in parametros) {
      if (parametros.hasOwnProperty(prop)) {
        params = params.append(prop, parametros[prop]);
      }
    }
  
    return this.http.get<ProductModel[]>(`${this.SRV}/product/${pag}/${lim}`, { params }).pipe(
      tap(() => {
        console.log('Request made with parameters:', parametros);
      }),
      retry(1),
      catchError(this.handleError)
    );
  }

  guardar(datos : any, id? : any): Observable<any>{
    //AL RECIBIR UN STRING INDICA QUE EL USUARIO INGRESÓ UN ID PARA CREAR
    //AL RECIBIR UN INT INDICA QUE EL USUARIO MODIFICARÁ UN ID ESPECÍFICO
    //POR ESTO VERIFICO CON TYPEOF EL TIPO DE DATO DEL ID
    if(typeof(id) !== 'string' ){
    //BORRAMOS EL ID PARA ENVIAR AL SERVIDOR SOLO LOS DATOS DEL ID QUE MODIFICAREMOS
      delete datos.idProduct;
      console.log("EDITAR",id,JSON.stringify(datos));

      return this.http.put(`${this.SRV}/product/${id}`,datos,this.httpOptions).pipe(retry(1), catchError(this.handleError));
    }



    console.log("CREANDO NUEVO", JSON.stringify(datos));
    return this.http.post(`${this.SRV}/product`,datos, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  eliminar(id: any) : Observable<any>{
    return this.http.delete(`${this.SRV}/product/${id}`).pipe(retry(1), catchError(this.handleError));
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
