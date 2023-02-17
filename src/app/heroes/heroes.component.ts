import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { Caracter } from '../caracter';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})

export class HeroesComponent implements OnInit {
  offset:number=0;
  public total =0;
  heroes: Caracter[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getPag();
  }

  getPag(): void { 
    
    this.heroService.getPag(this.offset)
    .subscribe(todos =>{
     this.total = this.heroService.todos;
     this.heroes = todos;
    }
      );
  }

  public maxPag(){
    this.offset = this.offset + 20;
    console.log(this.offset)
    this.getPag()
  }
  
  public minPag(){
    this.offset = this.offset - 20;
    this.getPag()
  }

}
