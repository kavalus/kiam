import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { ApplicationComponent } from './components/application/application.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; //importing the module
import { Ng2OrderModule } from 'ng2-order-pipe'; //importing the module
//toastr
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { UiSwitchModule } from 'ngx-toggle-switch';

 
//loader
import { LoadingModule } from 'ngx-loading';

import { ToastrModule } from 'ngx-toastr';
import { AdministrativeUsersComponent } from './components/administrative-users/administrative-users.component';
import { AttributesComponent } from './components/attributes/attributes.component';
import { RolesComponent } from './components/roles/roles.component';
import { ResourceTypesComponent } from './components/resource-types/resource-types.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { LoginComponent } from './components/login/login.component';
import { LdapconfigComponent } from './components/ldapconfig/ldapconfig.component';

//login
import { AuthService } from './components/login/services/auth.service';

// Guard
import { RouteGuardGuard } from './route-guard/route-guard.guard';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    ApplicationComponent,
    DashboardComponent,
    AdministrativeUsersComponent,
    AttributesComponent,
    RolesComponent,
    ResourceTypesComponent,
    ResourcesComponent,
    PoliciesComponent,
    LoginComponent,
    LdapconfigComponent
   
  ],
  imports: [
    // UiSwitchModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    LoadingModule,
    Ng2SearchPipeModule, //including into imports
    Ng2OrderModule,
    NgxPaginationModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      closeButton:true,
    }), // ToastrModule added
    RouterModule.forRoot([
      {path: '', component:DashboardComponent},
      {path: "application",component:ApplicationComponent},
      {path: "dashboard",component:DashboardComponent},
      {path: "resourceTypes",component:ResourceTypesComponent, canActivate:[RouteGuardGuard]},
      {path: 'attributes', component: AttributesComponent, canActivate:[RouteGuardGuard]},
      {path: 'attributes/:id', component: AttributesComponent, canActivate:[RouteGuardGuard]},
      {path: "roles",component:RolesComponent, canActivate:[RouteGuardGuard]},
      {path: "resources",component:ResourcesComponent, canActivate:[RouteGuardGuard]},
      {path: 'adminUsers', component: AdministrativeUsersComponent},
      {path: 'policies', component: PoliciesComponent, canActivate:[RouteGuardGuard]},
      {path: 'ldap-config', component:LdapconfigComponent },
      {path: '**', component:DashboardComponent}
      
    ])
  ],
  providers: [AuthService, RouteGuardGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
