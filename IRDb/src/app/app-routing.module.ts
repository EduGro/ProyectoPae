import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';

import { ListDetailsComponent } from './components/principal/list-details/list-details.component';
import { ListsComponent } from './components/principal/lists/lists.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/principal/main/main.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RecipesComponent } from './components/principal/recipes/recipes.component';
import { RegistroComponent } from './components/registro/registro.component';
import { UsersComponent } from './components/principal/users/users.component'
import { PrincipalComponent } from './components/principal/principal.component';
import { AuthGuard } from './common/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'principal', redirectTo: 'main', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistroComponent },
  {
    path: '', component: PrincipalComponent, canActivate:[AuthGuard],
    children: [
      { path: 'users', component: UsersComponent},
      {
        path: 'lists', children: [
          { path: '', component: ListsComponent },
          { path: ':id', component: ListDetailsComponent }
        ]
      },
      { path: 'principal', component: PrincipalComponent },
      { path: 'main', component: MainComponent },
      { path: 'users', component: UsersComponent },
      { path: 'recipes', component: RecipesComponent },
      
      { path: "**", component: NotFoundComponent }
    ]
  },
  
  { path: "**", component: NotFoundComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
