import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/common/services/auth.service';

interface List {
  name: string;
  descripcion: string;
  id: number;
}

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})

export class ListsComponent implements OnInit {

  lists: Array<List> = [];

  form!: FormGroup;

  @Input() loggedIn: boolean;

  constructor(private router: Router, private authService: AuthService, private httpClient: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.authService.loginStatus.subscribe(flag => {
      console.log('Login status', flag);
      this.loggedIn = flag;
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

    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    }, {
      validators: () => {
        if (!this.form) return;
        return {
          confirmPass: true
        }
      }
    });
  }

  selectList(list: List) {
    this.router.navigate(['./lists/:' + list.id]);
  }

  getLists() {
    const url = `${environment.apiUrl}getlists/`;
    return this.httpClient.get(url, {
      params: {
        email: localStorage.getItem('email'),
      }
    }).toPromise();
  }

  listAdd() {
    const url = `${environment.apiUrl}addlist/?email=${localStorage.getItem('email')}`;
    this.httpClient.post(url, {
      nombre: this.form.value.nombre,
      desc: this.form.value.descripcion
    }).toPromise().then(() => { window.location.reload(); });

  }
}