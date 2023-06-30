import { Component, Inject, Input, OnInit, inject } from '@angular/core';
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
import { PersonService } from 'src/app/shared/services/person.service';
import { PersonModel } from 'src/app/shared/models/person.model';
import { RolModel } from 'src/app/shared/models/roles.model';
import { RolService } from 'src/app/shared/services/rol.service';

import { RolComponent } from '../rol/rol.component';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css'],
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
export class PersonComponent implements OnInit {
 // params
  filtro: any;
  srvPerson = inject(PersonService); // Injectar Dependencia
  srvRol = inject(RolService);
  fb = inject(FormBuilder); // Injectar
  srvPrint = inject(PrintService);
  router = inject(Router); // Injectar
  frmPerson: FormGroup;
  persons = [new PersonModel()];
  rolData = [new RolModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPPag = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;

  constructor() {
    this.frmPerson = this.fb.group({
      idPerson: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ], //requerido - numeros -tamMax(15) -tamMin(9)
      idRol: [
        '',
        [Validators.required],
      ], //requerido - numeros -tamMax(15) -tamMin(9)

      namePerson: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('([A-Za-záéíóúñÑ]*)( ([A-Za-záéíóúñÑ]*)){0,4}'),
        ],
      ], //requerido - -tamMin(9)-formato(letras un espacio)

      firstLastNamePerson: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern('([A-Za-záéíóúñÑ]*)( ([A-Za-záéíóúñÑ]*)){0,3}'),
        ],
      ], //requerido - tamMin(9)-formato(letras)

      secondLastNamePerson: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern('([A-Za-záéíóúñÑ]*)( ([A-Za-záéíóúñÑ]*)){0,3}'),
        ],
      ], //requerido -tamMin(9)-formato(letras)

      personPhone: [
        '',
        [Validators.required, Validators.pattern('[0-9]{4}-[0-9]{4}')],
      ], //requerido - formato(####-####)


      personAddress: ['', [Validators.minLength(5)]], //tamMin(9)

      personEmail: ['', [Validators.required, , Validators.email]], //requerido - numeros -tamMax(15) -tamMin(9)
    });
  }
  get F() {
    return this.frmPerson.controls;
  }

  get stateFiltro() {
    return this.filtroVisible ? 'show' : 'hide';
  }
  @Input() params : any = [];
  onGetRol(){
    console.log(this.params);
    
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
    const person = {
      idPerson: this.frmPerson.value.idPerson,
      idRol: this.frmPerson.value.idRol,
      namePerson: this.frmPerson.value.namePerson,
      firstLastNamePerson: this.frmPerson.value.firstLastNamePerson,
      secondLastNamePerson: this.frmPerson.value.secondLastNamePerson,
      personPhone: this.frmPerson.value.personPhone,
      celular: this.frmPerson.value.celular,
      personAddress: this.frmPerson.value.personAddress,
      personEmail: this.frmPerson.value.personEmail,
    };
    const texto = this.frmPerson.value.idPerson
      ? 'Actualizado correctamente'
      : 'Creado correctamente';
    this.srvPerson.guardar(person, this.frmPerson.value.idPerson).subscribe({
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
              title: 'La persona no existe',
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              showCancelButton: true,
              cancelButtonText: 'Cerrar',
            });
            break;

          case 409:
            Swal.fire({
              icon: 'error',
              title: 'El ID de la persona ya existe',
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
    this.titulo = 'Nueva persona';
    console.log('Creando Nuevo');
    this.frmPerson.reset();
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
        this.srvPerson.eliminar(id).subscribe({
          // este tipo de subscribe se usa cuando viene de un pipe
          //next: () =>{},//proximo dato en strim
          complete: () => {
            Swal.fire(
              'Eliminado',
              'Persona eliminada de forma correcta',
              'success'
            );
            this.filtrar(); // este actualiza
          }, //ejecutar el strim
          error: (e) => {
            //console.log(e);
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'La persona no existe!',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar esta persona',
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
    this.srvPerson.buscar(id).subscribe((data) => {
      console.log(data);
      Swal.fire({
        title: '<strong> Informacion person</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th>Id</th>' +
          `<td>${data.idPerson}</td></tr>` +
          '<tr><th>namePerson</th>' +
          `<td>${data.namePerson}${data.firstLastNamePerson}${data.secondLastNamePerson}</td></tr>` +
          '<tr><th>Rol</th>' +
          `<td>${data.idRol}</td></tr>` +
          '<tr><th>personPhone</th>' +
          `<td>${data.personPhone}</td></tr>` +
          '<tr><th>personEmail</th>' +
          `<td>${data.personEmail}</td></tr>` +
          '<tr><th>Dirección</th>' +
          `<td>${data.personAddress}</td></tr>` +
          '</tbody>' +
          '</table>',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      });
    });
  }
 // console.log(onSelectRoles());
  

  onSelectRoles(){
    this.srvRol.extraerRol().subscribe((rolD) => {
    console.log(rolD);
  
    
    Swal.fire({
      title: '<strong> Informacion person</strong>',
      html:
        '<br>' +
        '<table class="table table-sm table-striped">' +
        '<tbody class="text-start">' +
        '<tr><th>Rotal</th>' +
        `<td>${rolD}</td></tr>` +
        '<tr><th>Id</th>' +
        `<td>${rolD.idRol}</td></tr>` +
        '<tr><th>Rol Description</th>' +
        `<td>${rolD.rolDescription}</td></tr>` +
        '</tbody>' +
        '</table>',
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
    });
    });
    console.log();
    
    
  }

  onEditar(id: any) {
    this.titulo = 'Editando Persona';
    this.srvPerson.buscar(id).subscribe(
      /*data => {
      console.log(data);
      this.frmPerson.setValue(data)
      }*/
      {
        next: (data) => {
          this.frmPerson.setValue(data);
        },
        error: (e) => {
          if (e == 404) {
            Swal.fire({
              title: 'La persona no existe',
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
    this.router.navigate(['/person']);
  }

  filtrar() {
    this.srvPerson
      .filtar(this.filtro, this.pagActual, this.itemsPPag)
      .subscribe((data) => {
        this.persons = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        //console.log(data);
        console.log(this.persons);
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
    const encabezado = ["Id", "Rol","Nombre","Correo","Telefono","Dirección"];
    this.srvPerson.filtar(this.filtro,1, this.numRegs)
    .subscribe(
      data => {
        const cuerpo = Object(data)['datos']
        .map(
          (Obj : any) => {
            const datos = [
              Obj.idPerson,
              Obj.namePerson+ ' '+ Obj.firstLastNamePerson + ' '+Obj.secondLastNamePerson,
              Obj.personEmail,
              Obj.personPhone,
              Obj.personAddress,
              
            ]
            return datos;
          }
        )
        this.srvPrint.print(encabezado, cuerpo, "Listado de personas",true);
      }
    );
  }
  resetearFiltro() {
    this.filtro = { idPerson: '', namePerson: '', firstLastNamePerson: '', secondLastNamePerson: '' };
    this.filtrar();
  }

  ngOnInit() {
    this.resetearFiltro();
  }
}
