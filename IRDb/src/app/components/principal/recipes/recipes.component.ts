import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';
import { ApiService } from 'src/app/common/services/api.service'
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

interface List {
  name: string;
  descripcion: string;
  id: number;
}

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

  @Input() loggedIn: boolean;

  lists: Array<List> = [];

  recipe:any;
  public id: string;

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService, private apiService: ApiService, private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.authService.loginStatus.subscribe(flag => {
      console.log('Login status', flag);
      this.loggedIn = flag;
    });

    this.activatedRoute.params.subscribe(paramsId => {
      this.id = paramsId.id;
      this.apiService.getRecipe(this.id).then(response => {
        this.recipe = response;
      });
    });
    
    this.activatedRoute.params.subscribe(paramsId => {
      this.id = paramsId.id;
      console.log(this.id);
    });

    if (this.loggedIn) {
      this.getLists().then((r) => {
        for (let i in r) {
          let addedList: List = {
            'name': r[i].nombre,
            'descripcion': r[i].descripcion,
            'id': r[i].id
          }
          this.lists.push(addedList);
        }
      });
    }
  }

  getLists() {
    const url = `${environment.apiUrl}getlists/`;
    return this.httpClient.get(url, {
      params: {
        email: localStorage.getItem('email'),
      }
    }).toPromise();
  }

  addToList(list: List) {
    const url = `${environment.apiUrl}addtolist/`;
    this.httpClient.post(url, {
      body: {
        idList: list.id,
        idRecipe: this.id,
        image: this.recipe["image"],
        name: this.recipe["name"]
      }
    }).toPromise();
    window.location.reload();
  }
}
