import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { ApiService } from 'src/app/common/services/api.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { PrincipalComponent } from '../principal.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input() loggedIn: boolean;
  query: String;
  recipes: any;
  cuicine: String;
  alergies: String;
  ban: boolean;

  constructor(private router: Router, private authService: AuthService, private apiService: ApiService, private principalComponent: PrincipalComponent) { }

  ngOnInit(): void {
    this.ban = false;
    this.authService.loginStatus.subscribe(flag => {
      console.log('Login status', flag);
      this.loggedIn = flag;
    });

    this.principalComponent.cuicine.subscribe(x => {
      this.cuicine = x
    });

    this.principalComponent.query.subscribe(x => {
      this.query = x;
    });

    this.principalComponent.alergies.subscribe(x => {
      this.alergies = x;
      this.search(this.query, this.cuicine, this.alergies);
    })
  }

  search(query, cuicine, alergies) {
    this.apiService.recipeSearch(query, cuicine, alergies).then(response => {
      this.recipes = response;
      this.ban = true;
    }).catch((e) => {
      console.log(e);
      this.ban = false;
    });
  }

}
