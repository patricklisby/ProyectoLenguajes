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
import { WarehouseModel } from 'src/app/shared/models/warehouse.model';
import { WarehouseService } from 'src/app/shared/services/warehouse.service';

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
      idWareHouse: [
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
    const warehouseData = {
      idWareHouse: this.frmWarehouse.value.idWareHouse,
      idProduct: this.frmWarehouse.value.idProduct,
      productDescription: this.frmWarehouse.value.productDescription,
      cantItem: this.frmWarehouse.value.cantItem
    };

    const texto = this.frmWarehouse.value.idWareHouse
      ? 'Actualizado correctamente'
      : 'Creado correctamente';
    this.srvWarehouse.guardar(warehouseData, this.frmWarehouse.value.idWareHouse).subscribe({
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
              title: 'El códigod de bodega no existe',
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              showCancelButton: true,
              cancelButtonText: 'Cerrar',
            });
            break;

          case 409:
            Swal.fire({
              icon: 'error',
              title: 'La bodega ya existe ya existe',
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
    this.titulo = 'Nueva Bodega';
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
              'Bodega eliminado de forma correcta',
              'success'
            );
            this.filtrar(); // este actualiza
          }, //ejecutar el strim
          error: (e) => {
            console.log(e);
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'Bodega no existe!',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar la bodega',
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
        title: '<strong> Informacion Inventario</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th>ID</th>' +
          `<td>${data.idWareHouse}</td></tr>` +
          '<tr><th>ID Producto</th>' +
          `<td>${data.idProduct}</td></tr>` +
          '<tr><th>Producto</th>' +
          `<td>${data.productDescription}</td></tr>` +
          '<tr><th>Cantidad</th>' +
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
    this.titulo = 'Editando Bodega';
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
              title: 'Bodega no Existe',
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
    );
    console.log('Editando ', id);
  }
  onCerrar() {
    this.router.navigate(['']);
  }

  filtrar() {
      if (this.filtroVisible) {
        this.srvWarehouse
        .filtrar(this.filtro, this.pagActual, this.itemsPPag)
        .subscribe((data) => {
          this.warehouses = Object(data)['datos'];
          this.numRegs = Object(data)['regs'];
        });
      }else{
        this.srvWarehouse
        .filtro()
        .subscribe((data) => {
          this.warehouses = data;
        });
      }
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
    const encabezado = ["ID","Nombre producto","Cantidad"];
    console.log(this.filtro);
    this.srvWarehouse.filtro()
    .subscribe(
      (data) => {
        const cuerpo = data
        .map((item) => [
              item.idWareHouse,
              item.productDescription,
              item.cantItem,
            ])
        this.srvPrint.print(encabezado, cuerpo, "Listado de Bodega",true);
        return cuerpo;
        });

  }

  resetearFiltro() {
    this.filtro = { idWareHouse: '', productDescription: ''};
    this.filtrar();
  }

  ngOnInit() {
    this.resetearFiltro();
  }
}
