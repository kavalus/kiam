import {Applications, addAttribute,updateAttribute,deleteAttribute,allAttributes,attributes_fetchByAppId,attributeById,filterAttributes} from '../../routeConfig';
import { ResourceTypesComponent } from './../resource-types/resource-types.component';
import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Http, Headers } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/map';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; //importing the module
import { Ng2OrderModule } from 'ng2-order-pipe'; //importing the module
import { LoadingModule } from 'ngx-loading';
declare var $;

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css']
})
export class AttributesComponent implements OnInit {
  public loading = false;
  private headers = new Headers({ 'Content-Type': 'application/json'});
  applications = [];
  attributes = [];
  uData:object= {}
  utype={}
  udatatype={}
  udesc={}
  usinmulti={}
  filterApplied = false;
  filteredAttributes = [];
  filterName: String;
  filterType: String;
  filterDataType: String;
  attributeNameToBeDeleted: String;
  attributeIdToBeDeleted: String;
  p: number = 1;
  collection: any[] = this.attributes;  
  key: string = 'name';
  reverse: boolean = false;
  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }
  filter;

  constructor(private _router: Router,
              private http: Http,
              private route: ActivatedRoute,
              private toastr: ToastrService) {}

  ngOnInit() {
    this.appAttr(this.session_id);
    //this.getApplications();
  }

  // Refresh Page
  refresh = () => {
    location.reload();
  }

  //get res by app_id
session_id=sessionStorage.getItem('app_id');
appAttr = function(session_id) {
  this.loading = true;
  this.http.get(attributes_fetchByAppId+session_id).subscribe(
   (res: Response) => {
    this.loading = false;
     this.attributes = res.json();

   }
  );
  }  

  // Set Delete Attribute
  setDeleteAttribute = (_id, Name) => {
    this.attributeIdToBeDeleted = _id;
    this.attributeNameToBeDeleted = Name;
  }

  // Delete Attribute

  deleteAttribute = function(id) {
    console.log(deleteAttribute+id);
    this.http.delete(deleteAttribute + id).subscribe(
      res => {
        if(res._body=="used"||res._body=="used") {
          this.appAttr(this.session_id);
          this.toastr.error('Attribute is already in use.');
          $('#deleteModal').modal('toggle');
        }
       
        else {
          this.appAttr(this.session_id);
          this.toastr.error('Attribute Deleted.');
          $('#deleteModal').modal('toggle');
        }
       
      },
      err => this.toastr.error('Opps! something went wrong.'))
}
  // Get All Applications

  getApplications = () => {

    this.http.get(Applications, {headers: this.headers})
    .map(res => res.json())
    .subscribe(
      data => {
        this.applications = data;
        //this.toastr.info('Fetched Apllication List Successfully.');
      },
      err => {
        this.toastr.error('Something Went Wrong.');
      }
    );
  }

  // Add Attribute
  addNewAttribute = (attribute) => {

    if (attribute.Name===undefined||attribute.Name===null||attribute.Name==='') {
          this.toastr.error('Attribute Name is required !');
    } 
    else if (attribute.Type===undefined||attribute.Type===null||attribute.Type==='' ){
      this.toastr.error('Attribute Type is required !');
    }
    else {

       // tslint:disable-next-line:prefer-const
       let Obj_Attribute = {
        Name             : attribute.Name,
        Type             : attribute.Type,
        DataType         : attribute.DataType,
        Description      : attribute.Description,
        Application_Id   : this.session_id,
        Single_Multiple  : attribute.Single_Multiple
    };

    this.http.post(addAttribute, Obj_Attribute, {headers: this.headers})
    .map(res => res.json())
    .subscribe(
      res => {
    
        if(res._body=="unique") {
          this.toastr.error('Attribute already exists.');
        }
        else {
          this.appAttr(this.session_id);
          $('#addModal').modal('toggle');
          this.toastr.success('Attribute Added.');
        }

      },
      err => {
        this.toastr.error('Attribute already exists.');

      }
    );
    }
  }
// Name;
_id={}
  // Edit Attribute
  editAttribute = (_id) => {

    this.http.get(attributeById + "?_id=" + _id, {headers: this.headers})
    .map(res => res.json())
    .subscribe(
      data => {
        if (data.success === true) {
          this.uData = data.Attribute.Name;
          this._id = data.Attribute._id;
          
          this.utype=data.Attribute.Type;
          this.udesc=data.Attribute.Description;
          this.udatatype=data.Attribute.DataType;
          this.usinmulti=data.Attribute.Single_Multiple;
        } else if (data.success === false) {
          this.appAttr(this.session_id);
          $('#updateModal').modal('toggle');
          this.toastr.error('Attribute Not Found. Refreshing The Attribute List');
        }
        console.log(this.uData);
        
      },
      err => {
        this.appAttr(this.session_id);
        $('#updateModal').modal('toggle');
        this.toastr.error('Something Went Wrong.');
      }
    );
  }

  // Update Attribute

  updateAttribute = (updateData, _id) => {

    if (updateData.Name===undefined||updateData.Name===null||updateData.Name==='') {
      this.toastr.error('Attribute name required.');
    } else {

    // tslint:disable-next-line:prefer-const
    let Obj_Attribute = {
      _id              : _id,
      Name             : updateData.Name,
      Type             : updateData.Type,
      DataType         : updateData.DataType,
      Description      : updateData.Description,
      Application_Id   : this.session_id,
      Single_Multiple  : updateData.Single_Multiple
      };

      this.http.put(updateAttribute, Obj_Attribute, {headers: this.headers})
        .map(res => res.json())
        .subscribe(
          data => {
            if (data.success === true) {
              $('#updateModal').modal('toggle');
              this._router.navigate(['/attributes']);
              this.appAttr(this.session_id);
              this.toastr.info('Attribute Updated.');
            } else if (data.success === false) {
              $('#updateModal').modal('toggle');
              this._router.navigate(['/attributes']);
              this.appAttr(this.session_id);
              this.toastr.error('Attribute Not Found. Refreshing The Attribute List.');
            }
          },
          err => {
            $('#updateModal').modal('toggle');
            this._router.navigate(['/attributes']);
            this.appAttr(this.session_id);
            this.toastr.error('Something Went Wrong.');
          }
        );
    }
  }

}
