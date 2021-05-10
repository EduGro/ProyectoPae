import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from './../../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { AuthService } from 'src/app/common/services/auth.service';
import { SessionService } from 'src/app/common/services/session.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  form: FormGroup;
  registerError: boolean;
  fileToUpload: File = null;

  constructor(private formBuilder: FormBuilder, private socialAuthService: SocialAuthService, private sessionService: SessionService, private authService: AuthService, private router: Router,  private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', [Validators.required, Validators.minLength(6)]],
      perfil: ['', Validators.required],
    }, {
      validators: () => {
        if (!this.form) return;
        if (this.form.controls.password.value == this.form.controls.confirmar.value) {
          return null;
        } else {
          return {
            confirmPass: true
          }
        }
      }
      
    });

    this.socialAuthService.authState.subscribe(user => {
      if (user) {
        console.log(user.idToken);
        this.sessionService.googleReg(user.idToken).then(response => {
          console.log(response);
          this.registerError = false;
          this.authService.save(response, true);
          this.router.navigate(['/principal']);
        }).catch(() => {
          document.getElementById('error').innerHTML = ('<p>Ya existe un usuario con ese correo<br>Por favor, inicie sesión</p>');
        });
      } else {
        console.log('Se cerro la sesion');
      }
    })


  }

  setFile(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);
  }

  registrar() {    
    this.sessionService.registrar(this.form.value.nombre, this.form.value.correo, this.form.value.password).then(response => {
      this.authService.save({ token: '1', email: this.form.value.correo, name: this.form.value.nombre}, false);
      this.router.navigate(['/principal']);
    });
  }

  googleReg() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

}

