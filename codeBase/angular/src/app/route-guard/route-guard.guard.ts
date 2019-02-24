import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RouteGuardGuard implements CanActivate {
  constructor(private router : Router){

  }
  canActivate(){
    let app_id = sessionStorage.getItem('app_id');
    // let app_type = sessionStorage.getItem('app_type');
    
    if(app_id != ('' || null)){
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
