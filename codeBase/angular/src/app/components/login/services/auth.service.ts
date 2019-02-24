import {addr,authenticate,ForgotPassword,ForgotPassword_id_token,ChangePassword} from '../../../routeConfig';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  authToken: any;
  user: any;

  constructor(private http: Http) { 
    console.log(authenticate);
  }

  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(authenticate, user, {headers: headers})
      .map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('user_id', user.id);
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  forgotPassword(email) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(ForgotPassword, email, {headers: headers})
      .map(res => res.json());
  }

  checkToken(uid, token){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    return this.http.get(addr+'/users/ForgotPassword/' + uid + "/" + token, {headers: headers})
    .map(res => res.json());
  }

  changePassword(data){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    return this.http.put(ChangePassword, data, {headers: headers})
    .map(res => res.json());
  }

}
