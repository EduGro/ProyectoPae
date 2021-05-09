import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';
import { ApiService } from 'src/app/common/services/api.service'


@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

  @Input() loggedIn: boolean;

  recipe:any;
  public id: string;

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService, private apiService : ApiService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(paramsId => {
      this.id = paramsId.id;
      this.apiService.getRecipe(this.id).then(response => {
        this.recipe = response;
      });
    });

    this.authService.loginStatus.subscribe(flag => {
      console.log('Login status', flag);
      this.loggedIn = flag;
    });
    
    this.activatedRoute.params.subscribe(paramsId => {
      this.id = paramsId.id;
      console.log(this.id);
    });
  }

}
