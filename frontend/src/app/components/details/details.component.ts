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
import { DetailService } from 'src/app/shared/services/detail.service';
import { DetailModel } from 'src/app/shared/models/detail.model';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
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
export class DetailsComponent implements OnInit {
  filtro: any;
  srvDetail = inject(DetailService); // Injectar Dependencia
  srvCustomer = inject(CustomerService);
  srvProduct = inject(ProductService);
  fb = inject(FormBuilder); // Injectar
  srvPrint = inject(PrintService);
  router = inject(Router); // Injectar
  frmDetail: FormGroup;
  details = [new DetailModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPPag = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;

  constructor() {
    this.frmDetail = this.fb.group({
      idDetail: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ], //requerido - numeros -tamMax(15) -tamMin(9)

      idCustomer: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ], //requerido - -tamMin(9)-formato(letras un espacio)

      idProduct: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ], //requerido - tamMin(9)-formato(letras)

      cantItem: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern('[0-9]*'),
        ],
      ], //requerido -tamMin(9)-formato(letras)
    });
  }
  get F() {
    return this.frmDetail.controls;
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
    const detail = {
      idDetail: this.frmDetail.value.idDetail,
      idCustomer: this.frmDetail.value.idCustomer,
      idProduct: this.frmDetail.value.idProduct,
      cantItem: this.frmDetail.value.cantItem,
    };
    const texto = this.frmDetail.value.idDetail
      ? 'Actualizado correctamente'
      : 'Creado correctamente';
    this.srvDetail.guardar(detail, this.frmDetail.value.idDetail).subscribe({
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
              title: 'El detalle no existe',
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              showCancelButton: true,
              cancelButtonText: 'Cerrar',
            });
            break;

          case 409:
            Swal.fire({
              icon: 'error',
              title: 'Detalle ya existe',
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
    this.titulo = 'Nuevo detalle';
    console.log('Creando Nuevo');
    this.frmDetail.reset();
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
        this.srvDetail.eliminar(id).subscribe({
          // este tipo de subscribe se usa cuando viene de un pipe
          //next: () =>{},//proximo dato en strim
          complete: () => {
            Swal.fire(
              'Eliminado',
              'Detalle eliminado de forma correcta',
              'success'
            );
            this.filtrar(); // este actualiza
          }, //ejecutar el strim
          error: (e) => {
            //console.log(e);
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'Detalle no existe!',
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
    this.srvDetail.buscar(id).subscribe((data) => {
      console.log(data);
      Swal.fire({
        title: '<strong> Informacion del Detalle</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th>Id</th>' +
          `<td>${data.idDetail}</td></tr>` +
          '<tr><th>Cliente</th>' +
          `<td>${data.nameCustomer}</td></tr>` +
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
    this.titulo = 'Editando Detalle';
    this.srvDetail.buscar(id).subscribe(
      /*data => {
      console.log(data);
      this.frmDetail.setValue(data)
      }*/
      {
        next: (data) => {
          this.frmDetail.setValue(data);
        },
        error: (e) => {
          if (e == 404) {
            Swal.fire({
              title: 'Detalle no Existe',
              icon: 'info',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonAriaLabel: '#d33',
              cancelButtonText: 'Cerrar',
            });
          }else if (e == 409) {
            Swal.fire({
              title: 'Detalle no ha sido editado',
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
  filtrarImpresion() {
    this.srvDetail
      .filtar(this.filtro, this.pagActual, this.itemsPPag)
      .subscribe((data) => {

        this.details = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        //console.log(data);
        console.log(this.details);
    });
  }
  filtrar() {
    /** 
    this.srvDetail
      .filtar(this.filtro, this.pagActual, this.itemsPPag)
      .subscribe((data) => {

        this.details = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        //console.log(data);
        console.log(this.details);
    });*/
    this.srvDetail
    .filtro()
    .subscribe((data) => {
      this.details = data;
      console.log(this.details);
    });
  }

  filtrarImp() {
     
    this.srvDetail
      .filtar(this.filtro, this.pagActual, this.itemsPPag)
      .subscribe((data) => {

        this.details = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        //console.log(data);
        console.log(this.details);
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
    const encabezado = ["ID","Cliente","Producto","Cantidad"];
    this.srvDetail.filtar(this.filtro,1, this.numRegs)
    .subscribe(
      data => {
        const cuerpo = Object(data)['datos']
        .map(
          (Obj : any) => {
            const datos = [
              Obj.idDetail,
              Obj.idCustomer,
              Obj.idProduct,
              Obj.cantItem,
            ]
            return datos;
          }
        )
        console.log(cuerpo);
        this.srvPrint.print(encabezado, cuerpo, "Listado detalle",true);
      }
    );
  }
  resetearFiltro() {
    this.filtro = { idDetail: '', idCustomer: '', idProduct: '', cantItem: '' };
    this.filtrar();
  }

  ngOnInit() {
    this.resetearFiltro();
  }
}
