import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './components/principal/users/users.component';
import { RecipesComponent } from './components/principal/recipes/recipes.component';
import { ListsComponent } from './components/principal/lists/lists.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MainComponent } from './components/principal/main/main.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { ListDetailsComponent } from './components/principal/list-details/list-details.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    RecipesComponent,
    ListsComponent,
    LoginComponent,
    RegistroComponent,
    NotFoundComponent,
    MainComponent,
    PrincipalComponent,
    ListDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
