import {Roles,role,addRole,updateRole,role_fetchByAppId,delRole,Applications} from '../../routeConfig';
import { Component, ViewContainerRef,OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { ActivatedRoute,Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; //importing the module
import { Ng2OrderModule } from 'ng2-order-pipe'; //importing the module
import { LoadingModule } from 'ngx-loading';
declare var $;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  public loading = false;
  aObj:Object = {};
  conformationString:String = "* Please enter name";
  isEmpty:boolean = false;
  constructor(private _router: Router,  private http:Http, private route: ActivatedRoute, private toastr: ToastrService) { 
    //this.fetchData();
    //this.fetchApplication();

  }
  filter;
  // Var declarations
  id:number;
  editobj : {};
  uApplication = [];
  uData:object = {};
  uExist = false;
  private headers = new Headers({ 'Content-Type': 'roles/json'});
  role = [];
  applications = [];

   //get res by app_id
session_id=sessionStorage.getItem('app_id');


p: number = 1;
collection: any[] = this.role;  
key: string = 'name';
reverse: boolean = false;
sort(key){
  this.key = key;
  this.reverse = !this.reverse;
}

  // Fetch Role
  fetchData=function() {
    this.http.get(Roles).subscribe(
      (res: Response) => {
        this.role = res.json();
      }
    )
   }

   // Fetch Application
  //  fetchApplication=function() {
  //   this.http.get(Applications).subscribe(
  //     (res: Response) => {
  //       this.applications = res.json();
  //     }
  //   )
  //  }

   //Refresh Page
   refresh = function() {
    window.location.reload();
  }
   //Del Role
   deleteRole = function(id) {
    
    const url = delRole + id;
    return this.http.delete(url, {headers: this.headers}).toPromise()
      .then(() => {
        this.appRole(this.session_id);
        $('#deleteModal').modal('toggle');
      this.toastr.error('Role Deleted.');
        
      })
  
  }

  attributeIdToBeDeleted : String;
  attributeNameToBeDeleted : String;

  // Set Delete Attribute
  setDeleteAttribute = (_id, Name) => {
    this.attributeIdToBeDeleted = _id;
    this.attributeNameToBeDeleted = Name;
  }

//Add Role
addNewRole = function(a) {
   if(a.Role_name==undefined||a.Role_name===null||a.Role_name==='') {
    this.toastr.error("Role name required.")
   }
   else {
  this.aObj = {
    "Role_id":a.id,
    "Role_name":a.Role_name,
    "displayname":a.displayname,
    "Application_id":this.session_id
  }
  this.http.post(addRole, this.aObj ,  {Headers : this.headers} ).subscribe(res => {
if(res._body=="unique") {
  this.toastr.error('Role already exists.');
}
else {
  this.appRole(this.session_id);
  $('#addModal').modal('toggle');
  this.toastr.success('Roles Added.');
}
  
  },
  err=> {
    this.toastr.error('Role already exists.');

   })
  }

}
//Edit Roles
_id={};

editRole = function(id) {
 
  this.http.get(role+id).subscribe(
     (res: Response) => {
       this.uApplication = res.json();
       this.uData = this.uApplication.Role_name;
       this._id = this.uApplication._id;
       


     }
   )
 
 }

appRole = function(session_id) {
  this.loading = true;
  this.http.get(role_fetchByAppId+session_id).subscribe(
   (res: Response) => {
    this.loading = false;
     this.role = res.json();
   }
  )
  }

 //Update Role
 updateRole = function(updateData,id)
{
  if(updateData.uRole_name == ""||updateData.uRole_name == null||updateData.uRole_name == undefined) {
    this.toastr.error('Role Name required.');
}
else {
  this.editObj = {
    "Role_id":updateData.id,
    "Role_name":updateData.uRole_name,
    "Application_id":this.session_id
  }
  this.http.put(updateRole+ id  , this.editObj ,  {Headers : this.headers} ).subscribe((res:Response) => {
    $('#updateModal').modal('toggle');
    this._router.navigate(['/roles']);
    this.appRole(this.session_id);
  this.toastr.info('Role Updated.');


  })
}
}
ngOnInit() {
  this.appRole(this.session_id);
}

}
