import { Component, OnInit, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  MaxLengthValidator,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { PrintService } from 'src/app/shared/services/print.service';
import { RolService } from 'src/app/shared/services/rol.service';
import { RolModel } from 'src/app/shared/models/roles.model';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css'],
  animations: [
    trigger('estadoFiltro', [
      state(
        'show',
        style({
          'max-height': '100%',
          opacity: '1',
          visibility: 'visible',
        })
      ),
      state(
        'hide',
        style({
          'max-height': '0%',
          opacity: '0',
          visibility: 'hide',
        })
      ),
      transition('show=>hide', animate('600ms ease-in-out')),
      transition('hide=>show', animate('100ms ease-in-out')),
    ]),
  ],
})
export class RolComponent implements OnInit {
  filtro: any;
  srvRol = inject(RolService); // Injectar Dependencia
  fb = inject(FormBuilder); // Injectar
  srvPrint = inject(PrintService);
  router = inject(Router); // Injectar
  frmRol: FormGroup;
  roles = [new RolModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPPag = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;

  constructor() {
    this.frmRol = this.fb.group({
      idRol: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
          Validators.pattern('[0-9]*'),
        ],
      ],
      rolDescription: ['', [Validators.required,Validators.minLength(3)]],
    });
  }
  get F() {
    return this.frmRol.controls;
  }

  get stateFiltro() {
    return this.filtroVisible ? 'show' : 'hide';
  }

  onCambioPag(e: any) {
    this.pagActual = e;
    this.filtrar();
  }
  onCambioTam(e: any) {
    this.itemsPPag = e.target.value;
    this.pagActual = 1;
    this.filtrar();
  }

  onSubmit() {
    console.log("Si entro");
    const rol = {
      idRol: this.frmRol.value.idRol,
      rolDescription: this.frmRol.value.rolDescription,
    };
     console.log("Soy rol");
    console.log(rol);
   
    
    const texto = this.frmRol.value.idRol
      ? 'Actualizado correctamente'
      : 'Creado correctamente';
      console.log("Texto");
      
      console.log(texto);
       console.log("Id rol");
       
      console.log(this.frmRol.value.idRol);
      
    this.srvRol.guardar(rol, this.frmRol.value.idRol)
    .subscribe({
      complete: () => {
        this.filtrar(); // este actualiza
        Swal.fire({
          icon: 'success',
          title: texto,
          showConfirmButton: false,
          timer: 1000,
        });
      },

      error: (e) => {
        switch (e) {
          case 404:
            Swal.fire({
              icon: 'error',
              title: 'El rol no existe',
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              showCancelButton: true,
              cancelButtonText: 'Cerrar',
            });
            break;

          case 409:
            Swal.fire({
              icon: 'error',
              title: 'id rol ya existe',
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              showCancelButton: true,
              cancelButtonText: 'Cerrar',
            });
            break;
        }
        this.filtrar(); // este actualiza
      },
    });
    console.log("Cumpli");
    
  }
  //@Output()
  getRoles (){
    let id : any, description : string;
    const params : any =[];
   this.roles.forEach(item => {
     id = item.idRol,
    description = item.rolDescription
    //console.log(item.idRol)
    //console.log(id);
    //console.log(description);
    params.push(id)
    params.push(description)
    
    //console.log(item.rolDescription)
    
   });
    console.log(params);
    return params;
    
  }

  onNuevo() {
    this.titulo = 'Nuevo Rol';
    console.log('Creando Nuevo');
    this.frmRol.reset();
  }

  onEliminar(id: any, nombre: string) {
    Swal.fire({
      title: 'Estas seguro de eliminar ?',
      text: nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvRol.eliminar(id).subscribe({
          // este tipo de subscribe se usa cuando viene de un pipe
          //next: () =>{},//proximo dato en strim
          complete: () => {
            Swal.fire(
              'Eliminado',
              'Rol eliminado de forma correcta',
              'success'
            );
            this.filtrar(); // este actualiza
          }, //ejecutar el strim
          error: (e) => {
            //console.log(e);
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'Rol no existe!',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar Rol',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
            }
          }, //capturas los estados de error
        });
      }
    });
  }

  onInfo(id: any) {
    this.srvRol.buscar(id).subscribe((data) => {
      console.log(data);
      Swal.fire({
        title: '<strong> Informacion Rol</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th>Id</th>' +
          `<td>${data.idRol}</td></tr>` +
          '<tr><th>Nombre</th>' +
          `<td>${data.rolDescription}</td></tr>` +
          '</tbody>' +
          '</table>',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      });
    });
  }

  onEditar(id: any) {
    this.titulo = 'Editando Rol';
    this.srvRol.buscar(id).subscribe(
      {
        next: (data) => {
          this.frmRol.setValue(data);
        },
        error: (e) => {
          if (e == 404) {
            Swal.fire({
              title: 'Rol no Existe',
              icon: 'info',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonAriaLabel: '#d33',
              cancelButtonText: 'Cerrar',
            });
          }
          this.filtrar();
        },
      }
      //guardas
      ///ng g guard shared/guards/auth --skip-tests=true
    );
    console.log('Editando ', id);
  }
  onCerrar() {
    this.router.navigate(['/roles']);
  }

  filtrar() {
    this.srvRol
      .filtar(this.filtro, this.pagActual, this.itemsPPag)
      .subscribe((data) => {
        this.roles = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        //console.log(data);
        console.log(this.roles);
      });
  }
  onFiltrar() {
    this.filtroVisible = !this.filtroVisible;
    if (!this.filtroVisible) {
      this.resetearFiltro();
    }
  }
  onFiltrarChange(f: any) {
    this.filtro = f;
    this.filtrar();
  }
  onImprimir() {
    const encabezado = ['Id Rol', 'Descripción Rol'];
    this.srvRol.filtar(this.filtro, 1, this.numRegs).subscribe((data) => {
      const cuerpo = Object(data)['datos'].map((Obj: any) => {
        const datos = [Obj.idRol, Obj.rolDescription];
        return datos;
      });
      this.srvPrint.print(encabezado, cuerpo, 'Listado de Roles', true);
    });
  }
  resetearFiltro() {
    this.filtro = { idRol: '', rolDescription: '' };
    this.filtrar();
  }

  ngOnInit() {
    this.resetearFiltro();
  }
}
