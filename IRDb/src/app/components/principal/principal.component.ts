import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  dropdownSettingsI:IDropdownSettings;
  dropdownSettingsC:IDropdownSettings;
  dropdownListI = [];
  selectedItemsI = [];
  dropdownListC = [];
  selectedItemsC = [];

  private _query = new BehaviorSubject<string>('');
  query = this._query.asObservable();
  searching: string;
  private _cuicine = new BehaviorSubject<string>('');
  cuicine = this._cuicine.asObservable();
  private _alergies = new BehaviorSubject<string>('');
  alergies = this._alergies.asObservable();


  loggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.loginStatus.subscribe(flag => {
      console.log('Login status', flag);
      this.loggedIn = flag;
    });
    this.dropdownListI = [
      { item_id: 1, item_text: 'Dairy' },
      { item_id: 2, item_text: 'Egg' },
      { item_id: 3, item_text: 'Gluten' },
      { item_id: 4, item_text: 'Grain' },
      { item_id: 5, item_text: 'Peanut' },
      { item_id: 6, item_text: 'Seafood' },
      { item_id: 7, item_text: 'Sesame' },
      { item_id: 8, item_text: 'Shellfish' },
      { item_id: 9, item_text: 'Soy' },
      { item_id: 10, item_text: 'Sulfite' },
      { item_id: 11, item_text: 'Tree Nut' },
      { item_id: 12, item_text: 'Wheat' }
    ];
    this.selectedItemsI = [
    ];
    this.dropdownSettingsI = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.dropdownListC = [
      { item_id: 1, item_text: 'African' },
      { item_id: 2, item_text: 'American' },
      { item_id: 3, item_text: 'British' },
      { item_id: 4, item_text: 'Cajun' },
      { item_id: 5, item_text: 'Caribbean' },
      { item_id: 6, item_text: 'Chinese' },
      { item_id: 7, item_text: 'Eastern European' },
      { item_id: 8, item_text: 'European' },
      { item_id: 9, item_text: 'French' },
      { item_id: 10, item_text: 'German' },
      { item_id: 11, item_text: 'Greek' },
      { item_id: 12, item_text: 'Indian' },
      { item_id: 13, item_text: 'Irish' },
      { item_id: 14, item_text: 'Italian' },
      { item_id: 15, item_text: 'Japanese' },
      { item_id: 16, item_text: 'Jewish' },
      { item_id: 17, item_text: 'Korean' },
      { item_id: 18, item_text: 'Latin American' },
      { item_id: 19, item_text: 'Mediterranean' },
      { item_id: 20, item_text: 'Mexican' },
      { item_id: 21, item_text: 'Middle Eastern' },
      { item_id: 22, item_text: 'Nordic' },
      { item_id: 23, item_text: 'Southern' },
      { item_id: 24, item_text: 'Spanish' },
      { item_id: 25, item_text: 'Thai' },
      { item_id: 26, item_text: 'Vietnamese' }
    ];
    this.selectedItemsC = [
    ];
    this.dropdownSettingsC = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  logout() {
    this.authService.logout().then(() => {
      if (this.router.url == "/principal") {
        this.router.navigate(['/principal']);
      } else {
        this.authService.logout().then(() => { this.router.navigate(['/principal']) });
      }
    });
  }
  

  search() {
    var i;
    var tempCuicine;
    if(this.selectedItemsC.length > 0){
      tempCuicine = "";
      for(i = 0; i < this.selectedItemsC.length-1; i++)
        tempCuicine += this.selectedItemsC[i].item_text + ',';
    tempCuicine += this.selectedItemsC[this.selectedItemsC.length-1].item_text;
    }
    var tempAlergies;
    if(this.selectedItemsI.length > 0){
      tempAlergies = "";
      for(i = 0; i < this.selectedItemsI.length-1; i++)
        tempAlergies += this.selectedItemsI[i].item_text + ',';
    tempAlergies += this.selectedItemsI[this.selectedItemsI.length-1].item_text;
    }
    this._cuicine.next(tempCuicine);
    this._query.next(this.searching);
    this._alergies.next(tempAlergies);
    this.router.navigate(['/search']);

  }
}

