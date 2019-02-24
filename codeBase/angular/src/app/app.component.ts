import { Component } from '@angular/core';
import { AuthService } from '../app/components/login/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ){

  }

  title = 'app';
}