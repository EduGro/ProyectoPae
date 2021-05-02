import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private formBuilder: FormBuilder, private socialAuthService: SocialAuthService, private sessionService: SessionService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', [Validators.required, Validators.minLength(6)]]
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
        });
      } else {
        console.log('Se cerro la sesion');
      }
    })
  }

  registrar() {
    //TODO
  }

  googleReg() {
    console.log(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

}
