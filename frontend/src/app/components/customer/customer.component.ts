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
import { CustomerService } from 'src/app/shared/services/customer.service';
import { CustomerModel } from 'src/app/shared/models/customer.model';
import * as moment from 'moment';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
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
export class CustomerComponent implements OnInit {
  filtro: any;
  srvCustomer = inject(CustomerService); // Injectar Dependencia
  fb = inject(FormBuilder); // Injectar
  srvPrint = inject(PrintService);
  router = inject(Router); // Injectar
  frmCustomer: FormGroup;
  customers = [new CustomerModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPPag = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;

  constructor() {
    this.frmCustomer = this.fb.group({
      idCustomer: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ], //requerido - numeros -tamMax(15) -tamMin(9)

      nameCustomer: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('([A-Za-záéíóúñÑ]*)( ([A-Za-záéíóúñÑ]*)){0,4}'),
        ],
      ], //requerido - -tamMin(9)-formato(letras un espacio)

      firstLastNameCustomer: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern('([A-Za-záéíóúñÑ]*)( ([A-Za-záéíóúñÑ]*)){0,3}'),
        ],
      ], //requerido - tamMin(9)-formato(letras)

      secondLastNameCustomer: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern('([A-Za-záéíóúñÑ]*)( ([A-Za-záéíóúñÑ]*)){0,3}'),
        ],
      ], //requerido -tamMin(9)-formato(letras)

      customerEmail: [
        '',
        [Validators.required, , Validators.email]
      ], //requerido - formato(####-####)

      customerPhone: ['', [Validators.pattern('[0-9]{4}-[0-9]{4}')]], //- formato(####-####)

      customerAddress: ['', [Validators.minLength(5)]], //tamMin(9)

      admissionDate: [''],
    });
  }
  get F() {
    return this.frmCustomer.controls;
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
    const customer = {
      idCustomer: this.frmCustomer.value.idCustomer,
      nameCustomer: this.frmCustomer.value.nameCustomer,
      firstLastNameCustomer: this.frmCustomer.value.firstLastNameCustomer,
      secondLastNameCustomer: this.frmCustomer.value.secondLastNameCustomer,
      customerEmail: this.frmCustomer.value.customerEmail,
      customerPhone: this.frmCustomer.value.customerPhone,
      customerAddress: this.frmCustomer.value.customerAddress,
      admissionDate: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    const texto = this.frmCustomer.value.idCustomer
      ?  'Creado correctamente'
      :'Actualizado correctamente';
      console.log(customer);

    this.srvCustomer.guardar(customer,this.frmCustomer.value.idCustomer).subscribe({
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
    this.frmCustomer.reset();
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
        this.srvCustomer.eliminar(id).subscribe({
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
    this.srvCustomer.buscar(id).subscribe((data) => {
      console.log(data);
      const fechaIng = new Date(data.admissionDate!).toLocaleDateString('es-Es');
      Swal.fire({
        title: '<strong> Informacion Cliente</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th>Id</th>' +
          `<td>${data.idCustomer}</td></tr>` +
          '<tr><th>nameCustomer</th>' +
          `<td>${data.nameCustomer}${data.firstLastNameCustomer}${data.secondLastNameCustomer}</td></tr>` +
          '<tr><th>customerEmail</th>' +
          `<td>${data.customerEmail}</td></tr>` +
          '<tr><th>customerPhone</th>' +
          `<td>${data.customerPhone}</td></tr>` +
          '<tr><th>Fecha Ingreso</th>' +
          `<td>${fechaIng}</td></tr>` +
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
    this.srvCustomer.buscar(id).subscribe(
      /*data => {
      console.log(data);
      this.frmCustomer.setValue(data)
      }*/
      {
        next: (data) => {
          this.frmCustomer.setValue(data);
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
    this.srvCustomer
      .filtar(this.filtro, this.pagActual, this.itemsPPag)
      .subscribe((data) => {
        this.customers = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        //console.log(data);
        console.log(this.customers);
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
    const encabezado = ["ID","Nombre","Correo", "Telefono","Dirección","Fecha Ingreso"];
    this.srvCustomer.filtar(this.filtro,1, this.numRegs)
    .subscribe(
      data => {
        const cuerpo = Object(data)['datos']
        .map(
          (Obj : any) => {
            const datos = [
              Obj.idCustomer,
              Obj.nameCustomer+ ' '+ Obj.firstLastNameCustomer + ' '+Obj.secondLastNameCustomer,
              Obj.customerEmail,
              Obj.customerPhone,
              Obj.customerAddress.
              Obj.admissionDate
            ]
            return datos;
          }
        )
        this.srvPrint.print(encabezado, cuerpo, "Listado de Clientes",true);
      }
    );
  }
  resetearFiltro() {
    this.filtro = { idCustomer: '', nameCustomer: '', firstLastNameCustomer: '', secondLastNameCustomer: '' };
    this.filtrar();
  }

  ngOnInit() {
    this.resetearFiltro();
  }
}
