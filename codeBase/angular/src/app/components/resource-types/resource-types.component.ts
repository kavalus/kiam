import { Applications, application, AppCoarse, AppFine, addr, resourceTypes, resourceType, ResourceType_fetchByAppId, addResourceType, updateResourceType, delResourceType, } from '../../routeConfig';
import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; //importing the module
import { Ng2OrderModule } from 'ng2-order-pipe'; //importing the module
import { LoadingModule } from 'ngx-loading';
import { Session } from 'protractor';
declare var $;

@Component({
  selector: 'app-resource-types',
  templateUrl: './resource-types.component.html',
  styleUrls: ['./resource-types.component.css']
})
export class ResourceTypesComponent implements OnInit {
  public loading = false;
  rtObj: Object = {};
  conformationString: String = "* Please enter name";
  isEmpty: boolean = false;
  constructor(private _router: Router, private http: Http, private route: ActivatedRoute, private toastr: ToastrService) {

  }
  filter;
  resourceType_type;
  uRt_resourceType_type;
  Applicationtype;
  // Var declarations
  id: number;
  editobj: {};
  uRt = [];
  uData: object = {};
  uExist = false;
  private headers = new Headers({ 'Content-Type': 'application/json' });
  resourceTypes = [];
  applications = [];
  restype_co_fi = [];
  actions = [];
  newAction = "";
  p: number = 1;
  collection: any[] = this.resourceTypes;
  key: string = 'name';
  reverse: boolean = false;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }


  componentVisibility: Boolean;
  pushAction = function () {
    if (this.newAction != "") {
      let object = {
        action_name: this.newAction
      };
      this.actions.push(object);
      this.newAction = "";
    }
    else{
      this.toastr.error("Select action")
    }
  }

  removeAction = function (index) {
    this.actions.splice(index, 1);
  }
  fetchData = function () {
    this.http.get(resourceTypes).subscribe(
      (res: Response) => {
        this.resourceTypes = res.json();
        //  console.log(this.ResourceTypes);

      }
    );

  }

  //get res by app_id
  session_id = sessionStorage.getItem('app_id');

  appResT = function (session_id) {
    this.loading = true;
    this.http.get(ResourceType_fetchByAppId + session_id).subscribe(
      (res: Response) => {
        this.loading = false;
        this.resourceTypes = res.json();
      });

  }

  // appResT1 = function (session_id) {
  //   this.loading = true;
  //   this.http.get(application + session_id).subscribe(
  //     (res: Response) => {
  //       this.loading = false;
  //       this.restype_co_fi = res.json();
  //       sessionStorage.setItem('apptype', this.restype_co_fi.app_type)
  //     });
  // }

  fetchApplications = function () {
    this.http.get(Applications).subscribe(
      (res: Response) => {
        this.applications = res.json();
      }
    )
  }
  // fetchApplicationFine = function () {
  //   this
  //     .http
  //     .get(AppFine)
  //     .subscribe((res: Response) => {
  //       this.applications = res.json();
  //       // this.toastr.success('Data Fetched')

  //     })
  //   }

  //   fetchApplicationCoarse = function () {
  //     this
  //     .http
  //     .get(AppCoarse)
  //     .subscribe((res: Response) => {
  //       this.applications = res.json();
  //       // this.toastr.success('Data Coarse Fetched')

  //     })
  // }

  //Refresh Page
  refresh = function () {
    window.location.reload();

  }

  // Delete Rt

  deleteRt = function (id) {
    this.http.delete(delResourceType + id).subscribe(
      res => {
        if (res._body == "used" || res._body == "used1") {
          this.appResT(this.session_id);
          this.toastr.error('Resource-Type is already in use.');
          $('#deleteModal').modal('toggle');
        }

        else {
          this.appResT(this.session_id);
          this.toastr.error('Resource-Type Deleted.');
          $('#deleteModal').modal('toggle');
        }

      },
      err => this.toastr.error('Ops! something went wrong.'))
  }

  //Add Rt
  addNewRt = function (rt) {
    var arg=rt.resourceType_type;

    if (rt.resourceType_name === undefined || rt.resourceType_name == '' || rt.resourceType_name === null) {
      this.toastr.error("Resource-Type name required.")
    }
    else {
      if (arg == true) {
        this.resourceType_type="Coarse";
    }      else  this.resourceType_type="Fine";

    
      this.rtObj = {
        "resourceType_name": rt.resourceType_name,
        "resourceType_displayname": rt.resourceType_displayname,
        "resourceType_description": rt.resourceType_description,
        "resourceType_type": this.resourceType_type,
        "application_id": this.session_id,
        "resourceType_actions": this.actions
      }
      this.http.post(addResourceType, this.rtObj, { Headers: this.headers }).subscribe(res => {

        if (res._body == "unique") {
          this.toastr.error('Resource-type already exists.');
        }
        else {
          this.appResT(this.session_id);
          $('#addModal').modal('toggle');

          this.toastr.success('Resource-Type Added.');
        }
        this.actions = [];

      },
        err => {
          this.toastr.error('Resource-Type already exists.');
        })


    }


  }

  //Edit Rt

  resourceType_displayname={};
  resourceType_description={};
  _id={}
  editRt = function (id) {

    this.http.get(resourceType + id).subscribe(
      (res: Response) => {
        this.uRt = res.json();
        this.actions = this.uRt.resourceType_actions;
        this.uData = this.uRt.resourceType_name;
        this.resourceType_displayname = this.uRt.resourceType_displayname;
        this.resourceType_description = this.uRt.resourceType_description;
        this._id = this.uRt._id;
        // this.newAction=this.uRt.newAction
        
      }
    )
    // this.actions=[];
  }


  //Upd Rt

  updateRt = function (updateData, id) {
    var arg=updateData.uRt_resourceType_type;

    if (updateData.uRt_name === undefined || updateData.uRt_name == '' || updateData.uRt_name === null) {
      this.toastr.error("Resource-Type name required.")
    }
    else {
      // console.log(updateData.uRt_name);
      if (arg == true) {
        this.resourceType_type="Coarse";
    }      else  this.resourceType_type="Fine";

      this.editObj = {
        "resourceType_name": updateData.uRt_name,
        "resourceType_displayname": updateData.uRt_displayname,
        "resourceType_description": updateData.uRt_description,
        "resourceType_type": this.resourceType_type,
          "application_id": this.session_id,
        "resourceType_actions": this.actions
      }
      console.log(this.editObj);
      
      this.http.put(updateResourceType + id, this.editObj, { Headers: this.headers }).subscribe((res: Response) => {

        $('#updateModal').modal('toggle');
        this._router.navigate(['/resourceTypes']);
        this.appResT(this.session_id);
        this.toastr.info('Resource-Type Updated.');
        this.actions = [];
      })
    }
  }

  attributeIdToBeDeleted: String;
  attributeNameToBeDeleted: String;

  // Set Delete Attribute
  setDeleteAttribute = (_id, Name) => {
    this.attributeIdToBeDeleted = _id;
    this.attributeNameToBeDeleted = Name;
  }


// app=(rs)=>{
// console.log(rs.resourceType_type);

// }




  
  // hidden = true;
  // ToggleCoarse = function () {
  //   var t1 = document.getElementById("divcoarse");
  //   var t2 = document.getElementById("divcoarseup");
  //   // var t3 = document.getElementById("divfine");
  //   // var t4 = document.getElementById("divfineupdate");
  //   if (this.hidden) {
  //     t1.style.display = "block";
  //     t2.style.display = "block";
  //     // t3.style.display = "none";
  //     // t4.style.display = "none";
  //     this.hidden = false;
  //   } else {
  //     t1.style.display = "none";
  //     t2.style.display = "none";
  //   //   t3.style.display = "block";
  //   //   t4.style.display = "block";
      
  //   //   this.hidden = true;
  //   }
  // }

  // // // hidden:boolean;
  // ToggleFine = function () {
  //   var tc1 = document.getElementById("divfine");
  //   var tc2 = document.getElementById("divfineupdate");
  //   // var tc3 = document.getElementById("divcoarse");
  //   // var tc4 = document.getElementById("divcoarseup");
    
  //   if (this.hidden) {
  //     tc1.style.display = "block";
  //     tc2.style.display = "block";
  //     // tc3.style.display = "none";
  //     // tc4.style.display = "none";
  //     this.hidden = false;
  //   } else {
  //     tc1.style.display = "none";
  //     tc2.style.display = "none";
  //   //   tc3.style.display = "block";
  //   //   tc4.style.display = "block";
  //   //   this.hidden = true;
  //   }
  // }


  ngOnInit() {
    // this.fetchData();

    if (this.session_id != null || this.session_id != undefined) {
      this.componentVisibility = true;
    }
  // this.ToggleCoarse();
  
    // this.Applicationtype();
    // this.appResT1(this.session_id);
    this.appResT(this.session_id);
    this.fetchApplications();
    // this.fetchApplicationFine();
    // this.fetchApplicationCoarse();

  }
}
