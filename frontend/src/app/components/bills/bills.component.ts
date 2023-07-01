import { Component, OnInit, inject } from '@angular/core';
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
import { BillsModel } from 'src/app/shared/models/bills.model';
import { BillService } from 'src/app/shared/services/bills.service';
import { DetailModel } from 'src/app/shared/models/detail.model';
import { PersonModel } from 'src/app/shared/models/person.model';

@Component({
  selector: 'app-Bills',
  templateUrl: './Bills.component.html',
  styleUrls: ['./Bills.component.css'],
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
export class BillsComponent implements OnInit {
  filtro: any;
  srvBills = inject(BillService); // Injectar Dependencia
  fb = inject(FormBuilder); // Injectar
  srvPrint = inject(PrintService);
  router = inject(Router); // Injectar
  frmBills: FormGroup;
  bills = [new BillsModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPPag = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;

  constructor() {
    this.frmBills = this.fb.group({
      idBill: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ],
      dateGeneration: [''],
    });
  }
  get F() {
    return this.frmBills.controls;
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
    const Bills = {
      idBills: this.frmBills.value.idBills,
      idDetail: this.frmBills.value.idDetail,
      idPerson: this.frmBills.value.idPerson,
    };
    const texto = this.frmBills.value.idBills
      ? 'Actualizado correctamente'
      : 'Creado correctamente';
      
    this.srvBills.guardar(Bills, this.frmBills.value.idBills)
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
              title: 'La factura no existe',
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              showCancelButton: true,
              cancelButtonText: 'Cerrar',
            });
            break;
          case 409:
            Swal.fire({
              icon: 'error',
              title: 'El identificador de la factura ya existe',
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
    this.filtrar(); // este actualiza
  }

  onNuevo() {
    this.titulo = 'Nueva Factura';
    console.log('Creando Nuevo');
    this.frmBills.reset();
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
        this.srvBills.eliminar(id).subscribe({
          // este tipo de subscribe se usa cuando viene de un pipe
          //next: () =>{},//proximo dato en strim
          complete: () => {
            Swal.fire(
              'Eliminado',
              'Bills eliminado de forma correcta',
              'success'
            );
            this.filtrar(); // este actualiza
          }, //ejecutar el strim
          error: (e) => {
            //console.log(e);
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'La factura no existe!',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar la factura',
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
    this.srvBills.buscar(id).subscribe((data) => {
      console.log(data);
      Swal.fire({
        title: '<strong> Información de la Factura</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th>Id</th>' +
          `<td>${data.idBill}</td></tr>` +
          '<tr><th>Id Detalle</th>' +
          `<td>${data.idDetail}</td></tr>` +
          '<tr><th>Id Persona</th>' +
          `<td>${data.idPerson}</td></tr>` +
          '</tbody>' +
          '</table>',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      });
    });
  }

  onEditar(id: any) {
    this.titulo = 'Editando Factura';
    this.srvBills.buscar(id).subscribe(
      {
        next: (data) => {
          this.frmBills.setValue(data);
        },
        error: (e) => {
          if (e == 404) {
            Swal.fire({
              title: 'Bills no Existe',
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
    this.router.navigate(['/bills']);
  }

  filtrar() {
    /** 
    this.srvBills
      .filtar(this.filtro, this.pagActual, this.itemsPPag)
      .subscribe((data) => {
        this.bills = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        //console.log(data);
        console.log(this.bills);
      });
      */

      this.srvBills
      .filtro()
      .subscribe((data) => {
        this.bills = data;
        console.log(this.bills);
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
    const encabezado = ['ID Factura', 'ID detalle','ID Persona','Fecha Creación'];
    this.srvBills.filtar(this.filtro, 1, this.numRegs).subscribe((data) => {
      const cuerpo = Object(data)['datos'].map((Obj: any) => {
        const datos = [Obj.idBills, Obj.idPerson, Obj.idDetail];
        return datos;
      });
      this.srvPrint.print(encabezado, cuerpo, 'Listado de Facturas', true);
    });
  }
  resetearFiltro() {
    this.filtro = { idBills: '', idDetail: '' , idDeidPerson: ''};
    this.filtrar();
  }

  ngOnInit() {
    this.resetearFiltro();
  }
}
