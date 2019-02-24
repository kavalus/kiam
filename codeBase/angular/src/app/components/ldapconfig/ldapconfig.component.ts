import { connectLDAP, GetLDAPConfiguration, SetLDAPConfiguration, CheckPara } from './../../routeConfig';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute,Router } from '@angular/router';
import { HttpModule, Http, Response, Headers } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ldapconfig',
  templateUrl: './ldapconfig.component.html',
  styleUrls: ['./ldapconfig.component.css']
})
export class LdapconfigComponent implements OnInit {

  rsp : Boolean = true;
  showbutton : Boolean = false;
  obj : Object;
  configs : Object;
  ans : Object;

  id : String = '';
  url : String = '';
  port : String = '';
  admin_uid : String = '';
  admin_password : String = '';
  user_base_dn : String = '';
  user_object_class : String = '';
  user_base_filter : String = '';
  user_search_scope : String = '';
  username : String = '';
  user_password : String = '';
  firstname : String = '';
  lastname : String = '';
  mobile_no : String = '';
  email : String = '';
  designation : String = '';
  role_base_dn : String = '';
  role_object_class : String = '';
  role_base_filter : String = '';
  role_search_scope : String = '';
  role_name : String = '';
  role_id : String = '';

  constructor(
    private toastr: ToastrService,
    private http:Http,
    _router: Router, 
    private route: ActivatedRoute
  ) { }

  checkParams = function(){
    let obj =  {
      port                :   this.port,
      url                 :   this.url,
      admin_uid_basedn    :   this.admin_uid,
      admin_password :   this.admin_password
    }

    console.log(obj);    

    if(this.url != (null || undefined || '') && this.port != (null || undefined || '') && this.admin_uid_basedn != (null || undefined || '') && this.admin_password != (null || undefined || '')){
      this.http.post(CheckPara, obj ,  {Headers : this.headers} ).subscribe(res => {
        this.ans = res.json();
        console.log(this.ans);
        let temp = this.ans['data'];
        
        if(this.ans['success'] == true){
          this.toastr.success(this.ans['msg']);
        }
        else if(this.ans['success'] == false){
          this.toastr.error(this.ans['msg']);
        }
      },
      err=> {
        console.log(err);
      });
    } else {
      this.toastr.error('All Fields are requered for testing the connection ..!');
    }
  }

  addconfig = function(data){
    console.log(data);

    let obj =  {
      id                  :   data.id,
      port                :   data.port,
      url                 :   data.url,
      userbase_dn         :   data.user_base_dn,
      rolebase_dn         :   data.role_base_dn,
      user_objectclass    :   data.user_object_class,
      role_objectclass    :   data.role_object_class,
      userbase_filter     :   data.user_base_filter,
      rolebase_filter     :   data.role_base_filter,
      usersearch_scope    :   data.user_search_scope,
      rolesearch_scope    :   data.role_search_scope,
      username_attr       :   data.username,
      password_attr       :   data.user_password,
      email_attr          :   data.email,
      designation_attr    :   data.designation,
      mobile_no_attr      :   data.mobile_no,
      fistname_attr       :   data.firstname,
      lastname_attr       :   data.lastname,
      rolename_attr       :   data.role_name,
      roleid_attr         :   data.role_id,
      admin_uid_basedn    :   data.admin_uid,
      admin_password_attr :   data.admin_password
    }

    console.log('Object : ',obj);
    

    this.http.post(SetLDAPConfiguration, obj ,  {Headers : this.headers} ).subscribe(res => {
      this.ans = res.json();
      // console.log(this.ans);
      // console.log(this.ans['success']);
      // console.log(this.ans['msg']);
      // console.log(this.ans['data']);
      let temp = this.ans['data'];
      
      if(this.ans['success'] == true){
        this.toastr.success(this.ans['msg']);
        this.configs = temp;
        this.rsp = true;
        this.showbutton = true;
      }
      else if(this.ans['success'] == false){
        // console.log(this.ans['msg']);
        this.toastr.error(this.ans['msg']);
      }
    },
    err=> {
      console.log(err);
    });

  }

  close_add = function(){
    this.rsp = true;
  }

  checkConnection = function(){
    this.http.get(GetLDAPConfiguration).subscribe(
      (res: Response) => {
        this.obj = res.json();
        // console.log(this.obj);
        if(this.obj['success'] == true) {
          this.http.get(connectLDAP).subscribe(
            (res: Response) => {
              this.obj1 = res.json();
              // console.log(this.obj1);
              if(this.obj1['success'] == true) {
                this.toastr.success(this.obj1['msg']);
              }
              else{
                this.toastr.error(this.obj1['msg']);
              }
            });
        }
        else{
          this.toastr.error('There is no Data to Connect LDAP..!');
        }
      });
  }

  change_rsp = function(){
    this.rsp = false;

    this.id = this.configs[0]._id;
    this.url = this.configs[0].Url;
    this.port = this.configs[0].Port;
    this.admin_uid = this.configs[0].Admin_UID_BaseDN;
    this.admin_password = this.configs[0].Admin_Password_Attr;
    this.user_base_dn = this.configs[0].UserBase_DN;
    this.user_object_class = this.configs[0].User_ObjectClass;
    this.user_base_filter = this.configs[0].UserBase_Filter;
    this.user_search_scope = this.configs[0].UserSearch_Scope;
    this.username = this.configs[0].UserName_Attr;
    this.user_password = this.configs[0].Password_Attr;
    this.firstname = this.configs[0].FirstName_Attr;
    this.lastname = this.configs[0].LastName_Attr;
    this.mobile_no = this.configs[0].Mobile_No_Attr;
    this.email = this.configs[0].Email_Attr;
    this.designation = this.configs[0].Designation_Attr;
    this.role_base_dn = this.configs[0].RoleBase_DN;
    this.role_object_class = this.configs[0].Role_ObjectClass;
    this.role_base_filter = this.configs[0].RoleBase_Filter;
    this.role_search_scope = this.configs[0].RoleSearch_Scope;
    this.role_name = this.configs[0].RoleName_Attr;
    this.role_id = this.configs[0].RoleId_Attr;
  };

  ngOnInit() {

    this.http.get(GetLDAPConfiguration).subscribe(
      (res: Response) => {
        this.obj = res.json();
        // console.log(this.obj);
        if(this.obj['success'] == true) {
          this.configs = this.obj['obj'];
          console.log('config', this.configs);
        }
        else{
          this.rsp = false;
        }
      });
  }

}
