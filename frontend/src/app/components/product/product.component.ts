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
import { ProductService } from 'src/app/shared/services/product.service';
import { ProductModel } from 'src/app/shared/models/product.model';
import { WarehouseModel } from 'src/app/shared/models/warehouse.model';
import { WarehouseService } from 'src/app/shared/services/warehouse.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
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
export class ProductComponent implements OnInit {
  filtro: any;
  srvWarehouse = inject(WarehouseService); // Injectar Dependencia
  srvProduct = inject(ProductService); // Injectar Dependencia
  fb = inject(FormBuilder); // Injectar
  srvPrint = inject(PrintService);
  router = inject(Router); // Injectar
  frmProduct: FormGroup;
  products = [new ProductModel()];
  warehouse = [new WarehouseModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPPag = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;

  constructor() {
    this.frmProduct = this.fb.group({
      idProduct: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ], //requerido - numeros -tamMax(15) -tamMin(9)
      idSupplier: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ], //requerido - numeros -tamMax(15) -tamMin(9)

      idClassification: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ], //requerido - numeros -tamMax(15) -tamMin(9)

      productDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.pattern('([A-Za-záéíóúñÑ]*)( ([A-Za-záéíóúñÑ]*)){0,5}')
        ],
      ], //requerido -tamMin(9)-formato(letras)
      priceProduct: ['', [Validators.required]],
      expirationProduct: [''],
    });
  }
  get F() {
    return this.frmProduct.controls;
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
      idProduct: this.frmProduct.value.idProduct,
      idSupplier: this.frmProduct.value.idSupplier,
      idClassification: this.frmProduct.value.idClassification,
      productDescription: this.frmProduct.value.productDescription,
      priceProduct: this.frmProduct.value.priceProduct,
      expirationProduct: this.frmProduct.value.expirationProduct,
    };
    const texto = this.frmProduct.value.idProduct
      ? 'Actualizado correctamente'
      : 'Creado correctamente';
      console.log(texto);

    this.srvProduct.guardar(cliente, this.frmProduct.value.idProduct).subscribe({
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
    this.titulo = 'Nuevo Producto';
    console.log('Creando Nuevo');
    this.frmProduct.reset();
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
        this.srvProduct.eliminar(id).subscribe({
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
    this.srvProduct.buscar(id).subscribe((data) => {
      console.log(data);
      Swal.fire({
        title: '<strong> Informacion Producto</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th>ID</th>' +
          `<td>${data.idProduct}</td></tr>` +
          '<tr><th>Proveedor</th>' +
          `<td>${data.supplierDescription}</td></tr>` +
          '<tr><th>Clasificacion</th>' +
          `<td>${data.classificationDescription}</td></tr>` +
          '<tr><th>Producto</th>' +
          `<td>${data.productDescription}</td></tr>` +
          '<tr><th>Precio</th>' +
          `<td>${data.priceProduct}</td></tr>` +
          '<tr><th>Fecha expiración</th>' +
          `<td>${data.expirationProduct}</td></tr>` +
          '</tbody>' +
          '</table>',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      });
    });
  }

  onEditar(id: any) {
    this.titulo = 'Editando Producto';
    this.srvProduct.buscar(id).subscribe(
      /*data => {
      console.log(data);
      this.frmProduct.setValue(data)
      }*/
      {
        next: (data) => {
          this.frmProduct.setValue(data);
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
    if (this.filtroVisible) {
      this.srvWarehouse
      .filtrar(this.filtro, this.pagActual, this.itemsPPag)
      .subscribe((data) => {
        this.warehouse = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        console.log(this.products);
      });
    }else{
      this.srvProduct
      .filtar()
      .subscribe((data) => {
        this.products = data;
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
    const encabezado = ["ID","Proveedor","Clasificación","Descripción","Precio", "Expiración Producto"];
    this.srvProduct.filtar()
    .subscribe(
      data => {
        const cuerpo = Object(data)['datos']
        .map(
          (Obj : any) => {
            const datos = [
              Obj.idProduct,
              Obj.supplierDescription,
              Obj.classificationDescription,
              Obj.productDescription,
              Obj.priceProduct,
              Obj.expirationProduct
            ]
            return datos;
          }
        )
        this.srvPrint.print(encabezado, cuerpo, "Listado de products",true);
      }
    );
  }
  resetearFiltro() {
    this.filtro = { idProduct: '', idSupplier: '', idClassification: '', productDescription: '' };
    this.filtrar();
  }

  ngOnInit() {
    this.resetearFiltro();
  }
}
