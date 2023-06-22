import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { RolModel } from '../models/roles.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  SRV : string = environment.SRV;

  httpOptions = {
    headers : new HttpHeaders({
      'Content-Type' : 'application/json'
    })
  }

  constructor(private http : HttpClient) { }

  buscar( idCustomer : any) : Observable<RolModel>{
    console.log("No busque "+idCustomer);
    
    return this.http.get<RolModel>(`${this.SRV}/rol/${idCustomer}`)
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

    guardar(datos : any, idCustomer? : any): Observable<any>{
      if (idCustomer) {//modificar
        console.log("Guardar en la parte de editar "+this.SRV + " / rol "+idCustomer);
        return this.http.put(`${this.SRV}/rol/${idCustomer}`,datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
        
  
      } else {//crear
        console.log("creando nuevo")
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

