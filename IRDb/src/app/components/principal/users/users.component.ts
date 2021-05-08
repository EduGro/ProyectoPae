import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from 'src/app/common/services/auth.service';
import { environment } from 'src/environments/environment';

interface Usuario {
  name: string;
  image: string;
  email: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

  user:Usuario;

  @Input() loggedIn: boolean;

  constructor(private authService: AuthService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.authService.loginStatus.subscribe(flag => {
      console.log('Login status', flag);
      this.loggedIn = flag;
    });

    if (this.loggedIn) {
      this.getUser().then((r) => {
        this.user = r as Usuario;
      });
    }
  }

  getUser() {
    const url = `${environment.apiUrl}getuser/`;
    return this.httpClient.get(url, {
      params: {
        email: localStorage.getItem('email'),
      }
    }).toPromise();
  }
}
