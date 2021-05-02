import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocialAuthService } from 'angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginStatus:BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(/*private socket:SocketService*/ private socialAuthService: SocialAuthService) {
    this.loginStatus.next(this.isLoggedIn());
  }

  save(data, google?) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.name);
    localStorage.setItem('email', data.email);
    this.loginStatus.next(true);
    if(google) {
      localStorage.setItem('social', '1');
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isSocialUser() {
    return !!localStorage.getItem('social');
  }

  clear() {
    return new Promise((resolve, reject) => {
      const isSocial = this.isSocialUser();
      localStorage.clear();
      if(isSocial){
        this.socialAuthService.signOut(true).then((response) => {
          this.loginStatus.next(false);
          reject();
        });
      } else {
        this.loginStatus.next(false);
        reject();
      }
    });
  }
}
