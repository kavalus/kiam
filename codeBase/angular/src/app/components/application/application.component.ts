import { Applications, application, addApp, updateApp, delApp } from '../../routeConfig';
import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; //importing the module
// import 'rxjs/add/operator/filter';

import { Ng2OrderModule } from 'ng2-order-pipe'; //importing the module
import { LoadingModule } from 'ngx-loading';
import { log } from 'util';
declare var $;


@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})

export class ApplicationComponent implements OnInit {
  
  public loading = false;
  aObj: Object = {};
  conformationString: String = "* Please enter name";
  isEmpty: boolean = false;
  constructor(private _router: Router, private http: Http, private route: ActivatedRoute, private toastr: ToastrService) {
  }

  

 filter;
//  app_displayname;
//  app_description;
//  _id;
  // Var declarations
  id: number;
  editobj: {};
  uApplication = [];
  uData:object={};
  uExist = false;
  private headers = new Headers({ 'Content-Type': 'application/json' });
  apps = [];
  p: number = 1;
  collection: any[] = this.apps;
  key: string = 'name';
  reverse: boolean = false;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  fetchData = function () {
    this.loading = true;
    this.http.get(Applications)
      .map(res => res.json())
      .subscribe(
        res => {
          this.loading = false;
          this.apps = res;
          // console.log(this.apps);
        }
      )
  }


  //Refresh Page
  refresh = () => {
    window.location.reload();
  }

  //Del App
  deleteApp = function (id) {
    this.http.delete(delApp + id).subscribe(
      res => {
        if (res._body == "used") {
          this.fetchData();
          this.toastr.error('Application is already in use.');
          $('#deleteModal').modal('toggle');
        }
        else {
          this.fetchData();
          this.toastr.error('Application Deleted.');
          $('#deleteModal').modal('toggle');
        }

      },
      err => this.toastr.error('Ops! something went wrong.'))
  }
  



  //Add App
  addNewApp = function (a) {

    if (a.app_name === undefined || a.app_name === null || a.app_name === '') {
      this.toastr.error('Application name required.');
    }
    else if (a.app_type === null) {
      this.toastr.error('Application type is Mandatory.');
    }
    else {
        this.aObj = {
        "app_id": a.id,
        "app_name": a.app_name,
        "app_displayname": a.app_displayname,
        // "app_type": a.app_type,
        "app_description": a.app_description,
      }
      this.http.post(addApp, this.aObj, { Headers: this.headers }).subscribe(res => {
        if (res._body == "unique") {
          this.toastr.error('Application already exists.');
        }
        else {
          this.fetchData();
          $('#addModal').modal('toggle');
          this.toastr.success('Application Added.');

        }

      },
        err => {
          // this.toastr.error(err);
          this.toastr.error('Application already exists.');
          
        })
    }

  }

  //Edit App
_id={}
  app_desc={}
  app_display={}
  editApp = function (id) {

    this.http.get(application + id).subscribe(
      (res: Response) => {
        this.uApplication = res.json();
        this.uData = this.uApplication.app_name;
        this.app_desc = this.uApplication.app_description;
        this.app_display = this.uApplication.app_displayname;
        this._id = this.uApplication._id;
      

        console.log(this.uData);
      }
      
    )

  }


  //Upd App

  updateApp = function (updateData, id) {
    if (updateData.uapp_name === undefined || updateData.uapp_name === null || updateData.uapp_name === '') {
      this.toastr.error('Application name required.');

    }

    else {

      this.editObj = {
        "app_name": updateData.uapp_name,
        "app_displayname": updateData.uapp_displayname,
        // "app_type": updateData.uapp_type,
        "app_description": updateData.uapp_description
      }
      console.log(this.editObj);
      
      this.http.put(updateApp + id, this.editObj, { Headers: this.headers }).subscribe((res: Response) => {
        console.log(res);
        $('#updateModal').modal('toggle');
        this._router.navigate(['/application']);
        this.fetchData();
        this.toastr.info('Application Updated.');


      })
    }
  }

  applicationIdToBeDeleted: String;
  applicationNameToBeDeleted: String;

  // Set Delete Attribute
  setDeleteApplication = (_id, Name) => {
    this.applicationIdToBeDeleted = _id;
    this.applicationNameToBeDeleted = Name;
  }


  ngOnInit() {
    this.fetchData();
  }

}

