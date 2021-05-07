import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {

  loggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.loginStatus.subscribe(flag => {
      console.log('Login status', flag);
      this.loggedIn = flag;
    });
  }

  logout() {
    this.authService.logout().then(() => {
      if (this.router.url == "/principal") {
        this.router.navigate(['/principal']);
      } else {
        this.authService.logout().then(() => { this.router.navigate(['/principal']) });
      }
      
    });
  }
}
