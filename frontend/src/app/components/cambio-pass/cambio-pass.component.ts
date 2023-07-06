import { Component, inject } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { notEqualsValidator } from 'src/app/shared/validators/passw-equals';
import { passwStrengthValidator } from 'src/app/shared/validators/passw-strength';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambio-pass',
  templateUrl: './cambio-pass.component.html',
  styleUrls: ['./cambio-pass.component.css'],
})
export class CambioPassComponent {
  frmChangePassw: FormGroup;
  fb = inject(FormBuilder);
  router = inject(Router);
  srvUser = inject(UserService);
  authSrv = inject(AuthService);
  errorLogin: boolean = false;

  constructor() {
    this.frmChangePassw = this.fb.group(
      {
        passw: ['', Validators.required],
        passwN: [
          '',
          [
            Validators.required,
            passwStrengthValidator(),
            Validators.minLength(8),
            
          ],
        ],
        passwR: ['', Validators.required],
      },
      { validator: notEqualsValidator() } as AbstractControlOptions
    );
  }
  get F() {
    return this.frmChangePassw.controls;
  }

  onSubmit() {
    this.srvUser
      .changePassw(this.authSrv.valorUserActual.idUsuario, {
        passw: this.frmChangePassw.value.passw,
        passwN: this.frmChangePassw.value.passwN,
      })
      .subscribe({
        complete: () => {
          Swal.fire({
            icon: 'success',
            title: "Contraseña cambiada",
            showConfirmButton: false,
            timer: 1500,
          });
          this.onCerrar();
        },
        error: (e) => {
          Swal.fire({
            title: "Credenciales no validas",
            icon: 'error',
            showCancelButton: true,
            showConfirmButton : false,
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cerrar'
          });
        },
      });
  }
  onCerrar() {
    this.router.navigate(['/home']);
  }
}
