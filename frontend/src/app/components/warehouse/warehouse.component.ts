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
import { WarehouseService } from 'src/app/shared/services/warehouse.service';
import { WarehouseModel } from 'src/app/shared/models/warehouse.model';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css'],
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
export class WarehouseComponent implements OnInit {
  filtro: any;
  srvWarehouse = inject(WarehouseService); // Injectar Dependencia
  fb = inject(FormBuilder); // Injectar
  srvPrint = inject(PrintService);
  router = inject(Router); // Injectar
  frmWarehouse: FormGroup;
  warehouses = [new WarehouseModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPPag = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;

  constructor() {
    this.frmWarehouse = this.fb.group({
      idWarehouse: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ], //requerido - numeros -tamMax(15) -tamMin(9)

      idProduct: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ], //requerido - -tamMin(9)-formato(letras un espacio)

      cantItem: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern('[0-9]*'),
        ],
      ],
    });
  }
  get F() {
    return this.frmWarehouse.controls;
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
      idWarehouse: this.frmWarehouse.value.idWarehouse,
      idProduct: this.frmWarehouse.value.idProduct,
      cantItem: this.frmWarehouse.value.cantItem,
    };
    const texto = this.frmWarehouse.value.idWarehouse
      ? 'Actualizado correctamente'
      : 'Creado correctamente';
    this.srvWarehouse.guardar(cliente, this.frmWarehouse.value.idWarehouse).subscribe({
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
              title: 'El cliente no existe',
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              showCancelButton: true,
              cancelButtonText: 'Cerrar',
            });
            break;

          case 409:
            Swal.fire({
              icon: 'error',
              title: 'id cliente ya existe',
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
    this.titulo = 'Nuevo Cliente';
    console.log('Creando Nuevo');
    this.frmWarehouse.reset();
  }

  onEliminar(id: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvWarehouse.eliminar(id).subscribe({
          // este tipo de subscribe se usa cuando viene de un pipe
          //next: () =>{},//proximo dato en strim
          complete: () => {
            Swal.fire(
              'Eliminado',
              'Cliente eliminado de forma correcta',
              'success'
            );
            this.filtrar(); // este actualiza
          }, //ejecutar el strim
          error: (e) => {
            //console.log(e);
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'Cliente no existe!',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar Cliente',
                  text: 'El cliente tiene artefacto relacionado',
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
    this.srvWarehouse.buscar(id).subscribe((data) => {
      console.log(data);
      Swal.fire({
        title: '<strong> Informacion Cliente</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th>ID</th>' +
          `<td>${data.idWareHouse}</td></tr>` +
          '<tr><th>Producto</th>' +
          `<td>${data.idProduct}</td></tr>` +
          '<tr><th>Cantiddad</th>' +
          `<td>${data.cantItem}</td></tr>` +
          '</tbody>' +
          '</table>',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      });
    });
  }

  onEditar(id: any) {
    this.titulo = 'Editando Cliente';
    this.srvWarehouse.buscar(id).subscribe(
      /*data => {
      console.log(data);
      this.frmWarehouse.setValue(data)
      }*/
      {
        next: (data) => {
          this.frmWarehouse.setValue(data);
        },
        error: (e) => {
          if (e == 404) {
            Swal.fire({
              title: 'Cliente no Existe',
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
    this.srvWarehouse
      .filtrar(this.filtro, this.pagActual, this.itemsPPag)
      .subscribe((data) => {
        this.warehouses = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        //console.log(data);
        console.log(this.warehouses);
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
    const encabezado = ["ID","Producto","Cantidad"];
    this.srvWarehouse.filtrar(this.filtro,1, this.numRegs)
    .subscribe(
      data => {
        const cuerpo = Object(data)['datos']
        .map(
          (Obj : any) => {
            const datos = [
              Obj.idWarehouse,
              Obj.idProduct,
              Obj.cantItem,
            ]
            return datos;
          }
        )
        this.srvPrint.print(encabezado, cuerpo, "Listado de warehouses",true);
      }
    );
  }
  resetearFiltro() {
    this.filtro = { idWarehouse: '', idProduct: '', cantItem: ''};
    this.filtrar();
  }

  ngOnInit() {
    this.resetearFiltro();
  }
}
