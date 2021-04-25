import { Component, OnInit } from '@angular/core';
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

  constructor(private socialAuthService:SocialAuthService, private sessionService: SessionService, private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe(user => {
      if(user){
        console.log(user.idToken);
        this.sessionService.googleLogin(user.idToken).then(response => {
          console.log(response);
          this.loginError = false;
          this.authService.save(response, true);
          this.router.navigate(['/principal']);
        });
      } else {
        console.log('Se cerro la sesion');
      }
    })
  }

  googleLogin() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  randomButton(){
    this.router.navigate(['/principal']);
  }

}
