import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  recipeSearch(query: string, cuisine: string, intolerances: string): Promise<any>{
    const url = `${environment.apiUrl}recipeSearch`;
    return this.httpClient.post(url, { query: query, cuisine: cuisine, intolerances: intolerances }).toPromise();
  }

  randomRecipes(): Promise<any>{
    const url = `${environment.apiUrl}recipesRandom`;
    return this.httpClient.get(url).toPromise();
  }

  getRecipe(id: String): Promise<any>{
    const url = `${environment.apiUrl}recipesInfo`;
    return this.httpClient.post(url, {id: id}).toPromise();
  }
}
