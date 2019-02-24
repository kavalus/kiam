import {Roles,role_fetchByAppId,user_Add,users_all,user,UpdateUser,DelUser,addr,users_admin} from '../../routeConfig';
import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpModule } from '@angular/http';
import { ActivatedRoute,Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; //importing the module
import { Ng2OrderModule } from 'ng2-order-pipe'; //importing the module
import { LoadingModule } from 'ngx-loading';
declare var $;

@Component({
  selector: 'app-administrative-users',
  templateUrl: './administrative-users.component.html',
  styleUrls: ['./administrative-users.component.css']
})
export class AdministrativeUsersComponent implements OnInit {
  public loading = false;
  aObj:Object = {};
  conformationString:String = "* Please enter name";
  isEmpty:boolean = false;
  constructor(private _router: Router,  private http:Http, private route: ActivatedRoute, private toastr: ToastrService) {
    this.fetchData();
 
}
filter;

// Var declarations
id: number;
editobj : {};
uresource = [];
uData:object = {};
uExist = false;
private headers = new Headers({ 'Content-Type': 'resources/json'});
user = [];
roles = [];
rolesarray = [];
adminId;
role = '';


p: number = 1;
   collection: any[] = this.user;  
   key: string = 'name';
   reverse: boolean = false;
   sort(key){
     this.key = key;
     this.reverse = !this.reverse;
   }

pushAction = function() {
  var singlerole = this.role.split(',');
  this.rolesarray.push({'role_id':singlerole[0],'role_name':singlerole[1]});
  console.log(this.rolesarray);
}







session_id=sessionStorage.getItem('app_id');


removeAction = function(index) {
  this.rolesarray.splice(index,1);
}

fetchRoles=function() {
  this.http.get(Roles).subscribe(
    (res: Response) => {
      this.roles = res.json();
    
    }
  )
 }


fetchData=function() {
  this.loading = true;
  this.http.get(users_all).subscribe(
    (res: Response) => {
      this.loading = false;
      this.user = res.json();
    
 
    }
  )
 }


 fetchAdmin=function() {
  this.loading = true;
  this.http.get(users_admin).subscribe(
    (res: Response) => {
      this.loading = false;
      this.users = res.json();
      // this.adminId==this.users[0]["_id"];
  //  console.log(this.users[0]["_id"],'this is admin')
    }
  )
 }





 //Refresh Page
refresh = function() {
  window.location.reload();
  this._router.navigate(['/adminUsers']);
  this.toastr.info('Page Reloaded.');
}

attributeIdToBeDeleted : String;
attributeNameToBeDeleted : String;

// Set Delete Attribute
setDeleteAttribute = (_id, Name) => {
  this.attributeIdToBeDeleted = _id;
  this.attributeNameToBeDeleted = Name;
}

//Del App
deleteUser = function(id) {
  let local_id = localStorage.getItem('user_id');
  if(local_id === id) {
    this.toastr.error('User is Logged In.');
    $('#deleteModal').modal('toggle');
  }
  else if(id === this.users[0]["_id"]) {
    this.toastr.error("Admin can't be deleted.");
    $('#deleteModal').modal('toggle');
  }
  else{
    const url = DelUser+ id;
    return this.http.delete(url, {headers: this.headers}).toPromise()
      .then(() => {
      this.fetchData();
      this.toastr.error('User Deleted.');
      $('#deleteModal').modal('toggle');
    
      });
  }

 
 }
 
 //Add App
 addNewUser = function(a) {
  if(a.name == ""||a.name == null||a.name == undefined) {
    this.toastr.error('User name required.');
  }
  else {
    this.aObj = {
      "name":a.name,
      "username":a.username,
      "password":a.password,
      "email":a.email,
      "role":this.rolesarray,
      "user_type":a.user_type,
      // "mobile_no":a.mobile_no
    }
    console.log(this.aObj);
    this.http.post(user_Add , this.aObj ,  {Headers : this.headers} ).subscribe((res:Response) => {
    this.fetchData();
    $('#addModal').modal('toggle');
    this.addRole = [];
    this.toastr.success('User Added.');
    })
   }
  
  

 }
 _id   ={}
 username={}
 email={}
 user_type={}
 status={}
 
  editUser = function(id) {
 //this.toastr.info('User Updated.');
 this.http.get(user+id).subscribe(
  (res: Response) => {
    this.uresource = res.json();
    this.uData = this.uresource;
    this.role = this.uresource.role;
    this._id = this.uresource._id;
    this.username = this.uresource.username;
    this.email = this.uresource.email;
    this.user_type = this.uresource.user_type;
    this.status = this.uresource.status;
    this.name=this.uresource.name
    // this.mobile_no=this.uresource.mobile_no;

console.log(this.uresource,"pppppppppppppppppppppppppz")



  }
 )
 }
 

 //remove all data
 removealldata = function(){
  this.addRole = [];
 }
 
 //Upd App
 
 updateUser = function(updateData,id)
 {
 
   if(updateData.name == ""||updateData.name == undefined||updateData.name == null) {
    this.toastr.error('User name required.');
   }
   
   else {
    this.editObj = {
      "name":updateData.name,
      "username":updateData.username,
      "email":updateData.email,
      "password":updateData.password,
      "role":this.rolesarray,
      "status":updateData.status,
      "user_type":updateData.user_type,
      // "mobile_no":updateData.mobile_no

    }
    
    this.http.put(UpdateUser+ id  , this.editObj ,  {Headers : this.headers} ).subscribe((res:Response) => {
      
    $('#updateModal').modal('toggle');
    this.fetchData();
    this.addRole = [];
    this.toastr.info('User Updated.');
 
   
     })
   



   }
	
 }
 
 
   ngOnInit() {
     this.fetchData();
     localStorage.getItem('app_id');
     this.fetchAdmin();
     this.fetchData();
     this.fetchRoles();
   }

}
