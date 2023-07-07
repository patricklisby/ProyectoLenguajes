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
import { ClassificationService } from 'src/app/shared/services/classification.service';
import { ClassificationModel } from 'src/app/shared/models/classification.model';

@Component({
  selector: 'app-Classification',
  templateUrl: './Classification.component.html',
  styleUrls: ['./Classification.component.css'],
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
export class ClassificationComponent implements OnInit {
  filtro: any;
  srvClassification = inject(ClassificationService); // Injectar Dependencia
  fb = inject(FormBuilder); // Injectar
  srvPrint = inject(PrintService);
  router = inject(Router); // Injectar
  frmClassification: FormGroup;
  classifications = [new ClassificationModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPPag = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;

  constructor() {
    this.frmClassification = this.fb.group({
      idClassification: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ],

      classificationDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(255),
          Validators.pattern('([A-Za-záéíóúñÑ]*)( ([A-Za-záéíóúñÑ]*)){0,15}'),
        ],
      ], //requerido - -tamMin(9)-formato(letras un espacio)
    });
  }
  get F() {
    return this.frmClassification.controls;
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
    const clasification = {
      idClassification: this.frmClassification.value.idClassification,
      classificationDescription: this.frmClassification.value.classificationDescription
    };
    const texto = this.frmClassification.value.idClassification
      ? 'Actualizado correctamente'
      : 'Creado correctamente';
    this.srvClassification.guardar(clasification, this.frmClassification.value.idClassification).subscribe({
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
              title: 'La clasificación no existe',
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              showCancelButton: true,
              cancelButtonText: 'Cerrar',
            });
            break;

          case 409:
            Swal.fire({
              icon: 'error',
              title: 'el id de la clasificación ya existe',
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
    this.titulo = 'Nueva clasificación';
    console.log('Creando Nuevo');
    this.frmClassification.reset();
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
        this.srvClassification.eliminar(id).subscribe({
          // este tipo de subscribe se usa cuando viene de un pipe
          //next: () =>{},//proximo dato en strim
          complete: () => {
            Swal.fire(
              'Eliminado',
              'Clasificación eliminada de forma correcta',
              'success'
            );
            this.filtrar(); // este actualiza
          }, //ejecutar el strim
          error: (e) => {
            console.log(e);
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'La clasificación no existe!',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar la clasificación',
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
    this.srvClassification.buscar(id).subscribe((data) => {
      console.log(data);
      Swal.fire({
        title: '<strong> Informacion Clasificación</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th>ID</th>' +
          `<td>${data.idClassification}</td></tr>` +
          '<tr><th>Descripción</th>' +
          `<td>${data.classificationDescription}</td></tr>` +
          '</tbody>' +
          '</table>',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      });
    });
  }

  onEditar(id: any) {
    this.titulo = 'Editando Clasificación';
    this.srvClassification.buscar(id).subscribe(
      /*data => {
      console.log(data);
      this.frmClassification.setValue(data)
      }*/
      {
        next: (data) => {
          this.frmClassification.setValue(data);
        },
        error: (e) => {
          if (e == 404) {
            Swal.fire({
              title: 'La clasificación no existe',
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
    this.srvClassification
      .filtar(this.filtro, this.pagActual, this.itemsPPag)
      .subscribe((data) => {
        this.classifications = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        console.log(data);
        console.log(this.classifications);
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
    const encabezado = ["ID","Descripcion"];
    this.srvClassification.filtar(this.filtro,1, this.numRegs)
    .subscribe(
      data => {
        const cuerpo = Object(data)['datos']
        .map(
          (Obj : any) => {
            const datos = [
              Obj.idClassification,
              Obj.classificationDescription
            ]
            return datos;
          }
        )
        this.srvPrint.print(encabezado, cuerpo, "Listado de clasificación",true);
      }
    );
  }
  resetearFiltro() {
    this.filtro = { idClassification: '', classificacionDescription: ''};
    this.filtrar();
  }

  ngOnInit() {
    this.resetearFiltro();
  }
}
