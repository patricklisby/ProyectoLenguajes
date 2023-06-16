import { Component,Inject,OnInit,inject } from '@angular/core';
import { ClienteService } from '../../shared/services/cliente.service';
import { ClienteModel } from '../../shared/models/cliente.model';
import { FormBuilder,FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import {  Router} from '@angular/router';
import Swal from 'sweetalert2';
import { animate, state, style, transition, trigger } from '@angular/animations';




@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  animations:[
    trigger('estadoFiltro',[
      state('show',style({
        'max-height' : '100%' , 'opacity' : '1','visibility' : 'visible'

      })),
      state('hide',style({
        'max-height' : '0%' , 'opacity' : '0','visibility' : 'hide'

      })),
      transition('show=>hide', animate('600ms ease-in-out')),
      transition('hide=>show', animate('100ms ease-in-out')),
 ])
  ]

})

export class ClienteComponent implements OnInit{
  filtro: any;
  srvCliente = inject(ClienteService); // Injectar Dependencia
  fb = inject(FormBuilder); // Injectar
  router = inject(Router); // Injectar
  frmCliente : FormGroup;
  clientes = [new ClienteModel];
  titulo : string = "";
  pagActual = 1;
  itemsPPag = 5;
  numRegs = 0;
  paginas =[2,5,10,20,50];
  filtroVisible: boolean = false;

  constructor(){ 
    this.frmCliente = this.fb.group({
      id : [''], 
      idCliente : ['',[Validators.required, Validators.minLength(9), Validators.maxLength(15),
                      Validators.pattern('[0-9]*')]],//requerido - numeros -tamMax(15) -tamMin(9)

      nombre : ['',[Validators.required, Validators.minLength(3),Validators.maxLength(30),
                    Validators.pattern('([A-Za-záéíóúñÑ]*)( ([A-Za-záéíóúñÑ]*)){0,1}')]],//requerido - -tamMin(9)-formato(letras un espacio) 

      apellido1: ['',[Validators.required, Validators.minLength(2),Validators.maxLength(15),
      Validators.pattern('[A-Za-záéíóúñÑ]*')]],//requerido - tamMin(9)-formato(letras) 

      apellido2: ['',[Validators.required, Validators.minLength(2),Validators.maxLength(15),
      Validators.pattern('[A-Za-záéíóúñÑ]*')]],//requerido -tamMin(9)-formato(letras) 

      telefono : ['',[Validators.required, Validators.pattern('[0-9]{4}-[0-9]{4}')]],//requerido - formato(####-####) 

      celular : ['',[Validators.pattern('[0-9]{4}-[0-9]{4}')]],//- formato(####-####) 

      direccion : ['',[Validators.minLength(5)]],//tamMin(9)

      correo : ['',[Validators.required,,Validators.email]],//requerido - numeros -tamMax(15) -tamMin(9)
      
      fechaIngreso : ['']
      });
  }
  get F(){return this.frmCliente.controls;}
  
  get stateFiltro(){return this.filtroVisible?'show':'hide';}

  onCambioPag(e:any) {
    this.pagActual = e;
    this.filtrar();
  }
  onCambioTam(e:any){
    this.itemsPPag = e.target.value;
    this.pagActual= 1;
    this.filtrar();

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
    }
    const texto = this.frmCliente.value.id ? 'Actualizado correctamente' : 'Creado correctamente';
    this.srvCliente.guardar(cliente, this.frmCliente.value.id)
      .subscribe({
        complete : ()=> {
          this.filtrar();
          Swal.fire({
            icon: 'success',
            title: texto,
            showConfirmButton: false,
            timer : 1500
          });
        },

        error : (e) => {
          switch(e){
            case 404 :
              Swal.fire({
                icon: 'error',
                title: 'El cliente no existe',
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                showCancelButton: true,
                cancelButtonText: 'Cerrar'
              });
            break;

            case 409 :
              Swal.fire({
                icon: 'error',
                title: 'id cliente ya existe',
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                showCancelButton: true,
                cancelButtonText: 'Cerrar'
              });
            break;
          }
          this.filtrar();
    }
  });
  }

  onNuevo(){
    this.titulo = "Nuevo Cliente"
    console.log('Creando Nuevo');
    this.frmCliente.reset();
  }

  onEliminar(id : any, nombre :string){
    Swal.fire({
      title: 'Estas seguro de eliminar ?',
      text: nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
      this.srvCliente.eliminar(id)
      .subscribe(
        { // este tipo de subscribe se usa cuando viene de un pipe
          //next: () =>{},//proximo dato en strim
          complete: () => {
            Swal.fire(
              'Eliminado',
              'Cliente eliminado de forma correcta',
              'success'
            );
            this.filtrar();// este actualiza
          },//ejecutar el strim
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
                  cancelButtonText: 'Cerrar'
                })
                break
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar Cliente',
                  text:'El cliente tiene artefacto relacionado',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar'
                })
                break
            }
          }//capturas los estados de error
        });
      }
    });
  }

  onInfo(id : any){
    this.srvCliente.buscar(id)
    .subscribe(
      data =>{
        console.log(data);
        const fechaIng = new Date(data.fechaIngreso!).toLocaleDateString('es-Es');
        Swal.fire(
          {
            title: '<strong> Informacion Cliente</strong>',
            html : '<br>'+
            '<table class="table table-sm table-striped">'+
            '<tbody class="text-start">'+
            '<tr><th>Id</th>'+`<td>${data.idCliente}</td></tr>`+
            '<tr><th>Nombre</th>'+`<td>${data.nombre}${data.apellido1}${data.apellido2}</td></tr>`+
            '<tr><th>Telefono</th>'+`<td>${data.telefono}</td></tr>`+
            '<tr><th>Celular</th>'+`<td>${data.celular}</td></tr>`+
            '<tr><th>Correo</th>'+`<td>${data.correo}</td></tr>`+
            '<tr><th>Fecha Ingreso</th>'+`<td>${fechaIng}</td></tr>`+
            '</tbody>'+
            '</table>',
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Cerrar'
          }
        )
      }
    )
  }

  onEditar(id : any){
    this.titulo = "Editando Cliente"
    this.srvCliente.buscar(id)
    .subscribe( 
      /*data => {
      console.log(data);
      this.frmCliente.setValue(data)
      }*/
      {
        next:(data)=>{
          this.frmCliente.setValue(data)
        },
        error:(e) =>{
          if(e==404){
            Swal.fire(
              {
                title: 'Cliente no Existe',
                icon: 'info',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonAriaLabel: '#d33',
                cancelButtonText : 'Cerrar'

              }
            )
          }
          this.filtrar();
        }
      }
      //guardas
///ng g guard shared/guards/auth --skip-tests=true

    );
    console.log('Editando ',id);
  }
  onCerrar(){
    this.router.navigate(['']);
  }

  filtrar(){
    this.srvCliente.filtar(this.filtro,this.pagActual,this.itemsPPag)
    .subscribe(
      data =>{
        this.clientes = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        //console.log(data);
        console.log(this.clientes);
      }
    );
  }
  onFiltrar() {
    this.filtroVisible = !this.filtroVisible;
    if (!this.filtroVisible){
      this.resetearFiltro();
    }
  }
  onFiltrarChange(f:any) {
    this.filtro = f;
    this.filtrar();
  }
  resetearFiltro() {
    this.filtro ={idCliente: '',nombre: '',apellido1: '',apellido2: ''};
    this.filtrar();
  }
  

  ngOnInit(){
    this.resetearFiltro();
  }
}
