import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private router: Router, private httpClient: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getLists().then((r) => {
      for (let i in r) {
        let addedList: List = {
          'name': r[i].nombre,
          'descripcion': r[i].descripcion,
          'id': i as unknown as number
        }
        this.lists.push(addedList);
      }
    });

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
    console.log(this.form.value.nombre);
  }
}