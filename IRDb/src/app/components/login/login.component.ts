import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { AuthService } from 'src/app/common/services/auth.service';
import { SessionService } from 'src/app/common/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginError: boolean;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private socialAuthService:SocialAuthService, private sessionService: SessionService, private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: () => {
        if (!this.form) return;
        return true;
      }
    });
  }

  googleLogin() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((res) => {
      this.sessionService.googleLogin(res.idToken).then(response => {
      console.log(response);
      this.loginError = false;
      this.authService.save(response, true);
      this.router.navigate(['/principal']);
    }).catch(() => {
      this.socialAuthService.signOut(true).then(() => {
        document.getElementById('error').innerHTML = ('<p>No existe un usuario con ese correo<br>Por favor, cree una cuenta</p>');
      });

    });
    })
    
  }

  loginNormal() {
    this.sessionService.login(this.form.value.correo, this.form.value.password).then(response => {
      if (response) {
        this.loginError = false;
        this.authService.save({ token: '1', email: this.form.value.correo}, false);
        this.router.navigate(['/principal']);
      } else if (response == null) {
        document.getElementById('error').innerHTML = ('<p>Está registrado con Google.<br>Por favor, inicie sesión con Google</p>');
      } else {
        document.getElementById('error').innerHTML = ('<p>Contraseña equivocada</p>');
      }
    }).catch(() => {
      document.getElementById('error').innerHTML = ('<p>No existe un usuario con ese correo<br>Por favor, cree una cuenta</p>');
    });
  }

}
