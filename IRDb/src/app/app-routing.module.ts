import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListsComponent } from './components/principal/lists/lists.component';

import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/principal/main/main.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RecipesComponent } from './components/principal/recipes/recipes.component';
import { RegistroComponent } from './components/registro/registro.component';
import { UsersComponent } from './components/principal/users/users.component'
import { PrincipalComponent } from './components/principal/principal.component';

const routes: Routes = [
  {path:'', redirectTo: 'login', pathMatch: 'full'},
  {path: 'main', component: MainComponent},
  { path: 'users', component: UsersComponent},
  { path: 'login', component: LoginComponent },
  { path: 'principal', component: PrincipalComponent},
  { path: 'register', component: RegistroComponent },
  { path: 'recipes', component: RecipesComponent},
  { path: 'listas', component: ListsComponent},
  {path: "**", component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
