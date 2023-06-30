import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, retry, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ProductModel } from '../models/product.model';
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
   console.log("editando")
  }

  guardar(datos : any, id? : any): Observable<any>{
    if (id) {//modificar
      return this.http.put(`${this.SRV}/warehouse/${id}`,datos, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
      console.log("editando")

    } else {//crear
      return this.http.post(`${this.SRV}/warehouse`,datos, this.httpOptions).pipe(retry(1), catchError(this.handleError));
      console.log("crear nuevo")
    }
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
