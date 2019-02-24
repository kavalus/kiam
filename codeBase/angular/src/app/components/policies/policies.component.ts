import { fetch_policy_url, fetch_roles_url, fetch_users_url, fetch_policyById_url, fetch_resource_url, add_policy_url, add_targets_url, update_policy_url, delete_policy_url, get_res_type_actions_url, fetch_resource_url_protected, fetch_resource_url_public, fetch_policy_url_public } from '../../routeConfig';
import { Component, OnInit, Input } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { ToastrService, Toast } from 'ngx-toastr';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; //importing the module
import { Ng2OrderModule } from 'ng2-order-pipe'; //importing the module
import { LoadingModule } from 'ngx-loading';
import { resource } from 'selenium-webdriver/http';

declare var $;
@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.css']
})
export class PoliciesComponent implements OnInit {
  public loading = false;

  app_id = sessionStorage.getItem('app_id');

  //fetch all policies for the table  
  fetchedpolicies = [];
  fetchedPublicpolicies = [];
  fetchedProtectedpolicies = [];

  //fetched policy for edit
  fetchedpolicy;
  val;
  //fetched roles and users and resources for selecting while adding policy
  allroles = [];
  allusers = [];
  allresources = [];
  allpublicresources = [];
  allprotectedresources = [];

  obj;

  //form input models value declaration
  //policy  - data
  policy_id: String;
  policy_name: String;
  policy_type: String;
  policy_constrains: String;
  principaltype;
  pp;
  pt;
  policy_response;
  policy_scope;



  //fetching authentication configuration
  auth_ip: Boolean;
  auth_time: Boolean;
  auth_ip_start: String;
  auth_ip_end: String;
  auth_time_start: String;
  auth_time_end: String;
  filter;
  coarse;
  value;

  daysArray: Array<any> = [];
  updaysArray: Array<any> = [];

  days = [
    { day: "Mon" }, { day: "Tue" }, { day: "Wed" }, { day: "Thu" }, { day: "Fri" }, { day: "Sat" }, { day: "Sun" },
  ];

  scopes = [{ type: "Protected" }, { type: "Public" }];

  //making policy principal data for sending to database
  principalsarray = [];

  //making policy targets data to add to target object 
  targetsarray = [];

  SingleTargetResource;
  singletargetactions = [];
  SingleTargetResourceName;

  actions;
  pro_res;
  pub_res;
  DropDisabled: boolean;
  //show policy prinicpal !
  select: Boolean = false;
  selectpp: Boolean;

  constructor(public _http: Http, private toastr: ToastrService) { }
  private headers = new Headers({
    'Content-Type': 'application/json'
  });

  updtobj;
  p: number = 1;
  collection: any[] = this.fetchedpolicies;
  collection_Public: any[] = this.fetchedPublicpolicies;
  collection_Protected: any[] = this.fetchedProtectedpolicies;
  collection_pub_resources: any[] = this.allpublicresources;

  key: string = 'name';
  reverse: boolean = false;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }
  onChange(day: string, isChecked: boolean) {

    if (isChecked) {

      this.daysArray.push(day);
    } else {
      let index = this.daysArray.indexOf(day);
      this.daysArray.splice(index, 1);

    }
    console.log(this.daysArray)
  }
  onUpChange(day: string, isChecked: boolean) {
    if (isChecked) {
      this.updaysArray.push(day);
    } else {
      let index = this.updaysArray.indexOf(day);
      this.updaysArray.splice(index, 1);

    }
    console.log(this.updaysArray)
  }


  // onChangeDrop(value) {

  //   console.log(value,'==========================')
  //       if (value === "Public") {

  //         this.allresources = [];
  //         this.allresources = this.allpublicresources;
  //   this.policy_scope="Public"
  //       }
  //       else {

  //         this._http.get(fetch_resource_url_protected + this.app_id).map(res => res.json()).subscribe(
  //           res => {
  //           this.allprotectedresources = res
  //           },
  //           err => { console.log(err) }
  //         );
  //          this.allresources=[];
  //          this.allresources = this.allprotectedresources;
  //       }
  //     }
  ngOnInit() {
    this.fetchPolicies();
    this.fetchRoles();
    this.fetchPublicResources();
    this.fetchProtectedResources();
    this.fetchResources();
    this.fetchUsers();
    this.fetchPublicPolicies();

  }

  refresh() { window.location.reload(); }

  emptyarray() {
    this.select = false;
    this.principalsarray = [];
    this.targetsarray = []
    this.daysArray = [];
    this.updaysArray = [];
  }

  fetchPolicies() {
    this.loading = true;
    this._http.get(fetch_policy_url + this.app_id).map(res => res.json()).subscribe(
      policies => {
        this.loading = false;
        this.fetchedpolicies = policies
      },
      err => console.log("error Occured while fetching Policies", err)
    )

  }

  fetchPublicPolicies() {
    this.loading = true;
    this._http.get(fetch_policy_url_public + this.app_id).map(res => res.json()).subscribe(
      Public => {
        this.loading = false;
        this.fetchPublicPolicies = Public;
        this.val = Public[0].policy_scope;
        // console.log(this.fetchPublicPolicies,"asdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd");


      },

      err => console.log("error Occured while fetching Policies", err)
    )

  }



  onChangeDrop(value) {
    // console.log(value,'==========================')
    if (value === "Public") {
      this.allresources = [];
      this.allresources = this.allpublicresources;
      // this.policy_scope="Public"
    }
    else {
      this._http.get(fetch_resource_url_protected + this.app_id).map(res => res.json()).subscribe(
        res => {
          this.allprotectedresources = res
        },
        err => { console.log(err) }
      );
      this.allresources = [];
      this.allresources = this.allprotectedresources;
    }
  }


  fetchRoles() {
    this._http.get(fetch_roles_url + this.app_id).map(res => res.json()).subscribe(
      roles => this.allroles = roles,
      err => this.toastr.error('error fetching the roles !', err)
    )
  }

  fetchUsers() {
    this._http.get(fetch_users_url).map(res => res.json()).subscribe(
      users => this.allusers = users,
      err => this.toastr.error('error fetching all users', err)
    )
  }
  fetchResources() {
    this._http.get(fetch_resource_url + this.app_id).map(res => res.json()).subscribe(
      resources => { this.allresources = resources },
      err => this.toastr.error('error fetching all the resources', err)

    )
  }


  fetchPublicResources() {
    this._http.get(fetch_resource_url_public + this.app_id).map(res => res.json()).subscribe(
      res => {
        this.allpublicresources = res
        console.log(res, ":::::::::::::::::::::::::::::::")
      },
      err => { console.log(err) }
    );
  };

  fetchProtectedResources() {
    this._http.get(fetch_resource_url_protected + this.app_id).map(res => res.json()).subscribe(
      res => {
        this.allprotectedresources = res
        console.log(res, "!!!!!!!!!!!!!!!!!!!!!!!!")

      },
      err => { console.log(err) }
    );

  };




  changeppvalue(value) {
    this.select = true;
    this.selectpp = value;
    this.principalsarray = [];
    // this.targetsarray = [];
  }

  pushpolicyprincipal() {
    var fetchedprincipal = this.pp.split(',');
    this.principalsarray.push({ id: fetchedprincipal[0], type: this.principaltype, name: fetchedprincipal[1] });
  }

  removepolicyprincipal(index) {
    this.principalsarray.splice(index, 1);
  }

  pushpolicytargets() {
    var fetchedtarget = this.pt.split(',');
    this.targetsarray.push({ resource_id: fetchedtarget[0], resource_name: fetchedtarget[1] });
    this.pt = "";
  }

  policyIdToBeDeleted: String;
  policyNameToBeDeleted: String;

  // Set Delete Attribute



  setDeletePolicy = (_id, Name) => {
    this.policyIdToBeDeleted = _id;
    this.policyNameToBeDeleted = Name;
  }

  removepolicytarget(index) {
    this.targetsarray.splice(index, 1);
  }

  polygrain;
  upolygrain;




  //add policy
  addPolicy(data) {
    var arg = data.polygrain;
    if (data.policy_name === null || data.policy_name === undefined || data.policy_name === '') {
      this.toastr.error("Policy name is requiered ! ")
      this.emptyarray();
    }

    else if (this.val === this.policy_scope) {
      this.toastr.error(' Public Policy already exists.')
      console.log(this.val, "jihihjihujihihuih");
    }
    else if (this.auth_ip == null || this.auth_time == null) {
      if (this.auth_ip == true) {
        this.auth_time == false
      } else if (this.auth_time == true) {
        this.auth_ip == false
      }

    }



    else {
      if (arg == true) {
        this.polygrain = "Coarse";
      } else this.polygrain = "Fine";


      this.obj = {
        "application_id": this.app_id,
        "policy_name": data.policy_name,
        "policy_type": data.policy_type,
        "policy_response": data.policy_response,
        "policy_scope": data.policy_scope,
        "policy_constrains": data.policy_constrains,
        "policy_principals": this.principalsarray,
        "policy_targets": this.targetsarray,
        "auth_time": data.auth_time,
        "auth_time_start": data.auth_time_start,
        "auth_time_end": data.auth_time_end,
        "alloted_days": this.daysArray,
        "auth_ip": data.auth_ip,
        "auth_ip_start": data.auth_ip_start,
        "auth_ip_end": data.auth_ip_end,
        "polygrain": this.polygrain,
      }
      // console.log(this.obj)

      this._http.post(add_policy_url, this.obj, { headers: this.headers })
        .map(res => res.json())
        .subscribe(
          res => {
            if (res.message == "unique") {
              this.toastr.error('Policy already exists.');
            }

            else {
              $('#addModal').modal('toggle');
              this.toastr.success('Policy added !');

              this.fetchPolicies();
              this.fetchPublicPolicies()
              this.emptyarray();
              data = res


            }

          },

          err => this.toastr.error('ops! there was an error adding the policy , problem with resources !', err)
        )




    }

  }

  deletePolicy(id) {
    this._http.delete(delete_policy_url + id).subscribe(
      res => {
        this.toastr.error('Policy Deleted !');
        this.fetchPolicies();
        this.fetchPublicPolicies();
      },
      err => this.toastr.error('Oops! something went wrong.'))
    this.fetchPolicies();
    this.fetchPublicPolicies();
    this.emptyarray();
    $('#deleteModal').modal('toggle');

  }


  editPolicy(id) {
    this._http.get(fetch_policyById_url + id).map(res => res.json()).subscribe(res => {
      this.fetchedpolicy = res;
      this.select = true;
      this.policy_id = this.fetchedpolicy._id;
      this.policy_name = this.fetchedpolicy.policy_name;
      this.policy_type = this.fetchedpolicy.policy_type;
      this.policy_constrains = this.fetchedpolicy.policy_constrains;
      this.principaltype = this.fetchedpolicy.policy_principals[0].type;
      this.principalsarray = this.fetchedpolicy.policy_principals;
      this.targetsarray = this.fetchedpolicy.policy_targets
      this.auth_ip = this.fetchedpolicy.auth_ip;
      this.auth_time = this.fetchedpolicy.auth_time;
      this.auth_ip_start = this.fetchedpolicy.auth_ip_start;
      this.auth_ip_end = this.fetchedpolicy.auth_ip_end;
      this.auth_time_start = this.fetchedpolicy.auth_time_start;
      this.auth_time_end = this.fetchedpolicy.auth_time_end;
      this.daysArray = this.fetchedpolicy.alloted_days;
      this.policy_response = this.fetchedpolicy.policy_response;
      this.policy_scope = this.fetchedpolicy.policy_scope;

    });

  }


  updatePolicy(id, formdata) {
    var arg = formdata.upolygrain;


    if (arg == true) {
      this.upolygrain = "Coarse";
    } else this.upolygrain = "Fine";

    let updtobj = {

      "_id": id,
      "application_id": this.app_id,
      "policy_name": this.policy_name,
      "policy_type": this.policy_type,
      "policy_constrains": this.policy_constrains,
      "policy_principals": this.principalsarray,
      "policy_targets": this.targetsarray,
      "auth_time": this.auth_time,
      "auth_time_start": this.auth_time_start,
      "auth_time_end": this.auth_time_end,
      "alloted_days": this.updaysArray,
      "auth_ip": this.auth_ip,
      "auth_ip_start": this.auth_ip_start,
      "auth_ip_end": this.auth_ip_end,
      "polygrain": this.upolygrain,
      "policy_scope": this.policy_scope,
      "policy_response": this.policy_response
    }
    // console.log(updtobj);
    if (updtobj.policy_name != ('' || undefined)) {
      this._http.put(update_policy_url, updtobj, { headers: this.headers })
        .subscribe(
          respon => {
            if (respon.status == 200) {
              this.toastr.info('updated policy sucessfully!');
              $('#editModal').modal('toggle');
              this.fetchPolicies();
              this.fetchPublicPolicies();
              this.emptyarray();
            }
            else {
              this.fetchPolicies();
              this.fetchPublicPolicies();
              this.toastr.error("the fields u entered were not propper !")
            }
          },
          err => { this.toastr.error("opps! something went wrong with resources !"); this.emptyarray(); })
    }
    else {
      this.toastr.error("policy name is required !")
    }

  }

  loadtargetactions(id) {
    this._http.get(fetch_policyById_url + id).map(res => res.json()).subscribe(res => {
      this.fetchedpolicy = res;
      this.policy_id = this.fetchedpolicy._id;
      this.policy_name = this.fetchedpolicy.policy_name;
      this.policy_type = this.fetchedpolicy.policy_type;
      this.policy_scope = this.fetchedpolicy.policy_scope;
      this.policy_response = this.fetchedpolicy.policy_response;
      this.policy_constrains = this.fetchedpolicy.policy_constrains;
      this.principalsarray = this.fetchedpolicy.policy_principals;
      this.targetsarray = this.fetchedpolicy.policy_targets;


    });
  }

  addTarget(data) {
    this.singletargetactions = data.resourceType_actions;
    this.SingleTargetResourceName = data.resource_name;
    this.SingleTargetResource = data;
    $('#info').modal('toggle');
    this.fetchrestypeactions(data.resourceType_Id)
  }

  fetchrestypeactions(id) {
    this._http.get(get_res_type_actions_url + id).map(res => res.json()).subscribe(
      res => { this.actions = res.policy_targets[0].resourceType_actions; },
      err => { console.log(err) }
    )
  }

  pushtarget(id, singleresource, name, state) {

    let data = { 'policyid': id, 'resource_id': singleresource.resource_id, 'name': name, 'state': state };
    this._http.put(add_targets_url, data, { headers: this.headers }).subscribe(
      res => {
        let rspns = res.json()
        if (res.status == 200 && rspns.success == true) {
          // this.fetchPolicies();
          this.emptyarray();
          this.fetchrestypeactions(singleresource.resourceType_Id);
          this.toastr.success('action status updated !');
        }
        else {
          this.toastr.error("actions were not updated !");
        }
      },
      err => this.toastr.error('oops! there was an error adding the target actions', err)
    )


  }


}
