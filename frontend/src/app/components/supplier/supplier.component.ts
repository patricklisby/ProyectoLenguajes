import { Component, Inject, OnInit, inject } from '@angular/core';
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
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { SupplierModel } from 'src/app/shared/models/supplier.model';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
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
export class SupplierComponent implements OnInit {
  filtro: any;
  srvSupplier = inject(SupplierService); // Injectar Dependencia
  fb = inject(FormBuilder); // Injectar
  srvPrint = inject(PrintService);
  router = inject(Router); // Injectar
  frmSupplier: FormGroup;
  suppliers = [new SupplierModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPPag = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;

  constructor() {
    this.frmSupplier = this.fb.group({
      idSupplier: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ], //requerido - numeros -tamMax(15) -tamMin(9)

      supplierDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('([A-Za-záéíóúñÑ]*)( ([A-Za-záéíóúñÑ]*)){0,5}'),
        ],
      ], //requerido - -tamMin(9)-formato(letras un espacio)

      supplierPhone: ['', [Validators.pattern('[0-9]{4}-[0-9]{4}')]],
      supplierAddress: ['', [Validators.minLength(5)]], //tamMin(9)

      supplierEmail: ['', [Validators.required, , Validators.email]], //requerido - numeros -tamMax(15) -tamMin(9)
    });
  }
  get F() {
    return this.frmSupplier.controls;
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
    const cliente = {
      idSupplier: this.frmSupplier.value.idSupplier,
      supplierDescription: this.frmSupplier.value.supplierDescription,
      supplierPhone: this.frmSupplier.value.supplierPhone,
      supplierAddress: this.frmSupplier.value.supplierAddress,
      supplierEmail: this.frmSupplier.value.supplierEmail,
    };
    const texto = this.frmSupplier.value.idSupplier
      ? 'Actualizado correctamente'
      : 'Creado correctamente';
    this.srvSupplier.guardar(cliente, this.frmSupplier.value.idSupplier).subscribe({
      complete: () => {
        this.filtrar();
        Swal.fire({
          icon: 'success',
          title: texto,
          showConfirmButton: false,
          timer: 1500,
        });
      },

      error: (e) => {
        switch (e) {
          case 404:
            Swal.fire({
              icon: 'error',
              title: 'El Proveedor no existe',
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              showCancelButton: true,
              cancelButtonText: 'Cerrar',
            });
            break;

          case 409:
            Swal.fire({
              icon: 'error',
              title: 'id proveedor ya existe',
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              showCancelButton: true,
              cancelButtonText: 'Cerrar',
            });
            break;
        }
        this.filtrar();
      },
    });
  }

  onNuevo() {
    this.titulo = 'Nuevo Proveedor';
    console.log('Creando Nuevo');
    this.frmSupplier.reset();
  }

  onEliminar(id: any) {
    Swal.fire({
      title: '¿Estás seguro (a) de eliminar ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvSupplier.eliminar(id).subscribe({
          // este tipo de subscribe se usa cuando viene de un pipe
          //next: () =>{},//proximo dato en strim
          complete: () => {
            Swal.fire(
              'Eliminado',
              'Poveedor eliminado de forma correcta',
              'success'
            );
            this.filtrar(); // este actualiza
          }, //ejecutar el strim
          error: (e) => {
            //console.log(e);
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'Proveedor no existe!',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar proveeodor',
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
    this.srvSupplier.buscar(id).subscribe((data) => {
      console.log(data);
      Swal.fire({
        title: '<strong> Informacion Proveedor</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th>Id</th>' +
          `<td>${data.idSupplier}</td></tr>` +
          '<tr><th>Descripción Proveedor</th>' +
          `<td>${data.supplierDescription}</td></tr>` +
          '<tr><th>Telefono</th>' +
          `<td>${data.supplierPhone}</td></tr>` +
          '<tr><th>Correo</th>' +
          `<td>${data.supplierEmail}</td></tr>` +
          '<tr><th>Dirección</th>' +
          `<td>${data.supplierAddress}</td></tr>` +
          '</tbody>' +
          '</table>',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      });
    });
  }

  onEditar(id: any) {
    this.titulo = 'Editando Proveedor';
    this.srvSupplier.buscar(id).subscribe(
      /*data => {
      console.log(data);
      this.frmSupplier.setValue(data)
      }*/
      {
        next: (data) => {
          this.frmSupplier.setValue(data);
        },
        error: (e) => {
          if (e == 404) {
            Swal.fire({
              title: 'Proveedor no Existe',
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
    this.router.navigate(['']);
  }

  filtrar() {
    this.srvSupplier
      .filtar(this.filtro, this.pagActual, this.itemsPPag)
      .subscribe((data) => {
        this.suppliers = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        //console.log(data);
        console.log(this.suppliers);
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
  onImprimir(){
    const encabezado = ["ID","Descripción Proveedor","Telefono","Correo","Dirección"];
    this.srvSupplier.filtar(this.filtro,1, this.numRegs)
    .subscribe(
      data => {
        const cuerpo = Object(data)['datos']
        .map(
          (Obj : any) => {
            const datos = [
              Obj.idSupplier,
              Obj.supplierDescription,
              Obj.supplierPhone,
              Obj.supplierEmail,
              Obj.supplierAddress
            ]
            return datos;
          }
        )
        this.srvPrint.print(encabezado, cuerpo, "Listado de suppliers",true);
      }
    );
  }
  resetearFiltro() {
    this.filtro = { idSupplier: '', supplierDescription: ''};
    this.filtrar();
  }

  ngOnInit() {
    this.resetearFiltro();
  }
}
