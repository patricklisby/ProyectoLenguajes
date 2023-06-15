import { Component, OnInit, inject } from '@angular/core';
import { ClienteService } from '../../shared/services/cliente.service';
import { ClienteModel } from '../../shared/models/cliente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { state, trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  animations: [
    trigger('estadoFiltro', [
      state(
        'show',
        style({
          'max-height': '100%',
          transform: 'translateX' //'max-height' : '100%', 'opacity' : '1', 'visibility' : 'visible'
        })
      ),
      state(
        'hide',
        style({
          'max-height': '0',
          'opacity' : '0',
          transform: 'translate(-100%)' //'max-height' : '0%', 'opacity' : '0', 'visibility' : '0'
        })
      ),
      transition('show => hide', animate('600ms ease-in-out')),
      transition('hide => show', animate('1000ms ease-in-out'))
    ])
  ]
})
export class ClienteComponent implements OnInit {
  filtro: any;
  srvCliente = inject(ClienteService);
  fb = inject(FormBuilder);
  router = inject(Router);
  frmCliente: FormGroup;
  clientes = [new ClienteModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPPag = 5;
  numRegs = 0;
  paginas = [2,5,10,20,50];
  filtroVisible : boolean = false;

  constructor() {
    this.frmCliente = this.fb.group({
      id: [''],
      idCliente: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(
            '([A-Za-ÑñáÁéÉíÍóÓúÚ]*)( ([A-Za-ÑñáÁéÉíÍóÓúÚ]*)){0,1}'
          ),
        ],
      ],
      apellido1: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.pattern(
            '([A-Za-ÑñáÁéÉíÍóÓúÚ]*)( ([A-Za-ÑñáÁéÉíÍóÓúÚ]*)){0,2}'
          ),
        ],
      ],
      apellido2: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.pattern(
            '([A-Za-ÑñáÁéÉíÍóÓúÚ]*)( ([A-Za-ÑñáÁéÉíÍóÓúÚ]*)){0,2}'
          ),
        ],
      ],
      telefono: [
        '',
        [Validators.required, Validators.pattern('[0-9]{4}-[0-9]{4}')],
      ],
      celular: ['', Validators.pattern('[0-9]{4}-[0-9]{4}')],
      direccion: ['', Validators.minLength(5)],
      correo: ['', [Validators.required, Validators.email]],
      fechaIngreso: [''],
    });
  }

  get stateFiltro(){
    return this.filtroVisible? 'show' : 'hide';
  }
  get F() {
    return this.frmCliente.controls;
  }
  onSubmit() {
    const cliente = {
      idCliente: this.frmCliente.value.idCliente,
      nombre: this.frmCliente.value.nombre,
      apellido1: this.frmCliente.value.apellido1,
      apellido2: this.frmCliente.value.apellido2,
      telefono: this.frmCliente.value.telefono,
      celular: this.frmCliente.value.celular,
      direccion: this.frmCliente.value.direccion,
      correo: this.frmCliente.value.correo,
    };
    const texto = this.frmCliente.value.id
      ? 'Cambios Guardados.'
      : 'Creado con éxtio.';
    this.srvCliente.guardar(cliente, this.frmCliente.value.id).subscribe({
      complete: () => {
        Swal.fire({
          title: texto,
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        this.filtrar();
      },
      error: (e) => {
        switch (e) {
          case 404:
            Swal.fire({
              title: 'Cliente no existe.',
              icon: 'info',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar',
            });
            this.filtrar();
            break;
          case 409:
            Swal.fire({
              title: 'Cliente ya existe',
              icon: 'info',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar',
            });
            this.filtrar();
            break;
        }
      },
    });
  }
  onNuevo() {
    this.titulo = 'Nuevo Cliente';
    //console.log('Creando nuevo');
    this.frmCliente.reset();
  }
  onEditar(id: any) {
    this.titulo = "Modificar Cliente";
    this.srvCliente.buscar(id)
    .subscribe({
      next : (data) => {
        this.frmCliente.setValue(data);
      },
      error : (e) => {
        if(e === 404){
          Swal.fire({
            title : 'Cliente no existe',
            icon : 'info',
            showCancelButton : true,
            showConfirmButton : false,
            cancelButtonAriaLabel : '#d33',
            cancelButtonText : 'Cerrar'
          })
        }
        this.filtrar();
      }
    });
    console.log('Editando ', id);
  }
  onEliminar(id: any, nombre: string) {
    Swal.fire({
      title: '¿Desea eliminar este cliente?',
      text: nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      //.then es una promesa
      if (result.isConfirmed) {
        this.srvCliente.eliminar(id).subscribe({
          complete : () => {
            Swal.fire(
              '¡Ha sido eliminado!',
              'Cliente eliminado exitosamente',
              'success'
            );
            this.filtrar();
          },
          error: (e) => {
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'Cliente no existe.',
                  icon: 'error',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                this.filtrar();
                break;
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar Cliente.',
                  text: 'El cliente está relacionado con artefacto',
                  icon: 'error',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                this.filtrar();
                break;
            }
          },
        });
      }
    });
  } //end onEditar
  resetearFiltro(){
    this.filtro = { idCliente: '', nombre: '', apellido1: '', apellido2: '' };
    this.filtrar();
  }
  onInfo(id: any) {
    this.srvCliente.buscar(id)
    .subscribe(
      data => {
        //var! = acepta nulos
        const fechaIng = new Date(data.fechaIngreso!).toLocaleDateString("es-Es");
        Swal.fire({
          title : '<strong>Información Cliente</strong>',
          html : '<br>'+
          '<table class = "table table-sm table-striped">'+
          '<tbody class = "text-start">'+
          '<tr><th>Id</th>'+`<td>${data.idCliente}</td></tr>`+
          '<tr><th>Nombre</th>'+`<td>${data.nombre} ${data.apellido1} ${data.apellido2}</td></tr>`+
          '<tr><th>Telefono</th>'+`<td>${data.telefono}</td></tr>`+
          '<tr><th>Celular</th>'+`<td>${data.celular}</td></tr>`+
          '<tr><th>Correo</th>'+`<td>${data.correo}</td></tr>`+
          '<tr><th>Fecha Ingreso</th>'+`<td>${fechaIng}</td></tr>`+
          '<tr><th>Direccion</th>'+`<td>${data.direccion}</td></tr>`+
          '</tbody>'+
          '</table>',
          showConfirmButton : false,
          showCancelButton : true,
          cancelButtonText : 'Cerrar'
        })
      }
    )
  }
  onCerrar() {
    this.router.navigate(['']);
  }
  onFiltrar(){
    this.filtroVisible = !this.filtroVisible;
    if(!this.filtroVisible){
      this.resetearFiltro;
    }
  }
  onFiltroChange(f : any){
    this.filtro = f;
    this.filtrar();
  }

  filtrar() {
    this.srvCliente.filtrar(this.filtro, this.pagActual, this.itemsPPag)
    .subscribe((data) => {
      this.clientes = Object(data)['datos'];
      this.numRegs = Object(data)['regs'];
      console.log(this.clientes);
    });
  }
  ngOnInit() {
    this.resetearFiltro();
  }
  onCambioTama(e : any){
    this.itemsPPag = e.target.value;
    this.pagActual = 1;
    this.filtrar();
  }

  onCambioPag(e : any){
    this.pagActual = e;
    this.filtrar();
  }
}
