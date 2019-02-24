const mongoose = require('mongoose');
const config = require('./../config/database');

const LDAPSchema = mongoose.Schema({
    Port                :       {type : String, required: true},
    Url                 :       {type : String, required: true},
    Admin_UID_BaseDN    :       {type : String, required: true},
    Admin_Password_Attr :       {type : String, required: true},
    UserBase_DN         :       {type : String, required: true},
    RoleBase_DN         :       {type : String, required: true},
    User_ObjectClass    :       {type : String, required: true},
    Role_ObjectClass    :       {type : String, required: true},
    UserBase_Filter     :       {type : String, required: true},
    RoleBase_Filter     :       {type : String, required: true},
    UserSearch_Scope    :       {type : String, required: true},
    RoleSearch_Scope    :       {type : String, required: true},
    UserName_Attr       :       {type : String, required: true},
    Password_Attr       :       {type : String, required: true},
    Email_Attr          :       {type : String, required: true},
    Designation_Attr    :       {type : String, required: true},
    Mobile_No_Attr      :       {type : String, required: true},
    FirstName_Attr      :       {type : String, required: true},
    LastName_Attr       :       {type : String, required: true},
    RoleName_Attr       :       {type : String, required: true},
    RoleId_Attr         :       {type : String, required: true}
});

const LDAP_config = module.exports = mongoose.model('ldap_config', LDAPSchema);