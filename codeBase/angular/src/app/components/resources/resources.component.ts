import {Fetch_Resource,addResource,Resource,Resource_fetchByAppId,UpdateResource,DeleteResource,Applications,resourceTypes,ResourceType_fetchByAppId,allAttributes,attributes_fetchByAppId,fetchByAppAndType} from '../../routeConfig';
import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { ActivatedRoute,Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { resource } from 'selenium-webdriver/http';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; //importing the module
import { Ng2OrderModule } from 'ng2-order-pipe'; //importing the module
import { LoadingModule } from 'ngx-loading';

declare var $;

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  public loading = false;
  aObj:Object = {};
  conformationString:String = "* Please enter name";
  isEmpty:boolean = false;
  constructor(private _router: Router,  private http:Http, private route: ActivatedRoute, private toastr: ToastrService) {
    this.appRes(this.session_id);
    //this.fetchData();
    this.fetchResourceType();
    // this.fetchApplications();
    this.fetchAttribute();
}

filter;
coarse;
rtData;
url={};
Protocol_type={}
Protection_type={}
Authentication_type={}
resourceType_type1={}
Resource_typeid={}
res_displayname={}
res_description={}
_id={}

  // Var declarations
  id: number;
  editobj : {};
  uresource = [];
  uData:object = {};
  appData = [];
  uExist = false;
  private headers = new Headers({ 'Content-Type': 'resources/json'});
  resource = [];
  applications = [];
  resourcetype = [];
  attribute = [];
  attributes = [];
  attribute_id = "";
  attribute_value = "";

  p: number = 1;
  collection: any[] = this.resource;  
  key: string = 'name';
  reverse: boolean = false;
  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }

  pushAction = function() {
    if(this.attribute_id != "") {
      var object = {
        attribute_id : this.attribute_id,
        attribute_value:this.attribute_value
      };
      this.attributes.push(object);
      this.attribute_id = "";
      this.attribute_value = "";
    }
  }
  //get res by app_id
session_id=sessionStorage.getItem('app_id');

  removeAction = function(index) {
    this.attributes.splice(index,1);
  }

  fetchData=function() {
    this.http.get(Resource).subscribe(
      (res: Response) => {
        this.resource = res.json();
      }
    )
   }


FetchClick=function(){
  this.fetchResourceType();
  this.fetchApplications();
  this.fetchAttribute();
  //this.addNewRes();
}

//Fetch Applications
fetchApplications=function() {
  this.http.get(Applications).subscribe(
    (res: Response) => {
      this.applications = res.json();
    }
  )
 }
 //Fetch ResourceType
 fetchResourceType=function() {
  this.http.get(ResourceType_fetchByAppId+this.session_id).subscribe(
    (res: Response) => {
      this.resourcetype = res.json();
    }
  )
 }
 //Fetch Attribute
 fetchAttribute=function() {
  this.http.get(fetchByAppAndType+this.session_id)
  .map(res => res.json() )
  .subscribe(
    res => {
      // console.log(res);
      // let a = [];
      // let obj = res;
      // let att = obj.Attributes;
      // for(let i = 0 ; i < att.length ; i++){
      //   //console.log(i);
      //   if(att[i].Type == "Fixed"){
      //     a.push(att[i]);
      //   }
      // }
      this.attribute = res;
    }
  )
 }


//Refresh Page
refresh = function() {
  window.location.reload();
}

//Del App
deleteRes = function(id) {
  this.http.delete(DeleteResource + id).subscribe(
    res => {
      if(res._body=="used") {
        this.appRes(this.session_id);
        this.toastr.error('Resource is already in use.');
        $('#deleteModal').modal('toggle');
      }
      else {
        this.appRes(this.session_id);
        this.toastr.error('Resource Deleted..');
        $('#deleteModal').modal('toggle');
      }
     
    },
    err => this.toastr.error('Ops! something went wrong.'))
}
grain;
ugrain;
//Add App
addNewRes = function(a) {
  var arg=a.grain;

  if(a.res_name==undefined||a.res_name==""||a.res_name==null) {
    this.toastr.error("Resource name required.")
   }
   else {
    if (arg == true) {
      this.grain="Coarse";
  }      else  this.grain="Fine";


    this.aObj = {
      "res_name":a.res_name,
      "res_displayname":a.res_displayname,
      "Resource_typeid":a.Resource_typeid,
      "Authentication_type":a.Authentication_type,
      "Protection_type":a.Protection_type,
      "application_id":this.session_id,
      "attributes":this.attributes,
      "attribute_value":a.attribute_value,
      "Protocol_type":a.Protocol_type,
      "url":a.url,
      "res_description":a.res_description,
      "grain":this.grain
    }
// console.log(this.aObj);

  
    this.http.post(addResource , this.aObj ,  {Headers : this.headers} ).subscribe(res => {
      if(res._body=="unique") {
        this.toastr.error('Resource already exists.');
        this.attributes=[];
        
      }
      else {
        this.appRes(this.session_id);
        $('#addModal').modal('toggle');
        this.toastr.success('Resource Added.');
        this.attributes=[];
      }
      
      ;
    },
    err=> {
      this.toastr.error('Resource already exists.');
     })


}
}
   

//Edit App

editRes = function(id) {

this.http.get(Resource+id).subscribe(
 (res: Response) => {
   this.uresource = res.json();
   this.uData = this.uresource;
   this.attributes = this.uData.attributes;
   this._id = this.uresource._id;
   this.uData = this.uresource.res_name;

     this.url = this.uresource.url;
   this.Protocol_type = this.uresource.Protocol_type;
   this.Protection_type = this.uresource.Protection_type;
   this.Authentication_type = this.uresource.Authentication_type;
  //  this.uData = this.uresource.resourceType_type1;
   this.Resource_typeid = this.uresource.Resource_typeid;
   this.res_displayname = this.uresource.res_displayname;
   this.res_description = this.uresource.res_description;



 }
)
}


appRes = function(session_id) {
  this.loading = true;
  this.http.get(Resource_fetchByAppId+session_id).subscribe(
   (res: Response) => {
    this.loading = false;
     this.resource = res.json();
     this._router.navigate(['/resources']);
   }
  )
  }  

  attributeIdToBeDeleted : String;
  attributeNameToBeDeleted : String;

  // Set Delete Attribute
  setDeleteAttribute = (_id, Name) => {
    this.attributeIdToBeDeleted = _id;
    this.attributeNameToBeDeleted = Name;
  }

//Upd App

updateRes = function(updateData,id)
{
  var arg=updateData.ugrain;
  if(updateData.ures_name==undefined||updateData.ures_name==""||updateData.ures_name==null) {
    this.toastr.error("Resource name required.")
   }
   else{
    if (arg == true) {
      this.ugrain="Coarse";
  }      else  this.ugrain="Fine";

    this.editObj = {
      "res_name":updateData.ures_name,
      "res_displayname":updateData.ures_displayname,
      "Resource_typeid":updateData.uResource_typeid,
      "Authentication_type":updateData.uAuthentication_type,
      "Protection_type":updateData.uProtection_type,
      "application_id":this.session_id,
      "attributes":this.attributes,
      "attribute_value":updateData.uattribute_value,
      "Protocol_type":updateData.uProtocol_type,
      "url":updateData.uurl,
      "res_description":updateData.ures_description,
      "grain":this.ugrain
    }
    // console.log('this iis lol',this.editObj)
   
    this.http.put(UpdateResource+ id  , this.editObj ,  {Headers : this.headers} ).subscribe((res:Response) => {
      $('#updateModal').modal('toggle');
      this._router.navigate(['/resources']);
    this.appRes(this.session_id);
    this.toastr.info('Resource Updated.');

  
    })
}
}
// se_app_type = sessionStorage.getItem('apptype');
  
// Applicationtype = () => {
//   if (this.se_app_type != "Fine") {
//     this.ToggleCoarse();
//     // console.log(this.se_app_type + "If block");
//   } else {
//     this.ToggleFine();
//     // console.log(this.se_app_type + "else else");
//   }
//   sessionStorage.removeItem('apptype');
// }

// ToggleCoarse = function () {
//   var t1 = document.getElementById("auth_label");
//   var t2 = document.getElementById("Authentication_type");
//   var t3 = document.getElementById("prot_label");
//   var t4 = document.getElementById("Protection_type");
//   var t5 = document.getElementById("proto_label");
//   var t6 = document.getElementById("url_label");
//   var t7 = document.getElementById("Protocol_type");
//   var t8 = document.getElementById("url");
//   if (this.hidden) {
//     t1.style.display = "block";
//     t2.style.display = "block";
//     t3.style.display = "block";
//     t4.style.display = "block";
//     t5.style.display = "block";
//     t6.style.display = "block";
//     t7.style.display = "block";
//     t8.style.display = "block";
    
//     this.hidden = false;
//   } else {
//     t1.style.display  ="none";
//     t2.style.display  ="none";
//     t3.style.display  ="none";
//     t4.style.display  ="none";
//     t5.style.display  ="none";
//     t6.style.display  ="none";
//     t7.style.display  ="none";
//     t8.style.display  ="none";
//         this.hidden = true;
//   }
// }


// // // hidden:boolean;
// hidden = true;
// ToggleFine = function () {
//   var t1 = document.getElementById("auth_label");
//   var t2 = document.getElementById("Authentication_type");
//   var t3 = document.getElementById("prot_label");
//   var t4 = document.getElementById("Protection_type");
//   var t5 = document.getElementById("proto_label");
//   var t6 = document.getElementById("url_label");
//   var t7 = document.getElementById("Protocol_type");
//   var t8 = document.getElementById("url");
//   if (this.hidden) {
//     t1.style.display  ="none";
//     t2.style.display  ="none";
//     t3.style.display  ="none";
//     t4.style.display  ="none";
//     t5.style.display  ="none";
//     t6.style.display  ="none";
//     t7.style.display  ="none";
//     t8.style.display  ="none";
//         this.hidden = true;
//       } else {
//         t1.style.display = "block";
//         t2.style.display = "block";
//         t3.style.display = "block";
//         t4.style.display = "block";
//         t5.style.display = "block";
//         t6.style.display = "block";
//         t7.style.display = "block";
//         t8.style.display = "block";
        
//         this.hidden = false;
// }
// }

// reset=()=>{

// }

  ngOnInit() {
  // this.Applicationtype();
    this.appRes(this.session_id);
  }

}
