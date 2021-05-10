import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
import { HttpClientModule } from '@angular/common/http';

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

import { environment} from './../environments/environment';
import { SearchComponent } from './components/principal/search/search.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

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
    ListDetailsComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.clientId
            )
          },

        ]
      } as SocialAuthServiceConfig,
    },
    PrincipalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
