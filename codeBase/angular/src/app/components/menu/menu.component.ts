import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menuItems: any[];
  // se_app_id = sessionStorage.getItem('app_id');
  componentVisibility : Boolean ;
  constructor(private router:Router) { 

    var s = sessionStorage.getItem('componentVisibility')

    this.router.events.subscribe(()=>{
      if(sessionStorage.getItem('app_id') != null || sessionStorage.getItem('app_id') != undefined) {
        if ( s = 'true' ){
          this.componentVisibility = true;
        }
        else{
          this.componentVisibility = false;
        }
      }
    })

  }

  ngOnInit() {

  }

  // isMobileMenu() {
  //     if ($(window).width() > 991) {
  //         return false;
  //     }
  //     return true;
  // };
}
