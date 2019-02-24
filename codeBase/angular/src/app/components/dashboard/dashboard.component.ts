import { Component, ViewContainerRef,OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    style: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/application',  title: 'Applications',     icon:'folder_open',    style: 'orange' },
    { path: '/resources',    title: 'Resources',        icon:'extension',  style: 'green'  },
    { path: '/resourceTypes',title: 'Resource Type',    icon:'collections_bookmark',       style: 'blue'   },
    { path: '/attributes',   title: 'Attributes',       icon:'view_module',           style: 'red'    },
    { path: '/policies',     title: 'Policies',         icon:'description',    style: 'purple' },
    { path: '/roles',        title: 'Roles',            icon:'supervisor_account', style: 'black'  }
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  menuItems: any[];
  se_app_id = sessionStorage.getItem('app_id');
  componentVisibility :Boolean;

  disableddashboard = [
    { path: '/',             title: 'Resources',        icon:'extension',           style: 'cursor:not-allowed' },
    { path: '/',             title: 'Resource Type',    icon:'collections_bookmark',style: 'cursor:not-allowed' },
    { path: '/',             title: 'Attributes',       icon:'view_module',         style: 'cursor:not-allowed' },
    { path: '/',             title: 'Policies',         icon:'description',         style: 'cursor:not-allowed' },
    { path: '/',             title: 'Roles',            icon:'supervisor_account',  style: 'cursor:not-allowed' }
  ];

  constructor() { 
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  
  
  ngOnInit() {
    if(this.se_app_id!=null||this.se_app_id!=undefined) {
      this.componentVisibility = true;
    }
  }
  
}
