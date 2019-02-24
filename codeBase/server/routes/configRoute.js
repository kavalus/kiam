const express = require('express');
const router = express.Router();
const ldap_config = require('./../models/LDAPSchema');

router.post('/SetConfig/', (req, res, next) => {
    let id = req.body.id;
    
    let data = {
        Port                :       req.body.port,
        Url                 :       req.body.url,
        Admin_UID_BaseDN    :       req.body.admin_uid_basedn,
        Admin_Password_Attr :       req.body.admin_password_attr,
        UserBase_DN         :       req.body.userbase_dn,
        RoleBase_DN         :       req.body.rolebase_dn,
        User_ObjectClass    :       req.body.user_objectclass,
        Role_ObjectClass    :       req.body.role_objectclass,
        UserBase_Filter     :       req.body.userbase_filter,
        RoleBase_Filter     :       req.body.rolebase_filter,
        UserSearch_Scope    :       req.body.usersearch_scope,
        RoleSearch_Scope    :       req.body.rolesearch_scope,
        UserName_Attr       :       req.body.username_attr,
        Password_Attr       :       req.body.password_attr,
        Email_Attr          :       req.body.email_attr,
        Designation_Attr    :       req.body.designation_attr,
        Mobile_No_Attr      :       req.body.mobile_no_attr,
        FirstName_Attr      :       req.body.fistname_attr,
        LastName_Attr       :       req.body.lastname_attr,
        RoleName_Attr       :       req.body.rolename_attr,
        RoleId_Attr         :       req.body.roleid_attr
    };
    
    if(id == undefined || id == null || id == ''){
        ldap_config.find({},(err, object) => {
            if(err) console.log('Problem in Finding Token..!');;
    
            let obj = new ldap_config(data);

            if(object.length == 0){
                obj.save((err, createdObj) => {
                    if(err) res.json({success : false, msg : 'Field should not be Empty..!'});
                    else res.status(200).json({success : true, msg : 'Configuration is being added Successfully..!', data : [createdObj]});
                });
            } else {
                res.status(500).json({success : false, msg : 'Configuration is already Exist..!'});
            }
    
        });
    } else {
        ldap_config.findByIdAndUpdate({_id : id}, data, (err, createdObj) => {
            if(err) res.status(500).json({success : false, msg : 'Configuration is not Exist..!'});
            if(createdObj) {
                ldap_config.find({},(err, abc) => {
                    if(err) res.status(404).json({success : false});
                    if(abc){
                        res.status(200).json({success : true, msg : 'Configuration is being updated successfully..!', data : abc});
                    }
                });
            }
            else {res.status(500).json({success : false, msg : 'Configuration is not Exist..!'});}
        });
    }

});

router.get('/GetConfig', (req, res, next) => {
    ldap_config.find({},(err, object) => {
        if(err) res.status(404).json({success : false});
        if(object.length == 0){
            res.status(200).json({success : false, obj : object});
        } else {
            res.status(200).json({success : true, obj : object});
        }
    });
});

module.exports = router;

// res.status(200).json({success : true, msg : 'Configuration is being updated successfully..!', data : createdObj});