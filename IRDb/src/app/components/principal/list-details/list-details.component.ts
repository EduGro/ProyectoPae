import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';
import { environment } from 'src/environments/environment';

interface Recipes{
  image: string;
  name:string;
  id:number;
}

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.scss']
})
export class ListDetailsComponent implements OnInit {

  @Input() recipes:Recipes[] = [];

  @Input() loggedIn: boolean;

  listId: string;

  constructor(private router: Router, private authService: AuthService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.listId = this.router.url.substring(8);
    this.authService.loginStatus.subscribe(flag => {
      console.log('Login status', flag);
      this.loggedIn = flag;
    });

    if (this.loggedIn) {
      this.getRecipes().then((r) => {
        for (let i in r) {
          let addedRecipe: Recipes = {
            'name': r[i].nombre,
            'image': r[i].imagen,
            'id': r[i].id
          }
          this.recipes.push(addedRecipe);
        }
      });
    }
  }

  getRecipes() {
    const url = `${environment.apiUrl}getrecipes/`;
    return this.httpClient.get(url, {
      params: {
        idList: this.listId
      }
    }).toPromise();
  }

  selectRecipe(recipe: Recipes) {
    console.log(recipe);
    this.router.navigate([`./recipes/${recipe.id}`]);
  }

  deleteList() {
    const url = `${environment.apiUrl}deletelist/`;
    this.httpClient.delete(url, {
      params: {
        idList: this.listId,
        email: localStorage.getItem('email')
      }
    }).toPromise();
    this.router.navigate(['/lists']);
  }

}
