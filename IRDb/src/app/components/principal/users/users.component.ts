import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @Input() user = {
    name: 'User',
    image: 'https://i.imgur.com/XUJi0zC.jpg',
    email: 'Random@fake.com',
    creation: '11/04/2021'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
