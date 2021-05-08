import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';

interface Recipes{
  image: string;
  name:string;
  id:number;
}

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.scss']
})
export class ListDetailsComponent implements OnInit {

  @Input() recipes:Recipes[] = [{image: "https://i.imgur.com/WjjgwNV.jpg", name:"Flan",
    id:1}, {image: "https://i.imgur.com/Az5zKiA.jpeg",name:"Carne Asada",
    id:2}, {image: "https://i.imgur.com/l6ZqE7w.jpg", name:"Ramen",
    id:3}
  ];

  @Input() loggedIn: boolean;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.loginStatus.subscribe(flag => {
      console.log('Login status', flag);
      this.loggedIn = flag;
    });
  }

  selectRecipe(recipe:Recipes){
    this.router.navigate(['./recipes']);
  }

}
