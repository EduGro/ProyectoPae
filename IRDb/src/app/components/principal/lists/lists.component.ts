import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../../environments/environment';

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

  constructor(private router: Router, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getLists().then((r) => {
      //this.lists.concat(r.);
      for (let i in r) {
        let addedList: List = {
          'name': r[i].nombre,
          'descripcion': r[i].descripcion,
          'id': i as unknown as number
        }
        this.lists.push(addedList);
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
}