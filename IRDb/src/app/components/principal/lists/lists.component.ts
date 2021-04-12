import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';

interface List{
  name:string;
  id:number;
}

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})

export class ListsComponent implements OnInit {

  @Input() lists:List[] = [{name:"List1",
    id:1}, {name:"List2",
    id:2}, {name:"List3",
    id:3}
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  selectList(list:List){
    this.router.navigate(['./lists/:'+list.id]);
  }
}
