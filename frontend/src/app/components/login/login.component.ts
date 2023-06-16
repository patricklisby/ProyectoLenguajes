import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  frmLogin : FormGroup;
  fb = inject(FormBuilder);
  srvAuth = inject(AuthService);
  errorLogin : boolean = false;
  
  constructor(){
    this.frmLogin = this.fb.group({
      idUsuario : ['',Validators.required],
      passw : ['',Validators.required]
    });
  }


onSubmit(){
  console.log(this.frmLogin.value);
  this.srvAuth.login(this.frmLogin.value)
  .subscribe(
    res => {
      this.errorLogin = (!res || res === 401);
    }
  )
}

}